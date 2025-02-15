<script lang="ts">
	import { createWorker } from 'tesseract.js';
	import { processedText } from '$lib/stores/processed-text.store';

	async function processImage(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) return;
		const worker = await createWorker('eng');
		const ret = await worker.recognize(file);
		processedText.set(ret.data.text);
		await worker.terminate();
	}
</script>

<input type="file" accept="image/*" on:change={processImage} />
