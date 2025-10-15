<script lang="ts">
  import AnnotatedImageCanvas from "$lib/ui/optimizer/AnnotatedImageCanvas.svelte";
  import OptimizerHeader from "$lib/ui/optimizer/OptimizerHeader.svelte";
  import type { PageData } from "./$types";

  const { data }: { data: PageData } = $props();
  const { optimization } = $derived(data);
</script>

<div class="container mx-auto px-4 py-8 max-w-6xl">
  <OptimizerHeader score={Number(optimization.overallScore)} summary={optimization.summary} />

  <AnnotatedImageCanvas
    annotations={optimization.annotations}
    fileName={optimization.combinedImageFileName}
  />
</div>
