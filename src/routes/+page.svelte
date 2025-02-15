<script>
	import ImageInput from '$lib/ui/ImageInput.svelte';
	import { processedText } from '$lib/stores/processed-text.store';
</script>

<ImageInput />

<div>{$processedText}</div>
