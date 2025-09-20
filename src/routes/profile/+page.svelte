<script lang="ts">
  import type { PageData } from "./$types";
  import Icon from "@iconify/svelte";
  import UsageDisplay from "$lib/ui/subscription/UsageDisplay.svelte";
  import SubscriptionTierStatusBadge from "$lib/ui/general/SubscriptionTierStatusBadge.svelte";
  import {
    getDisplayName,
    getUserInitials,
  } from "$lib/utils/user/user-info.util";

  let { data }: { data: PageData } = $props();
</script>

<div class="min-h-screen py-8">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
      <div class="flex items-center gap-4">
        <!-- Avatar -->
        <div class="relative h-16 w-16 overflow-hidden rounded-full">
          {#if data.user?.image}
            <img
              src={data.user.image}
              alt={getDisplayName({ user: data.user })}
              class="h-full w-full object-cover"
            />
          {:else}
            <div
              class="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-xl"
            >
              {getUserInitials(data.user)}
            </div>
          {/if}
        </div>

        <!-- User Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3 mb-1">
            <h1 class="text-2xl font-bold text-gray-900 truncate">
              {getDisplayName({ user: data.user })}
            </h1>
            <SubscriptionTierStatusBadge
              status={data.subscription?.status === "active" ? "pro" : "trial"}
            />
          </div>
          <p class="text-gray-600 truncate">{data.user?.email}</p>
          <div class="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span class="flex items-center gap-1">
              <Icon icon="mdi:calendar" class="w-4 h-4" />
              Member since {new Date(
                data.user?.createdAt || ""
              ).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Usage Section -->
    <div class="space-y-6">
      <UsageDisplay
        usageCount={data.currentUsage}
        subscription={data.subscription}
        userEmail={data.user?.email}
        showUpgradeCard={!data.subscription ||
          data.subscription.status !== "active"}
      />
    </div>
  </div>
</div>
