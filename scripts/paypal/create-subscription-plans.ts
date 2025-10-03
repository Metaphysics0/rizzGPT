/**
 * One-time script to create PayPal products and subscription plans.
 * Run this script once to generate your plan IDs, then add them to your .env file.
 *
 * To avoid a ts import error from $lib, simply add the envs like this:
 * const { PAYPAL_CLIENT_SECRET, PAYPAL_WEBHOOK_ID, PUBLIC_PAYPAL_CLIENT_ID } = process.env;
 *
 * Run the script: NODE_ENV="dev" bun run scripts/setup-paypal-plans.ts
 *
 *
 */

import { PaypalService } from "../../src/lib/server/services/payments/paypal.service";

async function setupPayPalPlans() {
  console.log("🚀 Setting up PayPal products and plans...\n");
  try {
    // Create Product
    const product = await createProduct();
    console.log("📦 Creating product...");
    console.log(`✅ Product created: ${product.id}\n`);

    // Create Monthly Plan (The Conversationalist)
    console.log("💳 Creating monthly plan (The Conversationalist)...");
    const starterPlan = await createStarterPlan(product.id);
    console.log(`✅ Starter plan created: ${starterPlan.id}`);
    console.log(
      `   Add to .env: PUBLIC_PAYPAL_STARTER_PLAN_ID="${starterPlan.id}"\n`
    );

    // Create Yearly Plan (The Date Magnet)
    console.log("💳 Creating yearly plan (The Date Magnet)...");
    const yearlyPlan = await createYearlyPlan(product.id);
    console.log(`✅ Yearly plan created: ${yearlyPlan.id}`);
    console.log(
      `   Add to .env: PUBLIC_PAYPAL_YEARLY_PLAN_ID="${yearlyPlan.id}"\n`
    );

    // Create Premium Yearly Plan (The Rizz Master)
    console.log("💳 Creating premium yearly plan (The Rizz Master)...");
    const premiumPlan = await createPremiumPlan(product.id);
    console.log(`✅ Premium plan created: ${premiumPlan.id}`);
    console.log(
      `   Add to .env: PUBLIC_PAYPAL_PREMIUM_PLAN_ID="${premiumPlan.id}"\n`
    );

    // Summary
    console.log("\n🎉 All plans created successfully!");
    console.log("\n📝 Add these to your .env file:");
    console.log("─".repeat(80));
    console.log(`PUBLIC_PAYPAL_STARTER_PLAN_ID="${starterPlan.id}"`);
    console.log(`PUBLIC_PAYPAL_YEARLY_PLAN_ID="${yearlyPlan.id}"`);
    console.log(`PUBLIC_PAYPAL_PREMIUM_PLAN_ID="${premiumPlan.id}"`);
    console.log("─".repeat(80));
  } catch (error) {
    console.error("❌ Error setting up PayPal plans:", error);
    process.exit(1);
  }
}

async function createStarterPlan(productId: string) {
  return new PaypalService().createPlan({
    product_id: productId,
    name: "The Conversationalist - Weekly",
    description:
      "Perfect for testing the waters. $0.99 first week, then $3.99/week with 30 generations per week.",
    billing_cycles: [
      {
        frequency: {
          interval_unit: "WEEK",
          interval_count: 1,
        },
        tenure_type: "TRIAL",
        sequence: 1,
        total_cycles: 1, // Only 1 trial cycle (first week)
        pricing_scheme: {
          fixed_price: {
            value: "0.99",
            currency_code: "USD",
          },
        },
      },
      {
        frequency: {
          interval_unit: "WEEK",
          interval_count: 1,
        },
        tenure_type: "REGULAR",
        sequence: 2,
        total_cycles: 0, // 0 = infinite (continues at $3.99/week)
        pricing_scheme: {
          fixed_price: {
            value: "3.99",
            currency_code: "USD",
          },
        },
      },
    ],
    payment_preferences: {
      auto_bill_outstanding: true,
      payment_failure_threshold: 3,
    },
  });
}

async function createYearlyPlan(productId: string) {
  return new PaypalService().createPlan({
    product_id: productId,
    name: "The Date Magnet - Yearly",
    description:
      "Your ultimate advantage for consistent dates. Yearly subscription with unlimited generations.",
    billing_cycles: [
      {
        frequency: {
          interval_unit: "YEAR",
          interval_count: 1,
        },
        tenure_type: "REGULAR",
        sequence: 1,
        total_cycles: 0, // 0 = infinite
        pricing_scheme: {
          fixed_price: {
            value: "69.99",
            currency_code: "USD",
          },
        },
      },
    ],
    payment_preferences: {
      auto_bill_outstanding: true,
      payment_failure_threshold: 3,
    },
  });
}

async function createPremiumPlan(productId: string) {
  return new PaypalService().createPlan({
    product_id: productId,
    name: "The Rizz Master - Premium Yearly",
    description:
      "Accelerate your journey to becoming a dating pro. Includes coaching and exclusive content.",
    billing_cycles: [
      {
        frequency: {
          interval_unit: "YEAR",
          interval_count: 1,
        },
        tenure_type: "REGULAR",
        sequence: 1,
        total_cycles: 0, // 0 = infinite
        pricing_scheme: {
          fixed_price: {
            value: "149.99",
            currency_code: "USD",
          },
        },
      },
    ],
    payment_preferences: {
      auto_bill_outstanding: true,
      payment_failure_threshold: 3,
    },
  });
}

async function createProduct() {
  return new PaypalService().createProduct(
    "RizzGPT Premium",
    "AI-powered dating assistance and conversation generation",
    "SERVICE"
  );
}

setupPayPalPlans();
