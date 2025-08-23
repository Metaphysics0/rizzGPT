import type {
  accounts,
  conversationMessages,
  conversations,
  sessions,
  users,
} from "./schema";

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;

export type ConversationMessage = typeof conversationMessages.$inferSelect;
export type NewConversationMessage = typeof conversationMessages.$inferInsert;

// Utility types for the conversation flow
export type ConversationWithMessages = Conversation & {
  messages: ConversationMessage[];
};

export type ConversationRole = "user" | "assistant";
export type ConversationStatus =
  | "initial"
  | "processing"
  | "refining"
  | "completed";

