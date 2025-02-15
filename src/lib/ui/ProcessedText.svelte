<script lang="ts">
	import { processedText, processedTextIsLoading } from '$lib/stores/processed-text.store';
	import { imagePreview } from '$lib/stores/image-preview.store';
	import Icon from '@iconify/svelte';

	function clearAll() {
		processedText.set('');
		imagePreview.set('');
	}
</script>

<div class="flex h-full flex-col">
	<div class="mb-4 flex items-center justify-between">
		<h2 class="text-xl font-semibold">Processed Text</h2>
		<div class="flex items-center gap-2">
			{#if $processedTextIsLoading}
				<Icon icon="svg-spinners:90-ring-with-bg" class="h-6 w-6 text-blue-500" />
			{/if}
			<button
				on:click={clearAll}
				class="
					rounded-lg p-2 text-gray-500
					transition-colors hover:bg-gray-100
					hover:text-red-600
				"
				title="Clear all"
			>
				<Icon icon="mdi:close" class="h-6 w-6" />
			</button>
		</div>
	</div>
	<div
		class="
			flex-1
			overflow-auto
			rounded-lg border
			border-gray-200
			p-4
			whitespace-pre-wrap
		"
	>
		{#if $processedTextIsLoading}
			<div class="flex h-full items-center justify-center">
				<Icon icon="svg-spinners:90-ring-with-bg" class="h-12 w-12 text-blue-500" />
			</div>
		{:else}
			{$processedText || 'Text will appear here after processing...'}
		{/if}
	</div>
</div>
