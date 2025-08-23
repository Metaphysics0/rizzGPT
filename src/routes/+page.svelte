<script lang="ts">
  import GenerateResponseButton from "$lib/ui/Form/GenerateResponseButton.svelte";
  import ImageInput from "$lib/ui/Form/ImageInput.svelte";
  import RelationshipContext from "$lib/ui/Form/RelationshipContext.svelte";
</script>

<div class="mx-auto max-w-4xl space-y-8">
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
