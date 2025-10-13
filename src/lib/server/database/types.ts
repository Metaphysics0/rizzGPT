import type {
  accounts,
  conversations,
  sessions,
  users,
  subscriptions,
  userUsage,
  profileOptimizations,
} from "./schema";

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;

export type UserUsage = typeof userUsage.$inferSelect;
export type NewUserUsage = typeof userUsage.$inferInsert;

export type ProfileOptimization = typeof profileOptimizations.$inferSelect;
export type NewProfileOptimization = typeof profileOptimizations.$inferInsert;

// Type for user with relations as returned by Drizzle
export type UserWithRelations = User & {
  subscriptions: Subscription[];
  userUsage: UserUsage[];
  hasActiveSubscription?: boolean;
};

// Alias for the common use case
export type UserWithActiveSubscription = UserWithRelations;
