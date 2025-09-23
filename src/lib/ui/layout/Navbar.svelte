<script lang="ts">
  import LinkButton from "../general/LinkButton.svelte";
  import Logo from "./Logo.svelte";

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
</script>

<nav class="flex w-full justify-around items-center">
  <Logo />

  <div class="flex gap-10">
    {#each NAV_ITEMS as { href, label }}
      <a class="hover:text-primary duration-100" {href}>{label}</a>
    {/each}
  </div>

  <div class="flex gap-5 items-center">
    <a class="text-primary font-bold duration-100" href="/sign-in">Login</a>
    <LinkButton label="Get Started" href="/sign-in" />
  </div>
</nav>
