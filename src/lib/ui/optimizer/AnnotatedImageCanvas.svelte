<script lang="ts">
  import { onMount } from "svelte";
  import { getSignedUrlFromFilePath } from "$lib/utils/file/client-file-upload.util";
  import { mediaCache } from "$lib/runes/media-cache.svelte";
  import AnnotationOverlay from "./AnnotationOverlay.svelte";
  import MediaSkeleton from "$lib/ui/loading-animations/MediaSkeleton.svelte";
  import type { Annotation, PixelPosition } from "$lib/types";

  let {
    annotations,
    fileName,
  }: {
    annotations: Annotation[];
    fileName: string;
  } = $props();

  let imageRef: HTMLImageElement | undefined = $state();
  let containerDimensions = $state({ width: 0, height: 0 });
  let naturalDimensions = $state({ width: 0, height: 0 });
  let activeAnnotationId = $state<string | null>(null);
  let hasError = $state(false);
  let isLoading = $state(true);

  const cachedMedia = mediaCache.get(fileName);
  const imageUrl = $derived(cachedMedia?.url || getSignedUrlFromFilePath(fileName));

  if (cachedMedia) {
    isLoading = false;
  }

  // Convert Gemini's normalized coordinates (0-1000) to displayed pixel coordinates
  const getPixelPosition = (annotation: Annotation): PixelPosition => {
    // Gemini format: [y_min, x_min, y_max, x_max] with values 0-1000
    const [y_min, x_min, y_max, x_max] = annotation.box_2d;

    // Convert from normalized (0-1000) to actual image pixels
    const imgLeft = (x_min / 1000) * naturalDimensions.width;
    const imgTop = (y_min / 1000) * naturalDimensions.height;
    const imgRight = (x_max / 1000) * naturalDimensions.width;
    const imgBottom = (y_max / 1000) * naturalDimensions.height;

    const scaleFactor = {
      x: containerDimensions.width / naturalDimensions.width,
      y: containerDimensions.height / naturalDimensions.height,
    };

    return {
      left: imgLeft * scaleFactor.x,
      top: imgTop * scaleFactor.y,
      width: (imgRight - imgLeft) * scaleFactor.x,
      height: (imgBottom - imgTop) * scaleFactor.y,
    };
  };

  onMount(() => {
    const updateDimensions = () => {
      if (!imageRef) return
      containerDimensions = {
        width: imageRef.offsetWidth,
        height: imageRef.offsetHeight,
      };
      naturalDimensions = {
        width: imageRef.naturalWidth,
        height: imageRef.naturalHeight,
      };
    };

    if (imageRef) {
      imageRef.addEventListener("load", updateDimensions);
      // Initial dimension update in case image is already loaded
      updateDimensions();
    }

    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  });

  const handleAnnotationClick = (annotationId: string) => {
    // Toggle active state - if clicking the same annotation, close it
    activeAnnotationId = activeAnnotationId === annotationId ? null : annotationId;
  };

  function handleImageError(error: Event) {
    hasError = true;
    isLoading = false;
    console.error("Image failed to load:", error);
  }

  function handleImageLoad() {
    isLoading = false;
    mediaCache.set(fileName, imageUrl, false);
  }
</script>

<div class="relative w-full">
  {#if hasError}
    <div class="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
      <p class="text-red-800 font-medium">Failed to load profile image</p>
      <p class="text-red-600 text-sm mt-2">The image might be processing or temporarily unavailable.</p>
    </div>
  {:else}
    <div class="relative">
      {#if isLoading}
        <MediaSkeleton height="600px" aspectRatio="auto" />
      {/if}

      <img
        bind:this={imageRef}
        src={imageUrl}
        alt="Profile collage"
        class="w-full rounded-lg {isLoading ? 'opacity-0 absolute inset-0' : ''}"
        onerror={handleImageError}
        onload={handleImageLoad}
      />

      {#if !isLoading && containerDimensions.width > 0 && naturalDimensions.width > 0}
        {#each annotations as annotation (annotation.id)}
          {@const position = getPixelPosition(annotation)}
          <AnnotationOverlay
            {annotation}
            {position}
            isActive={activeAnnotationId === annotation.id}
            onclick={() => handleAnnotationClick(annotation.id)}
          />
        {/each}
      {/if}
    </div>
  {/if}
</div>
