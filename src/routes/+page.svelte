<script>
	import ImageInput from '$lib/ui/ImageInput.svelte';
	import ProcessedText from '$lib/ui/ProcessedText.svelte';
	import RelationshipForm from '$lib/ui/RelationshipForm.svelte';
	import { isStep1Complete, isStep2Complete } from '$lib/stores/form.store';
	import ConversationSource from '$lib/ui/ConversationSource.svelte';
</script>

<div class="min-h-screen bg-slate-50 p-8">
	<div class="mx-auto max-w-7xl space-y-8">
		<!-- Header -->
		<div class="mx-auto mb-12 max-w-7xl text-center">
			<h1 class="text-4xl font-bold md:text-5xl">
				<span class="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
					RizzGPT
				</span>
			</h1>
			<p class="mt-4 text-lg text-gray-600 md:text-xl">
				Get the perfect response for bae 💌
				<span class="mt-2 block text-sm text-gray-400"> Snap → Scan → Sweet Talk </span>
			</p>
		</div>

		<!-- Main Grid -->
		<div class="grid gap-8 lg:grid-cols-3">
			<!-- Left Column - Configuration -->
			<div class="space-y-6 lg:col-span-1">
				<div class="rounded-xl bg-white p-6 shadow-sm">
					<h2 class="mb-4 text-lg font-semibold text-slate-900">1. Conversation Source</h2>
					<ConversationSource />
				</div>

				<!-- Relationship Context Section -->
				<div
					class="rounded-xl bg-white p-6 shadow-sm transition-opacity {!$isStep1Complete
						? 'pointer-events-none opacity-50'
						: ''}"
				>
					<h2 class="mb-4 text-lg font-semibold text-slate-900">2. Relationship Context</h2>
					<RelationshipForm />
				</div>
			</div>

			<!-- Right Column - Upload & Results -->
			<div class="flex lg:col-span-2">
				<div class="grid flex-1 gap-6 md:grid-cols-2">
					<!-- Upload Section -->
					<div
						class="relative flex flex-col rounded-xl bg-white p-6 shadow-sm transition-opacity {!$isStep2Complete
							? 'pointer-events-none opacity-50'
							: ''}"
					>
						<h2 class="mb-4 text-lg font-semibold text-slate-900">3. Upload Conversation</h2>
						<div class="flex-1">
							<ImageInput />
						</div>
					</div>

					<div class="flex flex-col rounded-xl bg-white p-6 shadow-sm">
						<h2 class="mb-4 text-lg font-semibold text-slate-900">AI Response</h2>
						<div class="flex-1">
							<ProcessedText />
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Submit Button -->
		<div class="flex justify-center">
			<button
				disabled={!$isStep1Complete || !$isStep2Complete}
				class="
					rounded-lg bg-slate-800 px-8 py-3 text-sm font-medium text-white
					transition-colors hover:bg-slate-900
					disabled:opacity-50
				"
			>
				Generate Response
			</button>
		</div>
	</div>
</div>
