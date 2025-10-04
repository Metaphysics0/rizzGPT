<script lang="ts">
  import CopyToClipboardButton from "$lib/ui/general/CopyToClipboardButton.svelte";

  let { index, response }: { index: number; response: string } = $props();
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

    <CopyToClipboardButton text={response} />
  </div>
</div>
