<script lang="ts">
  import Icon from "@iconify/svelte";
  import { cn } from "$lib/utils/string/cn.util";

  interface Props {
    status: "pro" | "free";
    size?: "sm" | "md";
  }

  let { status, size = "md" }: Props = $props();
</script>

{#if status === "pro"}
  <div
    class={cn(
      "flex items-center gap-2 bg-green-100 text-green-700 rounded-full font-medium",
      size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
    )}
  >
    <Icon icon="mdi:crown" class={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
    Pro
  </div>
{:else}
  <div
    class={cn(
      "flex items-center gap-2 bg-gray-100 text-gray-700 rounded-full font-medium",
      size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
    )}
  >
    <Icon icon="mdi:account" class={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
    Free
  </div>
{/if}
