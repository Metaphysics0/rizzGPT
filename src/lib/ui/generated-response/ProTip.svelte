<script lang="ts">
  import { cn } from "$lib/utils";
  import Icon from "@iconify/svelte";

  let { text, className }: { text: string; className?: string } = $props();
</script>

<div class={cn("mt-6 rounded-lg bg-green-50 p-3 text-sm", className)}>
  <div class="flex items-start gap-2">
    <Icon icon="mdi:lightbulb" class="mt-0.5 h-4 w-4 text-green-600" />
    <div>
      <span class="font-medium text-green-800">💡 Pro tip:</span>
      <span class="text-green-700">{text} </span>
    </div>
  </div>
</div>
