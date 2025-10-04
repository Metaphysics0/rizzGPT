<script lang="ts">
  import type { ComparisonItem } from "$lib/types";
  import Icon from "@iconify/svelte";
  import * as Tooltip from "$lib/components/tooltip";

  let {
    competitorName = "Competitor",
    features = [],
  }: {
    competitorName?: string;
    features?: ComparisonItem[];
  } = $props();
</script>

<div class="w-full max-w-4xl mx-auto">
  <div
    class="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200"
  >
    <!-- Header -->
    <div
      class="grid grid-cols-3 gap-4 bg-gradient-to-r from-purple-600 to-pink-600 p-6"
    >
      <div class="text-white font-semibold">
        <h3 class="text-2xl text-white opacity-80">Feature</h3>
      </div>
      <div class="text-center">
        <h3 class="text-2xl font-bold text-white">RizzGPT</h3>
      </div>
      <div class="text-center">
        <h3 class="text-2xl font-bold text-white opacity-90">
          {competitorName}
        </h3>
      </div>
    </div>

    <!-- Features -->
    <div class="divide-y divide-gray-200">
      {#each features as item, index}
        <div
          class="grid grid-cols-3 gap-4 p-6 hover:bg-gray-50 transition-colors"
          class:bg-gray-50={index % 2 === 0}
        >
          <div class="flex items-center text-gray-900 font-medium">
            {item.feature}
          </div>
          <div class="flex items-center justify-center">
            {#if item.rizzgptTooltip}
              <Tooltip.Provider delayDuration={0}>
                <Tooltip.Root>
                  <Tooltip.Trigger>
                    {#if item.rizzgpt === "in-progress"}
                      <Icon
                        icon="solar:hourglass-bold-duotone"
                        class="w-8 h-8 text-amber-500"
                      />
                    {:else if item.rizzgpt}
                      <Icon
                        icon="mingcute:check-fill"
                        class="w-8 h-8 text-green-500"
                      />
                    {:else}
                      <Icon
                        icon="mingcute:close-fill"
                        class="w-8 h-8 text-red-500"
                      />
                    {/if}
                  </Tooltip.Trigger>
                  <Tooltip.Content>
                    <p>{item.rizzgptTooltip}</p>
                  </Tooltip.Content>
                </Tooltip.Root>
              </Tooltip.Provider>
            {:else if item.rizzgpt === "in-progress"}
              <Icon
                icon="solar:hourglass-bold-duotone"
                class="w-8 h-8 text-amber-500"
              />
            {:else if item.rizzgpt}
              <Icon icon="mingcute:check-fill" class="w-8 h-8 text-green-500" />
            {:else}
              <Icon icon="mingcute:close-fill" class="w-8 h-8 text-red-500" />
            {/if}
          </div>
          <div class="flex items-center justify-center">
            {#if item.competitorTooltip}
              <Tooltip.Provider delayDuration={0}>
                <Tooltip.Root>
                  <Tooltip.Trigger>
                    {#if item.competitor}
                      <Icon
                        icon="mingcute:check-fill"
                        class="w-8 h-8 text-green-500"
                      />
                    {:else}
                      <Icon
                        icon="mingcute:close-fill"
                        class="w-8 h-8 text-red-500"
                      />
                    {/if}
                  </Tooltip.Trigger>
                  <Tooltip.Content>
                    <p>{item.competitorTooltip}</p>
                  </Tooltip.Content>
                </Tooltip.Root>
              </Tooltip.Provider>
            {:else if item.competitor}
              <Icon icon="mingcute:check-fill" class="w-8 h-8 text-green-500" />
            {:else}
              <Icon icon="mingcute:close-fill" class="w-8 h-8 text-red-500" />
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
