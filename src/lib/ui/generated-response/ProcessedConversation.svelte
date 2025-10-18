<script lang="ts">
  import type { Conversation } from "$lib/server/database/types";
  import Icon from "@iconify/svelte";
  import AIAnalysis from "./AIAnalysis.svelte";
  import { INITIAL_CONVERSATION_DESCRIPTION } from "$lib/constants/initial-conversation.constant";
  import ProcessingResponseSkeleton from "../loading-animations/ProcessingResponseSkeleton.svelte";
  import GeneratedResponseItem from "./GeneratedResponseItem.svelte";
  import Button from "$lib/components/button/button.svelte";
  import * as Pagination from "$lib/components/pagination";
  import toast from "svelte-french-toast";
  import ProTip from "./ProTip.svelte";

  let { conversation }: { conversation: Conversation } = $props();

  let isRegenerating = $state(false);
  let currentPage = $state(1);

  const isProcessing = $derived(conversation.status === "processing");
  const isCompleted = $derived(conversation.status === "completed");
  const hasResponses = $derived(conversation.rizzResponses.length > 0);
  const showLoading = $derived(isProcessing || isRegenerating);

  // Pagination constants
  const responsesPerPage = 3;
  const totalResponses = $derived(conversation.rizzResponses.length);
  const totalPages = $derived(Math.ceil(totalResponses / responsesPerPage));
  const showPagination = $derived(totalResponses > responsesPerPage);

  // Calculate responses for current page
  const displayResponses = $derived(() => {
    const startIndex = (currentPage - 1) * responsesPerPage;
    const endIndex = startIndex + responsesPerPage;
    return conversation.rizzResponses.slice(startIndex, endIndex);
  });

  // Reset to last page when new responses are added
  $effect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      currentPage = totalPages;
    }
  });

  async function handleRegenerate() {
    if (isRegenerating) return;
    isRegenerating = true;
    try {
      const response = await fetch(
        `/api/conversations/${conversation.id}/regenerate`,
        { method: "POST" },
      );

      if (!response.ok) throw new Error("Failed to regenerate responses");

      const result = await response.json();

      // Update conversation with new responses
      conversation.rizzResponses = [
        ...conversation.rizzResponses,
        ...result.data.responses,
      ];
      conversation.rizzResponseDescription = result.data.explanation;
      if (conversation.matchName === "Processing...") {
        conversation.matchName = result.data.matchName;
      }
    } catch (error) {
      console.error("Regeneration failed:", error);
      toast.error("Regeneration failed");
    } finally {
      isRegenerating = false;
    }
  }
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
          {:else if conversation.conversationType === "conversation-helper"}
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
      <div class="flex justify-between">
        <h3 class="flex items-center gap-2 text-lg font-semibold text-gray-800">
          {#if conversation.conversationType === "first-move"}
            <Icon icon="mdi:message-star" class="h-5 w-5 text-purple-600" />
            First Message Options
          {:else}
            <Icon icon="mdi:message-text" class="h-5 w-5 text-purple-600" />
            Response Options
          {/if}
        </h3>
        <Button
          variant="outline"
          class="cursor-pointer"
          onclick={handleRegenerate}
          disabled={isRegenerating}
        >
          {#if isRegenerating}
            <div
              class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            ></div>
          {:else}
            <Icon icon="mingcute:shuffle-2-fill" />
          {/if}
          Regenerate
        </Button>
      </div>

      {#each displayResponses() as response, index}
        <GeneratedResponseItem {index} {response} />
      {/each}
    </div>

    {#if showPagination}
      <div class="mt-4 flex justify-center">
        <Pagination.Root
          count={totalResponses}
          perPage={responsesPerPage}
          bind:page={currentPage}
          siblingCount={0}
        >
          {#snippet children()}
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.PrevButton />
              </Pagination.Item>
              <Pagination.Item>
                <Pagination.NextButton />
              </Pagination.Item>
            </Pagination.Content>
          {/snippet}
        </Pagination.Root>
      </div>
    {/if}

    <ProTip
      text="Click the copy button to copy any response to your clipboard, then paste it into your dating app! ✨"
    />
  {:else if showLoading}
    <ProcessingResponseSkeleton />
  {/if}
</div>
