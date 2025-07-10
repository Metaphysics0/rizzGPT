<script lang="ts">
  import {
    generatedResponse,
    isGeneratingResponse,
    relationshipDetails,
    responseError,
    uploadedFile,
  } from "$lib/stores/form.store";
  import type { RelationshipContext } from "$lib/types";
  import { ApiService } from "$lib/utils/api-service.util";
  import { triggerClientFileUpload } from "$lib/utils/client-file-upload.util";

  $: canGenerateResponse = $uploadedFile && !$isGeneratingResponse;

  async function onSubmit() {
    if (!$uploadedFile) return;

    isGeneratingResponse.set(true);
    responseError.set(null);
    generatedResponse.set(null);

    try {
      const relationshipContext: RelationshipContext = {
        duration: $relationshipDetails.duration,
        objective: $relationshipDetails.objective,
        notes: $relationshipDetails.notes || "",
      };

      const blobUrl = await triggerClientFileUpload($uploadedFile);
      const response = await new ApiService().triggerGenerateRizz({
        relationshipContext,
        blobUrl,
      });
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

<button
  disabled={!canGenerateResponse}
  onclick={onSubmit}
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
