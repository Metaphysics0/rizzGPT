import type { UserWithRelations } from "../database/types";

export function doesUserHaveActiveSubscription(
  user?: UserWithRelations
): boolean {
  if (user?.isSuperUser) return true;
  if (!user?.subscriptions?.length) return false;

  return user.subscriptions.filter((sub) => sub.status === "active").length > 0;
}
