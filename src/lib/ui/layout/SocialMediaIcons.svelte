<script lang="ts">
  import Icon from "@iconify/svelte";

  const socialLinks = [
    {
      name: "github",
      href: "https://github.com/Metaphysics0/rizzGPT",
      icon: "mdi:github",
    },
    {
      name: "instagram",
      href: "https://www.instagram.com/mathrockryan/",
      icon: "mdi:instagram",
    },
    {
      name: "linkedin",
      href: "https://www.linkedin.com/in/ryanroberts0/",
      icon: "mdi:linkedin",
    },
  ] as const;
</script>

<section class="flex items-center mx-auto w-fit h-max">
  {#each socialLinks as link}
    <a
      href={link.href}
      target="_blank"
      rel="noreferrer"
      class="h-full mx-3 opacity-50 hover:opacity-100 transition ease-in-out"
    >
      <Icon icon={link.icon} height="35" />
    </a>
  {/each}
</section>
