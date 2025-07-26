import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const subscriptions = pgTable("subscriptions", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),

  // Subscription details
  planName: text("plan_name").notNull(), // "free_trial", "conversationalist", "date_magnet", "rizz_master"
  status: text()
    .$type<
      "active" | "cancelled" | "expired" | "past_due" | "paused" | "unpaid"
    >()
    .default("active")
    .notNull(),

  // Usage limits based on plan
  conversationLimit: integer("conversation_limit").notNull(), // -1 for unlimited
  conversationsUsed: integer("conversations_used").default(0).notNull(),

  // Billing cycle
  billingCycle: text("billing_cycle").$type<"weekly" | "yearly">(),

  // Timestamps
  trialEndsAt: timestamp("trial_ends_at", { withTimezone: true }),
  currentPeriodStart: timestamp("current_period_start", { withTimezone: true }),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),

  // Metadata
  isActive: boolean("is_active").default(true).notNull(),
  webhookData: jsonb("webhook_data"), // Store webhook payload for debugging

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Usage tracking for detailed analytics
export const usageEvents = pgTable("usage_events", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  subscriptionId: uuid("subscription_id")
    .references(() => subscriptions.id, { onDelete: "cascade" })
    .notNull(),

  eventType: text("event_type")
    .$type<
      | "conversation_generated"
      | "plan_upgraded"
      | "plan_downgraded"
      | "subscription_cancelled"
    >()
    .notNull(),

  // Context data
  conversationId: uuid("conversation_id"), // Link to conversation if applicable
  metadata: jsonb("metadata"), // Additional context data

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
