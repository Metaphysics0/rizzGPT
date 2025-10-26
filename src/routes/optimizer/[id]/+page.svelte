<script lang="ts">
  import AnnotatedImageCanvas from "$lib/ui/optimizer/AnnotatedImageCanvas.svelte";
  import OptimizerHeader from "$lib/ui/optimizer/OptimizerHeader.svelte";
  import type { PageData } from "./$types";
  import GenerateExportButton from "$lib/ui/optimizer/GenerateExportButton.svelte";

  const { data }: { data: PageData } = $props();
  const { optimization } = $derived(data);
  let canvasContainerRef: HTMLDivElement | undefined = $state();
  let exportMode = $state(false);
</script>

<div class="container mx-auto px-4 py-8 max-w-6xl">
  <OptimizerHeader
    score={Number(optimization.overallScore)}
    summary={optimization.summary}
  />

  <AnnotatedImageCanvas
    annotations={optimization.annotations}
    fileName={optimization.combinedImageFileName}
    bind:containerRef={canvasContainerRef}
    bind:exportMode
  />

  <div class="w-full flex my-5">
    <GenerateExportButton
      {canvasContainerRef}
      score={Number(optimization.overallScore)}
      summary={optimization.summary}
      annotations={optimization.annotations}
      bind:exportMode
      className="mb-5 mx-auto"
    />
  </div>
</div>
