<script lang="ts">
  import GenerateResponseButton from "$lib/ui/form/GenerateRizzButton.svelte";
  import ImageInput from "$lib/ui/form/ImageInput.svelte";
  import RelationshipContext from "$lib/ui/form/RelationshipContext.svelte";
</script>

<div class="mx-auto max-w-xl space-y-8">
  <form method="POST" action="?/generateRizz">
    <div class="space-y-6">
      <ImageInput />
      <RelationshipContext />
    </div>

    <div class="flex justify-center pt-4">
      <GenerateResponseButton />
    </div>
  </form>
</div>
