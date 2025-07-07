<script lang="ts">
	import { generateRizz } from '$lib/services/gemini.service';
	import {
		generatedResponse,
		isGeneratingResponse,
		isStep1Complete,
		isStep2Complete,
		relationshipDetails,
		responseError,
		selectedApp,
		uploadedFile
	} from '$lib/stores/form.store';
	import { imagePreview } from '$lib/stores/image-preview.store';
	import type { RizzGPTFormData } from '$lib/types';
	import ConversationSource from '$lib/ui/ConversationSource.svelte';
	import GeneratedResponse from '$lib/ui/GeneratedResponse.svelte';
	import ImageInput from '$lib/ui/ImageInput.svelte';
	import RelationshipForm from '$lib/ui/RelationshipForm.svelte';

	// Check if we can generate response (all steps complete + file uploaded)
	$: canGenerateResponse =
		$isStep1Complete && $isStep2Complete && $uploadedFile && !$isGeneratingResponse;

	async function handleGenerateResponse() {
		if (!$uploadedFile || !$selectedApp) return;

		isGeneratingResponse.set(true);
		responseError.set(null);
		generatedResponse.set(null);

		try {
			const formData: RizzGPTFormData = {
				source: $selectedApp,
				duration: $relationshipDetails.duration,
				objective: $relationshipDetails.objective,
				notes: $relationshipDetails.additionalNotes || ''
			};

			const response = await generateRizz(formData, $uploadedFile);
			generatedResponse.set(response);
		} catch (error) {
			responseError.set(
				error instanceof Error ? error.message : 'An error occurred while generating response'
			);
		} finally {
			isGeneratingResponse.set(false);
		}
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-yellow-100 p-4 md:p-8">
	<div class="mx-auto max-w-4xl space-y-8">
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

		<div class="space-y-6">
			<div class="rounded-2xl border border-white/20 bg-white/70 p-6 shadow-lg backdrop-blur-sm">
				<h2 class="mb-4 text-lg font-semibold text-gray-700">1. Conversation Source</h2>
				<ConversationSource />
			</div>

			<div
				class="rounded-2xl border border-white/20 bg-white/70 p-6 shadow-lg backdrop-blur-sm transition-opacity {!$isStep1Complete
					? 'pointer-events-none opacity-50'
					: ''}"
			>
				<h2 class="mb-4 text-lg font-semibold text-gray-700">2. Relationship Context</h2>
				<RelationshipForm />
			</div>

			<div class="grid gap-6 md:grid-cols-1">
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
				{#if $generatedResponse || $responseError}
					<div
						class="rounded-2xl border border-white/20 bg-white/70 p-6 shadow-lg backdrop-blur-sm"
					>
						<h2 class="mb-4 text-lg font-semibold text-gray-700">AI Response</h2>
						<GeneratedResponse />
					</div>
				{/if}
			</div>
		</div>

		<div class="flex justify-center pt-4">
			<button
				disabled={!canGenerateResponse}
				on:click={handleGenerateResponse}
				class="
					rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 font-medium
					text-white shadow-lg transition-all duration-200
					hover:scale-105 hover:from-purple-700 hover:to-pink-700 hover:shadow-xl
					disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50
				"
			>
				{#if $isGeneratingResponse}
					<span class="flex items-center gap-2">
						<div
							class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
						></div>
						Generating...
					</span>
				{:else}
					Generate Response
				{/if}
			</button>
		</div>
	</div>
</div>
