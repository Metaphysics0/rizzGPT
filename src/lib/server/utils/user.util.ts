import type { UserWithRelations } from "../database/types";

export function doesUserHaveActiveSubscription(
  user?: UserWithRelations
): boolean {
  if (user?.isSuperUser) return true;

  return (
    !!user?.subscriptions &&
    user.subscriptions.filter((sub) => sub.status === "active").length > 0
  );
}
