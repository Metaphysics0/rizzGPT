<script lang="ts">
  import type { Conversation } from "$lib/server/database/types";
  import Icon from "@iconify/svelte";
  import AIAnalysis from "./AIAnalysis.svelte";
  import { INITIAL_CONVERSATION_DESCRIPTION } from "$lib/constants/initial-conversation.constant";
  import ProcessingResponseSkeleton from "../loading-animations/ProcessingResponseSkeleton.svelte";
  import GeneratedResponseItem from "./GeneratedResponseItem.svelte";

  let { conversation }: { conversation: Conversation } = $props();

  const isProcessing = $derived(conversation.status === "processing");
  const isCompleted = $derived(conversation.status === "completed");
  const hasResponses = $derived(conversation.rizzResponses.length > 0);
</script>

<div
  class="rounded-2xl border border-white/20 bg-white/70 p-6 shadow-lg backdrop-blur-sm"
>
  <div class="mb-6 flex items-center justify-between">
    <h1 class="text-2xl font-bold text-gray-800">
      {#if conversation.matchName && conversation.matchName !== "Processing..."}
        {#if conversation.conversationType === "first-move"}
          First Move for {conversation.matchName}
        {:else}
          Conversation with {conversation.matchName}
        {/if}
      {:else}
        <span class="text-gray-500">Processing...</span>
      {/if}
    </h1>

    <div class="flex items-center gap-2">
      {#if conversation.conversationType}
        <span
          class="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800"
        >
          {#if conversation.conversationType === "first-move"}
            <Icon icon="mdi:message-star" class="h-4 w-4" />
            First Move
          {:else if conversation.conversationType === "response-helper"}
            <Icon icon="mdi:message-reply" class="h-4 w-4" />
            Response Helper
          {:else}
            <Icon icon="mdi:message-text" class="h-4 w-4" />
            Conversation
          {/if}
        </span>
      {/if}

      {#if isProcessing}
        <span
          class="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
        >
          <div class="h-2 w-2 animate-pulse rounded-full bg-blue-600"></div>
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

  {#if conversation.rizzResponseDescription && conversation.rizzResponseDescription !== INITIAL_CONVERSATION_DESCRIPTION}
    <AIAnalysis {conversation} />
  {/if}

  {#if hasResponses}
    <div class="space-y-3">
      <h3 class="flex items-center gap-2 text-lg font-semibold text-gray-800">
        {#if conversation.conversationType === "first-move"}
          <Icon icon="mdi:message-star" class="h-5 w-5 text-purple-600" />
          First Message Options
        {:else}
          <Icon icon="mdi:message-text" class="h-5 w-5 text-purple-600" />
          Response Options
        {/if}
      </h3>

      {#each conversation.rizzResponses as response, index}
        <GeneratedResponseItem {index} {response} />
      {/each}
    </div>

    <div class="mt-6 rounded-lg bg-green-50 p-3 text-sm">
      <div class="flex items-start gap-2">
        <Icon icon="mdi:lightbulb" class="mt-0.5 h-4 w-4 text-green-600" />
        <div>
          <span class="font-medium text-green-800">💡 Pro tip:</span>
          <span class="text-green-700">
            Click the copy button to copy any response to your clipboard, then
            paste it into your dating app! ✨
          </span>
        </div>
      </div>
    </div>
  {:else if isProcessing}
    <ProcessingResponseSkeleton />
  {/if}
</div>
