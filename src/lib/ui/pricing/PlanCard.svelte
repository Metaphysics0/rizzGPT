<script lang="ts">
  import { page } from "$app/state";
  import type { PlanType, UiPlan } from "$lib/types";
  import { cn } from "$lib/utils";

  let { plan, onClick }: { plan: UiPlan; onClick: (e: Event) => any } =
    $props();

  const { user } = page.data;

  const isUserSubscribedToPlan = $derived(() => {
    if (!user?.subscriptions) return false;

    return !!user.subscriptions.find(
      (s) => s.status === "active" && s.paypalPlanId === plan.planId
    );
  });

  const starterPlanStyles = {
    buttonText: "Start Your Rizz",
    buttonClass:
      "block w-full bg-gray-900 text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors mb-6",
    cardClasses: "bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200",
    textClasses: "text-center",
    titleClasses: "text-2xl font-bold text-gray-900 mb-2",
    descriptionClasses: "text-gray-600 mb-4",
    priceClasses: "text-4xl font-bold text-gray-900",
    periodClasses: "text-gray-600",
    discountClasses: "text-sm text-gray-500 mt-1",
    checkIconClasses: "w-5 h-5 text-green-500 mr-3",
    mostPopular: false,
  };
  const yearlyPlanStyles = {
    buttonText: "Get The Date Magnet",
    buttonClass:
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
  };
  const premiumPlanStyles = {
    buttonText: "Become a Rizz Master",
    buttonClass:
      "block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 mb-6",
    cardClasses: "bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200",
    textClasses: "text-center",
    titleClasses: "text-2xl font-bold text-gray-900 mb-2",
    descriptionClasses: "text-gray-600 mb-4",
    priceClasses: "text-4xl font-bold text-gray-900",
    periodClasses: "text-gray-600",
    discountClasses: "text-sm text-gray-500 mt-1",
    checkIconClasses: "w-5 h-5 text-green-500 mr-3",
    mostPopular: false,
  };

  const planStyleMap: Record<PlanType, Record<string, any>> = {
    "the-conversationalist": starterPlanStyles,
    "the-date-magnet": yearlyPlanStyles,
    "the-rizz-master": premiumPlanStyles,
  } as const;

  const style = $derived(planStyleMap[plan.uiPlanId]);
</script>

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
    <button onclick={onClick} class={cn(style.buttonClass, "cursor-pointer")}>
      {style.buttonText}
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
