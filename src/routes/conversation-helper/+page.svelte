<script lang="ts">
  import { enhance } from "$app/forms";
  import { conversationHelperForm } from "$lib/runes/conversation-helper-form.svelte";
  import Dropzone from "$lib/ui/form/Dropzone.svelte";
  import FormHeader from "$lib/ui/form/FormHeader.svelte";
  import RelationshipContext from "$lib/ui/form/RelationshipContext.svelte";
  import SubmitFormButton from "$lib/ui/form/SubmitFormButton.svelte";
</script>

<svelte:head>
  <title>RizzGPT - Conversation Helper</title>
</svelte:head>

<div class="mx-auto max-w-xl space-y-8 px-3">
  <FormHeader
    header="Not sure what to say next?"
    subheader="Get a handcrafted response in seconds!"
  />
  <form
    method="POST"
    action="?/generateRizz"
    use:enhance={conversationHelperForm.handleEnhance}
  >
    <div class="space-y-6">
      <Dropzone
        title="Upload your conversation!"
        tooltip="Upload a screen recording or screenshot of your conversation with your partner."
        maxFiles={1}
        maxFileSize={50 * 1024 * 1024}
        accept="image/*, video/*"
        collapsible={false}
        defaultCollapsed={false}
        onFileUpload={(fileName) =>
          (conversationHelperForm.form.fileName = fileName)}
        onFileClear={() => (conversationHelperForm.form.fileName = "")}
        isProcessing={conversationHelperForm.response.loading}
      />
      <RelationshipContext
        value={conversationHelperForm.form.relationshipContext}
        onUpdate={(context) =>
          Object.assign(
            conversationHelperForm.form.relationshipContext,
            context
          )}
        showDuration={true}
      />
    </div>

    <div class="flex justify-center pt-4">
      <SubmitFormButton
        text="Generate response!"
        disabled={!conversationHelperForm.canGenerate}
        isLoading={conversationHelperForm.response.loading}
      />
    </div>
  </form>

  {#if conversationHelperForm.response.error}
    <div class="rounded-xl border border-red-200 bg-red-50 p-4">
      <div class="flex items-center gap-2 text-red-800">
        <span class="font-medium">Error:</span>
        <span>{conversationHelperForm.response.error}</span>
      </div>
    </div>
  {/if}
</div>
