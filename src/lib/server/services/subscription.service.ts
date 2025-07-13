import { and, eq, sql } from "drizzle-orm";
import { db } from "../database/connection";
import { subscriptions, usageEvents } from "../database/schema";
import type { Subscription } from "../database/types";

export type SubscriptionPlan =
  | "free_trial"
  | "conversationalist"
  | "date_magnet"
  | "rizz_master";

export interface SubscriptionPlanConfig {
  name: SubscriptionPlan;
  conversationLimit: number;
  displayName: string;
  price?: string;
  billingCycle?: "weekly" | "yearly";
}

export class SubscriptionService {
  private readonly planConfigs: Record<
    SubscriptionPlan,
    SubscriptionPlanConfig
  > = {
    free_trial: {
      name: "free_trial",
      conversationLimit: 3,
      price: "$0.00",
      displayName: "Free Trial",
    },
    conversationalist: {
      name: "conversationalist",
      conversationLimit: 30, // 30 messages per week
      displayName: "The Conversationalist",
      price: "$0.99",
      billingCycle: "weekly",
    },
    date_magnet: {
      name: "date_magnet",
      conversationLimit: -1, // Unlimited
      displayName: "The Date Magnet",
      price: "$69.99",
      billingCycle: "yearly",
    },
    rizz_master: {
      name: "rizz_master",
      conversationLimit: -1, // Unlimited
      displayName: "The Rizz Master",
      price: "$149.99",
      billingCycle: "yearly",
    },
  };

  /**
   * Create a free trial subscription for a new user
   */
  async createFreeTrialSubscription(userId: string): Promise<string> {
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 7); // 7 days trial

    const [subscription] = await db
      .insert(subscriptions)
      .values({
        userId,
        planName: "free_trial",
        status: "active",
        conversationLimit: this.planConfigs.free_trial.conversationLimit,
        conversationsUsed: 0,
        trialEndsAt,
        isActive: true,
        currentPeriodStart: new Date(),
        currentPeriodEnd: trialEndsAt,
      })
      .returning();

