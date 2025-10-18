<script lang="ts">
  import ConversationListItem from "$lib/ui/conversations/ConversationListItem.svelte";
  import OptimizationListItem from "$lib/ui/optimizer/OptimizationListItem.svelte";
  import { pluralizeWithCount } from "$lib/utils/string/pluralize";
  import type { PageData } from "./$types";
  import type { ConversationsListItem, ProfileOptimization } from "$lib/types";

  const { data }: { data: PageData } = $props();
  let { conversations, optimizations } = $state(data);

  // Merge and sort all items by updatedAt date
  type HistoryItem =
    | { type: "conversation"; data: ConversationsListItem }
    | { type: "optimization"; data: ProfileOptimization };

  const historyItems = $derived.by(() => {
    const conversationItems: HistoryItem[] = conversations.map((conv) => ({
      type: "conversation" as const,
      data: conv,
    }));

    // @ts-ignore - for some reason the 'optimizations' var is not type inferred
    const optimizationItems: HistoryItem[] = optimizations
      .filter((opt) => opt.status === "completed") // Only show completed optimizations
      .map((opt) => ({
        type: "optimization" as const,
        data: opt,
      }));

    const allItems = [...conversationItems, ...optimizationItems];

    // Sort by updatedAt in descending order (newest first)
    return allItems.sort((a, b) => {
      const dateA = new Date(a.data.updatedAt).getTime();
      const dateB = new Date(b.data.updatedAt).getTime();
      return dateB - dateA;
    });
  });

  function handleDeleteConversation(conversationId: string) {
    conversations = conversations.filter((conv) => conv.id !== conversationId);
  }

  function handleDeleteOptimization(optimizationId: string) {
    optimizations = optimizations.filter((opt) => opt.id !== optimizationId);
  }

  const totalItems = $derived(historyItems.length);
</script>

<svelte:head>
  <title>RizzGPT - Conversations</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 sm:px-6">
  <div class="mb-4 rounded-2xl border-gray-200 px-4 py-4 sm:px-6">
    <div class="flex items-center justify-between flex-wrap gap-4">
      <div>
        <h1 class="text-xl font-semibold text-gray-900 sm:text-2xl">History</h1>
        <p class="text-sm text-gray-600 mt-1">
          {pluralizeWithCount(totalItems, "item")}
        </p>
      </div>
    </div>
  </div>

  <div class="divide-y divide-gray-100">
    {#each historyItems as item (item.data.id)}
      {#if item.type === "conversation"}
        <ConversationListItem
          conversation={item.data}
          onDelete={handleDeleteConversation}
        />
      {:else}
        <OptimizationListItem
          optimization={item.data}
          onDelete={handleDeleteOptimization}
        />
      {/if}
    {/each}

    {#if historyItems.length === 0}
      <div class="text-center py-12">
        <p class="text-gray-500 text-lg">No history items yet</p>
        <p class="text-gray-400 text-sm mt-2">
          Start generating conversations or optimize your profile!
        </p>
      </div>
    {/if}
  </div>
</div>
