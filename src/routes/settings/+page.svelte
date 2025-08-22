<script lang="ts">
  import { formatDate } from "$lib/utils/date-format";
  import Icon from "@iconify/svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
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
      View your recent conversations
    </p>
  </div>

  <!-- Recent Conversations -->
  <div
    class="rounded-2xl border border-white/20 bg-white/70 shadow-lg backdrop-blur-sm overflow-hidden"
  >
    <div class="p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">
        Recent Conversations
      </h2>

      {#if data.recentConversations.length > 0}
        <div class="space-y-3">
          {#each data.recentConversations as conversation}
            <div class="bg-white/50 rounded-xl p-4 border border-white/20">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium text-gray-800">
                    {conversation.matchName}
                  </h3>
                  <p class="text-sm text-gray-600">
                    {conversation.rizzResponseDescription}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-600">
                    {formatDate(conversation.createdAt)}
                  </p>
                  <span
                    class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full {conversation.status === 'completed'
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
            icon="heroicons:chat-bubble-left"
            class="w-12 h-12 text-gray-400 mx-auto mb-4"
          />
          <p class="text-gray-600">No conversations yet</p>
        </div>
      {/if}
    </div>
  </div>
</div>
