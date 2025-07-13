<script lang="ts">
  import type { PageData } from "./$types";

  const { data }: { data: PageData } = $props();
  console.log("DATA", data);
</script>
