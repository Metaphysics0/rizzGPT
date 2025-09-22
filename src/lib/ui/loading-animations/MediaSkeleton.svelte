<script lang="ts">
  interface Props {
    aspectRatio?: "video" | "square" | "auto";
    height?: string;
  }

  const { aspectRatio = "auto", height = "240px" }: Props = $props();
</script>

<div
  class="animate-pulse bg-gray-200 rounded-xl w-full"
  style="height: {height}; aspect-ratio: {aspectRatio === 'video' ? '16/9' : aspectRatio === 'square' ? '1/1' : 'auto'}"
>
  <div class="flex items-center justify-center h-full">
    <div class="flex flex-col items-center gap-3">
      <div class="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
      <div class="w-20 h-3 bg-gray-300 rounded animate-pulse"></div>
    </div>
  </div>
</div>