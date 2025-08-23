import { router } from "./t";
import { generateRizzRouter } from "./routers/generate-rizz.router";
import { authRouter } from "./routers/auth.router";

export const appRouter = router({
  generateRizz: generateRizzRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
