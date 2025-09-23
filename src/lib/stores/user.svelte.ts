import type { Subscription } from "$lib/server/database/schema";
import type { User } from "better-auth/types";

class UserStore {
  user = $state<(User & { subscription?: Subscription }) | null>(null);

  setUser(user: (User & { subscription?: Subscription }) | null) {
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
}

export const userStore = new UserStore();
