<script lang="ts">
  import { generateRizzFormStore } from "$lib/stores/form.svelte";
  import { userStore } from "$lib/stores/user.svelte";
  import { mediaCache } from "$lib/stores/image-preview.svelte";
  import { triggerClientFileUpload } from "$lib/utils/file/client-file-upload.util";
  import Icon from "@iconify/svelte";
  import FormStep from "./FormStep.svelte";
  import MediaSkeleton from "$lib/ui/loading-animations/MediaSkeleton.svelte";
  import { fade } from "svelte/transition";

  interface Props {
    title?: string;
    subtitle?: string;
    tooltip?: string;
    collapsible?: boolean;
    defaultCollapsed?: boolean;
    uploadLabel?: string;
    uploadDescription?: string;
    uploadSubDescription?: string;
    acceptedTypes?: string;
    maxSizeText?: string;
  }

  let {
    title = "Conversation Upload",
    subtitle,
    tooltip = "Upload a screen recording or screenshot of your conversation with your partner.",
    collapsible = false,
    defaultCollapsed = false,
    uploadLabel = "Upload a file",
    uploadDescription = "Drag and drop or click to upload",
    uploadSubDescription = "Accepts images and videos up to 50MB",
    acceptedTypes = "image/*, video/mp4, video/quicktime, video/x-msvideo",
    maxSizeText = "Accepts images and videos up to 50MB",
  }: Props = $props();

  let imagePreview = $state<string | null>("");

  let fileInput = $state<HTMLInputElement>();
  let isVideo = $state(false);
  let isDragOver = $state(false);
  let isUploading = $state(false);

  async function handleFile(file: File) {
    try {
      isUploading = true;
      isVideo = file.type.startsWith("video/");
      const previewUrl = URL.createObjectURL(file);
      imagePreview = previewUrl;

      if (!userStore.userId) {
        throw new Error("User not authenticated");
      }

      const fileName = await triggerClientFileUpload(file, userStore.userId);
      console.log("Uploaded file succesfully: ", fileName);

      // Cache the uploaded media
      mediaCache.set(fileName, previewUrl, isVideo);

      generateRizzFormStore.setFileName(fileName);
    } catch (error) {
      console.error("Failed to upload file:", error);
      imagePreview = null;
      generateRizzFormStore.setFileName("");
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

  function triggerFileInput() {
    if (!isUploading && !generateRizzFormStore.isGenerating) {
      fileInput?.click();
    }
  }

  function clearImage() {
    imagePreview = null;
    generateRizzFormStore.setFileName("");

    if (fileInput) {
      fileInput.value = "";
    }
    isVideo = false;
  }
</script>

<FormStep {title} {subtitle} {tooltip} {collapsible} {defaultCollapsed}>
  {#snippet headerAction()}
    {#if imagePreview}
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
  <div class="flex h-max flex-col pt-4">
    {#if imagePreview}
      <!-- Preview Section -->
      <div class="mb-4 flex-1">
        {#if isUploading}
          <MediaSkeleton
            height="240px"
            aspectRatio={isVideo ? "video" : "auto"}
          />
        {:else if isVideo}
          <!-- svelte-ignore a11y_media_has_caption -->
          <video
            src={imagePreview}
            controls
            class="h-auto max-h-60 w-full rounded-xl object-contain"
          ></video>
        {:else}
          <img
            src={imagePreview}
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
            {isUploading || generateRizzFormStore.isGenerating
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
              <!-- <UploadProgress
                progress={uploadProgress}
                {isUploading}
                message="Uploading file..."
              /> -->
            {:else}
              <Icon
                icon="mingcute:upload-2-line"
                class="h-10 w-10 text-gray-500 bg-gray-200 border border-gray-300 rounded-md p-2"
              />
              <p class="text-gray-500 my-2">{uploadLabel}</p>
              <p class="text-gray-800 text-sm">
                {uploadDescription}
              </p>
              <p class="text-gray-800 text-sm">
                {uploadSubDescription}
              </p>
            {/if}
          </div>
        </div>
      </div>
    {/if}

    <!-- Hidden File Input -->
    <input
      type="file"
      accept={acceptedTypes}
      onchange={processImage}
      class="hidden"
      bind:this={fileInput}
      disabled={generateRizzFormStore.isGenerating || isUploading}
    />
  </div>
</FormStep>
