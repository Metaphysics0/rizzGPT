<script lang="ts">
  import { page } from "$app/state";
  import type { PlanType, UiPlan } from "$lib/types";
  import PlanDetailsModal from "$lib/ui/subscription/PlanDetailsModal.svelte";

  const plans = page.data.plans as UiPlan[];

  let selectedPlan = $state<UiPlan | null>(null);
  let isModalOpen = $state(false);

  function openPlanModal(plan: UiPlan | null) {
    selectedPlan = plan;
    isModalOpen = true;
  }

  // Styling configuration for each plan, keyed by plan ID
  const planStyles: Record<PlanType, Record<string, any>> = {
    "the-conversationalist": {
      ctaText: "Start Your Rizz",
      ctaClasses:
        "block w-full bg-gray-900 text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors mb-6",
      cardClasses:
        "bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200",
      textClasses: "text-center",
      titleClasses: "text-2xl font-bold text-gray-900 mb-2",
      descriptionClasses: "text-gray-600 mb-4",
      priceClasses: "text-4xl font-bold text-gray-900",
      periodClasses: "text-gray-600",
      discountClasses: "text-sm text-gray-500 mt-1",
      checkIconClasses: "w-5 h-5 text-green-500 mr-3",
      mostPopular: false,
    },
    "the-date-magnet": {
      ctaText: "Get The Date Magnet",
      ctaClasses:
        "block w-full bg-white text-purple-600 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors mb-6",
      cardClasses:
        "bg-gradient-to-b from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 border-2 border-purple-600 relative transform scale-105",
      textClasses: "text-center text-white",
      titleClasses: "text-2xl font-bold mb-2",
      descriptionClasses: "text-purple-100 mb-4",
      priceClasses: "text-4xl font-bold",
      periodClasses: "text-purple-100",
      discountClasses: "text-sm text-purple-200 mt-1",
      checkIconClasses: "w-5 h-5 text-green-300 mr-3",
      mostPopular: true,
    },
    "the-rizz-master": {
      ctaText: "Become a Rizz Master",
      ctaClasses:
        "block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 mb-6",
      cardClasses:
        "bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200",
      textClasses: "text-center",
      titleClasses: "text-2xl font-bold text-gray-900 mb-2",
      descriptionClasses: "text-gray-600 mb-4",
      priceClasses: "text-4xl font-bold text-gray-900",
      periodClasses: "text-gray-600",
      discountClasses: "text-sm text-gray-500 mt-1",
      checkIconClasses: "w-5 h-5 text-green-500 mr-3",
      mostPopular: false,
    },
  };
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
        {@const style = planStyles[plan.id]}
        <div class={style.cardClasses}>
          {#if style.mostPopular}
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span
                class="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-semibold"
              >
                Most Popular
              </span>
            </div>
          {/if}
          <div class={style.textClasses}>
            <h3 class={style.titleClasses}>
              {plan.name}
            </h3>
            <p class={style.descriptionClasses}>{plan.description}</p>
            <div class="mb-6">
              <span class={style.priceClasses}>{plan.price}</span>
              <span class={style.periodClasses}>{plan.period}</span>
              {#if plan.discount}
                <p class={style.discountClasses}>{plan.discount}</p>
              {/if}
            </div>
            <button
              onclick={() => openPlanModal(plan)}
              class={style.ctaClasses}
            >
              {style.ctaText}
            </button>
            <ul class="text-left space-y-3">
              {#each plan.features as feature}
                <li class="flex items-center">
                  <svg
                    class={style.checkIconClasses}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  {feature}
                </li>
              {/each}
            </ul>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Plan Details Modal -->
<PlanDetailsModal
  open={isModalOpen}
  onOpenChange={(open) => (isModalOpen = open)}
  plan={selectedPlan}
/>
