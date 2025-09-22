<script lang="ts">
  import { goto } from "$app/navigation";
  import type { ConversationsListItem, ConversationStatus } from "$lib/types";
  import { formatRelativeTime } from "$lib/utils/date.util";
  import { truncateText } from "$lib/utils/string/truncate-text.util";

  let { conversation }: { conversation: ConversationsListItem } = $props();

  function getStatusInfo(status: ConversationStatus | null) {
    switch (status) {
      case "initial":
        return {
          text: "Starting...",
          color: "text-gray-500",
          bgColor: "bg-gray-100",
        };
      case "processing":
        return {
          text: "Processing",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        };
      case "refining":
        return {
          text: "Refining",
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
        };
      case "completed":
        return {
          text: "Completed",
          color: "text-green-600",
          bgColor: "bg-green-50",
        };
      case null:
        return {
          text: "Unknown",
          color: "text-gray-500",
          bgColor: "bg-gray-100",
        };
      default:
        return {
          text: status || "Unknown",
          color: "text-gray-500",
          bgColor: "bg-gray-100",
        };
    }
  }

  function navigateToConversationPage() {
    goto(`/conversations/${conversation.id}`);
  }

  const statusInfo = $derived(getStatusInfo(conversation.status));
  const timeAgo = $derived(formatRelativeTime(conversation.updatedAt));
</script>

<button
  onclick={navigateToConversationPage}
  class="bg-white/20 mb-3 w-full p-4 text-left hover:bg-gray-50 transition-colors duration-200 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset group sm:p-5 cursor-pointer rounded-2xl"
>
  <div class="flex items-start justify-between space-x-3">
    <div class="flex-1 min-w-0">
      <!-- Match name and status -->
      <div class="flex items-center space-x-2 mb-1 flex-wrap sm:flex-nowrap">
        <h3
          class="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors sm:text-base"
        >
          {conversation.matchName}
        </h3>
        <span
          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium {statusInfo.bgColor} {statusInfo.color} shrink-0"
        >
          {statusInfo.text}
        </span>
      </div>

      <!-- Description -->
      <p class="text-sm text-gray-600 line-clamp-2 mb-2 sm:text-base">
        {truncateText(conversation.rizzResponseDescription)}
      </p>

      <!-- Timestamp -->
      <p class="text-xs text-gray-400 sm:text-sm">
        {timeAgo}
      </p>
    </div>
  </div>
</button>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
