<script>
	import ImageInput from '$lib/ui/ImageInput.svelte';
	import ProcessedText from '$lib/ui/ProcessedText.svelte';
	import RelationshipForm from '$lib/ui/RelationshipForm.svelte';
	import { isStep1Complete, isStep2Complete } from '$lib/stores/form.store';
	import ConversationSource from '$lib/ui/ConversationSource.svelte';
</script>

<div class="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-yellow-100 p-4 md:p-8">
	<div class="mx-auto max-w-4xl space-y-8">
		<!-- Header -->
		<div class="mx-auto mb-12 max-w-2xl text-center">
			<h1 class="text-4xl font-bold md:text-5xl">
				💕 <span class="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
					RizzGPT
				</span>
			</h1>
			<p class="mt-4 text-lg font-medium text-gray-600 md:text-xl">
				Get the perfect response for bae 💕
			</p>
			<p class="mt-2 text-sm text-gray-500">Your AI wingman for dating apps</p>
		</div>

		<!-- Main Content -->
		<div class="space-y-6">
			<!-- Step 1: Conversation Source -->
			<div class="rounded-2xl border border-white/20 bg-white/70 p-6 shadow-lg backdrop-blur-sm">
				<h2 class="mb-4 text-lg font-semibold text-gray-700">1. Conversation Source</h2>
				<ConversationSource />
			</div>

			<!-- Step 2: Relationship Context -->
			<div
				class="rounded-2xl border border-white/20 bg-white/70 p-6 shadow-lg backdrop-blur-sm transition-opacity {!$isStep1Complete
					? 'pointer-events-none opacity-50'
					: ''}"
			>
				<h2 class="mb-4 text-lg font-semibold text-gray-700">2. Relationship Context</h2>
				<RelationshipForm />
			</div>

			<!-- Step 3: Upload and Results Grid -->
			<div class="grid gap-6 md:grid-cols-1">
				<!-- Upload Section -->
				<div
					class="rounded-2xl border border-white/20 bg-white/70 p-6 shadow-lg backdrop-blur-sm transition-opacity {!$isStep2Complete
						? 'pointer-events-none opacity-50'
						: ''}"
				>
					<h2 class="mb-4 text-lg font-semibold text-gray-700">
						3. Upload Conversation (Image or Video)
					</h2>
					<ImageInput />
				</div>

				<!-- AI Response Section -->
				<!-- <div class="rounded-2xl border border-white/20 bg-white/70 p-6 shadow-lg backdrop-blur-sm">
					<h2 class="mb-4 text-lg font-semibold text-gray-700">AI Response</h2>
					<ProcessedText />
				</div> -->
			</div>
		</div>

		<!-- Submit Button -->
		<div class="flex justify-center pt-4">
			<button
				disabled={!$isStep1Complete || !$isStep2Complete}
				class="
					rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 font-medium
					text-white shadow-lg transition-all duration-200
					hover:scale-105 hover:from-purple-700 hover:to-pink-700 hover:shadow-xl
					disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50
				"
			>
				Generate Response
			</button>
		</div>
	</div>
</div>
