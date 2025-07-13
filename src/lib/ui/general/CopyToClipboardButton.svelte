<script lang="ts">
  import Icon from "@iconify/svelte";

  export let text: string;

  let copied = false;

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(text);
      copied = true;

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        copied = false;
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }
</script>

<button
  onclick={copyToClipboard}
  class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-600 opacity-0 transition-all hover:bg-purple-100 hover:text-purple-600 group-hover:opacity-100 cursor-pointer {copied
    ? 'bg-green-100 text-green-600'
    : ''}"
  title={copied ? "Copied!" : "Copy to clipboard"}
>
  <div class="transition-all duration-200 ease-in-out">
    {#if copied}
      <Icon icon="mdi:check" class="h-4 w-4 animate-pulse" />
    {:else}
      <Icon icon="mdi:content-copy" class="h-4 w-4" />
    {/if}
  </div>
</button>
