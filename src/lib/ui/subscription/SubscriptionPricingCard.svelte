<script lang="ts">
  import Icon from "@iconify/svelte";
  import { cn } from "$lib/utils/string/cn.util";

  interface Props {
    userEmail?: string;
    currentPlan?: "trial" | "pro";
    className?: string;
  }

  let { userEmail, currentPlan = "trial", className }: Props = $props();

  const GUMROAD_PRODUCT_URL = "https://rizzgpt.gumroad.com/l/rizzgpt-pro";

  function handleUpgrade() {
    // Redirect to Gumroad with user email pre-filled if available
    const url = new URL(GUMROAD_PRODUCT_URL);
    if (userEmail) {
      url.searchParams.set("email", userEmail);
    }
    window.open(url.toString(), "_blank");
  }

  const features = [
    "Unlimited AI-generated responses",
    "Advanced relationship context analysis",
    "Priority support",
    "Early access to new features",
    "Analytics & insights (coming soon)",
    "AI dating profile optimization (coming soon)",
  ];

  const freeFeatures = [
    "5 responses per month",
    "Basic relationship context",
    "Community support",
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
        <h3 class="text-2xl font-bold">RizzGPT Pro</h3>
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

        <!-- Free Plan Comparison -->
        <div class="pt-4 border-t border-gray-100">
          <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Icon icon="mdi:account" class="w-4 h-4 text-gray-500" />
            Free Plan
          </h4>
          <ul class="space-y-2">
            {#each freeFeatures as feature}
              <li class="flex items-start gap-2 text-sm text-gray-500">
                <Icon
                  icon="mdi:check"
                  class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"
                />
                <span>{feature}</span>
              </li>
            {/each}
          </ul>
        </div>
      </div>

      <!-- CTA Button -->
      {#if currentPlan === "pro"}
        <div
          class="text-center p-4 bg-green-50 rounded-lg border border-green-200"
        >
          <div class="flex items-center justify-center gap-2 text-green-700">
            <Icon icon="mdi:check-circle" class="w-5 h-5" />
            <span class="font-medium">You're on Pro!</span>
          </div>
          <p class="text-sm text-green-600 mt-1">
            Enjoying unlimited responses
          </p>
        </div>
      {:else}
        <button
          onclick={handleUpgrade}
          class="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          <div class="flex items-center justify-center gap-2">
            <Icon icon="mdi:rocket-launch" class="w-5 h-5" />
            <span>Upgrade to Pro</span>
          </div>
        </button>

        <p class="text-xs text-gray-500 text-center mt-3">
          Secure payment via Gumroad • Cancel anytime
        </p>
      {/if}
    </div>

    <!-- Popular Badge -->
    {#if currentPlan === "trial"}
      <div class="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <div
          class="bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg"
        >
          MOST POPULAR
        </div>
      </div>
    {/if}
  </div>
</div>
