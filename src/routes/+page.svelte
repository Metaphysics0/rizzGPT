<script lang="ts">
  import { applyAction, enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { generateRizzFormStore } from "$lib/stores/form.svelte";
  import GenerateResponseButton from "$lib/ui/form/GenerateRizzButton.svelte";
  import ImageInput from "$lib/ui/form/ImageInput.svelte";
  import RelationshipContext from "$lib/ui/form/RelationshipContext.svelte";
</script>

<div class="mx-auto max-w-xl space-y-8">
  <form
    method="POST"
    action="?/generateRizz"
    use:enhance={({ formData }) => {
      generateRizzFormStore.setFormData(formData);

      generateRizzFormStore.setGenerating(true);
      return async ({ result }) => {
        generateRizzFormStore.setGenerating(false);
        if (result.type === "redirect") {
          goto(result.location);
        } else if (result.type === "failure") {
          const errorMessage =
            typeof result.data?.error === "string"
              ? result.data.error
              : "Generation failed";
          generateRizzFormStore.setError(errorMessage);
        } else {
          await applyAction(result);
        }
      };
    }}
  >
    <div class="space-y-6">
      <ImageInput />
      <RelationshipContext />
    </div>

    <div class="flex justify-center pt-4">
      <GenerateResponseButton />
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
