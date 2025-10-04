<script lang="ts">
  import Icon from "@iconify/svelte";
  import { cn } from "$lib/utils/string/cn.util";
  import type { Subscription } from "$lib/server/database/schema";
  import SubscriptionStatusBadge from "./SubscriptionStatusBadge.svelte";

  interface Props {
    usageCount: number;
    subscription?: Subscription | null;
    userEmail?: string;
    className?: string;
    showUpgradeCard?: boolean;
  }

  let { usageCount, subscription, className }: Props = $props();

  const isProUser = subscription?.status === "active";
  const freeLimit = 5;
  const remainingResponses = Math.max(0, freeLimit - usageCount);
  const usagePercentage = isProUser
    ? 0
    : Math.min((usageCount / freeLimit) * 100, 100);

  function getUsageColor() {
    if (isProUser) return "text-green-600";
    if (usagePercentage >= 100) return "text-red-600";
    if (usagePercentage >= 80) return "text-orange-600";
    return "text-blue-600";
  }

  function getProgressColor() {
    if (isProUser) return "bg-green-500";
    if (usagePercentage >= 100) return "bg-red-500";
    if (usagePercentage >= 80) return "bg-orange-500";
    return "bg-blue-500";
  }
</script>

<div class={cn("space-y-4", className || "")}>
  <!-- Usage Stats Card -->
  <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Icon icon="mdi:chart-line" class="w-5 h-5 text-purple-600" />
        Usage This Month
      </h3>

      <SubscriptionStatusBadge status={isProUser ? "pro" : "free"} />
    </div>

    <div class="space-y-3">
      <!-- Usage Counter -->
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-600">Responses Generated</span>
        <span class={cn("text-xl font-bold", getUsageColor())}>
          {#if isProUser}
            {usageCount}
            <span class="text-sm font-normal text-gray-500">/ Unlimited</span>
          {:else}
            {usageCount}
            <span class="text-sm font-normal text-gray-500">/ {freeLimit}</span>
          {/if}
        </span>
      </div>

      <!-- Progress Bar -->
      {#if !isProUser}
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class={cn(
              "h-2 rounded-full transition-all duration-300",
              getProgressColor()
            )}
            style="width: {usagePercentage}%"
          ></div>
        </div>

        <!-- Remaining Count -->
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600">
            {#if remainingResponses > 0}
              {remainingResponses} responses remaining
            {:else}
              <span class="text-red-600 font-medium">Limit reached</span>
            {/if}
          </span>
          <span class="text-gray-500">Resets monthly</span>
        </div>
      {:else}
        <div class="text-sm text-green-600 flex items-center gap-1">
          <Icon icon="mdi:infinity" class="w-4 h-4" />
          <span>Unlimited responses</span>
        </div>
      {/if}
    </div>

    <!-- Warning for approaching limit -->
    {#if !isProUser && usagePercentage >= 80 && remainingResponses > 0}
      <div class="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
        <div class="flex items-start gap-2">
          <Icon icon="mdi:alert" class="w-5 h-5 text-orange-600 mt-0.5" />
          <div>
            <p class="text-sm font-medium text-orange-800">
              Almost at your limit
            </p>
            <p class="text-xs text-orange-700 mt-1">
              You have {remainingResponses} response{remainingResponses !== 1
                ? "s"
                : ""} left this month.
            </p>
          </div>
        </div>
      </div>
    {/if}

    <!-- Limit reached warning -->
    {#if !isProUser && remainingResponses === 0}
      <div class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-start gap-2">
          <Icon icon="mdi:lock" class="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <p class="text-sm font-medium text-red-800">
              Monthly limit reached
            </p>
            <p class="text-xs text-red-700 mt-1">
              Upgrade to Pro for unlimited responses or wait until next month.
            </p>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
