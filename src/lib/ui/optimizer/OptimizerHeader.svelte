<script lang="ts">
  import Icon from "@iconify/svelte";

  let {
    score,
    summary,
    onExport,
    isExporting = false,
  }: {
    score: number;
    summary: string;
    onExport?: () => void;
    isExporting?: boolean;
  } = $props();

  const scoreColor = $derived.by(() => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-amber-600";
    return "text-red-600";
  });

  const scoreBgColor = $derived.by(() => {
    if (score >= 8) return "bg-green-50 border-green-200";
    if (score >= 6) return "bg-amber-50 border-amber-200";
    return "bg-red-50 border-red-200";
  });
</script>

<div class="mb-6 rounded-lg border-2 p-6 {scoreBgColor}">
  <div class="flex items-center justify-between mb-3">
    <div class="flex items-center gap-3">
      <Icon icon="mingcute:star-fill" class="w-8 h-8 {scoreColor}" />
      <h1 class="text-2xl font-bold {scoreColor}">
        Profile Score: {score}/10
      </h1>
    </div>

    {#if onExport}
      <button
        onclick={onExport}
        disabled={isExporting}
        class="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Export as image"
      >
        {#if isExporting}
          <div
            class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
          ></div>
          <span>Exporting...</span>
        {:else}
          <Icon icon="mingcute:download-2-line" class="w-5 h-5" />
          <span>Export Image</span>
        {/if}
      </button>
    {/if}
  </div>
  <p class="text-gray-700 leading-relaxed">{summary}</p>
</div>
