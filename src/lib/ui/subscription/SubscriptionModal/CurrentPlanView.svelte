<script lang="ts">
  import Icon from "@iconify/svelte";

  interface Props {
    planName: string;
  }

  let { planName }: Props = $props();
</script>

<div class="space-y-4">
  <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
    <div class="flex items-center gap-3">
      <Icon icon="mingcute:check-circle-fill" class="w-6 h-6 text-green-600" />
      <div>
        <p class="font-medium text-green-900">You're subscribed to this plan</p>
        <p class="text-sm text-green-700">This is your active subscription</p>
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
