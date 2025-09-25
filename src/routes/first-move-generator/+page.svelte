<script lang="ts">
  import { applyAction, enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { firstMoveGeneratorFormStore } from "$lib/stores/first-move-generator-form.svelte";
  import GenerateResponseButton from "$lib/ui/form/SubmitFormButton.svelte";
  import RelationshipContext from "$lib/ui/form/RelationshipContext.svelte";
  import type { SubmitFunction } from "@sveltejs/kit";
  import NewDropzone from "$lib/ui/form/NewDropzone.svelte";

  const handleEnhance: SubmitFunction = ({ formData }) => {
    firstMoveGeneratorFormStore.setFormData(formData);
    firstMoveGeneratorFormStore.setGenerating(true);
    return async ({ result }) => {
      firstMoveGeneratorFormStore.setGenerating(false);
      if (result.type === "redirect") {
        goto(result.location);
        return;
      }
      if (result.type === "failure") {
        const errorMessage =
          typeof result.data?.error === "string"
            ? result.data.error
            : "Generation failed";
        firstMoveGeneratorFormStore.setError(errorMessage);
        return;
      }
      await applyAction(result);
    };
  };
</script>

<div class="mx-auto max-w-xl space-y-8">
  <form method="POST" action="?/generateFirstMove" use:enhance={handleEnhance}>
    <div class="space-y-6">
      <NewDropzone />
      <RelationshipContext
        title="Match Context"
        subtitle="(optional)"
        value={firstMoveGeneratorFormStore.form.relationshipContext}
        onUpdate={(context) =>
          firstMoveGeneratorFormStore.updateRelationshipContext(context)}
        showDuration={false}
      />
    </div>

    <div class="flex justify-center pt-4">
      <GenerateResponseButton text="Generate!" />
    </div>
  </form>

  {#if firstMoveGeneratorFormStore.error}
    <div class="rounded-xl border border-red-200 bg-red-50 p-4">
      <div class="flex items-center gap-2 text-red-800">
        <span class="font-medium">Error:</span>
        <span>{firstMoveGeneratorFormStore.error}</span>
      </div>
    </div>
  {/if}
</div>
