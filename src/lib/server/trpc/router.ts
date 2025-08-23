import { router } from "./t";
import { generateRizzRouter } from "./routers/generate-rizz.router";

export const appRouter = router({
  generateRizz: generateRizzRouter,
});

export type AppRouter = typeof appRouter;
