<script lang="ts">
	import { createWorker } from 'tesseract.js';
	import { processedText } from '$lib/stores/processed-text.store';
	import { imagePreview } from '$lib/stores/image-preview.store';
	import { processedTextIsLoading } from '$lib/stores/processed-text.store';
	import Icon from '@iconify/svelte';
	import { isStep2Complete } from '$lib/stores/form.store';
	import { FFmpeg } from '@ffmpeg/ffmpeg';
	import { videoProcessingState, MAX_FILE_SIZE } from '$lib/stores/form.store';
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';
	import { toBlobURL } from '@ffmpeg/util';

	let fileInput: HTMLInputElement;

	// Initialize FFmpeg
	let ffmpeg: FFmpeg;
	let worker: Tesseract.Worker;

	onMount(async () => {
		ffmpeg = new FFmpeg();
		await initializeFFmpeg();
		if (!browser) {
			throw new Error('ImageInput is not supported in the server');
		}
		worker = await createWorker('eng');
	});

	onDestroy(() => {
		if (worker) {
			worker.terminate();
		}
		if (ffmpeg) {
			ffmpeg.terminate();
		}
	});

	async function initializeFFmpeg() {
		if (!browser) {
			return;
		}
		const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
		try {
			await ffmpeg.load({
				coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
				wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
			});
			console.log('FFmpeg loaded successfully');
		} catch (error) {
			console.error('Error loading FFmpeg:', error);
		}
	}

	let videoUrl = '';
	let isVideo = false;
	let videoElement: HTMLVideoElement;

	async function processVideo(file: File) {
		if (file.size > MAX_FILE_SIZE) {
			alert('File size exceeds 15MB limit');
			fileInput.value = '';
			return;
		}

		try {
			videoProcessingState.update((s) => ({ ...s, isProcessing: true }));

			// Write video file to FFmpeg
			await ffmpeg.writeFile('input.mp4', new Uint8Array(await file.arrayBuffer()));
			console.log('Video file written to FFmpeg');

			// Extract frames at 1fps
			await ffmpeg.exec(['-i', 'input.mp4', '-r', '1', 'frame-%04d.png']);
			console.log('Frames extracted');

			// Get frame list
			const files = await ffmpeg.listDir('/');
			const frames = files.filter((f) => f.name.startsWith('frame-')).sort();
			console.log('Frames:', frames);

			// Process each frame sequentially
			for (const [index, frame] of frames.entries()) {
				console.log(`Processing frame ${index + 1}: ${frame.name}`);
				const data = await ffmpeg.readFile(frame.name);
				const blob = new Blob([data], { type: 'image/png' });

				const {
					data: { text }
				} = await worker.recognize(blob);
				processedText.update((current) => `${current}\n${text}`);

				videoProcessingState.update((s) => ({
					...s,
					progress: ((index + 1) / frames.length) * 100,
					currentFrame: index + 1
				}));

				// Clean up the frame file
				await ffmpeg.unmount(frame.name);
			}
		} catch (error) {
			console.error('Video processing failed:', error);
		} finally {
			videoProcessingState.set({ progress: 0, currentFrame: 0, isProcessing: false });
			// Clean up input file
			await ffmpeg.unmount('input.mp4');
		}
	}

	async function processImage(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) return;

		if (file.size === 0) {
			imagePreview.set('');
			return;
		}

		if (file.type.startsWith('video/')) {
			isVideo = true;
			videoUrl = URL.createObjectURL(file);
			imagePreview.set(videoUrl);
			await processVideo(file);
		} else if (file.type.startsWith('image/')) {
			isVideo = false;
			const reader = new FileReader();
			reader.onload = (e) => {
				imagePreview.set(e.target?.result as string);
			};
			reader.readAsDataURL(file);
			processedTextIsLoading.set(true);
			const worker = await createWorker('eng');
			const {
				data: { text }
			} = await worker.recognize(file);
			processedText.set(text);
			await worker.terminate();
			processedTextIsLoading.set(false);
		}
	}

	$: if (!$imagePreview && fileInput) {
		fileInput.value = '';
	}

	function triggerFileInput() {
		fileInput?.click();
	}
</script>

