import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const conversations = pgTable("conversations", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  rizzResponses: jsonb().$type<string[]>().notNull(),
  rizzResponseDescription: text().notNull(),
  uploadedConversationBlobUrl: text().notNull(),
  matchContext: text().notNull(),
  matchName: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});
