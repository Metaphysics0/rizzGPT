<script lang="ts">
	import { createWorker } from 'tesseract.js';
	import { processedText } from '$lib/stores/processed-text.store';

	let imagePreview: string;

	async function processImage(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) return;

		// Create preview
		const reader = new FileReader();
		reader.onload = (e) => (imagePreview = e.target?.result as string);
		reader.readAsDataURL(file);

		// OCR processing
		const worker = await createWorker('eng');
		const ret = await worker.recognize(file);
		processedText.set(ret.data.text);
		await worker.terminate();
	}
</script>

<div class="flex h-full flex-col gap-4">
	<label
		class="
		flex flex-1
		cursor-pointer items-center justify-center
		rounded-lg
		border-2
		border-dashed
		border-gray-300 transition-colors hover:border-blue-500
	"
	>
		<input type="file" accept="image/*" on:change={processImage} class="hidden" />
		{#if imagePreview}
			<img src={imagePreview} alt="Preview" class="h-full w-full object-contain p-4" />
		{:else}
			<span class="p-8 text-center text-gray-500">Click to upload image</span>
		{/if}
	</label>
</div>
