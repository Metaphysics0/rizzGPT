import type { UserWithRelations } from "$lib/server/database/types";

export function getUserInitials(user?: UserWithRelations): string {
  if (!user) return "U";
  const firstName = user.name?.split(" ")[0] || "";
  const lastName = user.name?.split(" ")[1] || "";

  if (firstName && lastName)
    return `${firstName[0]}${lastName[0]}`.toUpperCase();

  if (firstName) return firstName[0].toUpperCase();
  if (user.email) return user.email[0].toUpperCase();

  return "U";
}

export function getDisplayName({
  user,
  fullName = false,
}: {
  user?: UserWithRelations;
  fullName?: boolean;
}): string {
  if (!user) return "User";
  if (user.name) return fullName ? user.name : user.name.split(" ")[0];
  if (user.email) return user.email.split("@")[0];
  return "User";
}
