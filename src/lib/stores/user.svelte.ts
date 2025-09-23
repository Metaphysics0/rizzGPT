import type { UserWithActiveSubscription } from "$lib/server/database/types";

class UserStore {
  user = $state<UserWithActiveSubscription | null>(null);

  setUser(user: UserWithActiveSubscription | null) {
    this.user = user;
  }

  get isAuthenticated() {
    return !!this.user;
  }

  get userId() {
    return this.user?.id;
  }

  get userEmail() {
    return this.user?.email;
  }

  get activeSubscription() {
    return this.user?.subscriptions?.find(sub => sub.status === "active") || null;
  }

  get isProUser() {
    return !!this.activeSubscription;
  }
}

export const userStore = new UserStore();
