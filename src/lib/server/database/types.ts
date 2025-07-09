import type { conversations, users } from "./schema";

// User types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// Conversation types
export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;

// Kinde user interface (to match existing auth implementation)
export interface KindeUser {
  id: string;
  email: string;
  given_name?: string;
  family_name?: string;
  picture?: string | null;
}
