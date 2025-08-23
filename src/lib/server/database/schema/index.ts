import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import type { RelationshipContext } from "$lib/types";
import { jsonb } from "drizzle-orm/pg-core";

export const conversationMessages = pgTable(
  "conversation_messages",
  {
    id: uuid().primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id")
      .references(() => conversations.id, { onDelete: "cascade" })
      .notNull(),
    role: text().$type<"user" | "assistant">().notNull(),
    content: text().notNull(),
    messageOrder: integer("message_order").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("conversation_messages_conversation_id_order_idx").on(
      table.conversationId,
      table.messageOrder
    ),
  ]
);

export const conversations = pgTable("conversations", {
  id: uuid().primaryKey().defaultRandom(),
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
