import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type {
  ConversationType,
  ConversationStatus,
  RelationshipContext,
} from "$lib/types";
import { jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: text().primaryKey(),
  email: text().unique().notNull(),
  emailVerified: boolean().default(false).notNull(),
  isSuperUser: boolean().default(false),
  name: text(),
  image: text(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const sessions = pgTable("session", {
  id: text().primaryKey(),
  userId: text()
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  expiresAt: timestamp().notNull(),
  token: text().notNull().unique(),
  ipAddress: text(),
  userAgent: text(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const accounts = pgTable("account", {
  id: text().primaryKey(),
  userId: text()
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  accountId: text().notNull(),
  providerId: text().notNull(),
  accessToken: text(),
  refreshToken: text(),
  idToken: text(),
  accessTokenExpiresAt: timestamp(),
  refreshTokenExpiresAt: timestamp(),
  scope: text(),
  password: text(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verifications = pgTable("verification", {
  id: text().primaryKey(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const subscriptions = pgTable("subscription", {
  id: uuid().primaryKey().defaultRandom(),
  userId: text().references(() => users.id, { onDelete: "cascade" }),
  email: text().notNull(),
  // Payment provider
  provider: text().$type<"paypal">().default("paypal").notNull(),
  // PayPal fields
  paypalSubscriptionId: text().unique(),
  paypalPlanId: text(),
  // Common fields
  productId: text().notNull(),
  productName: text().notNull(),
  price: text().notNull(),
  status: text()
    .$type<"active" | "expired" | "cancelled">()
    .default("active")
    .notNull(),
  purchaserEmail: text().notNull(),
  purchaserName: text(),
  isSubscription: boolean().default(true).notNull(),
  expiresAt: timestamp(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
export type Subscription = typeof subscriptions.$inferSelect;

export const userUsage = pgTable("user_usage", {
  id: uuid().primaryKey().defaultRandom(),
  userId: text()
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  usageType: text()
    .$type<"first-move-generation" | "response-helper-generation" | "regeneration">()
    .notNull(),
  metadata: jsonb().$type<Record<string, any>>(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
export type UserUsage = typeof userUsage.$inferSelect;

export const conversations = pgTable("conversation", {
  id: uuid().primaryKey().defaultRandom(),
  userId: text()
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  rizzResponses: jsonb().$type<string[]>().notNull(),
  rizzResponseDescription: text().notNull(),
  initialUploadedConversationFileName: text().notNull(),
  relationshipContext: jsonb().$type<RelationshipContext>(),
  matchName: text().notNull(),
  status: text().$type<ConversationStatus>().default("initial"),
  conversationType: text().$type<ConversationType>().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  subscriptions: many(subscriptions),
  userUsage: many(userUsage),
  conversations: many(conversations),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));

export const userUsageRelations = relations(userUsage, ({ one }) => ({
  user: one(users, {
    fields: [userUsage.userId],
    references: [users.id],
  }),
}));

export const conversationsRelations = relations(conversations, ({ one }) => ({
  user: one(users, {
    fields: [conversations.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));
