<script lang="ts">
  import Icon from "@iconify/svelte";
  import type { Snippet } from "svelte";
  import { slide } from "svelte/transition";

  interface Props {
    title: string;
    subtitle?: string;
    required?: boolean;
    collapsible?: boolean;
    defaultCollapsed?: boolean;
    children: Snippet;
  }

  let {
    title,
    subtitle,
    required = false,
    collapsible = false,
    defaultCollapsed = false,
    children,
  }: Props = $props();

  let isOpen = $state(!defaultCollapsed);
</script>

<div
  class="rounded-2xl border border-white/20 bg-white/70 p-6 shadow-lg backdrop-blur-sm"
>
  {#if collapsible}
    <button
      type="button"
      onclick={() => (isOpen = !isOpen)}
      class="flex w-full items-center justify-between text-left focus:outline-none rounded-lg p-2 -m-2 cursor-pointer"
    >
      <h2 class="text-lg font-semibold text-gray-700">
        {title}
        {#if subtitle}
          <span class="text-gray-400">{subtitle}</span>
        {/if}
        {#if required}
          <span class="text-red-500">*</span>
        {/if}
      </h2>
      <Icon
        icon="heroicons:chevron-down"
        class="h-5 w-5 text-gray-500 transition-transform duration-200 {isOpen
          ? 'rotate-180'
          : ''}"
      />
    </button>

    {#if isOpen}
      <div transition:slide={{ duration: 300 }}>
        {@render children()}
      </div>
    {/if}
  {:else}
    <h2 class="mb-4 text-lg font-semibold text-gray-700">
      {title}
      {#if subtitle}
        <span class="text-gray-400">{subtitle}</span>
      {/if}
      {#if required}
        <span class="text-red-500">*</span>
      {/if}
    </h2>
    {@render children()}
  {/if}
</div>
