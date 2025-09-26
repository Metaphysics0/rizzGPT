import type { UserWithRelations } from "$lib/server/database/types";
import type { Session, User } from "better-auth/types";

declare global {
  namespace App {
    interface Locals {
      session?: Session;
      user?: User;
    }

    interface PageData {
      user?: UserWithRelations;
    }
  }
}

export {};
