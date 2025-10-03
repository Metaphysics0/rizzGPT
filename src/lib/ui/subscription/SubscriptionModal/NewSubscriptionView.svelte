<script lang="ts">
  import PayPalSubscriptionButton from "../PayPalSubscriptionButton.svelte";

  interface Props {
    planId: string;
    onSuccess: (subscriptionId: string) => void;
    onError: (error: any) => void;
    onCancel: () => void;
  }

  let { planId, onSuccess, onError, onCancel }: Props = $props();
</script>

<PayPalSubscriptionButton
  {planId}
  {onSuccess}
  {onError}
  {onCancel}
/>
