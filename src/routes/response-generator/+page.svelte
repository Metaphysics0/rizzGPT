<script lang="ts">
  import { enhance } from "$app/forms";
  import { responseHelperForm } from "$lib/stores/response-helper-form.svelte";
  import Dropzone from "$lib/ui/form/Dropzone.svelte";
  import RelationshipContext from "$lib/ui/form/RelationshipContext.svelte";
  import SubmitFormButton from "$lib/ui/form/SubmitFormButton.svelte";
</script>

<div class="mx-auto max-w-xl space-y-8">
  <form
    method="POST"
    action="?/generateRizz"
    use:enhance={responseHelperForm.handleEnhance}
  >
    <div class="space-y-6">
      <Dropzone
        title="Conversation Upload"
        tooltip="Upload a screen recording or screenshot of your conversation with your partner."
        maxFiles={1}
        maxFileSize={50 * 1024 * 1024}
        accept="image/*, video/*"
        collapsible={false}
        defaultCollapsed={false}
        onFileUpload={(fileName) =>
          (responseHelperForm.form.fileName = fileName)}
        onFileClear={() => (responseHelperForm.form.fileName = "")}
        isProcessing={responseHelperForm.response.loading}
      />
      <RelationshipContext
        value={responseHelperForm.form.relationshipContext}
        onUpdate={(context) =>
          Object.assign(responseHelperForm.form.relationshipContext, context)}
        showDuration={true}
      />
    </div>

    <div class="flex justify-center pt-4">
      <SubmitFormButton
        text="Get response"
        disabled={!responseHelperForm.canGenerate}
        isLoading={responseHelperForm.response.loading}
      />
    </div>
  </form>

  {#if responseHelperForm.response.error}
    <div class="rounded-xl border border-red-200 bg-red-50 p-4">
      <div class="flex items-center gap-2 text-red-800">
        <span class="font-medium">Error:</span>
        <span>{responseHelperForm.response.error}</span>
      </div>
    </div>
  {/if}
</div>
