<script lang="ts">
  import { enhance } from "$app/forms";
  import { generateRizzFormStore } from "$lib/stores/form.svelte";
  import GenerateResponseButton from "$lib/ui/form/GenerateRizzButton.svelte";
  import ImageInput from "$lib/ui/form/ImageInput.svelte";
  import RelationshipContext from "$lib/ui/form/RelationshipContext.svelte";
</script>

<div class="mx-auto max-w-xl space-y-8">
  <form
    method="POST"
    action="?/generateRizz"
    use:enhance={() => {
      generateRizzFormStore.setGenerating(true);
      return async ({ result }) => {
        generateRizzFormStore.setGenerating(false);
        if (result.type === "failure") {
          const errorMessage =
            typeof result.data?.error === "string"
              ? result.data.error
              : "Generation failed";
          generateRizzFormStore.setError(errorMessage);
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
</div>
