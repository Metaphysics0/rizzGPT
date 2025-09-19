<script lang="ts">
  import { isGeneratingResponse, uploadedFile } from "$lib/stores/form.store";
  import { imagePreview } from "$lib/stores/image-preview.store";
  import Icon from "@iconify/svelte";
  import FormStep from "./FormStep.svelte";
  import { fade } from "svelte/transition";

  let fileInput: HTMLInputElement;
  let isVideo = false;
  let videoElement: HTMLVideoElement;
  let isDragOver = false;

  function handleFile(file: File) {
    uploadedFile.set(file);
    isVideo = file.type.startsWith("video/");
    const previewUrl = URL.createObjectURL(file);
    imagePreview.set(previewUrl);
  }

  async function processImage(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    handleFile(file);
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    isDragOver = true;
  }

  function handleDragLeave(event: DragEvent) {
    event.preventDefault();
    isDragOver = false;
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        handleFile(file);
      }
    }
  }

  $: if (!$imagePreview && fileInput) {
    fileInput.value = "";
    uploadedFile.set(null);
  }

  function triggerFileInput() {
    fileInput?.click();
  }

  function clearImage() {
    imagePreview.set(null);
    uploadedFile.set(null);
    if (fileInput) {
      fileInput.value = "";
    }
    isVideo = false;
  }
</script>

<FormStep title="Conversation Upload" collapsible={false}>
  {#snippet headerAction()}
    {#if $imagePreview}
      <button
        type="button"
        onclick={clearImage}
        class="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-100 hover:text-red-700"
        transition:fade={{ duration: 200 }}
      >
        <Icon icon="mdi:close" class="h-4 w-4" />
        Clear
      </button>
    {/if}
  {/snippet}
  <div class="flex h-max flex-col">
    {#if $imagePreview}
      <!-- Preview Section -->
      <div class="mb-4 flex-1" transition:fade={{ duration: 200 }}>
        {#if isVideo}
          <div class="relative">
            <!-- svelte-ignore a11y_media_has_caption -->
            <video
              bind:this={videoElement}
              src={$imagePreview}
              controls
              class="h-auto max-h-60 w-full rounded-xl object-contain"
            ></video>
          </div>
        {:else}
          <img
            src={$imagePreview}
            alt="Preview"
            class="h-auto max-h-60 w-full rounded-xl object-contain"
          />
        {/if}
      </div>
    {:else}
      <div class="flex-1">
        <div
          class="
            group flex h-full min-h-[200px] flex-col items-center justify-center rounded-xl
            border-2 border-dashed transition-all duration-200 py-5 bg-gray-100 cursor-pointer
            {isDragOver
            ? 'border-purple-400 bg-purple-50/40'
            : 'border-gray-300 bg-gray-50/30 hover:bg-gray-200'}
          "
          onclick={triggerFileInput}
          role="button"
          tabindex="0"
          onkeydown={(e) => e.key === "Enter" && triggerFileInput()}
          ondragover={handleDragOver}
          ondragleave={handleDragLeave}
          ondrop={handleDrop}
        >
          <div class="flex flex-col items-center">
            <p class="text-gray-500 my-2">Drag and drop a file here or click</p>
            <Icon
              icon="clarity:upload-cloud-line"
              class="h-10 w-10 text-gray-500"
            />
          </div>
        </div>
      </div>
    {/if}

    <!-- Hidden File Input -->
    <input
      type="file"
      accept="image/*, video/mp4, video/quicktime, video/x-msvideo"
      onchange={processImage}
      class="hidden"
      bind:this={fileInput}
      disabled={$isGeneratingResponse}
    />
  </div>
</FormStep>
