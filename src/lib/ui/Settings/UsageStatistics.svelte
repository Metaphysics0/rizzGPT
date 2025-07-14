<script lang="ts">
  import { formatDateTime } from "$lib/utils/date-format";
  import Icon from "@iconify/svelte";

  const { usageStats, recentConversations } = $props();
</script>

<div class="space-y-6">
  <div>
    <h2 class="text-lg font-semibold text-gray-800 mb-4">Usage Statistics</h2>

    {#if usageStats}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Conversations Used -->
        <div class="bg-white/50 rounded-xl p-4 border border-white/20">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">
                Conversations Used
              </p>
              <p class="text-2xl font-bold text-gray-800">
                {usageStats.conversationsUsed}
              </p>
            </div>
            <div
              class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center"
            >
              <Icon
                icon="heroicons:chat-bubble-left-right"
                class="w-5 h-5 text-purple-600"
              />
            </div>
          </div>
        </div>

        <!-- Conversations Limit -->
        <div class="bg-white/50 rounded-xl p-4 border border-white/20">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Limit</p>
              <p class="text-2xl font-bold text-gray-800">
                {usageStats.isUnlimited
                  ? "Unlimited"
                  : usageStats.conversationLimit}
              </p>
            </div>
            <div
              class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
            >
              <Icon icon="heroicons:infinity" class="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <!-- Remaining -->
        <div class="bg-white/50 rounded-xl p-4 border border-white/20">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Remaining</p>
              <p class="text-2xl font-bold text-gray-800">
                {usageStats.isUnlimited
                  ? "Unlimited"
                  : usageStats.remainingConversations}
              </p>
            </div>
            <div
              class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"
            >
              <Icon
                icon="heroicons:check-circle"
                class="w-5 h-5 text-green-600"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Usage Progress Bar -->
      {#if !usageStats.isUnlimited}
        <div class="mt-6">
          <div
            class="flex justify-between text-sm font-medium text-gray-600 mb-2"
          >
            <span>Usage Progress</span>
            <span
              >{Math.round(
                (usageStats.conversationsUsed / usageStats.conversationLimit) *
                  100
              )}%</span
            >
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
              style="width: {Math.min(
                (usageStats.conversationsUsed / usageStats.conversationLimit) *
                  100,
                100
              )}%"
            ></div>
          </div>
        </div>
      {/if}
    {:else}
      <div class="text-center py-8">
        <Icon
          icon="heroicons:chart-bar"
          class="w-12 h-12 text-gray-400 mx-auto mb-4"
        />
        <p class="text-gray-600">No usage data available</p>
      </div>
    {/if}
  </div>

  <!-- Recent Conversations -->
  <div>
    <h3 class="text-lg font-semibold text-gray-800 mb-4">
      Recent Conversations
    </h3>
    {#if recentConversations && recentConversations.length > 0}
      <div class="space-y-3">
        {#each recentConversations as conversation}
          <div class="bg-white/50 rounded-xl p-4 border border-white/20">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-800">
                  {conversation.matchName}
                </p>
                <p class="text-sm text-gray-600">
                  {conversation.rizzResponseDescription}
                </p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-500">
                  {formatDateTime(conversation.createdAt)}
                </p>
                <span
                  class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full {conversation.status ===
                  'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'}"
                >
                  {conversation.status}
                </span>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="text-center py-8">
        <Icon
          icon="heroicons:chat-bubble-left-right"
          class="w-12 h-12 text-gray-400 mx-auto mb-4"
        />
        <p class="text-gray-600">No conversations yet</p>
        <a href="/" class="text-purple-600 hover:text-purple-700 font-medium"
          >Start your first conversation</a
        >
      </div>
    {/if}
  </div>
</div>
