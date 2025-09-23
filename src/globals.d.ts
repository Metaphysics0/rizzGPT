import type { UserWithActiveSubscription } from "$lib/server/database/types";
import type { User, Session } from "better-auth/types";

declare global {
  namespace App {
    interface Locals {
      session: Session | null;
      user: User | null;
    }

    interface PageData {
      user: UserWithActiveSubscription | null;
    }
  }
}

export {};
