<script lang="ts">
  import { onMount } from "svelte";
  import { getSignedUrlFromFilePath } from "$lib/utils/file/client-file-upload.util";
  import { mediaCache } from "$lib/runes/media-cache.svelte";
  import type { Annotation, BoundingBox, PixelPosition } from "./types";
  import AnnotationOverlay from "./AnnotationOverlay.svelte";
  import MediaSkeleton from "$lib/ui/loading-animations/MediaSkeleton.svelte";

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

  // Check cache first
  const cachedMedia = mediaCache.get(fileName);
  const imageUrl = $derived(cachedMedia?.url || getSignedUrlFromFilePath(fileName));

  // If we have cached media, don't show loading
  if (cachedMedia) {
    isLoading = false;
  }

  // Calculate scale factor between natural image size and displayed size
  const scaleFactor = $derived({
    x: containerDimensions.width / naturalDimensions.width,
    y: containerDimensions.height / naturalDimensions.height,
  });

  // Scale bounding boxes from original image coordinates to displayed coordinates
  const getPixelPosition = (bbox: BoundingBox): PixelPosition => ({
    left: bbox.x * scaleFactor.x,
    top: bbox.y * scaleFactor.y,
    width: bbox.width * scaleFactor.x,
    height: bbox.height * scaleFactor.y,
  });

  onMount(() => {
    // Update dimensions on image load and window resize
    const updateDimensions = () => {
      if (imageRef) {
        containerDimensions = {
          width: imageRef.offsetWidth,
          height: imageRef.offsetHeight,
        };
        naturalDimensions = {
          width: imageRef.naturalWidth,
          height: imageRef.naturalHeight,
        };
      }
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
    // Cache the loaded media
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
          {@const pixelPos = getPixelPosition(annotation.boundingBox)}
          <AnnotationOverlay
            {annotation}
            position={pixelPos}
            isActive={activeAnnotationId === annotation.id}
            onclick={() => handleAnnotationClick(annotation.id)}
          />
        {/each}
      {/if}
    </div>
  {/if}
</div>
