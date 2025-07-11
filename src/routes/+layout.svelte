<script lang="ts">
  import "../app.css";
  import ProfileDropdownMenu from "$lib/ui/Auth/ProfileDropdownMenu.svelte";

  let { children, data } = $props();
</script>

<!-- Top Navigation with Profile Avatar -->
<nav class="absolute top-0 left-0 right-0 z-50 p-4">
  <div class="flex justify-end">
    <ProfileDropdownMenu
      isAuthenticated={data.isAuthenticated}
      user={data.user}
    />
  </div>
</nav>

{@render children()}
