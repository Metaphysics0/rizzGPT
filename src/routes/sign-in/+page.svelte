<script lang="ts">
  import { authClient } from "$lib/auth-client";
  import { goto } from "$app/navigation";
  import { enhance } from "$app/forms";
  import { MINIMUM_PASSWORD_LENGTH } from "$lib/constants/minimum-password-length.constant";
  import type { ActionData } from "./$types";
  import type { ActionResult, SubmitFunction } from "@sveltejs/kit";

  export let form: ActionData;

  let email = "";
  let password = "";
  let name = "";
  let isSignUp = false;
  let isLoading = false;
  let error = "";

  // Set form values if there's error data from server
  $: if (form?.email) email = form.email;
  $: if (form?.name) name = form.name;
  $: if (form?.error) error = form.error;

  async function handleGoogleSignIn() {
    isLoading = true;
    error = "";

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      error = "Google sign in failed";
      console.error("Google sign in error:", err);
      isLoading = false;
    }
  }

  function toggleMode() {
    isSignUp = !isSignUp;
    error = "";
    email = "";
    password = "";
    name = "";
  }

  async function handleFormResult({
    result,
    update,
  }: {
    result: ActionResult;
    update: (options?: {
      reset?: boolean;
      invalidateAll?: boolean;
    }) => Promise<void>;
  }) {
    isLoading = false;

    if (result.type === "failure") {
      await update();
      return;
    }

    if (result.type === "redirect") {
      goto(result.location);
      return;
    }

    if (result.type !== "success") {
      await update();
      return;
    }

    // Handle success
    if (!result.data?.success) {
      await update();
      return;
    }

    error = "";

    if (isSignUp && result.data?.message) {
      error = result.data.message;
      return;
    }

    goto("/");
  }
</script>

<div class="flex items-center justify-center">
  <div
    class="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg"
  >
    <div>
      <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
        {isSignUp ? "Create your account" : "Sign in to your account"}
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        {isSignUp ? "Already have an account?" : "Don't have an account?"}
        <button
          type="button"
          class="font-medium text-pink-600 hover:text-pink-500 ml-1"
          onclick={toggleMode}
        >
          {isSignUp ? "Sign in" : "Sign up"}
        </button>
      </p>
    </div>

    <form
      class="mt-8 space-y-6"
      method="POST"
      action={isSignUp
        ? "/sign-in?/signUpWithEmail"
        : "/sign-in?/signInWithEmail"}
      use:enhance={() => {
        isLoading = true;
        error = "";
        return handleFormResult;
      }}
    >
      <div class="space-y-4">
        {#if isSignUp}
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              bind:value={name}
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              placeholder="Enter your full name"
            />
          </div>
        {/if}

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            bind:value={email}
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            Password
            {#if isSignUp}
              <span class="text-xs opacity-80"
                >({MINIMUM_PASSWORD_LENGTH} characters minimum)</span
              >
            {/if}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minlength={MINIMUM_PASSWORD_LENGTH}
            bind:value={password}
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            placeholder="Enter your password"
          />
        </div>
      </div>

      {#if error}
        <div
          class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
        >
          {error}
        </div>
      {/if}

      <div class="space-y-4">
        <button
          type="submit"
          disabled={isLoading}
          class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {#if isLoading}
            <svg
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          {/if}
          {isSignUp ? "Create Account" : "Sign In"}
        </button>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <button
          type="button"
          onclick={handleGoogleSignIn}
          disabled={isLoading}
          class="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>
      </div>
    </form>
  </div>
</div>
