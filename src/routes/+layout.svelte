<script lang="ts">
  import { page } from "$app/state";
  import Header from "$lib/ui/layout/Header.svelte";
  import { fade } from "svelte/transition";
  import "../app.css";
  import ProfileDropdownMenu from "$lib/ui/Auth/ProfileDropdownMenu.svelte";
  import { userStore } from "$lib/stores/user.svelte";
  import type { PageData } from "./$types";

  let { children, data }: { children: any; data: PageData } = $props();

  // Initialize user store from server data
  $effect(() => {
    userStore.setUser(data.user);
  });
</script>

{#if data.user && page.route.id !== "/sign-in"}
  <ProfileDropdownMenu user={data.user} />
{/if}

<div
  class="min-h-screen p-4 md:p-8"
  style="background-image: radial-gradient(at 0% 25%, color-mix(in oklab, rgb(139 69 19) 10%, transparent) 0px, transparent 30%), radial-gradient(at 15% 6%, color-mix(in oklab, rgb(34 197 94) 5%, transparent) 0px, transparent 30%), linear-gradient(to bottom right, rgb(252 231 243), rgb(250 245 255), rgb(254 249 195))"
>
  <Header />

  {#key page.url.pathname}
    <div in:fade={{ duration: 100, delay: 100 }} out:fade={{ duration: 200 }}>
      {@render children()}
    </div>
  {/key}
</div>
