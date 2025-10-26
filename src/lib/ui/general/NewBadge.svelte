<script lang="ts">
  import { cn } from "$lib/utils";

  let { className }: { className?: string } = $props();
</script>

<div
  class={cn(
    "flex items-center px-1 bg-amber-100 text-amber-600 rounded-full font-medium",
    className,
  )}
>
  New!
</div>
