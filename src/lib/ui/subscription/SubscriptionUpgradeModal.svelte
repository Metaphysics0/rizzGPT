<script lang="ts">
  import Icon from "@iconify/svelte";
  import * as Dialog from "$lib/ui/dialog/index.js";
  import SubscriptionPricingCard from "./UpgradeToProTierCard.svelte";

  interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userEmail?: string;
    remainingResponses?: number;
  }

  let {
    open,
    onOpenChange,
    userEmail,
    remainingResponses = 0,
  }: Props = $props();

  function handleUpgradeClick() {
    // The pricing card handles the upgrade flow
    // Close the modal after user clicks upgrade
    onOpenChange(false);
  }
</script>

<Dialog.Root {open} {onOpenChange}>
  <Dialog.Content class="max-w-2xl p-0 overflow-hidden">
    <Dialog.Header class="p-6 text-center border-b border-gray-100">
      <div
        class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center"
      >
        <Icon icon="mdi:lock" class="w-8 h-8 text-purple-600" />
      </div>
      <Dialog.Title class="text-2xl font-bold text-gray-900 mb-2">
        You've reached your limit!
      </Dialog.Title>
      <Dialog.Description class="text-gray-600">
        {#if remainingResponses > 0}
          You have <span class="font-semibold text-purple-600"
            >{remainingResponses} responses</span
          > remaining this month.
        {:else}
          You've used all <span class="font-semibold">5 free responses</span> this
          month. Upgrade to Pro for unlimited access!
        {/if}
      </Dialog.Description>
    </Dialog.Header>

    <!-- Pricing Card -->
    <div class="p-0">
      <SubscriptionPricingCard {userEmail} />
    </div>

    <!-- Modal Footer -->
    <Dialog.Footer class="p-6 border-t border-gray-100">
      <div class="flex flex-col sm:flex-row gap-3 w-full">
        <button
          onclick={() => onOpenChange(false)}
          class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Continue with Free
        </button>
        <button
          onclick={handleUpgradeClick}
          class="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <div class="flex items-center justify-center gap-2">
            <Icon icon="mdi:crown" class="w-4 h-4" />
            <span>Upgrade Now</span>
          </div>
        </button>
      </div>

      <p class="text-xs text-gray-500 text-center mt-4 w-full">
        Your usage resets on the 1st of each month
      </p>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
