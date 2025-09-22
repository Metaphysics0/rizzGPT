<script lang="ts">
  import { enhance } from "$app/forms";
  import { generateRizzFormStore } from "$lib/stores/form.svelte";

  // const canGenerateResponse = $derived(generateRizzFormStore.canGenerate);
  const canGenerateResponse = true;
</script>

<!-- Hidden form inputs for the form action -->
<input
  type="hidden"
  name="fileName"
  value={generateRizzFormStore.form.fileName}
/>
<input
  type="hidden"
  name="duration"
  value={generateRizzFormStore.form.relationshipContext.duration}
/>
<input
  type="hidden"
  name="objective"
  value={generateRizzFormStore.form.relationshipContext.objective}
/>
<input
  type="hidden"
  name="notes"
  value={generateRizzFormStore.form.relationshipContext.notes}
/>

<!-- use:enhance={() => {
    generateRizzFormStore.setGenerating(true);
    return async ({ result }) => {
      generateRizzFormStore.setGenerating(false);
      if (result.type === "failure") {
        generateRizzFormStore.setError(
          (result.data?.error as string) || "Generation failed"
        );
      }
    };
  }} -->
<button
  type="submit"
  disabled={!canGenerateResponse}
  class="
          rounded-xl bg-linear-to-r from-purple-600 to-pink-600 px-8 py-3 font-medium
          text-white shadow-lg transition-all duration-200
          hover:scale-105 hover:from-purple-700 hover:to-pink-700 hover:shadow-xl
          disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50
        "
>
  {#if generateRizzFormStore.isGenerating}
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
