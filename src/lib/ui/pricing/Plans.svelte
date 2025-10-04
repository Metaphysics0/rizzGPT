<script lang="ts">
  import { page } from "$app/state";
  import type { UiPlan } from "$lib/types";
  import PlanDetailsModal from "$lib/ui/subscription/PlanDetailsModal.svelte";
  import PlanCard from "./PlanCard.svelte";

  const { plans, user } = page.data;

  function isUserSubscribedToPlan(planId: string): boolean {
    if (!user) return false;
    const activeSubscriptions = user.subscriptions.filter(
      (s) => s.status === "active"
    );
    if (!activeSubscriptions.length) return false;

    return !!activeSubscriptions.find((s) => s.paypalPlanId === planId);
  }

  const modalState = $state<{
    plan: UiPlan | null;
    isOpen: boolean;
    isCurrentPlan: boolean;
  }>({
    isOpen: false,
    plan: null,
    isCurrentPlan: false,
  });

  function openPlanModal(plan: UiPlan) {
    modalState.isOpen = true;
    modalState.plan = plan;
    modalState.isCurrentPlan = !!user && isUserSubscribedToPlan(plan.planId);
  }
</script>

<section id="pricing">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <h2 class="text-4xl font-bold text-gray-900 mb-4">
        Choose Your Path to Dating Success.
      </h2>
      <p class="text-xl text-gray-600">No commitments. Cancel at any time.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      {#each plans as plan}
        <PlanCard {plan} onClick={() => openPlanModal(plan)} />
      {/each}
    </div>
  </div>
</section>

<PlanDetailsModal
  open={modalState.isOpen}
  onOpenChange={(isOpen) => (modalState.isOpen = isOpen)}
  plan={modalState.plan}
  isCurrentPlan={modalState.isCurrentPlan}
/>
