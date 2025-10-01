<script lang="ts">
  import Icon from "@iconify/svelte";
  import { cn } from "$lib/utils/string/cn.util";

  interface Props {
    userEmail?: string;
    className?: string;
  }

  let { userEmail, className }: Props = $props();

  let isLoading = $state(false);
  let error = $state<string | null>(null);

  async function handleUpgrade() {
    try {
      isLoading = true;
      error = null;

      const response = await fetch("/api/subscriptions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create subscription");
      }

      // Redirect to PayPal approval page
      if (data.approvalUrl) {
        window.location.href = data.approvalUrl;
      } else {
        throw new Error("No approval URL received");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      error = err instanceof Error ? err.message : "Failed to start subscription";
      isLoading = false;
    }
  }

  const features = [
    "Unlimited AI-generated responses",
    "Advanced relationship context analysis",
    "Priority support",
    "Early access to new features",
    "Analytics & insights (coming soon)",
    "AI dating profile optimization (coming soon)",
  ];
</script>

<div class={cn("w-full max-w-md mx-auto", className || "")}>
  <div
    class="relative bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
  >
    <!-- Pro Plan Header -->
    <div
      class="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white text-center"
    >
      <div class="flex items-center justify-center gap-2 mb-2">
        <Icon icon="mdi:crown" class="w-6 h-6 text-yellow-300" />
        <h3 class="text-2xl font-bold">Upgrade Today</h3>
      </div>
      <div class="flex items-baseline justify-center gap-1">
        <span class="text-4xl font-bold">$14.99</span>
        <span class="text-lg opacity-80">/month</span>
      </div>
      <p class="text-sm opacity-80 mt-1">Cancel anytime</p>
    </div>

    <!-- Features -->
    <div class="p-6">
      <div class="space-y-4 mb-6">
        <!-- Pro Features -->
        <div>
          <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Icon icon="mdi:crown" class="w-4 h-4 text-purple-600" />
            Pro Features
          </h4>
          <ul class="space-y-2">
            {#each features as feature}
              <li class="flex items-start gap-2 text-sm text-gray-700">
                <Icon
                  icon="mdi:check"
                  class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"
                />
                <span>{feature}</span>
              </li>
            {/each}
          </ul>
        </div>
      </div>

      {#if error}
        <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{error}</p>
        </div>
      {/if}

      <button
        onclick={handleUpgrade}
        disabled={isLoading}
        class="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        <div class="flex items-center justify-center gap-2">
          {#if isLoading}
            <Icon icon="mingcute:loading-fill" class="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          {:else}
            <Icon icon="mdi:rocket-launch" class="w-5 h-5" />
            <span>Upgrade to Pro</span>
          {/if}
        </div>
      </button>

      <p class="text-xs text-gray-500 text-center mt-3">
        Secure payment via PayPal • Cancel anytime
      </p>
    </div>
  </div>
</div>
