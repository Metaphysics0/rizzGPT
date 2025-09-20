import { db } from "../database/connection";
import { userUsage } from "../database/schema";
import { eq, and } from "drizzle-orm";

export class UsageService {
  private getCurrentMonthYear(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  }

  async getUserUsage(userId: string): Promise<number> {
    const monthYear = this.getCurrentMonthYear();

    const usage = await db
      .select()
      .from(userUsage)
      .where(
        and(
          eq(userUsage.userId, userId),
          eq(userUsage.monthYear, monthYear)
        )
      )
      .limit(1);

    return usage.length > 0 ? parseInt(usage[0].responseCount) : 0;
  }

  async incrementUsage(userId: string): Promise<void> {
    const monthYear = this.getCurrentMonthYear();

    const existing = await db
      .select()
      .from(userUsage)
      .where(
        and(
          eq(userUsage.userId, userId),
          eq(userUsage.monthYear, monthYear)
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
            eq(userUsage.monthYear, monthYear)
          )
        );
    } else {
      await db.insert(userUsage).values({
        userId,
        monthYear,
        responseCount: "1",
      });
    }
  }

  async hasExceededFreeLimit(userId: string): Promise<boolean> {
    const currentUsage = await this.getUserUsage(userId);
    return currentUsage >= 5;
  }

  async getRemainingFreeResponses(userId: string): Promise<number> {
    const currentUsage = await this.getUserUsage(userId);
    return Math.max(0, 5 - currentUsage);
  }
}