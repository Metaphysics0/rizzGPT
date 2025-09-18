import { auth } from "$lib/server/auth";
import { APIError } from "better-auth/api";
import type { Actions, RequestEvent } from "./$types";
import { fail } from "@sveltejs/kit";

export const actions: Actions = {
  signInWithEmail: async ({ request }: RequestEvent) => {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      return fail(400, {
        email: email as string,
        password: password as string,
        error: "Email and password are required",
        missingFields: !email
          ? ["email"]
          : !password
          ? ["password"]
          : ["email", "password"],
      });
    }

    try {
      const result = await auth.api.signInEmail({
        body: {
          email: email as string,
          password: password as string,
        },
      });

      return result;
    } catch (error) {
      console.error("Sign in error:", error);

      // Handle Better Auth APIError
      if (error instanceof APIError) {
        return fail(400, {
          email: email as string,
          password: "",
          error: "Invalid email or password",
          type: "auth_error",
        });
      }

      // Handle other errors
      return fail(500, {
        email: email as string,
        password: "",
        error: "An unexpected error occurred. Please try again.",
        type: "server_error",
      });
    }
  },
  signUpWithEmail: async ({ request }: RequestEvent) => {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name");

    if (!email || !password || !name) {
      const missingFields = [];
      if (!email) missingFields.push("email");
      if (!password) missingFields.push("password");
      if (!name) missingFields.push("name");

      return fail(400, {
        email: email as string,
        password: password as string,
        name: name as string,
        error: "All fields are required",
        missingFields,
      });
    }

    try {
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

      // Handle Better Auth APIError
      if (error instanceof APIError) {
        return fail(400, {
          email: email as string,
          password: "",
          name: name as string,
          error: "Failed to create account. Email may already be in use.",
          type: "auth_error",
        });
      }

      // Handle other errors
      return fail(500, {
        email: email as string,
        password: "",
        name: name as string,
        error: "An unexpected error occurred. Please try again.",
        type: "server_error",
      });
    }
  },
};
