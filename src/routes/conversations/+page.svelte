<script lang="ts">
  import { goto } from "$app/navigation";
  import type { PageData } from "./$types";

  const { data }: { data: PageData } = $props();

  let searchQuery = $state("");

  // Filter conversations based on search query
  const filteredConversations = $derived(() => {
    if (!searchQuery.trim()) return data.conversations;

    return data.conversations.filter(
      (conversation) =>
        conversation.matchName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        conversation.rizzResponseDescription
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  });

  // Helper function to format relative time
  function getRelativeTime(date: Date | string): string {
    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return then.toLocaleDateString();
  }

  // Helper function to get status display text
  function getStatusText(status: string): string {
    switch (status) {
      case "initial":
        return "Setting up...";
      case "processing":
        return "Generating responses...";
      case "refining":
        return "Finalizing...";
      case "completed":
        return "Ready";
      default:
        return status;
    }
  }

  // Helper function to get status color
  function getStatusColor(status: string): string {
    switch (status) {
      case "initial":
        return "text-orange-600";
      case "processing":
        return "text-blue-600";
      case "refining":
        return "text-purple-600";
      case "completed":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  }

  function navigateToConversation(conversationId: string) {
    goto(`/conversations/${conversationId}`);
  }

  function createNewChat() {
    goto("/");
  }
</script>

<div class="min-h-screen bg-gray-50 pt-20">
  <div class="mx-auto max-w-4xl px-4 py-8">
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <h1 class="text-3xl font-bold text-gray-900">Your chat history</h1>
      <button
        onclick={createNewChat}
        class="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
      >
        <svg
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        New chat
      </button>
    </div>

    <!-- Search Bar -->
    <div class="mb-6">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            class="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search your chats..."
          class="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>

    <!-- Chat Count -->
    <div class="mb-4">
      <p class="text-sm text-gray-600">
        You have {data.conversations.length} conversation{data.conversations
          .length !== 1
          ? "s"
          : ""} with RizzGPT
        {#if searchQuery && filteredConversations.length !== data.conversations.length}
          <span class="ml-1"
            >• Showing {filteredConversations.length} match{filteredConversations.length !==
            1
              ? "es"
              : ""}</span
          >
        {/if}
      </p>
    </div>

    <!-- Conversations List -->
    <div class="space-y-3">
      {#each filteredConversations as conversation (conversation.id)}
        <button
          onclick={() => navigateToConversation(conversation.id)}
          class="w-full rounded-lg border border-gray-200 bg-white p-4 text-left transition-colors hover:border-gray-300 hover:bg-gray-50"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <!-- Match Name (Title) -->
              <h3 class="truncate text-base font-medium text-gray-900">
                💕 Chat with {conversation.matchName}
              </h3>

              <!-- Description/Preview -->
              <p class="mt-1 truncate text-sm text-gray-600">
                {conversation.rizzResponseDescription}
              </p>

              <!-- Status -->
              <div class="mt-2 flex items-center gap-2">
                <span
                  class="text-xs {getStatusColor(
                    conversation.status
                  )} font-medium"
                >
                  {getStatusText(conversation.status)}
                </span>
                {#if conversation.rizzResponses.length > 0}
                  <span class="text-xs text-gray-400">•</span>
                  <span class="text-xs text-gray-500">
                    {conversation.rizzResponses.length} response{conversation
                      .rizzResponses.length !== 1
                      ? "s"
                      : ""} generated
                  </span>
                {/if}
              </div>
            </div>

            <!-- Timestamp -->
            <div class="ml-4 flex-shrink-0">
              <p class="text-xs text-gray-500">
                {getRelativeTime(conversation.updatedAt)}
              </p>
            </div>
          </div>
        </button>
      {:else}
        <!-- Empty State -->
        <div class="py-12 text-center">
          <div class="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 class="mt-4 text-sm font-medium text-gray-900">
            {searchQuery ? "No matching conversations" : "No conversations yet"}
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            {searchQuery
              ? "Try a different search term."
              : "Start chatting with RizzGPT to see your conversations here."}
          </p>
          {#if !searchQuery}
            <button
              onclick={createNewChat}
              class="mt-4 inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              <svg
                class="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Start your first chat
            </button>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>
