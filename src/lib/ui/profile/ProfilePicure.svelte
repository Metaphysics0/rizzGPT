<script lang="ts">
  import {
    getDisplayName,
    getUserInitials,
  } from "$lib/utils/user/user-info.util";
  import type { User } from "better-auth";

  interface Props {
    user: User;
  }

  let { user }: Props = $props();
</script>

<div class="relative h-16 w-16 overflow-hidden rounded-full">
  {#if user?.image}
    <img
      src={user.image}
      alt={getDisplayName({ user })}
      class="h-full w-full object-cover"
    />
  {:else}
    <div
      class="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-xl"
    >
      {getUserInitials(user)}
    </div>
  {/if}
</div>
