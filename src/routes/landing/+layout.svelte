<script lang="ts">
  import Footer from "$lib/ui/LandingPage/Footer.svelte";
  import Header from "$lib/ui/LandingPage/Header.svelte";

  let { children } = $props();
</script>

<Header />

{@render children()}

<Footer />
