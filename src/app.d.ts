import type { KindeUser } from "$lib/types";

declare global {
  namespace App {
    interface Locals {
      user?: KindeUser | null;
      dbUser?: {
        id: string;
        kindeId: string;
        email: string;
        givenName: string | null;
        familyName: string | null;
        picture: string | null;
        createdAt: Date;
        updatedAt: Date;
      } | null;
      isAuthenticated: boolean;
    }
  }
}

export {};
