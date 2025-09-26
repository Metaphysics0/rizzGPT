<script lang="ts">
  import type { ConversationType } from "$lib/types";
  import Icon from "@iconify/svelte";

  let { conversationType }: { conversationType: ConversationType } = $props();
</script>

<span
  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 shrink-0"
>
  {#if conversationType === "first-move"}
    <Icon icon="mdi:message-star" class="w-3 h-3 mr-1" />
    First Move
  {:else if conversationType === "response-helper"}
    <Icon icon="mdi:message-reply" class="w-3 h-3 mr-1" />
    Response
  {/if}
</span>
