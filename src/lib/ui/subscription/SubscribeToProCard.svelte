<script lang="ts">
  import Icon from "@iconify/svelte";
  import { cn } from "$lib/utils/string/cn.util";

  interface Props {
    userEmail?: string;
    className?: string;
  }

  let { userEmail, className }: Props = $props();

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
    </div>
  </div>
</div>
