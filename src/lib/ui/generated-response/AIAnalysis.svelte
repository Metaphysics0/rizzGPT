<script lang="ts">
  import type { Conversation } from "$lib/server/database/types";
  import Icon from "@iconify/svelte";

  let { conversation }: { conversation: Conversation } = $props();
</script>

<div class="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
  <div class="mb-3 flex items-center gap-2">
    <Icon icon="mdi:brain" class="h-5 w-5 text-blue-600" />
    <span class="font-medium text-blue-800">AI Analysis</span>
  </div>
  <p class="text-sm text-blue-700">
    {conversation.rizzResponseDescription}
  </p>
</div>
