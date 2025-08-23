<script lang="ts">
  import ConversationListItem from "$lib/ui/conversations/ConversationListItem.svelte";
  import NewConversationButton from "$lib/ui/conversations/NewConversationButton.svelte";
  import NoConversations from "$lib/ui/conversations/NoConversations.svelte";
  import type { PageData } from "./$types";

  const { data }: { data: PageData } = $props();

  const hasAtLeastOneConversation = $derived(
    data.conversations && data.conversations.length > 0
  );
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
          {#if hasAtLeastOneConversation}
            {data.conversations.length} conversation{data.conversations
              .length === 1
              ? ""
              : "s"}
          {:else}
            No conversations yet
          {/if}
        </p>
      </div>
      <NewConversationButton />
    </div>
  </div>

  {#if hasAtLeastOneConversation}
    <div class="divide-y divide-gray-100">
      {#each data.conversations as conversation (conversation.id)}
        <ConversationListItem {conversation} />
      {/each}
    </div>
  {:else}
    <NoConversations />
  {/if}
</div>
