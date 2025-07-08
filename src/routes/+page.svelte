<script lang="ts">
  import {
    generatedResponse,
    isGeneratingResponse,
    relationshipDetails,
    responseError,
    selectedApp,
    uploadedFile,
  } from "$lib/stores/form.store";
  import type { RizzGPTFormData } from "$lib/types";
  import ImageInput from "$lib/ui/Form/ImageInput.svelte";
  import RelationshipForm from "$lib/ui/Form/RelationshipContext.svelte";
  import GeneratedResponse from "$lib/ui/GeneratedResponse.svelte";
  import Header from "$lib/ui/Header.svelte";
  import { api } from "$lib/utils/api";

  // Check if we can generate response (only upload required now)
  $: canGenerateResponse = $uploadedFile && !$isGeneratingResponse;

  async function handleGenerateResponse() {
    if (!$uploadedFile) return;

    isGeneratingResponse.set(true);
    responseError.set(null);
    generatedResponse.set(null);

    try {
      const formData: RizzGPTFormData = {
        source: $selectedApp || undefined,
        duration: $relationshipDetails.duration,
        objective: $relationshipDetails.objective,
        notes: $relationshipDetails.additionalNotes || "",
      };

      const response = await api.generateRizz(formData, $uploadedFile);
      generatedResponse.set(response);
    } catch (error) {
      responseError.set(
        error instanceof Error
          ? error.message
          : "An error occurred while generating response"
      );
    } finally {
      isGeneratingResponse.set(false);
    }
  }
</script>

<div
  class="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-yellow-100 p-4 md:p-8"
>
  <div class="mx-auto max-w-4xl space-y-8">
    <Header />

    <div class="space-y-6">
      <div
        class="rounded-2xl border border-white/20 bg-white/70 p-6 shadow-lg backdrop-blur-sm"
      >
        <h2 class="mb-4 text-lg font-semibold text-gray-700">
          1. Upload Conversation (Image or Video) <span class="text-red-500"
            >*</span
          >
        </h2>
        <ImageInput />
      </div>

      <div
        class="rounded-2xl border border-white/20 bg-white/70 p-6 shadow-lg backdrop-blur-sm"
      >
        <h2 class="mb-4 text-lg font-semibold text-gray-700">
          2. Relationship Context <span class="text-gray-400">(optional)</span>
        </h2>
        <RelationshipForm />
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
