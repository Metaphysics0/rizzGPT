import type { Subscription } from "$lib/server/database/schema";
import type { User, Session } from "better-auth/types";

declare global {
  namespace App {
    interface Locals {
      session: Session | null;
      user: (User & { subscription?: Subscription }) | null;
    }
  }
}

export {};
