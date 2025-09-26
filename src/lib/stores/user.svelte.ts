import type { UserWithActiveSubscription } from "$lib/server/database/types";

class UserStore {
  public user = $state<UserWithActiveSubscription | null>(null);
}

export const userStore = new UserStore();
