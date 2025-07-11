<script lang="ts">
  import SignInView from "$lib/ui/Auth/SignInView.svelte";
  import GenerateResponseButton from "$lib/ui/Form/GenerateResponseButton.svelte";
  import ImageInput from "$lib/ui/Form/ImageInput.svelte";
  import RelationshipContext from "$lib/ui/Form/RelationshipContext.svelte";
  import GeneratedResponse from "$lib/ui/GeneratedResponse.svelte";
  import Header from "$lib/ui/Header.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<div class="mx-auto max-w-4xl space-y-8">
  {#if data.isAuthenticated}
    <div class="space-y-6">
      <ImageInput />
      <RelationshipContext />
      <GeneratedResponse />
    </div>

    <div class="flex justify-center pt-4">
      <GenerateResponseButton />
    </div>
  {:else}
    <SignInView />
  {/if}
</div>
