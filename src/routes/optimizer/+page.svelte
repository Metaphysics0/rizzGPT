<script lang="ts">
  import { enhance } from "$app/forms";
  import { profileOptimizerForm } from "$lib/runes/forms/profile-optimizer-form.svelte";
  import GenerateResponseButton from "$lib/ui/form/SubmitFormButton.svelte";
  import Dropzone from "$lib/ui/form/Dropzone.svelte";
  import FormHeader from "$lib/ui/form/FormHeader.svelte";
</script>

x
<svelte:head>
  <title>RizzGPT - Profile Optimizer</title>
</svelte:head>

<div class="mx-auto max-w-xl space-y-8 px-3">
  <FormHeader
    header="Optimize your bio!!"
    subheader="Upload up to 5 screenshots of your bio, and get personalized optimizations"
  />
  <form
    method="POST"
    action="?/optimize"
    use:enhance={profileOptimizerForm.handleEnhance}
  >
    <div class="space-y-6">
      <Dropzone
        title="Profile bio"
        tooltip="Upload screenshots of your bio"
        onFileUpload={(fileName) => profileOptimizerForm.images.add(fileName)}
        onFileClear={(fileName) => profileOptimizerForm.images.remove(fileName)}
        isProcessing={profileOptimizerForm.response.loading}
      />
    </div>

    <div class="flex justify-center pt-4">
      <GenerateResponseButton
        text="Optimize 🪄"
        disabled={!profileOptimizerForm.canGenerate}
        isLoading={profileOptimizerForm.response.loading}
      />
    </div>
  </form>

  {#if profileOptimizerForm.response.error}
    <div class="rounded-xl border border-red-200 bg-red-50 p-4">
      <div class="flex items-center gap-2 text-red-800">
        <span class="font-medium">Error:</span>
        <span>{profileOptimizerForm.response.error}</span>
      </div>
    </div>
  {/if}
</div>
