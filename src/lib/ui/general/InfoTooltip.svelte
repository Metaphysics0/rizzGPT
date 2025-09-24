<script lang="ts">
  import * as Tooltip from "$lib/components/tooltip";
  import Icon from "@iconify/svelte";

  let { content }: { content: string } = $props();
</script>

<Tooltip.Provider delayDuration={0}>
  <Tooltip.Root>
    <Tooltip.Trigger>
      <Icon icon="mdi:information" class="h-4 w-4 text-gray-500" />
    </Tooltip.Trigger>
    <Tooltip.Content>
      <p>{content}</p>
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
