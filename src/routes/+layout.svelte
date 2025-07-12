<script lang="ts">
  import "../app.css";
  import ProfileDropdownMenu from "$lib/ui/Auth/ProfileDropdownMenu.svelte";
  import Header from "$lib/ui/Header.svelte";

  let { children, data } = $props();
</script>

<nav class="absolute top-0 left-0 right-0 z-50 p-4">
  <div class="flex justify-end">
    <ProfileDropdownMenu
      isAuthenticated={data.isAuthenticated}
      user={data.user}
    />
  </div>
</nav>

<div
  class="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-yellow-100 p-4 md:p-8"
>
  <Header />
  {@render children()}
</div>
