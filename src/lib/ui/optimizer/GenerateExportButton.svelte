<script lang="ts">
  import { cn } from "$lib/utils";
  import { convertHtmlToImage } from "$lib/utils/export/image-capture.util";
  import { generateOptimizationPDF } from "$lib/utils/export/pdf-generator";
  import { downloadBlob } from "$lib/utils/file/trigger-client-side-download.util";
  import Icon from "@iconify/svelte";
  import toast from "svelte-french-toast";
  import type { Annotation } from "$lib/types";
  import { tick } from "svelte";

  let {
    canvasContainerRef,
    score,
    summary,
    annotations,
    exportMode = $bindable(false),
    className,
  }: {
    canvasContainerRef?: HTMLDivElement;
    score: number;
    summary: string;
    annotations: Annotation[];
    exportMode?: boolean;
    className?: string;
  } = $props();

  let isExporting = $state(false);
  let showDropdown = $state(false);

  async function exportAsImage() {
    if (!canvasContainerRef) {
      console.error("Canvas container not found");
      return;
    }

    isExporting = true;
    showDropdown = false;

    try {
      // Enable export mode to hide bounding boxes
      exportMode = true;
      // Wait for DOM to update
      await tick();

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
      // Restore normal view
      exportMode = false;
      isExporting = false;
    }
  }

  async function exportAsPDF() {
    if (!canvasContainerRef) {
      console.error("Canvas container not found");
      return;
    }

    isExporting = true;
    showDropdown = false;

    try {
      // Enable export mode to hide bounding boxes
      exportMode = true;
      // Wait for DOM to update
      await tick();

      const pdfBlob = await generateOptimizationPDF(
        {
          score,
          summary,
          annotations,
        },
        canvasContainerRef,
      );

      if (!pdfBlob) throw new Error("Failed to create PDF");

      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `rizzgpt-profile-analysis-${timestamp}.pdf`;
      downloadBlob(pdfBlob, filename);
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("Failed to export PDF:", error);
      toast.error("Failed to export PDF. Please try again.");
    } finally {
      // Restore normal view
      exportMode = false;
      isExporting = false;
    }
  }
</script>

<div class={cn("relative inline-block", className)}>
  <!-- Main button with dropdown toggle -->
  <button
    onclick={() => (showDropdown = !showDropdown)}
    disabled={isExporting}
    class="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    title="Export report"
  >
    {#if isExporting}
      <div
        class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
      ></div>
      <span>Exporting...</span>
    {:else}
      <Icon icon="mingcute:download-2-line" class="w-5 h-5" />
      <span>Export Report!</span>
      <Icon
        icon="mingcute:down-line"
        class="w-4 h-4 transition-transform {showDropdown ? 'rotate-180' : ''}"
      />
    {/if}
  </button>

  <!-- Dropdown menu -->
  {#if showDropdown && !isExporting}
    <div
      class="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
    >
      <button
        onclick={exportAsPDF}
        class="w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition-colors text-left"
      >
        <Icon icon="mingcute:file-pdf-line" class="w-5 h-5 text-red-500" />
        <div class="flex-1">
          <div class="text-sm font-medium text-gray-900">Export as PDF</div>
          <div class="text-xs text-gray-500">Full report with annotations</div>
        </div>
      </button>

      <div class="h-px bg-gray-200"></div>

      <button
        onclick={exportAsImage}
        class="w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition-colors text-left"
      >
        <Icon icon="mingcute:image-line" class="w-5 h-5 text-purple-500" />
        <div class="flex-1">
          <div class="text-sm font-medium text-gray-900">Export as Image</div>
          <div class="text-xs text-gray-500">PNG screenshot only</div>
        </div>
      </button>
    </div>
  {/if}
</div>

<!-- Click outside to close dropdown -->
{#if showDropdown}
  <button
    onclick={() => (showDropdown = false)}
    class="fixed inset-0 z-40"
    tabindex="-1"
    aria-hidden="true"
  ></button>
{/if}
