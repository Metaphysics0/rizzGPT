import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { RelationshipContext } from "$lib/types";
import { jsonb } from "drizzle-orm/pg-core";

// Users table
export const users = pgTable("user", {
  id: uuid().primaryKey().defaultRandom(),
  email: text().unique().notNull(),
  emailVerified: boolean().default(false).notNull(),
  name: text(),
  image: text(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const sessions = pgTable("session", {
  id: text().primaryKey(),
  userId: uuid()
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  expiresAt: timestamp({ withTimezone: true }).notNull(),
  token: text().notNull().unique(),
  ipAddress: text(),
  userAgent: text(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const accounts = pgTable("account", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  accountId: text().notNull(),
  providerId: text().notNull(),
  accessToken: text(),
  refreshToken: text(),
  idToken: text(),
  accessTokenExpiresAt: timestamp({ withTimezone: true }),
  refreshTokenExpiresAt: timestamp({ withTimezone: true }),
  scope: text(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const verifications = pgTable("verification", {
  id: text().primaryKey(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp({ withTimezone: true }).notNull(),
  createdAt: timestamp({ withTimezone: true }),
  updatedAt: timestamp({ withTimezone: true }),
});

export const conversations = pgTable("conversation", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid().references(() => users.id, { onDelete: "cascade" }),
  rizzResponses: jsonb().$type<string[]>().notNull(),
  rizzResponseDescription: text().notNull(),
  initialUploadedConversationBlobUrl: text().notNull(),
  relationshipContext: jsonb().$type<RelationshipContext>(),
  matchName: text().notNull(),
  status: text()
    .$type<"initial" | "processing" | "refining" | "completed">()
    .default("initial"),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});
