<script lang="ts">
  import {
    isGeneratingResponse,
    relationshipContextForm,
    responseError,
    uploadedFile,
  } from "$lib/stores/form.store";
  import { triggerClientFileUpload } from "$lib/utils/file/client-file-upload.util";
  import { getRelationshipContextForUpload } from "$lib/utils/get-relationship-context-for-upload.util";
  import { enhance } from "$app/forms";

  let blobUrl = "";
  let relationshipContext = "";

  $: canGenerateResponse = $uploadedFile && !$isGeneratingResponse;

  async function onButtonClick() {
    try {
      if (!$uploadedFile) return;
      isGeneratingResponse.set(true);
      responseError.set(null);
      relationshipContext = JSON.stringify(
        getRelationshipContextForUpload($relationshipContextForm)
      );

      const blobUrl = await triggerClientFileUpload($uploadedFile);

      // await goto(`/conversations/${conversationId}`);
    } catch (error) {
      responseError.set(
        error instanceof Error
          ? error.message
          : "An error occurred while generating response"
      );
      isGeneratingResponse.set(false);
    }
  }
</script>

<form
  use:enhance={() => {
    return ({ result, update }) => {
      isGeneratingResponse.set(false);
    };
  }}
  action="?/generateRizz"
  method="POST"
>
  <input type="hidden" name="blobUrl" value={blobUrl} />
  <input type="hidden" name="relationshipContext" value={relationshipContext} />
  <button
    disabled={!canGenerateResponse}
    on:click={onButtonClick}
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
      Generate Response
    {/if}
  </button>
</form>
