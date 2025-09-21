<script lang="ts">
  import { isGeneratingResponse, generateRizzForm } from "$lib/stores/form.store";
  import { imagePreview } from "$lib/stores/image-preview.store";
  import { triggerClientFileUpload } from "$lib/utils/file/client-file-upload.util";
  import Icon from "@iconify/svelte";
  import FormStep from "./FormStep.svelte";
  import { fade } from "svelte/transition";

  let fileInput: HTMLInputElement;
  let isVideo = false;
  let videoElement: HTMLVideoElement;
  let isDragOver = false;
  let isUploading = false;

  async function handleFile(file: File) {
    try {
      isUploading = true;
      isVideo = file.type.startsWith("video/");
      const previewUrl = URL.createObjectURL(file);
      imagePreview.set(previewUrl);

      // Upload to S3 immediately
      const blobUrl = await triggerClientFileUpload(file);

      // Update the form store with the blob URL
      generateRizzForm.update(form => ({
        ...form,
        blobUrl
      }));
    } catch (error) {
      console.error("Failed to upload file:", error);
      // Clear preview on error
      imagePreview.set(null);
      generateRizzForm.update(form => ({
        ...form,
        blobUrl: ""
      }));
    } finally {
      isUploading = false;
    }
  }

  async function processImage(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    await handleFile(file);
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    isDragOver = true;
  }

  function handleDragLeave(event: DragEvent) {
    event.preventDefault();
    isDragOver = false;
  }

  async function handleDrop(event: DragEvent) {
    event.preventDefault();
    isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        await handleFile(file);
      }
    }
  }

  $: if (!$imagePreview && fileInput) {
    fileInput.value = "";
    generateRizzForm.update(form => ({
      ...form,
      blobUrl: ""
    }));
  }

  function triggerFileInput() {
    if (!isUploading && !$isGeneratingResponse) {
      fileInput?.click();
    }
  }

  function clearImage() {
    imagePreview.set(null);
    generateRizzForm.update(form => ({
      ...form,
      blobUrl: ""
    }));
    if (fileInput) {
      fileInput.value = "";
    }
    isVideo = false;
  }
</script>

<FormStep
  title="Conversation Upload"
  collapsible={false}
  tooltip="Upload a screen recording or screenshot of your conversation with your partner."
>
  {#snippet headerAction()}
    {#if $imagePreview}
      <button
        type="button"
        onclick={clearImage}
        class="flex items-center gap-1.5 rounded-lg text-gray-500 px-3 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer hover:text-gray-700"
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
      <div class="mb-4 flex-1">
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
            border-2 border-dashed transition-all duration-200 py-5 bg-gray-100
            {isUploading || $isGeneratingResponse
            ? 'cursor-not-allowed opacity-50'
            : 'cursor-pointer'}
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
            {#if isUploading}
              <div class="h-10 w-10 animate-spin rounded-full border-2 border-purple-500 border-t-transparent bg-gray-200 p-2"></div>
              <p class="text-gray-500 my-2">Uploading...</p>
            {:else}
              <Icon
                icon="mingcute:upload-2-line"
                class="h-10 w-10 text-gray-500 bg-gray-200 border border-gray-300 rounded-md p-2"
              />
              <p class="text-gray-500 my-2">Upload a file</p>
            {/if}
            <p class="text-gray-800 text-sm">
              Drag and drop or click to upload
            </p>
            <p class="text-gray-800 text-sm">
              Accepts images and videos up to 50MB
            </p>
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
      disabled={$isGeneratingResponse || isUploading}
    />
  </div>
</FormStep>
