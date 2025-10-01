# Migration Plan: Gumroad → PayPal Subscriptions

**Date**: October 1, 2025
**Status**: Pre-Production (Safe to remove Gumroad code)

## Overview

Complete migration from Gumroad to PayPal for subscription management. Since the app is not in production, we will completely remove Gumroad-related code and replace it with PayPal integration.

---

## Phase 1: Database Schema Changes

### 1.1 Update Subscriptions Table

**File**: `src/lib/server/database/schema/index.ts`

**Changes**:
- Remove `gumroadSaleId` field (was unique, not null)
- Add `paypalSubscriptionId` field (text, unique)
- Add `paypalPlanId` field (text)
- Add `provider` field (enum: "paypal") - for future extensibility
- Keep common fields: `productId`, `productName`, `price`, `status`, `purchaserEmail`, etc.

**Migration SQL** (to be generated):
```sql
ALTER TABLE subscription
  DROP COLUMN gumroad_sale_id,
  ADD COLUMN provider TEXT NOT NULL DEFAULT 'paypal',
  ADD COLUMN paypal_subscription_id TEXT UNIQUE,
  ADD COLUMN paypal_plan_id TEXT;
```

### 1.2 Clean Up Existing Data
- Truncate/delete existing subscription records (safe since not in production)
- No data migration needed

---

## Phase 2: Remove Gumroad Code

### 2.1 Delete Gumroad Service Files
- ❌ Delete: `src/lib/server/services/payments/gumroad.service.ts`
- ❌ Delete: `src/lib/server/services/payments/gumroad.types.ts`

### 2.2 Delete Gumroad Webhook Handler
- ❌ Delete: `src/routes/api/webhooks/gumroad/+server.ts`

### 2.3 Delete Gumroad Cron Job
- ❌ Delete: `src/routes/api/cron/subscriptions-poll/+server.ts`

### 2.4 Update SubscriptionService
**File**: `src/lib/server/services/subscription.service.ts`

**Remove**:
- Import of `GumroadService`
- `syncSubscriptionsFromGumroad()` method
- `syncSubscriber()` method
- `createSubscriptionFromGumroad()` method
- `updateSubscriptionFromGumroad()` method
- `mapGumroadStatusToDbStatus()` method
- `getExpirationDate()` method

**Keep**:
- `createOrUpdateSubscription()` - adapt for PayPal
- `getActiveSubscription()`
- `getUserSubscriptions()`
- `cancelSubscription()` - adapt for PayPal

### 2.5 Update Environment Variables
**File**: `.env`

**Remove**:
```
GUMROAD_ACCESS_TOKEN
GUMROAD_PRODUCT_ID
```

**Verify Exist**:
```
PAYPAL_CLIENT_ID
PAYPAL_CLIENT_SECRET
PAYPAL_CLIENT_ID_DEV (sandbox)
PAYPAL_CLIENT_SECRET_DEV (sandbox)
```

---

## Phase 3: Implement PayPal Service Layer

### 3.1 Complete PayPal Service
**File**: `src/lib/server/services/payments/paypal.service.ts` (already started)

**Add Methods**:

1. **`createProduct()`** - Create PayPal product
   - Endpoint: `POST /v1/catalogs/products`
   - Required: name, description, type, category

2. **`createPlan()`** - Create subscription plan
   - Endpoint: `POST /v1/billing/plans`
   - Required: product_id, name, billing_cycles, payment_preferences

3. **`createSubscription()`** - Create subscription for user
   - Endpoint: `POST /v1/billing/subscriptions`
   - Required: plan_id, subscriber info

4. **`getSubscription()`** - Fetch subscription details
   - Endpoint: `GET /v1/billing/subscriptions/{subscription_id}`

5. **`cancelSubscription()`** - Cancel subscription
   - Endpoint: `POST /v1/billing/subscriptions/{subscription_id}/cancel`

6. **`verifyWebhookSignature()`** - Validate webhook authenticity
   - Endpoint: `POST /v1/notifications/verify-webhook-signature`

### 3.2 Complete PayPal Types
**File**: `src/lib/server/services/payments/paypal.types.ts` (already started)

**Add Interfaces**:
- `PayPalProduct`
- `PayPalPlan`
- `PayPalSubscription`
- `PayPalSubscriptionDetails`
- `PayPalWebhookEvent`
- `PayPalBillingCycle`
- `PayPalPaymentPreferences`

---

## Phase 4: Create PayPal Webhook Handler

### 4.1 Create Webhook Endpoint
**File**: `src/routes/api/webhooks/paypal/+server.ts` (new)

