import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { conversations } from "./conversations";

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
  (table) => ({
    conversationOrderIdx: index(
      "conversation_messages_conversation_id_order_idx"
    ).on(table.conversationId, table.messageOrder),
  })
);
