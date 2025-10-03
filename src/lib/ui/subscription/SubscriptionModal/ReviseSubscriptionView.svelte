<script lang="ts">
  import Icon from "@iconify/svelte";

  let { planId }: { planId: string } = $props();

  let isRevising = $state(false);
  let revisionError = $state<string | null>(null);

  async function handleRevise() {
    isRevising = true;
    revisionError = null;
    try {
      const response = await fetch("/api/subscriptions/revise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPlanId: planId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to revise subscription");
      }

      // Redirect to PayPal for re-consent
      if (data.approvalUrl) {
        window.location.href = data.approvalUrl;
      } else {
        throw new Error("No approval URL received");
      }
    } catch (error) {
      console.error("Revision error:", error);
      revisionError =
        error instanceof Error
          ? error.message
          : "Failed to revise subscription";
      isRevising = false;
    }
  }
</script>

<div class="space-y-4">
  <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
    <div class="flex items-start gap-3">
      <Icon
        icon="mingcute:information-fill"
        class="w-6 h-6 text-blue-600 mt-0.5"
      />
      <div class="text-sm text-blue-800">
        <p class="font-medium mb-1">Plan Change</p>
        <p>
          This will change your current subscription. The new price takes effect
          on your next billing cycle. You'll need to re-approve the change with
          PayPal.
        </p>
      </div>
    </div>
  </div>

  {#if revisionError}
    <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-sm text-red-600">{revisionError}</p>
    </div>
  {/if}

  <button
    onclick={handleRevise}
    disabled={isRevising}
    class="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {#if isRevising}
      <Icon
        icon="mingcute:loading-fill"
        class="inline w-5 h-5 mr-2 animate-spin"
      />
      Processing...
    {:else}
      Change to This Plan
    {/if}
  </button>
</div>
