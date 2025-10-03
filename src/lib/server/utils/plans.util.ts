import {
  PUBLIC_PAYPAL_STARTER_PLAN_ID,
  PUBLIC_PAYPAL_YEARLY_PLAN_ID,
  PUBLIC_PAYPAL_PREMIUM_PLAN_ID,
} from "$env/static/public";
import type { UiPlan } from "$lib/types";

export function getPlans(): UiPlan[] {
  return [
    {
      id: "the-conversationalist",
      name: "The Conversationalist",
      description: "Perfect for testing the waters.",
      planId: PUBLIC_PAYPAL_STARTER_PLAN_ID,
      price: "$3.99",
      period: "/week",
      features: [
        "Higher quality LLM model",
        "30 generations per week",
        "Ability to regenerate responses",
        "History and profile pages",
      ],
    },
    {
      id: "the-date-magnet",
      name: "The Date Magnet",
      description: "Your ultimate advantage for consistent dates.",
      planId: PUBLIC_PAYPAL_YEARLY_PLAN_ID,
      price: "$69.99",
      period: "/year",
      discount: "Save 60% vs. monthly!",
      features: [
        "Everything in The Conversationalist",
        "Unlimited AI-generated messages",
        "Priority customer support",
        "Access to new premium features first",
        "AI Profile Analyzer",
      ],
    },
    {
      id: "the-rizz-master",
      name: "The Rizz Master",
      description: "Accelerate your journey to becoming a dating pro.",
      planId: PUBLIC_PAYPAL_PREMIUM_PLAN_ID,
      price: "$149.99",
      period: "/year",
      discount: "Over $500 in value!",
      features: [
        "Everything in The Date Magnet",
        "Personalized dating profile review",
        "1-on-1 Coaching Call (30 min)",
        'Exclusive "Mastering Rizz" content',
      ],
    },
  ];
}
