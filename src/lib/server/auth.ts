import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./database/connection";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "$env/static/private";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import * as schema from "./database/schema";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
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
    sendVerificationEmail: async ({ user, url, token }, request) => {
      // await sendEmail({
      //   to: user.email,
      //   subject: "Verify your email address",
      //   text: `Click the link to verify your email: ${url}`,
      // });
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
