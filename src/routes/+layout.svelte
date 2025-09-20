<script lang="ts">
  import { page } from "$app/state";
  import Header from "$lib/ui/layout/Header.svelte";
  import { fade } from "svelte/transition";
  import "../app.css";
  import ProfileDropdownMenu from "$lib/ui/Auth/ProfileDropdownMenu.svelte";
  import { authClient } from "$lib/auth-client";

  let { children } = $props();

  // Use client-side session data which updates reactively
  const session = authClient.useSession();
</script>

{#if $session.data?.user && page.route.id !== "/sign-in"}
  <ProfileDropdownMenu user={$session.data.user} />
{/if}

<div
  class="min-h-screen bg-linear-to-br from-pink-100 via-purple-50 to-yellow-100 p-4 md:p-8"
>
  <Header />

  {#key page.url.pathname}
    <div in:fade={{ duration: 100, delay: 100 }} out:fade={{ duration: 200 }}>
      {@render children()}
    </div>
  {/key}
</div>
