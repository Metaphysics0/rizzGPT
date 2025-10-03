<script lang="ts">
  import Icon from "@iconify/svelte";
  import * as Dialog from "$lib/components/dialog/index.js";
  import PayPalSubscriptionButton from "./PayPalSubscriptionButton.svelte";
  import type { UiPlan } from "$lib/types";

  interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    plan: UiPlan | null;
    isCurrentPlan?: boolean;
  }

  let { open, onOpenChange, plan, isCurrentPlan = false }: Props = $props();

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
      <!-- Header -->
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

        <!-- PayPal Subscription Button or Management Link -->
        <div class="mt-6">
          {#if isCurrentPlan}
            <div class="space-y-4">
              <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div class="flex items-center gap-3">
                  <Icon
                    icon="mingcute:check-circle-fill"
                    class="w-6 h-6 text-green-600"
                  />
                  <div>
                    <p class="font-medium text-green-900">
                      You're subscribed to this plan
                    </p>
                    <p class="text-sm text-green-700">
                      This is your active subscription
                    </p>
                  </div>
                </div>
              </div>

              <a
                href="https://www.paypal.com/myaccount/autopay/"
                target="_blank"
                rel="noopener noreferrer"
                class="block w-full bg-gray-900 text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors text-center"
              >
                Manage Subscription on PayPal
                <Icon icon="mingcute:external-link-line" class="inline w-4 h-4 ml-1" />
              </a>
            </div>
          {:else}
            <PayPalSubscriptionButton
              planId={plan.planId}
              onSuccess={handleSubscriptionSuccess}
              onError={handleSubscriptionError}
              onCancel={handleSubscriptionCancel}
            />
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
                {isCurrentPlan ? "Manage Your Subscription" : "Secure Payment via PayPal"}
              </p>
              <p>
                {isCurrentPlan
                  ? "You can update your payment method or cancel your subscription anytime through PayPal."
                  : "Your subscription will be processed securely through PayPal. You can cancel anytime from your account settings."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Dialog.Content>
  </Dialog.Root>
{/if}