<div class="flex h-max flex-col">
	{#if $imagePreview}
		<!-- Preview Section -->
		<div class="mb-4 flex-1">
			{#if isVideo}
				<div class="relative">
					<!-- svelte-ignore a11y_media_has_caption -->
					<video
						bind:this={videoElement}
						src={$imagePreview}
						controls
						class="h-auto max-h-64 w-full rounded-xl object-contain"
					></video>
					{#if $videoProcessingState.isProcessing}
						<div class="absolute right-0 bottom-0 left-0 rounded-b-xl bg-black/70 p-3 text-white">
							<div class="mb-2 text-sm">
								Processing frame {$videoProcessingState.currentFrame}...
							</div>
							<div class="h-2 overflow-hidden rounded-full bg-gray-600">
								<div
									class="h-full bg-blue-500 transition-all duration-300"
									style={`width: ${$videoProcessingState.progress}%`}
								></div>
							</div>
						</div>
					{/if}
				</div>
			{:else}
				<img
					src={$imagePreview}
					alt="Preview"
					class="h-auto max-h-64 w-full rounded-xl object-contain"
				/>
			{/if}
		</div>
	{:else}
		<!-- Upload Area -->
		<div class="flex-1">
			<div
				class="
					group flex h-full min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl
					border-2 border-dashed border-gray-300 bg-gray-50/50 py-5
					transition-all duration-200 hover:border-purple-400 hover:bg-purple-50/30
					{!$isStep2Complete ? 'pointer-events-none opacity-50' : ''}
					{$processedTextIsLoading ? 'pointer-events-none' : ''}
				"
				on:click={triggerFileInput}
				role="button"
				tabindex="0"
				on:keydown={(e) => e.key === 'Enter' && triggerFileInput()}
			>
				<!-- Upload Icons -->
				<div class="mb-4 flex items-center gap-3">
					<div class="rounded-lg bg-blue-100 p-3 text-blue-600 group-hover:bg-blue-200">
						<Icon icon="mdi:upload" class="h-6 w-6" />
					</div>
					<div class="rounded-lg bg-green-100 p-3 text-green-600 group-hover:bg-green-200">
						<Icon icon="mdi:image" class="h-6 w-6" />
					</div>
					<div class="rounded-lg bg-purple-100 p-3 text-purple-600 group-hover:bg-purple-200">
						<Icon icon="mdi:video" class="h-6 w-6" />
					</div>
				</div>

				<!-- Upload Text -->
				<div class="text-center">
					<p class="mb-2 text-lg font-medium text-gray-700">
						{#if $processedTextIsLoading}
							<Icon icon="svg-spinners:90-ring-with-bg" class="mr-2 inline h-5 w-5" />
							Processing...
						{:else}
							Upload your conversation screenshot or screen recording
						{/if}
					</p>
					<p class="mb-4 text-sm text-gray-500">Supported formats: JPG, PNG, MP4, MOV (max 15MB)</p>
				</div>

				<!-- Choose File Button -->
				{#if !$processedTextIsLoading}
					<button
						type="button"
						class="
							flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600
							px-6 py-3 font-medium text-white shadow-md transition-all duration-200
							hover:scale-105 hover:from-purple-700 hover:to-blue-700 hover:shadow-lg
						"
					>
						<Icon icon="mdi:folder-upload" class="h-5 w-5" />
						Choose File
					</button>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Pro Tip -->
	<div class="mt-4 rounded-lg bg-blue-50 p-3 text-sm">
		<div class="flex items-start gap-2">
			<Icon icon="mdi:lightbulb" class="mt-0.5 h-4 w-4 text-blue-600" />
			<div>
				<span class="font-medium text-blue-800">💡 Pro tip:</span>
				<span class="text-blue-700">
					For best results, make sure the conversation is clearly visible and well-lit. The AI will
					extract and analyze your messages! ✨
				</span>
			</div>
		</div>
	</div>

	<!-- Hidden File Input -->
	<input
		type="file"
		accept="image/*, video/mp4, video/quicktime, video/x-msvideo"
		on:change={processImage}
		class="hidden"
		bind:this={fileInput}
		disabled={$processedTextIsLoading}
	/>
</div>
