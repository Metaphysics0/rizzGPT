<script lang="ts">
  import { cn } from "$lib/utils";
  import Icon from "@iconify/svelte";

  let { className }: { className?: string } = $props();
</script>

<div class={cn("flex flex-row gap-1 text-2xl", className)}>
  <span> RizzGPT </span>
  <Icon icon="mingcute:ai-line" class="mb-0.5" stroke-width={0.25} />
</div>
