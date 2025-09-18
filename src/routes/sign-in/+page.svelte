<script lang="ts">
  import { goto } from "$app/navigation";
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";
  import type { ActionResult } from "@sveltejs/kit";
  import SignInWithGoogleButton from "$lib/ui/Auth/SignInWithGoogleButton.svelte";
  import SignInWithEmail from "$lib/ui/Auth/SignInWithEmail.svelte";

  let { form }: { form: ActionData } = $props();

  let email = $state("");
  let password = $state("");
  let name = $state("");
  let isSignUp = $state(false);
  let isLoading = $state(false);
  let error = $state("");
  let afterSignUpVerificationMessage = $state("");

  // Update error when form data changes
  $effect(() => {
    if (form?.error) {
      error = form.error;
    }
  });

  function toggleMode() {
    isSignUp = !isSignUp;
    error = "";
    email = "";
    password = "";
    name = "";
    afterSignUpVerificationMessage = "";
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

    if (isSignUp && result.data?.requiresVerification && result.data?.message) {
      afterSignUpVerificationMessage = result.data.message;
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
          class="font-medium text-pink-600 hover:text-pink-500 ml-1 cursor-pointer"
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
      <SignInWithEmail {isSignUp} {name} {email} {password} />

      {#if error}
        <div
          class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
        >
          {error}
        </div>
      {/if}

      {#if isSignUp && afterSignUpVerificationMessage}
        <div
          class="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm"
        >
          {afterSignUpVerificationMessage}
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

        <SignInWithGoogleButton {isLoading} {error} />
      </div>
    </form>
  </div>
</div>
