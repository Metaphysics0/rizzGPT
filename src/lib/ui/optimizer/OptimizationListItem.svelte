<script lang="ts">
  import { goto } from "$app/navigation";
  import type { ProfileOptimization } from "$lib/types";
  import { formatRelativeTime } from "$lib/utils/date.util";
  import Icon from "@iconify/svelte";
  import DeleteConfirmationModal from "../modals/DeleteConfirmationModal.svelte";

  let {
    optimization,
    onDelete,
  }: { optimization: ProfileOptimization; onDelete: (id: string) => void } =
    $props();

  let showDeleteDialog = $state(false);
  let isDeleting = $state(false);

  function getStatusInfo(status: "processing" | "completed" | "failed") {
    switch (status) {
      case "processing":
        return {
          text: "Processing",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        };
      case "completed":
        return {
          text: "Completed",
          color: "text-green-600",
          bgColor: "bg-green-50",
        };
      case "failed":
        return {
          text: "Failed",
          color: "text-red-600",
          bgColor: "bg-red-50",
        };
      default:
        return {
          text: "Unknown",
          color: "text-gray-500",
          bgColor: "bg-gray-100",
        };
    }
  }

  function navigateToOptimizationPage() {
    goto(`/optimizer/${optimization.id}`);
  }

  async function handleDelete() {
    isDeleting = true;
    try {
      const response = await fetch(`/optimizer/${optimization.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDelete(optimization.id);
        showDeleteDialog = false;
      } else {
        console.error("Failed to delete optimization");
      }
    } catch (error) {
      console.error("Error deleting optimization:", error);
    } finally {
      isDeleting = false;
    }
  }

  function handleDeleteClick(event: Event) {
    event.stopPropagation();
    showDeleteDialog = true;
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigateToOptimizationPage();
    }
  }

  const statusInfo = $derived(getStatusInfo(optimization.status));
  const timeAgo = $derived(
    formatRelativeTime(new Date(optimization.updatedAt)),
  );
  const score = $derived(Number(optimization.overallScore));
</script>

<div
  onclick={navigateToOptimizationPage}
  onkeydown={handleKeyDown}
  class="bg-white/20 mb-3 w-full p-4 text-left hover:bg-gray-50 transition-colors duration-200 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset group sm:p-5 cursor-pointer rounded-2xl"
  aria-label="View profile optimization"
  aria-keyshortcuts="enter"
  tabindex="0"
  role="button"
>
  <div class="flex items-start justify-between space-x-3">
    <div class="flex-1 min-w-0">
      <div class="flex items-center space-x-2 mb-1 flex-wrap sm:flex-nowrap">
        <h3
          class="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors sm:text-base"
        >
          Profile Optimization
        </h3>
        <span
          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 shrink-0"
        >
          <Icon icon="mingcute:sparkles-fill" class="w-3 h-3 mr-1" />
          Bio Analysis
        </span>
        {#if optimization.status === "completed"}
          <span
            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0 {score >= 7
              ? 'bg-green-50 text-green-700'
              : score >= 5
                ? 'bg-yellow-50 text-yellow-700'
                : 'bg-red-50 text-red-700'}"
          >
            Score: {score}/10
          </span>
        {/if}
        <span
          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium {statusInfo.bgColor} {statusInfo.color} shrink-0"
        >
          {statusInfo.text}
        </span>
      </div>

      <div class="mb-2">
        {#if optimization.status === "completed"}
          <p class="text-sm text-gray-600 line-clamp-2 sm:text-base">
            {optimization.summary}
          </p>
        {:else}
          <p class="text-sm text-gray-500 italic sm:text-base">
            Your profile is being analyzed...
          </p>
        {/if}
      </div>

      <!-- Timestamp -->
      <p class="text-xs text-gray-400 sm:text-sm">
        {timeAgo}
      </p>
    </div>

    <!-- Delete button -->
    <div class="flex-shrink-0">
      <button
        onclick={handleDeleteClick}
        class="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200 rounded-lg hover:bg-red-50"
        title="Delete optimization"
      >
        <Icon icon="mdi:delete" class="w-4 h-4" />
      </button>
    </div>
  </div>
</div>

<DeleteConfirmationModal
  {showDeleteDialog}
  {handleDelete}
  {isDeleting}
  dialogDescription="Are you sure you want to delete this profile optimization? This action cannot be undone."
  dialogTitle="Delete Profile Optimization"
/>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
