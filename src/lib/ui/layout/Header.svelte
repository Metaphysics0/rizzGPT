<script lang="ts">
  import { page } from "$app/state";
  import Icon from "@iconify/svelte";
</script>

<div class="mx-auto mb-9 mt-3 max-w-2xl text-center">
  <a
    href="/"
    class="text-4xl md:text-5xl w-fit mx-auto z-50 flex items-center justify-center gap-1"
  >
    <span> RizzGPT </span>
    <Icon icon="mingcute:ai-line" class="mb-0.5" stroke-width={0.25} />
  </a>

  {#if page.url.pathname !== "/"}
    <p class="mt-4 text-lg font-medium text-gray-600 md:text-xl">
      Get the perfect response for bae 💕
    </p>
    <p class="mt-2 text-sm text-gray-500">Your AI wingman for dating apps</p>
  {/if}
</div>
