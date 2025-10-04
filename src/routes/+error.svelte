<script>
  import TextContentCard from "$lib/ui/layout/TextContentCard.svelte";
  import { page } from "$app/state";
</script>

<TextContentCard
  header={String(page.status + " - " + page.error?.message || "")}
>
  <h1 class="mb-2">Something went wrong 😢</h1>

  <p>
    Click <a class="text-blue-500 font-bold" href="/">here</a> to return home.
  </p>
</TextContentCard>
