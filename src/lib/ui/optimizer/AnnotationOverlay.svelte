<script lang="ts">
  import type { Annotation, PixelPosition } from "./types";
  import AnnotationCard from "./AnnotationCard.svelte";

  let {
    annotation,
    position,
    isActive = false,
    onclick,
  }: {
    annotation: Annotation;
    position: PixelPosition;
    isActive?: boolean;
    onclick?: () => void;
  } = $props();

  const severityBorderColors = {
    critical: "border-red-500",
    moderate: "border-amber-500",
    minor: "border-green-500",
  };

  const severityBadgeColors = {
    critical: "bg-red-500",
    moderate: "bg-amber-500",
    minor: "bg-green-500",
  };

  // Extract annotation number from ID (e.g., "ann_1" -> "1")
  const annotationNumber = annotation.id.split("_")[1];

  // Calculate card position (above the bounding box)
  // Card is 288px wide (w-72), so offset by 144px to center it
  // Position it above the bounding box with some spacing
  const cardPosition = $derived({
    left: position.left + position.width / 2 - 144, // Center card horizontally
    bottom: position.top + 20, // Position above the box (20px gap)
  });
</script>

<!-- Bounding box with dashed border -->
<button
  class="absolute border-3 border-dashed rounded-lg cursor-pointer transition-all duration-200 {severityBorderColors[
    annotation.severity
  ]} {isActive ? 'bg-black/10' : 'bg-transparent hover:bg-black/5'}"
  style:left="{position.left}px"
  style:top="{position.top}px"
  style:width="{position.width}px"
  style:height="{position.height}px"
  onclick={onclick}
  type="button"
>
  <!-- Animated badge with number -->
  <div
    class="absolute -top-3 -right-3 w-8 h-8 rounded-full {severityBadgeColors[
      annotation.severity
    ]} text-white text-sm font-bold flex items-center justify-center shadow-lg {isActive
      ? 'scale-110'
      : 'animate-pulse'}"
  >
    {annotationNumber}
  </div>
</button>

<!-- Annotation card (tooltip) -->
<div class="absolute" style:left="{cardPosition.left}px" style:bottom="{cardPosition.bottom}px">
  <AnnotationCard {annotation} {isActive} />
</div>
