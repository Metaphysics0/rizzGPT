<script lang="ts">
  import {
    generatedResponse,
    isGeneratingResponse,
    relationshipDetails,
    responseError,
    uploadedFile,
  } from "$lib/stores/form.store";
  import type { RizzGPTFormData } from "$lib/types";
  import { ApiService } from "$lib/utils/api-service.util";
  import { triggerClientFileUpload } from "$lib/utils/client-file-upload.util";

  $: canGenerateResponse = $uploadedFile && !$isGeneratingResponse;

  async function onSubmit() {
    if (!$uploadedFile) return;

    isGeneratingResponse.set(true);
    responseError.set(null);
    generatedResponse.set(null);

    try {
      // const formData: RizzGPTFormData = {
      //   duration: $relationshipDetails.duration,
      //   objective: $relationshipDetails.objective,
      //   notes: $relationshipDetails.notes || "",
      // };

      // const blobUrl = await triggerClientFileUpload($uploadedFile);

      const { messageBody, url } = {
        messageBody: {
          blobUrl:
            "https://l7g7ily341onx4gp.public.blob.vercel-storage.com/uploads/1752147070684-80z5jz1zw4c-lr4T6XKQCUAO38e5z4y4XQjaSR4zm7.mov",
          formData: {
            duration: 0,
            objective: "",
            notes: "",
          },
        },
        url: "https://huge-ads-know.loca.lt/api/edge-functions/generate-rizz",
      };

      const response = await new ApiService().generateRizz(
        messageBody.formData,
        messageBody.blobUrl
      );
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
