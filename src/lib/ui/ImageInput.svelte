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
			// ---  PLACE YOUR EXISTING IMAGE PROCESSING LOGIC HERE ---
			// Example (replace with your actual image processing):
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

	function cleanupVideo() {
		if (videoUrl) URL.revokeObjectURL(videoUrl);
	}

	$: if (!$imagePreview && fileInput) {
		fileInput.value = '';
	}
</script>

<div class="flex h-full flex-col gap-4">
	<label
		class="
			relative flex
			flex-1 cursor-pointer items-center
			justify-center
			rounded-lg
			border-2
			border-dashed border-slate-200 transition-all
			{!$isStep2Complete ? 'pointer-events-none opacity-50' : 'hover:border-slate-400'}
		"
	>
		<input
			type="file"
			accept="image/*, video/mp4, video/quicktime, video/x-msvideo"
			on:change={processImage}
			class="hidden"
			bind:this={fileInput}
			disabled={$processedTextIsLoading}
		/>
		{#if $imagePreview}
			{#if isVideo}
				<div class="relative mb-4">
					<video
						bind:this={videoElement}
						src={$imagePreview}
						controls
						class="max-h-64 w-full rounded-lg object-contain"
					/>
					{#if $videoProcessingState.isProcessing}
						<div class="absolute right-0 bottom-0 left-0 bg-black/50 p-2 text-white">
							<div class="mb-1 text-sm">
								Processing frame {$videoProcessingState.currentFrame}...
							</div>
							<div class="h-1 bg-gray-600">
								<div
									class="h-full bg-blue-500 transition-all duration-300"
									style={`width: ${$videoProcessingState.progress}%`}
								/>
							</div>
						</div>
					{/if}
				</div>
			{:else}
				<img src={$imagePreview} alt="Preview" class="h-full w-full object-contain p-4" />
			{/if}
		{:else}
			<span class="p-8 text-center text-gray-500">
				{#if $processedTextIsLoading}
					<Icon icon="svg-spinners:90-ring-with-bg" class="mr-2 h-5 w-5" />
					Processing...
				{:else}
					Click to upload image
				{/if}
			</span>
		{/if}
	</label>
</div>
