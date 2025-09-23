<script lang="ts">
  import { page } from "$app/state";
  import { fade } from "svelte/transition";
  import "../app.css";
  import { userStore } from "$lib/stores/user.svelte";
  import type { PageData } from "./$types";
  import Navbar from "$lib/ui/layout/Navbar.svelte";

  let { children, data }: { children: any; data: PageData } = $props();

  $effect(() => {
    userStore.setUser(data.user || null);
  });
</script>

<div
  class="min-h-screen"
  style="background-image: radial-gradient(at 0% 25%, color-mix(in oklab, rgb(139 69 19) 10%, transparent) 0px, transparent 30%), radial-gradient(at 15% 6%, color-mix(in oklab, rgb(34 197 94) 5%, transparent) 0px, transparent 30%), linear-gradient(to bottom right, rgb(252 231 243), rgb(250 245 255), rgb(254 249 195))"
>
  <Navbar />
  {#key page.url.pathname}
    <div
      in:fade={{ duration: 100, delay: 100 }}
      out:fade={{ duration: 200 }}
      class="pt-20"
    >
      {@render children()}
    </div>
  {/key}
</div>
