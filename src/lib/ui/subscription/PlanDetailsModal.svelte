<script lang="ts">
  import { page } from "$app/state";
  import { browser } from "$app/environment";
  import Icon from "@iconify/svelte";
  import * as Dialog from "$lib/components/dialog/index.js";
  import CurrentPlanView from "./SubscriptionModal/CurrentPlanView.svelte";
  import ReviseSubscriptionView from "./SubscriptionModal/ReviseSubscriptionView.svelte";
  import type { UiPlan } from "$lib/types";

  interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    plan: UiPlan | null;
    isCurrentPlan?: boolean;
  }

  let { open, onOpenChange, plan, isCurrentPlan = false }: Props = $props();

  const { user } = page.data;

  const hasActiveSubscription = $derived(
    !!user?.subscriptions?.some((s) => s.status === "active")
  );

  const isUpgradeOrDowngrade = $derived(
    !isCurrentPlan && hasActiveSubscription && plan
  );

  function handleSubscriptionSuccess(subscriptionId: string) {
    console.log("Subscription successful:", subscriptionId);
    // Modal will be closed when redirecting to success page
  }

  function handleSubscriptionError(error: any) {
    console.error("Subscription error:", error);
  }

  function handleSubscriptionCancel() {
    console.log("Subscription cancelled");
    onOpenChange(false);
  }
</script>

{#if plan}
  <Dialog.Root {open} {onOpenChange}>
    <Dialog.Content class="max-w-2xl p-0 overflow-hidden">
      <Dialog.Header
        class="p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
      >
        <div class="flex items-center gap-3 mb-2">
          <Icon icon="mingcute:vip-1-fill" class="w-8 h-8" />
          <Dialog.Title class="text-2xl font-bold">
            {plan.name}
          </Dialog.Title>
        </div>
        <Dialog.Description class="text-purple-100">
          {plan.description}
        </Dialog.Description>

        <!-- Price -->
        <div class="mt-4 flex items-baseline gap-1">
          <span class="text-4xl font-bold">{plan.price}</span>
          <span class="text-lg opacity-80">{plan.period}</span>
        </div>
        {#if plan.discount}
          <p class="text-sm text-purple-200 mt-1">{plan.discount}</p>
        {/if}
      </Dialog.Header>

      <!-- Features -->
      <div class="p-6 bg-white">
        <h4 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon icon="mingcute:checkbox-fill" class="w-5 h-5 text-purple-600" />
          What's Included
        </h4>
        <ul class="space-y-3 mb-6">
          {#each plan.features as feature}
            <li class="flex items-start gap-3">
              <Icon
                icon="mingcute:check-circle-fill"
                class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
              />
              <span class="text-gray-700">{feature}</span>
            </li>
          {/each}
        </ul>

        <!-- Subscription Action View -->
        <div class="mt-6">
          {#if isCurrentPlan}
            <CurrentPlanView />
          {:else if isUpgradeOrDowngrade}
            <ReviseSubscriptionView planId={plan.planId} />
          {:else if browser}
            {#await import("./PayPalSubscriptionButton.svelte") then { default: PayPalSubscriptionButton }}
              <PayPalSubscriptionButton
                planId={plan.planId}
                onSuccess={handleSubscriptionSuccess}
                onError={handleSubscriptionError}
                onCancel={handleSubscriptionCancel}
              />
            {/await}
          {:else}
            <div class="flex items-center justify-center py-8">
              <div
                class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"
              ></div>
            </div>
          {/if}
        </div>

        <!-- Footer Note -->
        <div class="mt-6 p-4 bg-gray-50 rounded-lg">
          <div class="flex items-start gap-3">
            <Icon
              icon="mingcute:information-fill"
              class="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
            />
            <div class="text-sm text-gray-600">
              <p class="font-medium text-gray-900 mb-1">
                {isCurrentPlan
                  ? "Manage Your Subscription"
                  : isUpgradeOrDowngrade
                    ? "Plan Change"
                    : "Secure Payment via PayPal"}
              </p>
              <p>
                {isCurrentPlan
                  ? "You can update your payment method or cancel your subscription anytime through PayPal."
                  : isUpgradeOrDowngrade
                    ? "Changes take effect on your next billing cycle. No proration for mid-cycle changes."
                    : "Your subscription will be processed securely through PayPal. You can cancel anytime from your account settings."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Dialog.Content>
  </Dialog.Root>
{/if}
