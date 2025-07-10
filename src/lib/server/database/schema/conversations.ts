import type { RizzGPTFormData } from "$lib/types";
import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const conversations = pgTable("conversations", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  rizzResponses: jsonb("rizz_responses").$type<string[]>().notNull(),
  rizzResponseDescription: text("rizz_response_description").notNull(),
  initialUploadedConversationBlobUrl: text(
    "initial_uploaded_conversation_blob_url"
  ).notNull(),
  relationshipContext: jsonb("relationship_context").$type<RizzGPTFormData>(),
  matchName: text("match_name").notNull(),
  status: text()
    .$type<"initial" | "refining" | "completed">()
    .default("initial"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
