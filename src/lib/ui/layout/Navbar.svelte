<script lang="ts">
  import LinkButton from "../general/LinkButton.svelte";
  import Logo from "./Logo.svelte";
  import { onMount } from "svelte";

  const NAV_ITEMS = [
    {
      label: "Home",
      href: "#home",
    },
    {
      label: "How it works",
      href: "#how-it-works",
    },
    {
      label: "FAQs",
      href: "#faqs",
    },
    {
      label: "Reviews",
      href: "#reviews",
    },
  ] as const;

  let scrolled = false;

  onMount(() => {
    const handleScroll = () => {
      scrolled = window.scrollY > 50;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

<nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 {scrolled ? 'backdrop-blur-md bg-white/80 border-b border-gray-200/50' : 'bg-transparent'}">
  <div class="flex w-full justify-between items-center p-4 max-w-7xl mx-auto">
    <Logo />

    <!-- Desktop navigation -->
    <div class="hidden md:flex gap-10">
      {#each NAV_ITEMS as { href, label }}
        <a class="hover:text-primary duration-100" {href}>{label}</a>
      {/each}
    </div>

    <div class="flex gap-5 items-center">
      <!-- Desktop login link -->
      <a class="text-primary font-bold duration-100 hidden md:block" href="/sign-in">Login</a>
      <LinkButton label="Get Started" href="/sign-in" />
    </div>
  </div>
</nav>
