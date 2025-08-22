import type {
  conversationMessages,
  conversations,
} from "./schema";

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

