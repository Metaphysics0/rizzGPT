/**
 * One-time script to create PayPal products and subscription plans.
 * Run this script once to generate your plan IDs, then add them to your .env file.
 *
 * Usage: bun run scripts/setup-paypal-plans.ts
 */

import { PaypalService } from '../src/lib/server/services/payments/paypal.service';

async function setupPayPalPlans() {
  console.log('🚀 Setting up PayPal products and plans...\n');

  const paypalService = new PaypalService();

  try {
    // Create Product
    console.log('📦 Creating product...');
    const product = await paypalService.createProduct(
      'RizzGPT Premium',
      'AI-powered dating assistance and conversation generation',
      'SERVICE'
    );
    console.log(`✅ Product created: ${product.id}\n`);

    // Create Monthly Plan (The Conversationalist)
    console.log('💳 Creating monthly plan (The Conversationalist)...');
    const monthlyPlan = await paypalService.createPlan({
      product_id: product.id,
      name: 'The Conversationalist - Monthly',
      description: 'Perfect for testing the waters. Monthly subscription with 30 generations per week.',
      billing_cycles: [
        {
          frequency: {
            interval_unit: 'MONTH',
            interval_count: 1,
          },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 0, // 0 = infinite
          pricing_scheme: {
            fixed_price: {
              value: '14.99',
              currency_code: 'USD',
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        payment_failure_threshold: 3,
      },
    });
    console.log(`✅ Monthly plan created: ${monthlyPlan.id}`);
    console.log(`   Add to .env: PUBLIC_PAYPAL_MONTHLY_PLAN_ID="${monthlyPlan.id}"\n`);

    // Create Yearly Plan (The Date Magnet)
    console.log('💳 Creating yearly plan (The Date Magnet)...');
    const yearlyPlan = await paypalService.createPlan({
      product_id: product.id,
      name: 'The Date Magnet - Yearly',
      description: 'Your ultimate advantage for consistent dates. Yearly subscription with unlimited generations.',
      billing_cycles: [
        {
          frequency: {
            interval_unit: 'YEAR',
            interval_count: 1,
          },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 0, // 0 = infinite
          pricing_scheme: {
            fixed_price: {
              value: '69.99',
              currency_code: 'USD',
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        payment_failure_threshold: 3,
      },
    });
    console.log(`✅ Yearly plan created: ${yearlyPlan.id}`);
    console.log(`   Add to .env: PUBLIC_PAYPAL_YEARLY_PLAN_ID="${yearlyPlan.id}"\n`);

    // Create Premium Yearly Plan (The Rizz Master)
    console.log('💳 Creating premium yearly plan (The Rizz Master)...');
    const premiumPlan = await paypalService.createPlan({
      product_id: product.id,
      name: 'The Rizz Master - Premium Yearly',
      description: 'Accelerate your journey to becoming a dating pro. Includes coaching and exclusive content.',
      billing_cycles: [
        {
          frequency: {
            interval_unit: 'YEAR',
            interval_count: 1,
          },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 0, // 0 = infinite
          pricing_scheme: {
            fixed_price: {
              value: '149.99',
              currency_code: 'USD',
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        payment_failure_threshold: 3,
      },
    });
    console.log(`✅ Premium plan created: ${premiumPlan.id}`);
    console.log(`   Add to .env: PUBLIC_PAYPAL_PREMIUM_PLAN_ID="${premiumPlan.id}"\n`);

    // Summary
    console.log('\n🎉 All plans created successfully!');
    console.log('\n📝 Add these to your .env file:');
    console.log('─'.repeat(80));
    console.log(`PUBLIC_PAYPAL_MONTHLY_PLAN_ID="${monthlyPlan.id}"`);
    console.log(`PUBLIC_PAYPAL_YEARLY_PLAN_ID="${yearlyPlan.id}"`);
    console.log(`PUBLIC_PAYPAL_PREMIUM_PLAN_ID="${premiumPlan.id}"`);
    console.log('─'.repeat(80));

  } catch (error) {
    console.error('❌ Error setting up PayPal plans:', error);
    process.exit(1);
  }
}

setupPayPalPlans();
