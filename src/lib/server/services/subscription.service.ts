import { db } from "../database/connection";
import { subscriptions, users } from "../database/schema";
import { eq, and } from "drizzle-orm";
import { PaypalService } from "./payments/paypal.service";
import type { PayPalSubscription } from "./payments/paypal.types";

export interface SubscriptionData {
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

export class SubscriptionService {
  private paypalService = new PaypalService();

  async createOrUpdateSubscription(
    subscriptionData: SubscriptionData
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
    // Cancel in PayPal first
    await this.paypalService.cancelSubscription(paypalSubscriptionId, reason);

    // Update database
    await db
      .update(subscriptions)
      .set({
        status: "cancelled",
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.paypalSubscriptionId, paypalSubscriptionId));
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

    // If subscription is active but no next billing time, set to 1 month from now
    if (paypalSubscription.status === "ACTIVE") {
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);
      return expiresAt;
    }

    return undefined;
  }
}
