import { auth } from "$lib/server/auth";
import {
  missingRequiredParametersErrorResponse,
  unauthorizedResponse,
} from "$lib/server/utils/response.util";
import type { Actions, RequestEvent } from "./$types";

export const actions: Actions = {
  signInWithEmail: async ({ request }: RequestEvent) => {
    try {
      const formData = await request.formData();
      const email = formData.get("email");
      const password = formData.get("password");

      if (!email || !password) {
        return missingRequiredParametersErrorResponse(["email", "password"]);
      }
      return auth.api.signInEmail({
        body: {
          email: email as string,
          password: password as string,
        },
      });
    } catch (error) {
      console.log("ERRasdfasdfOR", error);

      // BetterAuth error
      if ((error as any).statusCode === 401) {
        return unauthorizedResponse("Invalid email or password");
      }
      return {
        success: false,
        message: "Failed to sign in. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
  signUpWithEmail: async ({ request }: RequestEvent) => {
    try {
      const formData = await request.formData();
      const email = formData.get("email");
      const password = formData.get("password");
      const name = formData.get("name");

      if (!email || !password || !name) {
        return missingRequiredParametersErrorResponse([
          "email",
          "password",
          "name",
        ]);
      }
      const result = await auth.api.signUpEmail({
        body: {
          name: name as string,
          email: email as string,
          password: password as string,
          callbackURL: "/",
          rememberMe: false,
        },
      });

      return {
        success: true,
        message:
          "Account created! Please check your email to verify your account.",
      };
    } catch (error) {
      console.error("Sign up error:", error);
      return {
        success: false,
        message: "Failed to create account. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};
