<script lang="ts">
  import * as Tooltip from "$lib/ui/tooltip/index";
  import Icon from "@iconify/svelte";
  import type { Snippet } from "svelte";
  import { slide } from "svelte/transition";
  // import { TooltipContent, TooltipProvider, TooltipTrigger } from "../tooltip";

  interface Props {
    title?: string;
    subtitle?: string;
    tooltip?: string;
    collapsible?: boolean;
    defaultCollapsed?: boolean;
    children: Snippet;
    headerAction?: Snippet;
  }

  let {
    title,
    tooltip,
    subtitle,
    collapsible = false,
    defaultCollapsed = false,
    children,
    headerAction,
  }: Props = $props();

  let isOpen = $state(!defaultCollapsed);
</script>

<div class="rounded-2xl bg-white/70 p-6 shadow">
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
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-700 flex items-center gap-2">
        <span> {title} </span>

        {#if tooltip}
          <Tooltip.Provider delayDuration={0}>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <Icon icon="mdi:information" class="h-4 w-4 text-gray-500" />
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>{tooltip}</p>
              </Tooltip.Content>
            </Tooltip.Root>
          </Tooltip.Provider>
        {/if}
        {#if subtitle}
          <span class="text-gray-400">{subtitle}</span>
        {/if}
      </h2>
      {#if headerAction}
        {@render headerAction()}
      {/if}
    </div>
    {@render children()}
  {/if}
</div>
