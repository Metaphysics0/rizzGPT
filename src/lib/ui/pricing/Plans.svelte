<script lang="ts">
  import { page } from "$app/state";
  import type { UiPlan } from "$lib/types";
  import PlanDetailsModal from "$lib/ui/subscription/PlanDetailsModal.svelte";
  import PlanCard from "./PlanCard.svelte";

  const { plans } = page.data;

  const modalState = $state<{ plan: UiPlan | null; isOpen: boolean }>({
    isOpen: false,
    plan: null,
  });

  function openPlanModal(plan: UiPlan) {
    modalState.isOpen = true;
    modalState.plan = plan;
  }
</script>

<section id="pricing">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <h2 class="text-4xl font-bold text-gray-900 mb-4">
        Choose Your Path to Dating Success.
      </h2>
      <p class="text-xl text-gray-600">
        Flexible plans designed to help you get the most out of RizzGPT.
      </p>
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
/>
