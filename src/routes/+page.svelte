<script lang="ts">
  import SignInView from "$lib/ui/Auth/SignInView.svelte";
  import GenerateResponseButton from "$lib/ui/Form/GenerateResponseButton.svelte";
  import ImageInput from "$lib/ui/Form/ImageInput.svelte";
  import RelationshipForm from "$lib/ui/Form/RelationshipContext.svelte";
  import GeneratedResponse from "$lib/ui/GeneratedResponse.svelte";
  import Header from "$lib/ui/Header.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
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
      <SignInView />
    {/if}
  </div>
</div>
