<script lang="ts">
  import Icon from "@iconify/svelte";

  export let index: number;
  export let response: string;

  function copyToClipboard(response: string) {
    navigator.clipboard.writeText(response);
  }
</script>

<div
  class="group relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-purple-300 hover:shadow-md"
>
  <div class="flex items-start justify-between gap-3">
    <div class="flex-1">
      <div class="mb-2 flex items-center gap-2">
        <span
          class="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-purple-600"
        >
          {index + 1}
        </span>
        <span class="text-sm font-medium text-gray-500">Option {index + 1}</span
        >
      </div>
      <p class="text-gray-800">{response}</p>
    </div>

    <button
      onclick={() => copyToClipboard(response)}
      class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-600 opacity-0 transition-all hover:bg-purple-100 hover:text-purple-600 group-hover:opacity-100"
      title="Copy to clipboard"
    >
      <Icon icon="mdi:content-copy" class="h-4 w-4" />
    </button>
  </div>
</div>
