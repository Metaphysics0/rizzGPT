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

  const uploadIcons = [
    { icon: "mdi:upload", color: "blue" },
    { icon: "mdi:image", color: "green" },
    { icon: "mdi:video", color: "purple" },
  ];
</script>

<FormStep title="1. Upload DM Conversation" required collapsible={false}>
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
      <div class="mb-4 flex-1">
        {#if isVideo}
          <div class="relative">
            <!-- svelte-ignore a11y_media_has_caption -->
            <video
              bind:this={videoElement}
              src={$imagePreview}
              controls
              class="h-auto max-h-64 w-full rounded-xl object-contain"
            ></video>
          </div>
        {:else}
          <img
            src={$imagePreview}
            alt="Preview"
            class="h-auto max-h-64 w-full rounded-xl object-contain"
          />
        {/if}
      </div>
    {:else}
      <div class="flex-1">
        <div
          class="
            group flex h-full min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl
            border-2 border-dashed transition-all duration-200 py-5
            {isDragOver
            ? 'border-purple-400 bg-purple-50/40'
            : 'border-gray-300 bg-gray-50/30 hover:border-gray-400 hover:bg-gray-100/40'}
          "
          onclick={triggerFileInput}
          role="button"
          tabindex="0"
          onkeydown={(e) => e.key === "Enter" && triggerFileInput()}
          ondragover={handleDragOver}
          ondragleave={handleDragLeave}
          ondrop={handleDrop}
        >
          <div class="mb-4 flex items-center gap-3">
            {#each uploadIcons as { icon, color }}
              <div
                class="rounded-lg bg-{color}-100 p-3 text-{color}-600 group-hover:bg-{color}-200"
              >
                <Icon {icon} class="h-5 w-5" />
              </div>
            {/each}
          </div>

          <div class="text-center">
            <p class="mb-4 text-lg font-medium text-gray-700">
              {#if $isGeneratingResponse}
                <Icon
                  icon="svg-spinners:90-ring-with-bg"
                  class="mr-2 inline h-5 w-5"
                />
                Processing...
              {:else if isDragOver}
                Drop your file here!
              {:else}
                Upload your conversation screenshot or screen recording
              {/if}
            </p>
          </div>

          <div class="flex flex-col items-center">
            <button
              type="button"
              class="
              text-sm
                  flex items-center gap-2 rounded-xl border-2 border-gray-300 bg-white
                  px-6 py-2.5 font-medium text-gray-700 transition-all duration-200
                hover:border-purple-400 hover:bg-purple-50 hover:text-purple-700 cursor-pointer"
              disabled={$isGeneratingResponse}
            >
              <Icon icon="mdi:folder-upload" class="h-4 w-4" />
              Select File
            </button>
            <span class="text-gray-500 text-sm my-2">or</span>
            <p>Drag and drop a file here</p>
          </div>
        </div>
        <!-- <p class="mb-4 text-sm text-gray-500">
          Supports: .jpg, .png, .mp4, .mov & more! (max 50MB)
        </p> -->
      </div>
    {/if}

    <!-- Pro Tip -->
    <div class="mt-4 rounded-lg bg-blue-50 p-3 text-sm">
      <div class="flex items-start gap-2">
        <Icon icon="mdi:lightbulb" class="mt-0.5 h-4 w-4 text-blue-600" />
        <div>
          <span class="font-medium text-blue-800">💡 Pro tip:</span>
          <span class="text-blue-700">
            For best results, make sure the conversation is clearly visible and
            well-lit. Large files will upload instantly and then process in the
            background! ✨
          </span>
        </div>
      </div>
    </div>

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
