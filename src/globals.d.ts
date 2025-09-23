import type { UserWithRelations } from "$lib/server/database/types";
import type { User, Session } from "better-auth/types";

declare global {
  namespace App {
    interface Locals {
      session: Session | null;
      user: User | null;
    }

    interface PageData {
      user: UserWithRelations | null;
    }
  }
}

export {};
