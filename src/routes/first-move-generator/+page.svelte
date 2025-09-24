<script lang="ts">
  import { applyAction, enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { generateRizzFormStore } from "$lib/stores/response-helper-form.svelte";
  import GenerateResponseButton from "$lib/ui/form/SubmitFormButton.svelte";
  import ImageInput from "$lib/ui/form/ImageInput.svelte";
  import RelationshipContext from "$lib/ui/form/RelationshipContext.svelte";
  import type { SubmitFunction } from "@sveltejs/kit";

  const handleEnhance: SubmitFunction = ({ formData }) => {};
</script>

<div class="mx-auto max-w-xl space-y-8">
  <form method="POST" action="?/generateFirstMove" use:enhance={handleEnhance}>
    <div class="space-y-6">
      <ImageInput
        title="Profile Analysis"
        tooltip="Upload screenshots of their profile, bio, or photos for AI analysis"
        collapsible={true}
        defaultCollapsed={false}
        onFileUpload={(fileName) => generateRizzFormStore.setFileName(fileName)}
        onFileClear={() => generateRizzFormStore.setFileName("")}
        isProcessing={generateRizzFormStore.isGenerating}
      />
      <RelationshipContext />
    </div>

    <div class="flex justify-center pt-4">
      <GenerateResponseButton text="Generate Rizz" />
    </div>
  </form>

  {#if generateRizzFormStore.error}
    <div class="rounded-xl border border-red-200 bg-red-50 p-4">
      <div class="flex items-center gap-2 text-red-800">
        <span class="font-medium">Error:</span>
        <span>{generateRizzFormStore.error}</span>
      </div>
    </div>
  {/if}
</div>
