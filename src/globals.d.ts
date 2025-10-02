import type { UserWithRelations } from "$lib/server/database/types";
import type { UiPlan } from "$lib/types";
import type { Session } from "better-auth/types";

declare global {
  namespace App {
    interface Locals {
      session?: Session;
      user?: UserWithRelations;
    }

    interface PageData {
      user?: UserWithRelations;
      plans: UiPlan[];
    }
  }
}

export {};
