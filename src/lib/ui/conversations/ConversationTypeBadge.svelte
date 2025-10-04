<script lang="ts">
  import type { ConversationType } from "$lib/types";
  import { cn } from "$lib/utils";
  import Icon from "@iconify/svelte";

  let {
    conversationType,
    size = "sm",
    className,
  }: {
    conversationType: ConversationType;
    size?: "sm" | "md";
    className?: string;
  } = $props();

  const iconClass = size === "sm" ? "w-3 h-3" : "w-4 h-4";
</script>

<span
  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 shrink-0"
>
  {#if conversationType === "first-move"}
    <Icon icon="mdi:message-star" class={cn(iconClass, className)} />
    First Move
  {:else if conversationType === "conversation-helper"}
    <Icon icon="mdi:message-reply" class={cn(iconClass, className)} />
    Response
  {:else}
    <Icon icon="mdi:message-text" class={cn(iconClass, className)} />
    Conversation
  {/if}
</span>
