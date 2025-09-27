<script lang="ts">
  import { cn } from "$lib/utils";

  let {
    label = "Click Me",
    href,
    className,
    responsive = true,
  }: {
    label: string;
    href: string;
    className?: string;
    responsive?: boolean;
  } = $props();
</script>

<a
  class={cn(
    "inline-block rounded-full bg-black text-white font-medium text-center capitalize whitespace-nowrap hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white transition-colors duration-200 shadow-lg",
    responsive
      ? "px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-3 text-sm sm:text-base md:text-base"
      : "px-8 py-3 text-base",
    className
  )}
  {href}
>
  {label}
</a>

<style>
  .shadow-lg {
    box-shadow: 0px 10px 33px -7px rgba(236, 84, 116, 0.6);
  }
</style>
