<script lang="ts">
  import { cn } from "$lib/utils";
  import type { Snippet } from "svelte";

  const {
    header,
    fullHeight = true,
    children,
  }: { header: string; fullHeight?: boolean; children: Snippet } = $props();
</script>

<div class={cn(fullHeight && "min-h-screen", "py-8")}>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="bg-white shadow-sm rounded-lg p-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">{header}</h1>

      <div class="prose prose-lg max-w-none">
        {@render children()}
      </div>
    </div>
  </div>
</div>
