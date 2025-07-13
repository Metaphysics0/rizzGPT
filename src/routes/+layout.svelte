<script lang="ts">
  import "../app.css";
  import { page } from "$app/state";
  import ProfileDropdownMenu from "$lib/ui/Auth/ProfileDropdownMenu.svelte";
  import Header from "$lib/ui/Layout/Header.svelte";
  import { fade } from "svelte/transition";

  let { children, data } = $props();
</script>

{#if page.url.pathname !== "/landing"}
  <ProfileDropdownMenu
    isAuthenticated={data.isAuthenticated}
    user={data.user}
  />

  <div
    class="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-yellow-100 p-4 md:p-8"
  >
    <Header />
    {#key page.url.pathname}
      <div in:fade={{ duration: 100, delay: 100 }} out:fade={{ duration: 200 }}>
        {@render children()}
      </div>
    {/key}
  </div>
{:else}
  {@render children()}
{/if}
