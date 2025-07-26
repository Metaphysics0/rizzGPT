<script lang="ts">
  import UsageStatistics from "$lib/ui/Settings/UsageStatistics.svelte";
  import { formatDate } from "$lib/utils/date-format";
  import Icon from "@iconify/svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
  let activeTab = $state("usage");

  const tabs = [
    { id: "usage", name: "Usage", icon: "heroicons:chart-bar" },
    { id: "billing", name: "Billing", icon: "heroicons:credit-card" },
    { id: "profile", name: "Profile", icon: "heroicons:user-circle" },
  ];

  function getPlanDisplayName(planName: string): string {
    const planNames: Record<string, string> = {
      free_trial: "Free Trial",
      conversationalist: "The Conversationalist",
      date_magnet: "The Date Magnet",
      rizz_master: "The Rizz Master",
    };
    return planNames[planName] || planName;
  }

  function getPlanPrice(planName: string): string {
    const planPrices: Record<string, string> = {
      free_trial: "$0.00",
      conversationalist: "$0.99/week",
      date_magnet: "$69.99/year",
      rizz_master: "$149.99/year",
    };
    return planPrices[planName] || "Unknown";
  }

  function getStatusColor(status: string): string {
    const statusColors: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      expired: "bg-gray-100 text-gray-800",
      past_due: "bg-yellow-100 text-yellow-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  }
</script>

<svelte:head>
  <title>Settings - RizzGPT</title>
</svelte:head>

<div class="max-w-4xl mx-auto space-y-6">
  <!-- Header -->
  <div
    class="rounded-2xl border border-white/20 bg-white/70 p-6 shadow-lg backdrop-blur-sm"
  >
    <h1 class="text-2xl font-bold text-gray-800">Settings</h1>
    <p class="text-gray-600 mt-1">
      Manage your account, subscription, and preferences
    </p>
  </div>

  <!-- Tab Navigation -->
  <div
    class="rounded-2xl border border-white/20 bg-white/70 shadow-lg backdrop-blur-sm overflow-hidden"
  >
    <div class="border-b border-white/20">
      <nav class="flex">
        {#each tabs as tab}
          <button
            type="button"
            class="flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 cursor-pointer {activeTab ===
            tab.id
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
              : 'text-gray-600 hover:text-gray-800'}"
            onclick={() => (activeTab = tab.id)}
          >
            <Icon icon={tab.icon} class="w-5 h-5" />
            {tab.name}
          </button>
        {/each}
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="p-6">
      {#if activeTab === "usage"}
        <!-- Usage Tab -->
        <UsageStatistics
          usageStats={data.usageStats}
          recentConversations={data.recentConversations}
        />
      {:else if activeTab === "billing"}
        <!-- Billing Tab -->
        <div class="space-y-6">
          <div>
            <h2 class="text-lg font-semibold text-gray-800 mb-4">
              Subscription Details
            </h2>

            {#if data.subscription}
              <div class="bg-white/50 rounded-xl p-6 border border-white/20">
                <div class="flex items-center justify-between mb-4">
                  <div>
                    <h3 class="text-xl font-semibold text-gray-800">
                      {getPlanDisplayName(data.subscription.planName)}
                    </h3>
                    <p class="text-gray-600">
                      {getPlanPrice(data.subscription.planName)}
                    </p>
                  </div>
                  <span
                    class="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full {getStatusColor(
                      data.subscription.status
                    )}"
                  >
                    {data.subscription.status}
                  </span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm font-medium text-gray-600">
                      Current Period
                    </p>
                    <p class="text-gray-800">
                      {data.subscription.currentPeriodStart
                        ? formatDate(data.subscription.currentPeriodStart)
                        : "N/A"} -
                      {data.subscription.currentPeriodEnd
                        ? formatDate(data.subscription.currentPeriodEnd)
                        : "N/A"}
                    </p>
                  </div>

                  {#if data.subscription.trialEndsAt}
                    <div>
                      <p class="text-sm font-medium text-gray-600">
                        Trial Ends
                      </p>
                      <p class="text-gray-800">
                        {formatDate(data.subscription.trialEndsAt)}
                      </p>
                    </div>
                  {/if}

                  <div>
                    <p class="text-sm font-medium text-gray-600">
                      Subscription Started
                    </p>
                    <p class="text-gray-800">
                      {formatDate(data.subscription.createdAt)}
                    </p>
                  </div>

                  {#if data.subscription.billingCycle}
                    <div>
                      <p class="text-sm font-medium text-gray-600">
                        Billing Cycle
                      </p>
                      <p class="text-gray-800 capitalize">
                        {data.subscription.billingCycle}
                      </p>
                    </div>
                  {/if}
                </div>
              </div>
            {:else}
              <div class="text-center py-8">
                <Icon
                  icon="heroicons:credit-card"
                  class="w-12 h-12 text-gray-400 mx-auto mb-4"
                />
                <p class="text-gray-600">No subscription found</p>
              </div>
            {/if}
          </div>

          <!-- Upgrade Options -->
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-4">
              Upgrade Your Plan
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-white/50 rounded-xl p-4 border border-white/20">
                <h4 class="font-semibold text-gray-800">
                  The Conversationalist
                </h4>
                <p class="text-2xl font-bold text-gray-800 mt-2">
                  $0.99<span class="text-sm font-normal text-gray-600"
                    >/week</span
                  >
                </p>
                <p class="text-sm text-gray-600 mt-2">
                  30 conversations per week
                </p>
                <button
                  class="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                >
                  Upgrade
                </button>
              </div>

              <div class="bg-white/50 rounded-xl p-4 border border-white/20">
                <h4 class="font-semibold text-gray-800">The Date Magnet</h4>
                <p class="text-2xl font-bold text-gray-800 mt-2">
                  $69.99<span class="text-sm font-normal text-gray-600"
                    >/year</span
                  >
                </p>
                <p class="text-sm text-gray-600 mt-2">
                  Unlimited conversations
                </p>
                <button
                  class="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                >
                  Upgrade
                </button>
              </div>

              <div class="bg-white/50 rounded-xl p-4 border border-white/20">
                <h4 class="font-semibold text-gray-800">The Rizz Master</h4>
                <p class="text-2xl font-bold text-gray-800 mt-2">
                  $149.99<span class="text-sm font-normal text-gray-600"
                    >/year</span
                  >
                </p>
                <p class="text-sm text-gray-600 mt-2">
                  Unlimited conversations + priority support
                </p>
                <button
                  class="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                >
                  Upgrade
                </button>
              </div>
            </div>
          </div>
        </div>
      {:else if activeTab === "profile"}
        <!-- Profile Tab -->
        <div class="space-y-6">
          <div>
            <h2 class="text-lg font-semibold text-gray-800 mb-4">
              Profile Information
            </h2>

            <div class="bg-white/50 rounded-xl p-6 border border-white/20">
              <div class="flex items-center space-x-4 mb-6">
                {#if data.user.picture}
                  <img
                    src={data.user.picture}
                    alt="Profile"
                    class="w-16 h-16 rounded-full object-cover"
                  />
                {:else}
                  <div
                    class="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center"
                  >
                    <span class="text-white font-semibold text-xl">
                      {data.user.given_name?.[0] ||
                        data.user.email[0].toUpperCase()}
                    </span>
                  </div>
                {/if}
                <div>
                  <h3 class="text-xl font-semibold text-gray-800">
                    {data.user.given_name || data.user.family_name
                      ? `${data.user.given_name || ""} ${data.user.family_name || ""}`.trim()
                      : "User"}
                  </h3>
                  <p class="text-gray-600">{data.user.email}</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm font-medium text-gray-600">Email</p>
                  <p class="text-gray-800">{data.user.email}</p>
                </div>

                <div>
                  <p class="text-sm font-medium text-gray-600">Member Since</p>
                  <p class="text-gray-800">
                    {formatDate(data.dbUser.createdAt)}
                  </p>
                </div>

                {#if data.user.given_name}
                  <div>
                    <p class="text-sm font-medium text-gray-600">First Name</p>
                    <p class="text-gray-800">{data.user.given_name}</p>
                  </div>
                {/if}

                {#if data.user.family_name}
                  <div>
                    <p class="text-sm font-medium text-gray-600">Last Name</p>
                    <p class="text-gray-800">{data.user.family_name}</p>
                  </div>
                {/if}
              </div>
            </div>
          </div>

          <!-- Account Actions -->
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-4">
              Account Actions
            </h3>
            <div class="space-y-3">
              <button
                class="w-full bg-white/50 border border-white/20 rounded-xl p-4 text-left hover:bg-white/70 transition-colors"
              >
                <div class="flex items-center space-x-3">
                  <Icon
                    icon="heroicons:pencil-square"
                    class="w-5 h-5 text-gray-600"
                  />
                  <div>
                    <p class="font-medium text-gray-800">Edit Profile</p>
                    <p class="text-sm text-gray-600">
                      Update your profile information
                    </p>
                  </div>
                </div>
              </button>

              <button
                class="w-full bg-white/50 border border-white/20 rounded-xl p-4 text-left hover:bg-white/70 transition-colors"
              >
                <div class="flex items-center space-x-3">
                  <Icon icon="heroicons:key" class="w-5 h-5 text-gray-600" />
                  <div>
                    <p class="font-medium text-gray-800">Change Password</p>
                    <p class="text-sm text-gray-600">
                      Update your account password
                    </p>
                  </div>
                </div>
              </button>

              <button
                class="w-full bg-white/50 border border-white/20 rounded-xl p-4 text-left hover:bg-red-50 transition-colors"
              >
                <div class="flex items-center space-x-3">
                  <Icon icon="heroicons:trash" class="w-5 h-5 text-red-600" />
                  <div>
                    <p class="font-medium text-red-600">Delete Account</p>
                    <p class="text-sm text-red-500">
                      Permanently delete your account and all data
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
