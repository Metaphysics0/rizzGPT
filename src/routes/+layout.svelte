<script lang="ts">
  import { page } from "$app/state";
  import Header from "$lib/ui/Layout/Header.svelte";
  import { fade } from "svelte/transition";
  import "../app.css";
  import { authClient } from "$lib/auth-client";

  let { children } = $props();

  const session = authClient.useSession();
</script>

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
