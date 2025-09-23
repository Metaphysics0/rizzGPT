<script lang="ts">
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

<nav class="flex w-full justify-around">
  <Logo />
  <div>
    {#each NAV_ITEMS as { href, label }}
      <a {href}>{label}</a>
    {/each}
  </div>

  <div>
    <button>Login</button>
    <button>Get Started</button>
  </div>
</nav>
