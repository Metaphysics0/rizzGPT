<script lang="ts">
  import { isFileUrlMovie } from "$lib/utils/file/is-file-url-movie.util";
  import Icon from "@iconify/svelte";

  interface Props {
    blobUrl: string;
    title: string;
  }

  const { blobUrl, title }: Props = $props();

  let hasError = $state(false);

  function handleMediaError(error: Event) {
    hasError = true;
    console.error("Media failed to load:", error);
    console.error("Media URL:", blobUrl);
  }

  const isVideo = $derived(isFileUrlMovie(blobUrl));
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
    {/if}

    {#if isVideo && !hasError}
      <!-- svelte-ignore a11y_media_has_caption -->
      <video
        src={blobUrl}
        controls
        preload="metadata"
        class="h-auto max-h-64 w-full rounded-xl object-contain"
        onerror={handleMediaError}
      ></video>
    {:else if !hasError}
      <img
        src={blobUrl}
        alt="Original conversation"
        class="h-auto max-h-64 w-full rounded-xl object-contain"
        onerror={handleMediaError}
      />
    {/if}
  </div>
</div>
