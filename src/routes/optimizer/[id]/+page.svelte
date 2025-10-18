<script lang="ts">
  import ProTip from "$lib/ui/generated-response/ProTip.svelte";
  import AnnotatedImageCanvas from "$lib/ui/optimizer/AnnotatedImageCanvas.svelte";
  import OptimizerHeader from "$lib/ui/optimizer/OptimizerHeader.svelte";
  import { captureAndDownloadImage } from "$lib/utils/export/image-capture.util";
  import toast from "svelte-french-toast";
  import type { PageData } from "./$types";

  const { data }: { data: PageData } = $props();
  const { optimization } = $derived(data);

  let canvasContainerRef: HTMLDivElement | undefined = $state();
  let isExporting = $state(false);

  async function handleExport() {
    if (!canvasContainerRef) {
      console.error("Canvas container not found");
      return;
    }

    isExporting = true;

    try {
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `rizzgpt-profile-analysis-${timestamp}.png`;

      await captureAndDownloadImage(canvasContainerRef, filename, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      console.log("Image exported successfully");
    } catch (error) {
      console.error("Failed to export image:", error);
      toast.error("Failed to export image. Please try again.");
    } finally {
      isExporting = false;
    }
  }
</script>

<div class="container mx-auto px-4 py-8 max-w-6xl">
  <OptimizerHeader
    score={Number(optimization.overallScore)}
    summary={optimization.summary}
    onExport={handleExport}
    {isExporting}
  />

  <AnnotatedImageCanvas
    annotations={optimization.annotations}
    fileName={optimization.combinedImageFileName}
    bind:containerRef={canvasContainerRef}
  />

  <ProTip
    className="my-6 text-lg"
    text="Click on one of the annotations to see the analysis suggestion"
  />
</div>
