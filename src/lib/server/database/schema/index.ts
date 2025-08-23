import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { RelationshipContext } from "$lib/types";
import { jsonb } from "drizzle-orm/pg-core";

// Users table
export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  email: text().unique().notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  name: text(),
  image: text(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Auth sessions table (for BetterAuth when we add it)
export const sessions = pgTable("sessions", {
  id: text().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  token: text().notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Auth accounts table (for social providers)
export const accounts = pgTable("accounts", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", {
    withTimezone: true,
  }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
    withTimezone: true,
  }),
  scope: text(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const conversations = pgTable("conversations", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  rizzResponses: jsonb("rizz_responses").$type<string[]>().notNull(),
  rizzResponseDescription: text("rizz_response_description").notNull(),
  initialUploadedConversationBlobUrl: text(
    "initial_uploaded_conversation_blob_url"
  ).notNull(),
  relationshipContext: jsonb(
    "relationship_context"
  ).$type<RelationshipContext>(),
  matchName: text("match_name").notNull(),
  status: text()
    .$type<"initial" | "processing" | "refining" | "completed">()
    .default("initial"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
