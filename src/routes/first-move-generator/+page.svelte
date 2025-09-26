<script lang="ts">
  import { enhance } from "$app/forms";
  import { firstMoveGeneratorForm } from "$lib/stores/first-move-generator-form.svelte";
  import GenerateResponseButton from "$lib/ui/form/SubmitFormButton.svelte";
  import RelationshipContext from "$lib/ui/form/RelationshipContext.svelte";
  import Dropzone from "$lib/ui/form/Dropzone.svelte";
</script>

<div class="mx-auto max-w-xl space-y-8">
  <form
    method="POST"
    action="?/generateFirstMove"
    use:enhance={firstMoveGeneratorForm.handleEnhance}
  >
    <div class="space-y-6">
      <Dropzone
        title="Match Profile Analysis"
        tooltip="Upload screenshots of your match bio"
      />
      <RelationshipContext
        title="Match Context"
        subtitle="(optional)"
        value={firstMoveGeneratorForm.form.relationshipContext}
        onUpdate={(context) =>
          Object.assign(
            firstMoveGeneratorForm.form.relationshipContext,
            context
          )}
        showDuration={false}
      />
    </div>

    <div class="flex justify-center pt-4">
      <GenerateResponseButton
        text="Generate!"
        disabled={!firstMoveGeneratorForm.canGenerate}
        isLoading={firstMoveGeneratorForm.response.loading}
      />
    </div>
  </form>

  {#if firstMoveGeneratorForm.response.error}
    <div class="rounded-xl border border-red-200 bg-red-50 p-4">
      <div class="flex items-center gap-2 text-red-800">
        <span class="font-medium">Error:</span>
        <span>{firstMoveGeneratorForm.response.error}</span>
      </div>
    </div>
  {/if}
</div>
