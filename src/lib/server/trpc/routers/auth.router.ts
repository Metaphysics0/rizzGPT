import z from "zod/v4";
import { publicProcedure, router } from "../t";
import { auth } from "$lib/server/auth";

export const authRouter = router({
  signInWithEmail: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ input }) => {
      return auth.api.signInEmail({
        body: {
          email: input.email,
          password: input.password,
        },
      });
    }),

  signInSocial: publicProcedure
    .input(z.object({ provider: z.string() }))
    .mutation(async ({ input }) => {
      return auth.api.signInSocial({
        body: {
          provider: input.provider,
        },
      });
    }),
});
