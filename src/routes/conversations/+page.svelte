<script lang="ts">
  import ConversationListItem from "$lib/ui/conversations/ConversationListItem.svelte";
  import { pluralizeWithCount } from "$lib/utils/string/pluralize";
  import type { PageData } from "./$types";

  const { data }: { data: PageData } = $props();

  let conversations = $state(data.conversations);

  function handleDelete(conversationId: string) {
    conversations = conversations.filter((conv) => conv.id !== conversationId);
  }
</script>

<svelte:head>
  <title>Conversations - RizzGPT</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 sm:px-6">
  <div class="mb-4 rounded-2xl border-gray-200 px-4 py-4 sm:px-6">
    <div class="flex items-center justify-between flex-wrap gap-4">
      <div>
        <h1 class="text-xl font-semibold text-gray-900 sm:text-2xl">
          Conversation History
        </h1>
        <p class="text-sm text-gray-600 mt-1">
          {pluralizeWithCount(conversations.length, "conversation")}
        </p>
      </div>
    </div>
  </div>

  <div class="divide-y divide-gray-100">
    {#each conversations as conversation (conversation.id)}
      <ConversationListItem {conversation} onDelete={handleDelete} />
    {/each}
  </div>
</div>
