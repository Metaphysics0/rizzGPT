<script lang="ts">
	import { createWorker } from 'tesseract.js';
	import { processedText } from '$lib/stores/processed-text.store';
	import { imagePreview } from '$lib/stores/image-preview.store';
	import { processedTextIsLoading } from '$lib/stores/processed-text.store';
	import Icon from '@iconify/svelte';
	import { isStep2Complete } from '$lib/stores/form.store';
	let fileInput: HTMLInputElement;

	async function processImage(event: Event) {
		console.log('event!!', event);

		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) return;

		// Reset input if cleared
		if (file.size === 0) {
			imagePreview.set('');
			return;
		}

		// Create preview
		const reader = new FileReader();
		reader.onload = (e) => imagePreview.set(e.target?.result as string);
		reader.readAsDataURL(file);

		// OCR processing
		try {
			processedTextIsLoading.set(true);
			const worker = await createWorker('eng');
			const ret = await worker.recognize(file);
			processedText.set(ret.data.text);
			await worker.terminate();
			processedTextIsLoading.set(false);
		} catch (error) {
			console.error(error);
			processedTextIsLoading.set(false);
		} finally {
			processedTextIsLoading.set(false);
		}
	}

	// Add this reactive statement to reset file input
	$: if (!$imagePreview && fileInput) {
		fileInput.value = '';
	}
</script>

<div class="flex h-full flex-col gap-4 overflow-hidden">
	<label
		class="
			relative flex
			h-full w-full
			cursor-pointer items-center
			justify-center
			rounded-lg
			border border-dashed border-slate-300
			transition-all
			{!$isStep2Complete ? 'pointer-events-none opacity-50' : 'hover:border-slate-400'}
		"
	>
		<input
			type="file"
			accept="image/*"
			on:change={processImage}
			class="hidden"
			bind:this={fileInput}
			disabled={$processedTextIsLoading}
		/>
		{#if $imagePreview}
			<img src={$imagePreview} alt="Preview" class="h-full w-full object-contain p-4" />
		{:else}
			<span class="p-4 text-center text-slate-500">
				{#if $processedTextIsLoading}
					<Icon icon="svg-spinners:90-ring-with-bg" class="mr-2 h-5 w-5" />
					Processing...
				{:else}
					<div class="space-y-2">
						<Icon icon="mdi:cloud-upload" class="mx-auto h-8 w-8" />
						<span class="block text-sm">Click to upload image</span>
						<span class="block text-xs text-slate-400">or drag and drop</span>
					</div>
				{/if}
			</span>
		{/if}
	</label>
</div>
