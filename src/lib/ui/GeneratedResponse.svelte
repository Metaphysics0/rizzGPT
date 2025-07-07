<script lang="ts">
import { generatedResponse, responseError } from "$lib/stores/form.store";
import Icon from "@iconify/svelte";

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  // Could add a toast notification here
}
</script>

{#if $responseError}
	<div class="rounded-xl border border-red-200 bg-red-50 p-4">
		<div class="flex items-center gap-2 text-red-800">
			<Icon icon="mdi:alert-circle" class="h-5 w-5" />
			<span class="font-medium">Error</span>
		</div>
		<p class="mt-2 text-sm text-red-700">{$responseError}</p>
	</div>
{:else if $generatedResponse}
	<div class="space-y-4">
		<!-- AI Analysis -->
		<div class="rounded-xl border border-blue-200 bg-blue-50 p-4">
			<div class="mb-3 flex items-center gap-2">
				<Icon icon="mdi:brain" class="h-5 w-5 text-blue-600" />
				<span class="font-medium text-blue-800">AI Analysis</span>
			</div>
			<p class="text-sm text-blue-700">{$generatedResponse.explanation}</p>
		</div>

		<!-- Response Options -->
		<div class="space-y-3">
			<h3 class="flex items-center gap-2 text-lg font-semibold text-gray-800">
				<Icon icon="mdi:message-text" class="h-5 w-5 text-purple-600" />
				Response Options
			</h3>

			{#each $generatedResponse.responses as response, index}
				<div
					class="group relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-purple-300 hover:shadow-md"
				>
					<div class="flex items-start justify-between gap-3">
						<div class="flex-1">
							<div class="mb-2 flex items-center gap-2">
								<span
									class="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-purple-600"
								>
									{index + 1}
								</span>
								<span class="text-sm font-medium text-gray-500">Option {index + 1}</span>
							</div>
							<p class="text-gray-800">{response}</p>
						</div>

						<button
							on:click={() => copyToClipboard(response)}
							class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-600 opacity-0 transition-all hover:bg-purple-100 hover:text-purple-600 group-hover:opacity-100"
							title="Copy to clipboard"
						>
							<Icon icon="mdi:content-copy" class="h-4 w-4" />
						</button>
					</div>
				</div>
			{/each}
		</div>

		<!-- Pro Tip -->
		<div class="rounded-lg bg-green-50 p-3 text-sm">
			<div class="flex items-start gap-2">
				<Icon icon="mdi:lightbulb" class="mt-0.5 h-4 w-4 text-green-600" />
				<div>
					<span class="font-medium text-green-800">💡 Pro tip:</span>
					<span class="text-green-700">
						Click the copy button to copy any response to your clipboard, then paste it into your
						dating app! ✨
					</span>
				</div>
			</div>
		</div>
	</div>
{/if}
