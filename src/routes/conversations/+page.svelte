<script lang="ts">
  import type { PageData } from "../$types";

  const { data }: { data: PageData } = $props();

  console.log("conversations page data", data);
</script>

<div>Conversations page</div>
