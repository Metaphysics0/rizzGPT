<script lang="ts">
  import { cn } from "$lib/utils.js";
  import LinkButton from "$lib/ui/general/LinkButton.svelte";

  let { className }: { className?: string } = $props();
</script>

<div class={cn("flex justify-center", className)}>
  <LinkButton label="Try it for free" href="/sign-in" />
</div>
