<script lang="ts">
  import GenerateResponseButton from "$lib/ui/Form/GenerateResponseButton.svelte";
  import ImageInput from "$lib/ui/Form/ImageInput.svelte";
  import RelationshipForm from "$lib/ui/Form/RelationshipContext.svelte";
  import GeneratedResponse from "$lib/ui/GeneratedResponse.svelte";
  import Header from "$lib/ui/Header.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  $: {
    console.log("page data", data);
  }
</script>

<div
  class="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-yellow-100 p-4 md:p-8"
>
  <div class="mx-auto max-w-4xl space-y-8">
    <div class="mx-auto mb-12 max-w-2xl text-center pt-16">
      <Header />
    </div>

    {#if data.isAuthenticated}
      <div class="space-y-6">
        <ImageInput />
        <RelationshipForm />
        <GeneratedResponse />
      </div>

      <div class="flex justify-center pt-4">
        <GenerateResponseButton />
      </div>
    {:else}
      <!-- Not authenticated message -->
      <div class="mx-auto max-w-md text-center">
        <div
          class="rounded-2xl border border-white/20 bg-white/70 p-8 shadow-lg backdrop-blur-sm"
        >
          <div class="mb-4">
            <div
              class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600"
            >
              <svg
                class="h-8 w-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m0 0v2m0-2h2m-2 0H8m4-7V6a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2h4z"
                />
              </svg>
            </div>
          </div>
          <h2 class="mb-3 text-xl font-semibold text-gray-800">
            Sign in to get started
          </h2>
          <p class="mb-6 text-gray-600">
            Please sign in to access RizzGPT and start generating the perfect
            responses for your conversations.
          </p>
          <div class="space-y-3">
            <a
              href="/api/auth/login"
              class="block w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-purple-700 hover:to-pink-700 hover:shadow-xl"
            >
              Sign In
            </a>
            <a
              href="/api/auth/register"
              class="block w-full rounded-xl border border-purple-300 px-6 py-3 font-medium text-purple-600 transition-all duration-200 hover:bg-purple-50"
            >
              Create Account
            </a>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
