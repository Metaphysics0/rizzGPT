<script lang="ts">
  let { label = "Click Me", href }: { label: string; href: string } = $props();
</script>

<a
  class="inline-block rounded-full bg-black text-white px-8 py-3 text-base font-medium text-center capitalize whitespace-nowrap hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white transition-colors duration-200 shadow-lg"
  {href}
>
  {label}
</a>

<style>
  .shadow-lg {
    box-shadow: 0px 10px 33px -7px rgba(236, 84, 116, 0.6);
  }
</style>
