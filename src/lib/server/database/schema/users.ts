import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid().primaryKey(),
  kindeId: text().unique().notNull(),
  email: text().notNull(),
  givenName: text(),
  familyName: text(),
  picture: text(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});
