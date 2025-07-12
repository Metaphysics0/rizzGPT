<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Icon from "@iconify/svelte";
  import { onDestroy, onMount } from "svelte";
  import type { PageData } from "./$types";

  const { data }: { data: PageData } = $props();

  let conversation = $state(data.conversation);
  let eventSource: EventSource | null = null;
  let isConnected = $state(false);
  let error = $state<string | null>(null);

  onMount(() => {
    if (conversation?.status !== "completed") {
      connectToSSE();
    }
  });

  onDestroy(() => {
    if (eventSource) {
      eventSource.close();
    }
  });

  function connectToSSE() {
    const conversationId = page.params.id;
    eventSource = new EventSource(
      `/api/conversations/${conversationId}/events`
    );

    eventSource.onopen = () => {
      isConnected = true;
      error = null;
    };

    eventSource.onmessage = (event) => {
      try {
        const updatedData = JSON.parse(event.data);
        conversation = { ...conversation, ...updatedData };
      } catch (e) {
        console.error("Failed to parse SSE data:", e);
      }
    };

    eventSource.onerror = () => {
      isConnected = false;
      error = "Connection lost. Retrying...";

      setTimeout(() => {
        if (eventSource?.readyState === EventSource.CLOSED) {
          connectToSSE();
        }
      }, 3000);
    };
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  function goBack() {
    goto("/");
  }

  const isProcessing = $derived(conversation?.status === "processing");
  const isCompleted = $derived(conversation?.status === "completed");
  const hasResponses = $derived(
    conversation?.rizzResponses && conversation.rizzResponses.length > 0
  );
</script>

<svelte:head>
  <title>
    {conversation?.matchName && conversation.matchName !== "Processing..."
      ? `Conversation with ${conversation.matchName} - RizzGPT`
      : "Processing Conversation - RizzGPT"}
  </title>
</svelte:head>

<div
  class="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-yellow-100 p-4 md:p-8"
>
  <div class="mx-auto max-w-4xl space-y-8">
    <button
      onclick={goBack}
      class="mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
    >
      <Icon icon="heroicons:arrow-left" class="h-4 w-4" />
      Start New Conversation
    </button>

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
      <div
        class="rounded-2xl border border-white/20 bg-white/70 p-6 shadow-lg backdrop-blur-sm"
      >
        <div class="mb-6 flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-800">
            {#if conversation.matchName && conversation.matchName !== "Processing..."}
              Conversation with {conversation.matchName}
            {:else}
              <span class="text-gray-500">Processing Conversation...</span>
            {/if}
          </h1>

          <div class="flex items-center gap-2">
            {#if isProcessing}
              <span
                class="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
              >
                <div
                  class="h-2 w-2 animate-pulse rounded-full bg-blue-600"
                ></div>
                Processing
              </span>
            {:else if isCompleted}
              <span
                class="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
              >
                <Icon icon="heroicons:check-circle" class="h-4 w-4" />
                Complete
              </span>
            {/if}
          </div>
        </div>

        {#if conversation.rizzResponseDescription && conversation.rizzResponseDescription !== "Processing your conversation..."}
          <div class="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
            <div class="mb-3 flex items-center gap-2">
              <Icon icon="mdi:brain" class="h-5 w-5 text-blue-600" />
              <span class="font-medium text-blue-800">AI Analysis</span>
            </div>
            <p class="text-sm text-blue-700">
              {conversation.rizzResponseDescription}
            </p>
          </div>
        {/if}

        {#if hasResponses}
          <div class="space-y-3">
            <h3
              class="flex items-center gap-2 text-lg font-semibold text-gray-800"
            >
              <Icon icon="mdi:message-text" class="h-5 w-5 text-purple-600" />
              Response Options
            </h3>

            {#each conversation.rizzResponses as response, index}
              <div
                class="group relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-purple-300 hover:shadow-md"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="flex-1">
                    <div class="mb-2 flex items-center gap-2">
                      <span
                        class="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-purple-600"
                      >
                        {index + 1}
                      </span>
                      <span class="text-sm font-medium text-gray-500"
                        >Option {index + 1}</span
                      >
                    </div>
                    <p class="text-gray-800">{response}</p>
                  </div>

                  <button
                    onclick={() => copyToClipboard(response)}
                    class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-600 opacity-0 transition-all hover:bg-purple-100 hover:text-purple-600 group-hover:opacity-100"
                    title="Copy to clipboard"
                  >
                    <Icon icon="mdi:content-copy" class="h-4 w-4" />
                  </button>
                </div>
              </div>
            {/each}
          </div>

          <div class="mt-6 rounded-lg bg-green-50 p-3 text-sm">
            <div class="flex items-start gap-2">
              <Icon
                icon="mdi:lightbulb"
                class="mt-0.5 h-4 w-4 text-green-600"
              />
              <div>
                <span class="font-medium text-green-800">💡 Pro tip:</span>
                <span class="text-green-700">
                  Click the copy button to copy any response to your clipboard,
                  then paste it into your dating app! ✨
                </span>
              </div>
            </div>
          </div>
        {:else if isProcessing}
          <div class="space-y-4">
            <div class="animate-pulse space-y-3">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              <div class="h-16 bg-gray-200 rounded"></div>
              <div class="h-16 bg-gray-200 rounded"></div>
              <div class="h-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        {/if}
      </div>
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
          onclick={goBack}
          class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:scale-105"
        >
          <Icon icon="heroicons:arrow-left" class="h-4 w-4" />
          Go Back
        </button>
      </div>
    {/if}
  </div>
</div>
