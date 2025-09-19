<script lang="ts">
  import { goto, invalidate } from "$app/navigation";
  import {
    isGeneratingResponse,
    relationshipContextForm,
    responseError,
    uploadedFile,
  } from "$lib/stores/form.store";
  import { triggerClientFileUpload } from "$lib/utils/file/client-file-upload.util";
  import { getRelationshipContextForUpload } from "$lib/utils/get-relationship-context-for-upload.util";

  $: canGenerateResponse = $uploadedFile && !$isGeneratingResponse;

  async function onSubmit() {
    try {
      if (!$uploadedFile) return;
      isGeneratingResponse.set(true);
      responseError.set(null);
      const relationshipContext = getRelationshipContextForUpload(
        $relationshipContextForm
      );

      const blobUrl = await triggerClientFileUpload($uploadedFile);

      const response = await fetch("/api/generate-rizz", {
        method: "POST",
        body: JSON.stringify({ blobUrl, relationshipContext }),
      });
      const { conversationId } = await response.json();

      await invalidate("/conversations");
      await goto(`/conversations/${conversationId}`);
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
      Starting...
    </span>
  {:else}
    Generate Rizz
  {/if}
</button>
