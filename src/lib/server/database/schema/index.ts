import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { ConversationStatus, RelationshipContext } from "$lib/types";
import { jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: text().primaryKey(),
  email: text().unique().notNull(),
  emailVerified: boolean().default(false).notNull(),
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
  email: text().notNull(),
  gumroadSaleId: text().unique().notNull(),
  productId: text().notNull(),
  productName: text().notNull(),
  price: text().notNull(),
  status: text()
    .$type<"active" | "expired" | "cancelled">()
    .default("active")
    .notNull(),
  purchaserEmail: text().notNull(),
  purchaserName: text(),
  isSubscription: boolean().default(false).notNull(),
  subscriptionId: text(),
  expiresAt: timestamp(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
export type Subscription = typeof subscriptions.$inferSelect;

export const conversations = pgTable("conversation", {
  id: uuid().primaryKey().defaultRandom(),
  userId: text()
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  rizzResponses: jsonb().$type<string[]>().notNull(),
  rizzResponseDescription: text().notNull(),
  initialUploadedConversationBlobUrl: text().notNull(),
  relationshipContext: jsonb().$type<RelationshipContext>(),
  matchName: text().notNull(),
  status: text().$type<ConversationStatus>().default("initial"),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
