<script lang="ts">
	import { processedText } from '$lib/stores/processed-text.store';
</script>

<div class="flex h-full flex-col">
	<h2 class="mb-4 text-xl font-semibold">Processed Text</h2>
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
		{$processedText || 'Text will appear here after processing...'}
	</div>
</div>
