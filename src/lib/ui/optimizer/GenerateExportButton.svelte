<script lang="ts">
  import { cn } from "$lib/utils";
  import { convertHtmlToImage } from "$lib/utils/export/image-capture.util";
  import { downloadBlob } from "$lib/utils/file/trigger-client-side-download.util";
  import Icon from "@iconify/svelte";
  import toast from "svelte-french-toast";

  let {
    canvasContainerRef,
    className,
  }: { canvasContainerRef?: HTMLDivElement; className?: string } = $props();

  let isExporting = $state(false);

  async function downloadExport() {
    if (!canvasContainerRef) {
      console.error("Canvas container not found");
      return;
    }

    isExporting = true;

    try {
      const imageBlob = await convertHtmlToImage(canvasContainerRef);

      if (!imageBlob) throw new Error("Failed to create image");

      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `rizzgpt-profile-analysis-${timestamp}.png`;
      downloadBlob(imageBlob, filename);
      toast.success("Image exported successfully!");
    } catch (error) {
      console.error("Failed to export image:", error);
      toast.error("Failed to export image. Please try again.");
    } finally {
      isExporting = false;
    }
  }
</script>

<button
  onclick={downloadExport}
  disabled={isExporting}
  class={cn(
    "cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
    className,
  )}
  title="Export as image"
>
  {#if isExporting}
    <div
      class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
    ></div>
    <span>Exporting...</span>
  {:else}
    <Icon icon="mingcute:download-2-line" class="w-5 h-5" />
    <span>Export report</span>
  {/if}
</button>
