import type { UserWithRelations } from "../database/types";

export function doesUserHaveActiveSubscription(
  user?: UserWithRelations
): boolean {
  if (!user) return false;
  if (user.isSuperUser) return true;

  return getActiveSubscriptions(user).length > 0;
}

const getActiveSubscriptions = (user: UserWithRelations) =>
  user.subscriptions.filter((sub) => sub.status === "active");
