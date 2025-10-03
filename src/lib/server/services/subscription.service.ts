import { db } from "../database/connection";
import { subscriptions, users } from "../database/schema";
import { eq, and } from "drizzle-orm";
import { PaypalService } from "./payments/paypal.service";
import type {
  CreateOrUpdateSubscriptionParams,
  PayPalSubscription,
} from "./payments/paypal.types";
import { getPlans } from "../utils/plans.util";
import type { UiPlan } from "$lib/types";

export class SubscriptionService {
  private paypalService = new PaypalService();

  async createOrUpdateSubscription(
    subscriptionData: CreateOrUpdateSubscriptionParams
  ): Promise<void> {
    const user = await db.query.users.findFirst({
      where: eq(users.email, subscriptionData.email),
    });

    const existing = await db
      .select()
      .from(subscriptions)
      .where(
        eq(
          subscriptions.paypalSubscriptionId,
          subscriptionData.paypalSubscriptionId
        )
      )
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(subscriptions)
        .set({
          status: subscriptionData.status,
          expiresAt: subscriptionData.expiresAt,
          paypalPlanId: subscriptionData.paypalPlanId,
          updatedAt: new Date(),
        })
        .where(
          eq(
            subscriptions.paypalSubscriptionId,
            subscriptionData.paypalSubscriptionId
          )
        );
    } else {
      await db.insert(subscriptions).values({
        ...subscriptionData,
        userId: user?.id ?? null,
      });
    }
  }

  async getActiveSubscription(email: string) {
    return await db
      .select()
      .from(subscriptions)
      .where(
        and(eq(subscriptions.email, email), eq(subscriptions.status, "active"))
      )
      .limit(1)
      .then((results) => results[0] || null);
  }

  async getUserSubscriptions(email: string) {
    return await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.email, email));
  }

  async cancelSubscription(
    paypalSubscriptionId: string,
    reason?: string
  ): Promise<void> {
    await this.paypalService.cancelSubscription(paypalSubscriptionId, reason);

    await db
      .update(subscriptions)
      .set({
        status: "cancelled",
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.paypalSubscriptionId, paypalSubscriptionId));
  }

  async reviseSubscription(params: {
    userId: string;
    newPlanId: string;
    returnUrl: string;
    cancelUrl: string;
  }): Promise<{ approvalUrl: string; subscriptionId: string }> {
    const activeSubscription = await this.getActiveSubscriptionByUserId(
      params.userId
    );

    if (!activeSubscription) {
      throw new Error("No active subscription found");
    }

    if (!activeSubscription.paypalSubscriptionId) {
      throw new Error("Invalid subscription: missing PayPal ID");
    }

    if (activeSubscription.paypalPlanId === params.newPlanId) {
      throw new Error("Already subscribed to this plan");
    }

    const subscriptionId = activeSubscription.paypalSubscriptionId;
    const returnUrlWithParams = `${params.returnUrl}?subscription_id=${subscriptionId}&new_plan_id=${params.newPlanId}`;

    const revision = await this.paypalService.reviseSubscription({
      subscriptionId,
      newPlanId: params.newPlanId,
      returnUrl: returnUrlWithParams,
      cancelUrl: params.cancelUrl,
    });

    const approvalUrl = this.paypalService.getApprovalUrl(revision);

    if (!approvalUrl) {
      throw new Error("No approval URL received from PayPal");
    }

    return {
      approvalUrl,
      subscriptionId,
    };
  }

  async handleRevisionApproval(params: {
    subscriptionId: string;
    newPlanId: string;
  }): Promise<void> {
    const paypalSubscription = await this.paypalService.getSubscription(
      params.subscriptionId
    );

    if (paypalSubscription.plan_id !== params.newPlanId) {
      throw new Error(
        `Plan mismatch: expected ${params.newPlanId}, got ${paypalSubscription.plan_id}`
      );
    }

    const plan = this.getPlanById(params.newPlanId);

    await db
      .update(subscriptions)
      .set({
        paypalPlanId: params.newPlanId,
        productName: plan.name,
        price: plan.price,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.paypalSubscriptionId, params.subscriptionId));
  }

  async syncFromPayPalWebhook(
    paypalSubscription: PayPalSubscription
  ): Promise<void> {
    const status = this.mapPayPalStatusToDbStatus(paypalSubscription.status);
    const expiresAt = this.calculateExpirationDate(paypalSubscription);

    const subscriberEmail = paypalSubscription.subscriber?.email_address || "";
    const subscriberName = paypalSubscription.subscriber?.name
      ? `${paypalSubscription.subscriber.name.given_name} ${paypalSubscription.subscriber.name.surname}`
      : undefined;

    await this.createOrUpdateSubscription({
      email: subscriberEmail,
      provider: "paypal",
      paypalSubscriptionId: paypalSubscription.id,
      paypalPlanId: paypalSubscription.plan_id,
      productId: paypalSubscription.plan_id,
      productName: "RizzGPT Pro",
      price: "14.99",
      purchaserEmail: subscriberEmail,
      purchaserName: subscriberName,
      isSubscription: true,
      status,
      expiresAt,
    });
  }

  private async getActiveSubscriptionByUserId(userId: string) {
    const results = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, userId),
          eq(subscriptions.status, "active")
        )
      )
      .limit(1);

    return results[0] || null;
  }

  private getPlanById(planId: string): UiPlan {
    const plans = getPlans();
    const plan = plans.find((p) => p.planId === planId);

    if (!plan) {
      throw new Error(`Unknown plan ID: ${planId}`);
    }

    return plan;
  }

  private mapPayPalStatusToDbStatus(
    paypalStatus: PayPalSubscription["status"]
  ): "active" | "expired" | "cancelled" {
    switch (paypalStatus) {
      case "ACTIVE":
      case "APPROVED":
        return "active";
      case "CANCELLED":
      case "SUSPENDED":
        return "cancelled";
      case "EXPIRED":
        return "expired";
      default:
        return "expired";
    }
  }

  private calculateExpirationDate(
    paypalSubscription: PayPalSubscription
  ): Date | undefined {
    if (paypalSubscription.billing_info?.next_billing_time) {
      return new Date(paypalSubscription.billing_info.next_billing_time);
    }

    if (paypalSubscription.status === "ACTIVE") {
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);
      return expiresAt;
    }

    return undefined;
  }
}
