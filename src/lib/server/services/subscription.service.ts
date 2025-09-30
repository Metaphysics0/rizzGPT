import { db } from "../database/connection";
import { subscriptions, users } from "../database/schema";
import { eq, and } from "drizzle-orm";
import { GumroadService } from "./payments/gumroad.service";
import type { GumroadSubscriber } from "./payments/gumroad.types";

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

export interface SyncResult {
  success: boolean;
  insertedCount: number;
  updatedCount: number;
  error?: string;
}

export class SubscriptionService {
  private gumroadService = new GumroadService();

  async syncSubscriptionsFromGumroad(): Promise<SyncResult> {
    const subscribersResponse =
      await this.gumroadService.getAllActiveSubscribers();

    if (!subscribersResponse?.success) {
      return {
        success: false,
        insertedCount: 0,
        updatedCount: 0,
        error: "Failed to fetch subscribers from Gumroad",
      };
    }

    const results = await Promise.all(
      subscribersResponse.subscribers.map((subscriber) =>
        this.syncSubscriber(subscriber)
      )
    );

    return {
      success: true,
      insertedCount: results.filter((r) => r.isNew).length,
      updatedCount: results.filter((r) => r.wasUpdated).length,
    };
  }

  private async syncSubscriber(subscriber: GumroadSubscriber) {
    const existing = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.subscriptionId, subscriber.id),
    });

    if (!existing) {
      await this.createSubscriptionFromGumroad(subscriber);
      return { isNew: true, wasUpdated: false };
    }

    const wasUpdated = await this.updateSubscriptionFromGumroad(
      existing,
      subscriber
    );
    return { isNew: false, wasUpdated };
  }

  private async createSubscriptionFromGumroad(subscriber: GumroadSubscriber) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, subscriber.email),
    });

    const status = this.mapGumroadStatusToDbStatus(subscriber.status);
    const expiresAt = this.getExpirationDate(subscriber);

    await db.insert(subscriptions).values({
      userId: user?.id ?? null,
      email: subscriber.email,
      gumroadSaleId: subscriber.purchase_ids[0] || subscriber.id,
      productId: subscriber.product_id,
      productName: subscriber.product_name,
      price: "0",
      status,
      purchaserEmail: subscriber.email,
      purchaserName: null,
      isSubscription: true,
      subscriptionId: subscriber.id,
      expiresAt,
    });
  }

  private async updateSubscriptionFromGumroad(
    existing: any,
    subscriber: GumroadSubscriber
  ) {
    const newStatus = this.mapGumroadStatusToDbStatus(subscriber.status);
    const newExpiresAt = this.getExpirationDate(subscriber);

    const hasChanges =
      existing.status !== newStatus ||
      existing.expiresAt?.toISOString() !== newExpiresAt?.toISOString();

    if (!hasChanges) {
      return false;
    }

    await db
      .update(subscriptions)
      .set({
        status: newStatus,
        expiresAt: newExpiresAt,
      })
      .where(eq(subscriptions.id, existing.id));

    return true;
  }

  private mapGumroadStatusToDbStatus(
    gumroadStatus: string
  ): "active" | "expired" | "cancelled" {
    switch (gumroadStatus) {
      case "alive":
        return "active";
      case "pending_cancellation":
        return "cancelled";
      default:
        return "expired";
    }
  }

  private getExpirationDate(subscriber: GumroadSubscriber): Date | null {
    if (subscriber.ended_at) {
      return new Date(subscriber.ended_at);
    }
    if (subscriber.cancelled_at) {
      return new Date(subscriber.cancelled_at);
    }
    return null;
  }

  async createOrUpdateSubscription(
    subscriptionData: SubscriptionData
  ): Promise<void> {
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
}
