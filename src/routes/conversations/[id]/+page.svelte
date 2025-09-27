<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import MediaPreview from "$lib/ui/general/MediaPreview.svelte";
  import { connectToSSE } from "$lib/utils/connect-to-sse.util";
  import Icon from "@iconify/svelte";
  import { onDestroy, onMount } from "svelte";
  import type { PageData } from "./$types";
  import ProcessedConversation from "$lib/ui/generated-response/ProcessedConversation.svelte";
  import LinkButton from "$lib/ui/general/LinkButton.svelte";

  const { data }: { data: PageData } = $props();

  let conversation = $state(data.conversation);
  let eventSource: EventSource | null = null;
  let isConnected = $state(false);
  let error = $state<string | null>(null);
  let reconnectAttempts = $state(0);
  let maxReconnectAttempts = 3;

  function connectToConversationSSE() {
    if (eventSource) {
      eventSource.close();
    }

    eventSource = connectToSSE({
      eventSourceUrl: `/api/conversations/${page.params.id}/events`,
      onDataUpdate: (data) => {
        conversation = { ...conversation, ...data };
        reconnectAttempts = 0; // Reset attempts on successful data
      },
      onConnectionChange: (connected) => {
        isConnected = connected;
      },
      onError: (errorMessage) => {
        error = errorMessage;

        // Attempt to reconnect if connection is lost and we haven't exceeded max attempts
        if (
          !isConnected &&
          reconnectAttempts < maxReconnectAttempts &&
          conversation?.status !== "completed"
        ) {
          reconnectAttempts++;
          setTimeout(() => {
            if (conversation?.status !== "completed") {
              connectToConversationSSE();
            }
          }, 3000 * reconnectAttempts); // Exponential backoff
        }
      },
    });
  }

  onMount(() => {
    if (conversation?.status !== "completed") {
      connectToConversationSSE();
    }
  });

  onDestroy(() => {
    if (eventSource) {
      eventSource.close();
    }
  });

  // Close connection when conversation is completed
  $effect(() => {
    if (conversation?.status === "completed" && eventSource) {
      eventSource.close();
      eventSource = null;
      isConnected = false;
      error = null;
    }
  });

  const isProcessing = $derived(conversation?.status === "processing");

  function goToConversationsPage() {
    goto("/conversations");
  }
</script>

<svelte:head>
  <title>
    {conversation?.matchName && conversation.matchName !== "Processing..."
      ? `Conversation with ${conversation.matchName} - RizzGPT`
      : "Processing Conversation - RizzGPT"}
  </title>
</svelte:head>

<div class="mx-auto max-w-4xl space-y-8">
  <button
    onclick={goToConversationsPage}
    class="mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
  >
    <Icon icon="heroicons:arrow-left" class="h-4 w-4" />
    Conversation History
  </button>

  {#if conversation.initialUploadedConversationFileName}
    <MediaPreview
      fileName={conversation.initialUploadedConversationFileName}
      title={`Uploaded ${conversation.conversationType === "first-move" ? "Bio" : "Conversation"}`}
    />
  {/if}

  {#if isProcessing}
    <div class="rounded-xl border border-blue-200 bg-blue-50 p-4">
      <div class="flex items-center gap-3">
        {#if isConnected}
          <div
            class="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"
          ></div>
          <span class="font-medium text-blue-800"
            >Processing your conversation...</span
          >
        {:else if error}
          <Icon icon="mdi:wifi-off" class="h-5 w-5 text-orange-600" />
          <span class="text-orange-800">{error}</span>
        {:else}
          <div
            class="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"
          ></div>
          <span class="font-medium text-blue-800">Connecting...</span>
        {/if}
      </div>
    </div>
  {/if}

  {#if conversation}
    <ProcessedConversation {conversation} />
  {:else}
    <div
      class="rounded-2xl border border-white/20 bg-white/70 p-8 shadow-lg backdrop-blur-sm text-center"
    >
      <Icon
        icon="mdi:alert-circle"
        class="mx-auto h-12 w-12 text-gray-400 mb-4"
      />
      <h2 class="text-xl font-semibold text-gray-800 mb-2">
        Conversation Not Found
      </h2>
      <p class="text-gray-600 mb-4">
        The conversation you're looking for doesn't exist or you don't have
        access to it.
      </p>
      <button
        onclick={goToConversationsPage}
        class="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:scale-105"
      >
        <Icon icon="heroicons:arrow-left" class="h-4 w-4" />
        Go Back
      </button>
    </div>
  {/if}
</div>
