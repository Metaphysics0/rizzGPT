<script lang="ts">
  import type { Subscription } from "$lib/server/database/schema";
  import {
    getDisplayName,
    getUserInitials,
  } from "$lib/utils/user/user-info.util";
  import type { User } from "better-auth";
  import SubscriptionTierStatusBadge from "../general/SubscriptionTierStatusBadge.svelte";
  import Icon from "@iconify/svelte";

  interface Props {
    user: User & { subscription?: Subscription };
  }

  let { user }: Props = $props();
</script>

<div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
  <div class="flex items-center gap-4">
    <!-- Avatar -->
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

    <!-- User Info -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-3 mb-1">
        <h1 class="text-2xl font-bold text-gray-900 truncate">
          {getDisplayName({ user })}
        </h1>
        <SubscriptionTierStatusBadge
          status={user.subscription?.status === "active" ? "pro" : "trial"}
        />
      </div>
      <p class="text-gray-600 truncate">{user.email}</p>
      <div class="flex items-center gap-4 mt-2 text-sm text-gray-500">
        <span class="flex items-center gap-1">
          <Icon icon="mdi:calendar" class="w-4 h-4" />
          Member since {new Date(user.createdAt || "").toLocaleDateString()}
        </span>
      </div>
    </div>
  </div>
</div>