**Handle Events**:
1. **`BILLING.SUBSCRIPTION.ACTIVATED`**
   - Action: Create subscription record with status "active"
   - Set expiresAt based on billing cycle

2. **`BILLING.SUBSCRIPTION.CANCELLED`**
   - Action: Update status to "cancelled"
   - Keep expiresAt for grace period

3. **`BILLING.SUBSCRIPTION.EXPIRED`**
   - Action: Update status to "expired"
   - Update expiresAt

4. **`BILLING.SUBSCRIPTION.UPDATED`**
   - Action: Sync subscription details
   - Update plan_id if changed

5. **`PAYMENT.SALE.COMPLETED`**
   - Action: Extend expiresAt for recurring payment
   - Confirm subscription is "active"

**Security**:
- Verify webhook signature using PayPal API
- Validate webhook origin
- Return 200 for successful processing

---

## Phase 5: Update Subscription Service

### 5.1 Refactor SubscriptionService
**File**: `src/lib/server/services/subscription.service.ts`

**Update Methods**:

1. **`createOrUpdateSubscription()`**
   - Accept PayPal subscription data
   - Map PayPal fields to database schema
   - Remove gumroadSaleId references

2. **`cancelSubscription()`**
   - Call `PayPalService.cancelSubscription()`
   - Update database status

3. **New: `createPayPalSubscription()`**
   - Accept: planId, userEmail, userName
   - Call PayPal API to create subscription
   - Return subscription approval URL

**Update Interface**:
```typescript
interface SubscriptionData {
  email: string;
  provider: "paypal";
  paypalSubscriptionId: string;
  paypalPlanId: string;
  productId: string;
  productName: string;
  price: string;
  purchaserEmail: string;
  purchaserName?: string;
  isSubscription: boolean;
  status: "active" | "expired" | "cancelled";
  expiresAt?: Date;
}
```

---

## Phase 6: Create Server Endpoints

### 6.1 Create Subscription Endpoint
**File**: `src/routes/api/subscriptions/create/+server.ts` (new)

**Purpose**: Server-side subscription creation

**Flow**:
1. Validate user session
2. Call `PayPalService.createSubscription()`
3. Return approval URL to frontend
4. Frontend redirects user to PayPal

### 6.2 Create Subscription Success Handler
**File**: `src/routes/api/subscriptions/success/+server.ts` (new)

**Purpose**: Handle return from PayPal after approval

**Flow**:
1. Receive subscription_id from query params
2. Fetch subscription details from PayPal
3. Create/update subscription in database
4. Redirect user to success page

---

## Phase 7: Update Frontend UI

### 7.1 Update SubscribeToProCard
**File**: `src/lib/ui/subscription/SubscribeToProCard.svelte`

**Changes**:
- Remove Gumroad URL constant
- Update `handleUpgrade()` to call `/api/subscriptions/create`
- Redirect to PayPal approval URL on success
- Update text: "Secure payment via PayPal" (instead of Gumroad)

**Alternative Approach** (Client-Side SDK):
- Add PayPal JavaScript SDK to app.html
- Render PayPal subscription button directly
- Handle approve/error callbacks

### 7.2 Create PayPal Button Component (Optional)
**File**: `src/lib/ui/subscription/PayPalSubscriptionButton.svelte` (new)

**Features**:
- Load PayPal SDK
- Render subscription button
- Handle subscription flow
- Show loading/error states

### 7.3 Update Success/Cancel Pages
- Create subscription success page
- Create subscription cancel page
- Show appropriate messaging

---

## Phase 8: PayPal Setup (Manual Steps)

### 8.1 Create PayPal Product & Plan

**Via API or Dashboard**:
1. Create Product:
   - Name: "RizzGPT Pro"
   - Type: "SERVICE"
   - Category: "SOFTWARE"

2. Create Plan:
   - Product ID: (from step 1)
   - Name: "RizzGPT Pro Monthly"
   - Billing Cycle: Monthly
   - Price: $14.99 USD
   - Payment Preferences:
     - Auto-bill outstanding amount: YES
     - Setup fee: $0
     - Payment failure threshold: 3

3. Save Plan ID to environment variables:
   ```
   PAYPAL_PLAN_ID=P-XXXXXXXXXXXXX
   PAYPAL_PLAN_ID_DEV=P-XXXXXXXXXXXXX (sandbox)
   ```

### 8.2 Configure Webhooks in PayPal Dashboard

