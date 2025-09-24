<script lang="ts">
  import { generateRizzFormStore } from "$lib/stores/response-helper-form.svelte";
  const canGenerateResponse = $derived(generateRizzFormStore.canGenerate);

  let { text }: { text: string } = $props();
</script>

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
    {text}
  {/if}
</button>
