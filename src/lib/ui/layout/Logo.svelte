<script lang="ts">
  import { cn } from "$lib/utils";
  import Icon from "@iconify/svelte";

  let { className }: { className?: string } = $props();
</script>

<a href="/" class={cn("flex flex-row gap-1 items-center text-3xl", className)}>
  <span class="font-bold"> RizzGPT </span>
  <Icon icon="mingcute:ai-line" class="mb-0.5" stroke-width={0.25} />
</a>
