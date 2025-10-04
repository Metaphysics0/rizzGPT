<script lang="ts">
  import type { PageData } from "./$types";
  import Icon from "@iconify/svelte";
  import UsageDisplay from "$lib/ui/subscription/UsageDisplay.svelte";
  import { page } from "$app/state";
  import { formatSubscriptionDate } from "$lib/utils/date.util";
  import { getUserInitials } from "$lib/utils/user/user-info.util";

  const { data }: { data: PageData } = $props();
  const { user } = page.data;
</script>

<svelte:head>
  <title>Profile - RizzGPT</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 sm:px-6 py-8">
  <!-- Header -->
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900">Profile</h1>
    <p class="text-gray-600 mt-2">Manage your account and subscription</p>
  </div>

  <!-- User Info Card -->
  <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
    <div class="flex items-center gap-4">
      <div class="w-16 h-16 overflow-hidden rounded-full">
        {#if user?.image}
          <img
            src={user.image}
            alt={user?.name || "User"}
            class="h-full w-full object-cover"
          />
        {:else}
          <div
            class="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-2xl font-medium text-white"
          >
            {getUserInitials(user)}
          </div>
        {/if}
      </div>
      <div>
        <h2 class="text-xl font-semibold text-gray-900">
          {user?.name || "User"}
        </h2>
        <p class="text-gray-600">{user?.email}</p>
      </div>
    </div>
  </div>

  <div class="grid gap-6 md:grid-cols-2">
    <!-- Subscription Details -->
    <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div class="flex items-center gap-2 mb-4">
        <Icon icon="mingcute:vip-2-fill" class="w-6 h-6 text-purple-600" />
        <h3 class="text-lg font-semibold text-gray-900">Subscription</h3>
      </div>

      {#if data.subscription}
        <div class="space-y-4">
          <div>
            <p class="text-sm text-gray-600">Plan</p>
            <p class="text-lg font-semibold text-gray-900">
              {data.subscription.productName}
            </p>
          </div>

          <div>
            <p class="text-sm text-gray-600">Status</p>
            <div class="flex items-center gap-2 mt-1">
              {#if data.subscription.status === "active"}
                <div
                  class="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                >
                  <Icon icon="mingcute:check-circle-fill" class="w-4 h-4" />
                  Active
                </div>
              {:else if data.subscription.status === "cancelled"}
                <div
                  class="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium"
                >
                  <Icon icon="mingcute:close-circle-fill" class="w-4 h-4" />
                  Cancelled
                </div>
              {:else}
                <div
                  class="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                >
                  <Icon icon="mingcute:information-fill" class="w-4 h-4" />
                  {data.subscription.status}
                </div>
              {/if}
            </div>
          </div>

          <div>
            <p class="text-sm text-gray-600">Price</p>
            <p class="text-lg font-semibold text-gray-900">
              ${data.subscription.price}/month
            </p>
          </div>

          {#if data.subscription.expiresAt}
            <div>
              <p class="text-sm text-gray-600">Next Billing Date</p>
              <p class="text-base text-gray-900">
                {formatSubscriptionDate(data.subscription.expiresAt)}
              </p>
            </div>
          {/if}

          <div class="pt-4 border-t border-gray-200">
            <a
              href="https://www.paypal.com/myaccount/autopay/"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-center gap-2 w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              <Icon icon="mingcute:settings-3-fill" class="w-4 h-4" />
              Manage on PayPal
              <Icon icon="mingcute:external-link-line" class="w-4 h-4" />
            </a>
          </div>
        </div>
      {:else}
        <div class="text-center py-8">
          <Icon
            icon="mingcute:information-fill"
            class="w-12 h-12 text-gray-400 mx-auto mb-3"
          />
          <p class="text-gray-600 mb-4">No active subscription</p>
          <a
            href="/upgrade"
            class="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            <Icon icon="mingcute:vip-2-fill" class="w-4 h-4" />
            Upgrade Now
          </a>
        </div>
      {/if}
    </div>

    <!-- Usage Details -->
    <div>
      <UsageDisplay
        usageCount={data.usageCount}
        subscription={data.subscription}
      />
    </div>
  </div>

  <!-- Account Actions -->
  <div class="mt-6 bg-gray-50 rounded-xl border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
    <div class="flex flex-wrap gap-3">
      <a
        href="/conversations"
        class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <Icon icon="mingcute:chat-3-fill" class="w-4 h-4" />
        View Conversations
      </a>
      {#if !data.subscription}
        <a
          href="/upgrade"
          class="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Icon icon="mingcute:vip-2-fill" class="w-4 h-4" />
          Upgrade to Pro
        </a>
      {/if}
    </div>
  </div>
</div>
