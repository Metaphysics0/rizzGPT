import type { conversationMessages, conversations, users } from "./schema";

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;

export type ConversationMessage = typeof conversationMessages.$inferSelect;
export type NewConversationMessage = typeof conversationMessages.$inferInsert;

// Utility types for the conversation flow
export type ConversationWithMessages = Conversation & {
  messages: ConversationMessage[];
};

export type ConversationRole = "user" | "assistant";
export type ConversationStatus = "initial" | "refining" | "completed";

// Kinde user interface (to match existing auth implementation)
export interface KindeUser {
  id: string;
  email: string;
  given_name?: string;
  family_name?: string;
  picture?: string | null;
}
