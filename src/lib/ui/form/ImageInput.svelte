<script lang="ts">
  import { isGeneratingResponse, uploadedFile } from "$lib/stores/form.store";
  import { imagePreview } from "$lib/stores/image-preview.store";
  import Icon from "@iconify/svelte";
  import FormStep from "./FormStep.svelte";

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

  const uploadIcons = [
    { icon: "mdi:upload", color: "blue" },
    { icon: "mdi:image", color: "green" },
    { icon: "mdi:video", color: "purple" },
  ];
</script>

<FormStep
  title="1. Upload Conversation (Image or Video)"
  required
  collapsible={true}
>
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
            ? 'border-purple-500 bg-purple-100/50'
            : 'border-gray-300 bg-gray-50/50 hover:border-purple-400 hover:bg-purple-50/30'}
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
                <Icon {icon} class="h-6 w-6" />
              </div>
            {/each}
          </div>

          <div class="text-center">
            <p class="mb-2 text-lg font-medium text-gray-700">
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
            <p class="mb-4 text-sm text-gray-500">
              Supported formats: JPG, PNG, MP4, MOV (max 50MB)
            </p>
          </div>

          {#if !$isGeneratingResponse}
            <button
              type="button"
              class="
                flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600
                px-6 py-3 font-medium text-white shadow-md transition-all duration-200
                hover:scale-105 hover:from-purple-700 hover:to-blue-700 hover:shadow-lg
              "
            >
              <Icon icon="mdi:folder-upload" class="h-5 w-5" />
              Choose File
            </button>
          {/if}
        </div>
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
