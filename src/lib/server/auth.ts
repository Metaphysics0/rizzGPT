import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./database/connection";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "$env/static/private";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import * as schema from "./database/schema";
import { ResendService } from "./services/resend.service";

import { base } from "$app/paths";

export const auth = betterAuth({
  baseURL: process.env.PUBLIC_BASE_URL ?? "http://localhost:5173",
  basePath: `${base}/api/auth`,
  trustedOrigins: [
    "http://localhost:5173",
    process.env.PUBLIC_BASE_URL!,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  socialProviders: {
    google: {
      enabled: true,
      clientId: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await new ResendService().sendSignUpVerificationEmail({
        to: user.email,
        name: user.name,
        url,
      });
    },
    afterEmailVerification: async (user, request) => {
      console.log(`${user.email} has been successfully verified!`);
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      account: schema.accounts,
      session: schema.sessions,
      user: schema.users,
      verification: schema.verifications,
    },
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
  },
  plugins: [sveltekitCookies(getRequestEvent)],
});
