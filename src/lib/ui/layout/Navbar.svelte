<script lang="ts">
  import { page } from "$app/state";
  import ProfileDropdownMenu from "../Auth/ProfileDropdownMenu.svelte";
  import LinkButton from "../general/LinkButton.svelte";
  import Logo from "./Logo.svelte";
  import { onMount } from "svelte";

  const landingPageNavItems = [
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

  let scrolled = $state(false);

  onMount(() => {
    const handleScroll = () => {
      scrolled = window.scrollY > 50;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });
</script>

<nav
  class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 {scrolled
    ? 'backdrop-blur-md bg-white/80 border-b border-gray-200/50'
    : 'bg-transparent'}"
>
  <div class="flex w-full justify-between items-center p-4 max-w-7xl mx-auto">
    <Logo />

    {#if !page.data.user && page.url.pathname !== "/sign-in"}
      <div class="hidden md:flex gap-10">
        {#each landingPageNavItems as { href, label }}
          <a class="hover:text-primary duration-100" {href}>{label}</a>
        {/each}
      </div>
    {/if}

    <div class="flex gap-5 items-center">
      {#if page.data.user}
        <div class="mr-24">
          {#if page.url.pathname === "/"}
            <LinkButton label="Generate Rizz!" href="/response-helper" />
          {/if}
        </div>
        <ProfileDropdownMenu />
      {:else}
        <!-- Desktop login link -->
        <a
          class="text-primary font-bold duration-100 hidden md:block"
          href="/sign-in">Login</a
        >
        <LinkButton label="Get Started" href="/sign-in" />
      {/if}
    </div>
  </div>
</nav>
