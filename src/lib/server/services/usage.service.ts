import { db } from "../database/connection";
import { userUsage } from "../database/schema";
import { eq, and, gte } from "drizzle-orm";
import { actions } from "./db-actions.service";

export type UsageType =
  | "first-move-generation"
  | "conversation-helper-generation"
  | "regeneration";

export interface CreateUsageOptions {
  userId: string;
  usageType: UsageType;
  metadata?: Record<string, any>;
}

export class UsageService {
  static readonly MAX_AMOUNT_OF_MONTHLY_GENERATIONS_FOR_FREE_TIER = 5;

  async createUsageRecord(options: CreateUsageOptions): Promise<void> {
    await db.insert(userUsage).values({
      userId: options.userId,
      usageType: options.usageType,
      metadata: options.metadata || null,
    });
  }

  async getUserUsageCount(userId: string): Promise<number> {
    const monthStart = this.getCurrentMonthStart();

    const usageRecords = await db
      .select()
      .from(userUsage)
      .where(
        and(eq(userUsage.userId, userId), gte(userUsage.createdAt, monthStart))
      );

    return usageRecords.length;
  }

  async hasExceededFreeLimit(userId: string): Promise<boolean> {
    const isSuperUser = await actions.isSuperUser(userId);
    if (isSuperUser) return false;

    const currentUsage = await this.getUserUsageCount(userId);

    return (
      currentUsage >=
      UsageService.MAX_AMOUNT_OF_MONTHLY_GENERATIONS_FOR_FREE_TIER
    );
  }

  private getCurrentMonthStart(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
}
