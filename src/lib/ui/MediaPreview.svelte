<script lang="ts">
  import Icon from "@iconify/svelte";

  interface Props {
    blobUrl: string;
    title: string;
  }

  const { blobUrl, title }: Props = $props();

  let mediaLoadingState = $state<"loading" | "loaded" | "error">("loading");
  let mediaErrorMessage = $state<string | null>(null);

  function handleMediaLoad() {
    console.log("Media loaded");
    mediaLoadingState = "loaded";
    mediaErrorMessage = null;
  }

  function handleMediaError(error: Event) {
    mediaLoadingState = "error";
    mediaErrorMessage =
      "Failed to load media. The file might be processing or temporarily unavailable.";
    console.error("Media failed to load:", error);
    console.error("Media URL:", blobUrl);
  }

  function retryLoading() {
    mediaLoadingState = "loading";
    mediaErrorMessage = null;
  }

  // Reset media loading state when blobUrl changes
  $effect(() => {
    if (blobUrl) {
      mediaLoadingState = "loading";
      mediaErrorMessage = null;
    }
  });

  // Check if the URL is a video file
  const isVideo = $derived(
    [".mp4", ".mov", "video"].some((extension) =>
      blobUrl.toLowerCase().includes(extension)
    )
  );
</script>

<div class="mb-6 rounded-xl border border-gray-200 bg-gray-50/30 p-4">
  <h3 class="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-800">
    <Icon icon="mdi:image" class="h-5 w-5 text-purple-600" />
    {title}
  </h3>
  <div class="rounded-xl border border-gray-200 bg-gray-50/30 p-4">
    {#if mediaLoadingState === "loading"}
      <div class="flex h-32 items-center justify-center rounded-xl bg-gray-100">
        <div class="flex items-center gap-2 text-gray-600">
          <div
            class="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"
          ></div>
          <span>Loading media...</span>
        </div>
      </div>
    {:else if mediaLoadingState === "error"}
      <div class="rounded-xl border border-red-200 bg-red-50 p-4">
        <div class="flex items-center gap-2 text-red-800 mb-3">
          <Icon icon="mdi:alert-circle" class="h-5 w-5" />
          <span class="font-medium">Media Load Error</span>
        </div>
        <p class="text-red-700 text-sm mb-3">{mediaErrorMessage}</p>
        <div class="flex flex-col gap-2">
          <a
            href={blobUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
          >
            <Icon icon="mdi:download" class="h-4 w-4" />
            Try downloading the file directly
          </a>
          <button
            onclick={retryLoading}
            class="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 text-sm"
          >
            <Icon icon="mdi:refresh" class="h-4 w-4" />
            Retry loading
          </button>
        </div>
      </div>
    {:else if isVideo}
      <!-- svelte-ignore a11y_media_has_caption -->
      <video
        src={blobUrl}
        controls
        preload="metadata"
        class="h-auto max-h-64 w-full rounded-xl object-contain"
        onloadeddata={handleMediaLoad}
        onerror={handleMediaError}
      ></video>
    {:else}
      <img
        src={blobUrl}
        alt="Original conversation"
        class="h-auto max-h-64 w-full rounded-xl object-contain"
        onload={handleMediaLoad}
        onerror={handleMediaError}
      />
    {/if}
  </div>
</div>
