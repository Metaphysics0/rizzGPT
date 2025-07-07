<script lang="ts">
	import { processedText, processedTextIsLoading } from '$lib/stores/processed-text.store';
	import { imagePreview } from '$lib/stores/image-preview.store';
	import Icon from '@iconify/svelte';
	import { fade } from 'svelte/transition';

	function clearAll() {
		processedText.set('');
		imagePreview.set(null);
	}
</script>

<div class="flex h-full flex-col">
	<!-- Header with Clear Button -->
	{#if $processedText}
		<div class="mb-4 flex items-center justify-end" in:fade>
			<button
				on:click={clearAll}
				class="
					flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-red-600
					transition-colors hover:bg-red-100 hover:text-red-700
				"
				title="Clear all"
			>
				<Icon icon="mdi:trash-can" class="h-4 w-4" />
				<span class="text-sm font-medium">Clear</span>
			</button>
		</div>
	{/if}

	<!-- Content Area -->
	<div class="flex-1 overflow-hidden rounded-xl border-2 border-gray-200 bg-white">
		{#if $processedTextIsLoading}
			<div class="flex h-full items-center justify-center p-8">
				<div class="text-center">
					<Icon icon="svg-spinners:90-ring-with-bg" class="mb-4 h-12 w-12 text-purple-500" />
					<p class="text-gray-600">Extracting text from your conversation...</p>
				</div>
			</div>
		{:else if $processedText}
			<div class="h-full overflow-auto p-4">
				<div class="text-sm leading-relaxed whitespace-pre-wrap text-gray-700">
					{$processedText}
				</div>
			</div>
		{:else}
			<div class="flex h-full items-center justify-center p-8">
				<div class="text-center">
					<Icon icon="mdi:message-text" class="mb-4 h-12 w-12 text-gray-300" />
					<p class="text-gray-500">Your extracted conversation text will appear here...</p>
					<p class="mt-2 text-sm text-gray-400">Upload an image or video to get started</p>
				</div>
			</div>
		{/if}
	</div>

	<!-- Footer Info -->
	{#if $processedText}
		<div class="mt-4 rounded-lg bg-green-50 p-3 text-sm" in:fade>
			<div class="flex items-start gap-2">
				<Icon icon="mdi:check-circle" class="mt-0.5 h-4 w-4 text-green-600" />
				<div>
					<span class="font-medium text-green-800">Text extracted successfully!</span>
					<span class="text-green-700">
						Review the conversation above and generate your perfect response.
					</span>
				</div>
			</div>
		</div>
	{/if}
</div>
