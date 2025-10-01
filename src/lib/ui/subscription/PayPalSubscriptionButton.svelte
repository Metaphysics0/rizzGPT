<script lang="ts">
  import { onMount } from "svelte";
  import { PUBLIC_PAYPAL_CLIENT_ID } from "$env/static/public";

  interface Props {
    planId: string;
    onSuccess?: (subscriptionId: string) => void;
    onError?: (error: any) => void;
    onCancel?: () => void;
  }

  let { planId, onSuccess, onError, onCancel }: Props = $props();

  let buttonContainer: HTMLDivElement;
  let isLoading = $state(true);
  let error = $state<string | null>(null);
  let sdkLoaded = $state(false);

  // Load PayPal SDK dynamically
  function loadPayPalSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if SDK is already loaded
      if (window.paypal) {
        sdkLoaded = true;
        resolve();
        return;
      }

      // Check if script is already being loaded
      const existingScript = document.querySelector(
        'script[src*="paypal.com/sdk/js"]'
      );
      if (existingScript) {
        existingScript.addEventListener("load", () => {
          sdkLoaded = true;
          resolve();
        });
        existingScript.addEventListener("error", reject);
        return;
      }

      // Load the script
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${PUBLIC_PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
      script.async = true;
      script.setAttribute("data-sdk-integration-source", "button-factory");

      script.onload = () => {
        sdkLoaded = true;
        resolve();
      };

      script.onerror = () => {
        reject(new Error("Failed to load PayPal SDK"));
      };

      document.head.appendChild(script);
    });
  }

  onMount(async () => {
    try {
      // Load PayPal SDK
      await loadPayPalSDK();

      // Render PayPal button
      if (window.paypal && buttonContainer) {
        window.paypal
          .Buttons({
            style: {
              shape: "rect",
              color: "gold",
              layout: "vertical",
              label: "subscribe",
            },
            createSubscription: function (data: any, actions: any) {
              return actions.subscription.create({
                plan_id: planId,
              });
            },
            onApprove: async function (data: any, actions: any) {
              console.log(
                "Subscription approved, subscription ID:",
                data.subscriptionID
              );

              // Call success callback
              if (onSuccess) {
                onSuccess(data.subscriptionID);
              }

              // Redirect to success handler
              window.location.href = `/api/subscriptions/success?subscription_id=${data.subscriptionID}`;
            },
            onCancel: function (data: any) {
              console.log("Subscription cancelled by user");
              if (onCancel) {
                onCancel();
              }
            },
            onError: function (err: any) {
              console.error("PayPal subscription error:", err);
              error = "Failed to process subscription. Please try again.";
              if (onError) {
                onError(err);
              }
            },
          })
          .render(buttonContainer);

        isLoading = false;
      }
    } catch (err) {
      console.error("Error loading PayPal SDK:", err);
      error = "Failed to load payment system. Please refresh the page.";
      isLoading = false;
    }
  });
</script>

<div class="paypal-button-wrapper">
  {#if isLoading}
    <div class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    </div>
  {/if}

  {#if error}
    <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-sm text-red-600">{error}</p>
    </div>
  {/if}

  <div bind:this={buttonContainer} class:hidden={isLoading || error}></div>
</div>

<style>
  .paypal-button-wrapper {
    min-height: 100px;
  }
</style>
