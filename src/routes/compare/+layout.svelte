<script lang="ts">
  import Footer from "$lib/ui/layout/Footer.svelte";
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

{@render children()}

<div class="py-10"></div>

<Footer />