1. Go to: https://developer.paypal.com/dashboard/webhooks
2. Create webhook with URL: `https://yourdomain.com/api/webhooks/paypal`
3. Subscribe to events:
   - `BILLING.SUBSCRIPTION.ACTIVATED`
   - `BILLING.SUBSCRIPTION.CANCELLED`
   - `BILLING.SUBSCRIPTION.EXPIRED`
   - `BILLING.SUBSCRIPTION.UPDATED`
   - `PAYMENT.SALE.COMPLETED`

4. Save webhook ID to environment:
   ```
   PAYPAL_WEBHOOK_ID=WH-XXXXXXXXXXXXX
   ```

---

## Phase 9: Testing

### 9.1 Sandbox Testing
1. Use PayPal sandbox accounts
2. Test subscription creation flow
3. Test webhook events (use simulator)
4. Test subscription cancellation
5. Verify database updates

### 9.2 Webhook Testing
- Use PayPal webhook simulator
- Test each event type
- Verify database updates
- Check error handling

### 9.3 E2E Testing
1. User clicks "Upgrade to Pro"
2. Redirected to PayPal
3. Complete payment with sandbox account
4. Redirected back to app
5. Verify subscription is active
6. Test feature access (unlimited responses)

---

## Phase 10: Deployment Checklist

- [ ] Run database migrations
- [ ] Set production environment variables
- [ ] Create production PayPal product & plan
- [ ] Configure production webhook
- [ ] Deploy code changes
- [ ] Verify webhook endpoint is accessible
- [ ] Test with real PayPal sandbox account
- [ ] Monitor logs for errors
- [ ] Update README.md to reflect PayPal

---

## Files to Modify

### Delete (3 files)
- `src/lib/server/services/payments/gumroad.service.ts`
- `src/lib/server/services/payments/gumroad.types.ts`
- `src/routes/api/webhooks/gumroad/+server.ts`
- `src/routes/api/cron/subscriptions-poll/+server.ts`

### Modify (4 files)
- `src/lib/server/database/schema/index.ts`
- `src/lib/server/services/subscription.service.ts`
- `src/lib/ui/subscription/SubscribeToProCard.svelte`
- `README.md`

### Create (6 files)
- `src/routes/api/webhooks/paypal/+server.ts`
- `src/routes/api/subscriptions/create/+server.ts`
- `src/routes/api/subscriptions/success/+server.ts`
- `src/lib/ui/subscription/PayPalSubscriptionButton.svelte` (optional)
- `src/routes/subscriptions/success/+page.svelte` (optional)
- `src/routes/subscriptions/cancelled/+page.svelte` (optional)

### Complete (2 files)
- `src/lib/server/services/payments/paypal.service.ts` (already started)
- `src/lib/server/services/payments/paypal.types.ts` (already started)

---

## Technical Decisions

### Why Remove Gumroad Entirely?
- App not in production
- Simpler codebase
- No migration of existing subscribers needed
- Cleaner implementation

### PayPal Flow Choice
**Option A: Server-Side Flow** (Recommended)
- Server creates subscription
- Returns approval URL
- User redirects to PayPal
- Returns to success handler

**Option B: Client-Side SDK**
- Load PayPal JS SDK
- Render button in client
- Handle in-page flow
- More seamless UX

**Recommendation**: Start with Option A for better control, can add Option B later.

### Database Design
- Keep provider field for potential future providers
- Use nullable PayPal fields for flexibility
- Maintain common fields for consistency

---

## Post-Migration Tasks

1. Update documentation
2. Remove Gumroad from README
3. Update environment setup docs
4. Test subscription flow thoroughly
5. Monitor webhook events in production
6. Set up alerting for failed payments
7. Consider adding subscription management page for users

---

## Rollback Plan

Since not in production:
- Revert to Gumroad code from git
- Restore database schema
- Reconfigure Gumroad webhook

If needed, maintain feature branch until confident in PayPal migration.

---

## Resources

- [PayPal Subscriptions API](https://developer.paypal.com/docs/subscriptions/)
- [PayPal Webhooks](https://developer.paypal.com/api/rest/webhooks/)
- [PayPal JavaScript SDK](https://developer.paypal.com/sdk/js/)
- [PayPal Sandbox Testing](https://developer.paypal.com/tools/sandbox/)

---

## Questions/Decisions Needed

1. ✅ Do we need to support both Gumroad and PayPal? **No - remove Gumroad**
2. ❓ Which frontend integration approach? (Server-side vs Client SDK)
3. ❓ Do we need subscription management page for users?
4. ❓ Should we add email notifications for subscription events?
5. ❓ Do we want to add trial period support?
