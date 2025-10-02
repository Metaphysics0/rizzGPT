<script lang="ts">
  import { PUBLIC_PAYPAL_CLIENT_ID } from "$env/static/public";
  import { loadScript } from "@paypal/paypal-js";

  interface Props {
    planId: string;
    onSuccess: (subscriptionId: string) => void;
    onError: (error: any) => void;
    onCancel: () => void;
  }

  let { planId, onSuccess, onError, onCancel }: Props = $props();

  let isLoading = $state(true);
  let error = $state<string | null>(null);

  loadScript({
    clientId: PUBLIC_PAYPAL_CLIENT_ID,
    vault: true,
    intent: "subscription",
  }).then((paypal) => {
    if (!paypal) {
      error = "Failed to load payment system. Please refresh the page.";
      isLoading = false;
      return;
    }

    paypal
      .Buttons?.({
        style: {
          shape: "rect",
          color: "gold",
          layout: "vertical",
          label: "subscribe",
        },
        createSubscription: function (data, actions) {
          return actions.subscription.create({
            plan_id: planId,
          });
        },
        onApprove: async function (data: any, actions: any) {
          console.log(
            "Subscription approved, subscription ID:",
            data.subscriptionID
          );

          onSuccess(data.subscriptionID);

          // Redirect to success handler
          window.location.href = `/api/subscriptions/success?subscription_id=${data.subscriptionID}`;
        },
        onCancel: function (data: any) {
          console.log("Subscription cancelled by user");
          onCancel();
        },
        onError: function (err: any) {
          console.error("PayPal subscription error:", err);
          error = "Failed to process subscription. Please try again.";
          onError(err);
        },
      })
      .render("#paypal-button-container")
      .then(() => {
        isLoading = false;
      })
      .catch((err) => {
        console.error("Error rendering PayPal button:", err);
        error = "Failed to load payment system. Please refresh the page.";
        isLoading = false;
      });
  });
</script>

<div class="paypal-button-wrapper">
  {#if isLoading}
    <div class="flex items-center justify-center py-8">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"
      ></div>
    </div>
  {/if}

  {#if error}
    <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-sm text-red-600">{error}</p>
    </div>
  {/if}

  <div id="paypal-button-container" class:hidden={isLoading || error}></div>
</div>

<style>
  .paypal-button-wrapper {
    min-height: 100px;
  }

  #paypal-button-container {
    margin: 30px 0;
  }
</style>
