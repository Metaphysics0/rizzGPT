<script lang="ts">
  import { page } from "$app/state";
  import { cn } from "$lib/utils";
  import ProfileDropdownMenu from "../Auth/ProfileDropdownMenu.svelte";
  import LinkButton from "../general/LinkButton.svelte";
  import Logo from "./Logo.svelte";
  import { onMount } from "svelte";

  const navItems = [
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
      label: "Pricing",
      href: "#pricing",
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

  function smoothScrollAnchorClick(event: MouseEvent) {
    const link = event.currentTarget as HTMLAnchorElement;
    const anchorId = new URL(link.href).hash.replace("#", "");

    // If not on home page, navigate to home page with hash
    if (page.url.pathname !== "/") {
      window.location.href = "/" + link.hash;
      return;
    }

    event.preventDefault();
    const anchor = document.getElementById(anchorId);
    if (anchor) {
      window.scrollTo({
        top: anchor.offsetTop - 80, // Offset for fixed navbar
        behavior: "smooth",
      });
    }
  }
</script>

<nav
  class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 {scrolled
    ? 'backdrop-blur-md bg-white/80 border-b border-gray-200/50'
    : 'bg-transparent'}"
>
  <div class="flex w-full justify-between items-center p-4 max-w-7xl mx-auto">
    <Logo />

    {#if !page.data.user}
      <div class="hidden md:flex gap-10">
        {#each navItems as { href, label }}
          <a
            class="hover:text-primary duration-100 font-semibold"
            {href}
            onclick={smoothScrollAnchorClick}>{label}</a
          >
        {/each}
      </div>
    {/if}

    <div class="flex gap-5 items-center">
      {#if page.data.user}
        {#if page.url.pathname === "/"}
          <div class={cn("mr-0 md:mr-24")}>
            <LinkButton label="Generate Rizz!" href="/conversation-helper" />
          </div>
        {/if}
        <ProfileDropdownMenu
          wrapperClass={cn(page.url.pathname === "/" && "hidden md:block")}
        />
      {:else}
        <a
          class="text-primary font-bold duration-100 hidden md:block"
          href="/sign-in">Login</a
        >
        <LinkButton label="Get Started" href="/sign-in" />
      {/if}
    </div>
  </div>
</nav>
