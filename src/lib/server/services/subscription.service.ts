import { db } from "../database/connection";
import { subscriptions } from "../database/schema";
import { eq, and } from "drizzle-orm";

export interface GumroadWebhookPayload {
  sale_id: string;
  product_id: string;
  product_name: string;
  price: string;
  email: string;
  full_name?: string;
  purchaser_id: string;
  subscription_id?: string;
  is_subscription_payment?: string;
  is_renewal?: string;
  cancelled?: string;
  ended?: string;
  test?: boolean;
}

export interface SubscriptionData {
  email: string;
  gumroadSaleId: string;
  productId: string;
  productName: string;
  price: string;
  purchaserEmail: string;
  purchaserName?: string;
  isSubscription: boolean;
  subscriptionId?: string;
  status: "active" | "expired" | "cancelled";
  expiresAt?: Date;
}

export class SubscriptionService {
  async createOrUpdateSubscription(
    webhookData: GumroadWebhookPayload
  ): Promise<void> {
    const subscriptionData: SubscriptionData =
      this.parseWebhookData(webhookData);

    const existing = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.gumroadSaleId, subscriptionData.gumroadSaleId))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(subscriptions)
        .set({
          status: subscriptionData.status,
          expiresAt: subscriptionData.expiresAt,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.gumroadSaleId, subscriptionData.gumroadSaleId));
    } else {
      await db.insert(subscriptions).values(subscriptionData);
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

  async cancelSubscription(saleId: string): Promise<void> {
    await db
      .update(subscriptions)
      .set({
        status: "cancelled",
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.gumroadSaleId, saleId));
  }

  private parseWebhookData(
    webhookData: GumroadWebhookPayload
  ): SubscriptionData {
    const isSubscription = webhookData.is_subscription_payment === "true";
    const isCancelled =
      webhookData.cancelled === "true" || webhookData.ended === "true";

    let status: "active" | "expired" | "cancelled" = "active";
    if (isCancelled) {
      status = "cancelled";
    }

    let expiresAt: Date | undefined;
    if (isSubscription && !isCancelled) {
      expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    }

    return {
      email: webhookData.email,
      gumroadSaleId: webhookData.sale_id,
      productId: webhookData.product_id,
      productName: webhookData.product_name,
      price: webhookData.price,
      purchaserEmail: webhookData.email,
      purchaserName: webhookData.full_name,
      isSubscription,
      subscriptionId: webhookData.subscription_id,
      status,
      expiresAt,
    };
  }
}
