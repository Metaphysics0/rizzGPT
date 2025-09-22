import { getCurrentMonthYear } from "$lib/utils/date.util";
import { db } from "../database/connection";
import { userUsage } from "../database/schema";
import { eq, and } from "drizzle-orm";
import { databaseService } from "./database.service";

export class UsageService {
  static readonly MAX_AMOUNT_OF_MONTHLY_GENERATIONS_FOR_FREE_TIER = 5;
  readonly currentMonthYear = getCurrentMonthYear();

  async getUserUsage(userId: string): Promise<number> {
    const usage = await db
      .select()
      .from(userUsage)
      .where(
        and(
          eq(userUsage.userId, userId),
          eq(userUsage.monthYear, this.currentMonthYear)
        )
      )
      .limit(1);

    return usage.length > 0 ? parseInt(usage[0].responseCount) : 0;
  }

  async incrementUsage(userId: string): Promise<void> {
    const existing = await db
      .select()
      .from(userUsage)
      .where(
        and(
          eq(userUsage.userId, userId),
          eq(userUsage.monthYear, this.currentMonthYear)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      const currentCount = parseInt(existing[0].responseCount);
      await db
        .update(userUsage)
        .set({
          responseCount: String(currentCount + 1),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(userUsage.userId, userId),
            eq(userUsage.monthYear, this.currentMonthYear)
          )
        );
    } else {
      await db.insert(userUsage).values({
        userId,
        monthYear: this.currentMonthYear,
        responseCount: "1",
      });
    }
  }

  async hasExceededFreeLimit(userId: string): Promise<boolean> {
    const isSuperUser = await databaseService.isSuperUser(userId);
    if (isSuperUser) return false;

    const currentUsage = await this.getUserUsage(userId);

    return (
      currentUsage >=
      UsageService.MAX_AMOUNT_OF_MONTHLY_GENERATIONS_FOR_FREE_TIER
    );
  }
}