    return subscription.id;
  }

  /**
   * Get user's current active subscription
   */
  async getUserSubscription(userId: string) {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(
        and(eq(subscriptions.userId, userId), eq(subscriptions.isActive, true))
      )
      .limit(1);

    return subscription;
  }

  /**
   * Check if user can generate a conversation (hasn't reached limit)
   */
  async canGenerateConversation(userId: string): Promise<{
    allowed: boolean;
    subscription: any;
    reason?: string;
  }> {
    const subscription = await this.getUserSubscription(userId);

    if (!subscription) {
      return {
        allowed: false,
        subscription: null,
        reason: "No active subscription found",
      };
    }

    // Check if subscription is expired
    if (subscription.status !== "active") {
      return {
        allowed: false,
        subscription,
        reason: "Subscription is not active",
      };
    }

    // Check if trial has expired
    if (
      subscription.planName === "free_trial" &&
      subscription.trialEndsAt &&
      new Date() > subscription.trialEndsAt
    ) {
      return {
        allowed: false,
        subscription,
        reason: "Free trial has expired",
      };
    }

    // Check usage limits (-1 means unlimited)
    if (
      subscription.conversationLimit !== -1 &&
      subscription.conversationsUsed >= subscription.conversationLimit
    ) {
      return {
        allowed: false,
        subscription,
        reason: "Usage limit reached",
      };
    }

    return {
      allowed: true,
      subscription,
    };
  }

  /**
   * Increment conversation usage for a user
   */
  async incrementConversationUsage(
    userId: string,
    conversationId: string
  ): Promise<void> {
    const subscription = await this.getUserSubscription(userId);

    if (!subscription) {
      throw new Error("No active subscription found");
    }

    // Update usage count
    await db
      .update(subscriptions)
      .set({
        conversationsUsed: sql`${subscriptions.conversationsUsed} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, subscription.id));

    // Log usage event
    await db.insert(usageEvents).values({
      userId,
      subscriptionId: subscription.id,
      eventType: "conversation_generated",
      conversationId,
      metadata: {
        previousUsage: subscription.conversationsUsed,
        newUsage: subscription.conversationsUsed + 1,
        limit: subscription.conversationLimit,
      },
    });
  }

  /**
   * Get subscription usage statistics
   */
  async getUsageStats(userId: string): Promise<{
    conversationsUsed: number;
    conversationLimit: number;
    planName: string;
    isUnlimited: boolean;
    remainingConversations: number;
  } | null> {
    const subscription = await this.getUserSubscription(userId);

    if (!subscription) {
      return null;
    }

    const isUnlimited = subscription.conversationLimit === -1;
    const remainingConversations = isUnlimited
      ? -1
      : Math.max(
          0,
          subscription.conversationLimit - subscription.conversationsUsed
        );

    return {
      conversationsUsed: subscription.conversationsUsed,
      conversationLimit: subscription.conversationLimit,
      planName: subscription.planName,
      isUnlimited,
      remainingConversations,
    };
  }

  /**
   * Update subscription plan (for upgrades/downgrades)
   */
  async updateSubscriptionPlan(
    userId: string,
    newPlan: SubscriptionPlan,
    lemonSqueezyData?: {
      lemonSqueezyId: string;
      lemonSqueezyCustomerId: string;
      lemonSqueezyOrderId: string;
      lemonSqueezyProductId: string;
      lemonSqueezyVariantId: string;
    }
  ): Promise<void> {
    const subscription = await this.getUserSubscription(userId);
    if (!subscription) throw new Error("No active subscription found");

    const planConfig = this.planConfigs[newPlan];
    const now = new Date();

    const newPeriodEnd = new Date();
    if (planConfig.billingCycle === "weekly") {
      newPeriodEnd.setDate(now.getDate() + 7);
    }
    if (planConfig.billingCycle === "yearly") {
      newPeriodEnd.setFullYear(now.getFullYear() + 1);
    }

    // Update subscription
    await db
      .update(subscriptions)
      .set({
        planName: newPlan,
        conversationLimit: planConfig.conversationLimit,
        billingCycle: planConfig.billingCycle,
        currentPeriodStart: now,
        currentPeriodEnd: newPeriodEnd,
        trialEndsAt: null, // Clear trial end when upgrading
        ...lemonSqueezyData,
        updatedAt: now,
      })
      .where(eq(subscriptions.id, subscription.id));

    // Log upgrade/downgrade event
    await db.insert(usageEvents).values({
      userId,
      subscriptionId: subscription.id,
      eventType: this.getUpdateSubscriptionEventType(subscription, newPlan),
      metadata: {
        previousPlan: subscription.planName,
        newPlan,
        lemonSqueezyData,
      },
    });
  }

  private getUpdateSubscriptionEventType(
    subscription: Subscription,
    newPlan: SubscriptionPlan
  ) {
    const isUpgradeByDefault =
      subscription.planName === "free_trial" ||
      subscription.planName === "conversationalist";

    if (isUpgradeByDefault) return "plan_upgraded";
    if (subscription.planName === "rizz_master") return "plan_downgraded";
    if (
      subscription.planName === "date_magnet" &&
      newPlan === "conversationalist"
    ) {
      return "plan_downgraded";
    }

    return "plan_upgraded";
  }

  getPlanConfig(planName: SubscriptionPlan): SubscriptionPlanConfig {
    return this.planConfigs[planName];
  }

  getAllPlanConfigs(): SubscriptionPlanConfig[] {
    return Object.values(this.planConfigs);
  }

  async cancelSubscription(userId: string): Promise<void> {
    const subscription = await this.getUserSubscription(userId);
    if (!subscription) throw new Error("No active subscription found");

    await db
      .update(subscriptions)
      .set({
        status: "cancelled",
        cancelledAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, subscription.id));

    // Log cancellation event
    await db.insert(usageEvents).values({
      userId,
      subscriptionId: subscription.id,
      eventType: "subscription_cancelled",
      metadata: {
        cancelledPlan: subscription.planName,
      },
    });
  }
}
