<script lang="ts">
  import * as Carousel from "$lib/ui/carousel";

  import badooLogo from "$lib/assets/dating-app-logos/badoo.svg";
  import bumbleLogo from "$lib/assets/dating-app-logos/bumble.svg";
  import hingeLogo from "$lib/assets/dating-app-logos/hinge.svg";
  import instagramLogo from "$lib/assets/dating-app-logos/instagram-logo-white.png";
  import okcupidLogo from "$lib/assets/dating-app-logos/okcupid.svg";
  import tinderLogo from "$lib/assets/dating-app-logos/tinder.svg";

  const datingApps = [
    { name: "Tinder", logo: tinderLogo },
    { name: "Instagram", logo: instagramLogo },
    { name: "Bumble", logo: bumbleLogo },
    { name: "Hinge", logo: hingeLogo },
    { name: "OkCupid", logo: okcupidLogo },
    { name: "Badoo", logo: badooLogo },
    { name: "Tinder", logo: tinderLogo },
    { name: "Bumble", logo: bumbleLogo },
    { name: "Hinge", logo: hingeLogo },
    { name: "OkCupid", logo: okcupidLogo },
  ];
</script>

<section class="py-20 bg-gradient-to-br from-pink-400 to-indigo-400">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-shadow-lg">
    <div class="text-center mb-16">
      <h2 class="text-4xl font-bold text-white mb-4">
        Works with all dating apps
      </h2>
      <p class="text-xl text-purple-100">
        RizzGPT integrates seamlessly with virtually any dating app or platform
        that uses text and images.
      </p>
    </div>

    <Carousel.Root>
      <Carousel.Content>
        <Carousel.Item class="basis-1/3">...</Carousel.Item>
        <Carousel.Item class="basis-1/3">...</Carousel.Item>
        <Carousel.Item class="basis-1/3">...</Carousel.Item>
      </Carousel.Content>
    </Carousel.Root>
  </div>
</section>
