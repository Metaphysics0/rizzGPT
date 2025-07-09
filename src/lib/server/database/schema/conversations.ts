import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  rizzResponses: jsonb("rizz_responses").$type<string[]>().notNull(),
  rizzResponseDescription: text("rizz_response_description").notNull(),
  uploadedConversationBlobUrl: text("uploaded_conversation_blob_url").notNull(),
  matchContext: text("match_context").notNull(),
  matchName: text("match_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
