<script lang="ts">
  import { getSignedUrlFromFilePath } from "$lib/utils/file/client-file-upload.util";
  import { isFileUrlMovie } from "$lib/utils/file/is-file-url-movie.util";
  import { mediaCache } from "$lib/runes/image-preview.svelte";
  import MediaSkeleton from "$lib/ui/loading-animations/MediaSkeleton.svelte";
  import Icon from "@iconify/svelte";

  interface Props {
    fileName: string;
    title: string;
  }

  const { fileName, title }: Props = $props();
  const isVideo = $derived(isFileUrlMovie(fileName));

  let hasError = $state(false);
  let isLoading = $state(true);

  // Check cache first
  const cachedMedia = mediaCache.get(fileName);
  const downloadUrl = $derived(
    cachedMedia?.url || getSignedUrlFromFilePath(fileName)
  );

  // If we have cached media, don't show loading
  if (cachedMedia) {
    isLoading = false;
  }

  function handleMediaError(error: Event) {
    hasError = true;
    isLoading = false;
    console.error("Media failed to load:", error);
  }

  function handleMediaLoad() {
    isLoading = false;
    // Cache the loaded media
    mediaCache.set(fileName, downloadUrl, isVideo);
  }
</script>

<div class="mb-6 rounded-xl border border-gray-200 bg-gray-50/30 p-4">
  <h3 class="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-800">
    <Icon icon="mdi:image" class="h-5 w-5 text-purple-600" />
    {title}
  </h3>
  <div class="rounded-xl border border-gray-200 bg-gray-50/30 p-4">
    {#if hasError}
      <div class="rounded-xl border border-red-200 bg-red-50 p-4">
        <div class="flex items-center gap-2 text-red-800 mb-3">
          <Icon icon="mdi:alert-circle" class="h-5 w-5" />
          <span class="font-medium">Media Load Error</span>
        </div>
        <span>The file might be processing or temporarily unavailable.</span>
      </div>
    {:else}
      <div class="relative">
        {#if isLoading}
          <MediaSkeleton
            height="256px"
            aspectRatio={isVideo ? "video" : "auto"}
          />
        {/if}

        {#if isVideo}
          <!-- svelte-ignore a11y_media_has_caption -->
          <video
            src={downloadUrl}
            controls
            preload="metadata"
            class="h-auto max-h-64 w-full rounded-xl object-contain {isLoading
              ? 'opacity-0 absolute inset-0'
              : ''}"
            onerror={handleMediaError}
            onloadeddata={handleMediaLoad}
          ></video>
        {:else}
          <img
            src={downloadUrl}
            alt="Original conversation"
            class="h-auto max-h-64 w-full rounded-xl object-contain {isLoading
              ? 'opacity-0 absolute inset-0'
              : ''}"
            onerror={handleMediaError}
            onload={handleMediaLoad}
          />
        {/if}
      </div>
    {/if}
  </div>
</div>
