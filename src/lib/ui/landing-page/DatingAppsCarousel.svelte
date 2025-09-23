<script lang="ts">
  import * as Carousel from "$lib/ui/carousel";

  import BadooLogo from "$lib/assets/dating-app-logos/badoo.svg";
  import BumbleLogo from "$lib/assets/dating-app-logos/bumble.svg";
  import HingeLogo from "$lib/assets/dating-app-logos/hinge.svg";
  import OkcupidLogo from "$lib/assets/dating-app-logos/okcupid.svg";
  import TinderLogo from "$lib/assets/dating-app-logos/tinder.svg";

  const datingApps = [
    { name: "Tinder", logo: TinderLogo },
    { name: "Bumble", logo: BumbleLogo },
    { name: "Hinge", logo: HingeLogo },
    { name: "OkCupid", logo: OkcupidLogo },
    { name: "Badoo", logo: BadooLogo },
    { name: "Tinder", logo: TinderLogo },
    { name: "Bumble", logo: BumbleLogo },
    { name: "Hinge", logo: HingeLogo },
    { name: "OkCupid", logo: OkcupidLogo },
  ];
</script>

<section class="py-20 bg-secondary">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-shadow-lg">
    <div class="text-center mb-16">
      <h2 class="text-4xl font-bold text-white mb-4">
        Works with all dating apps
      </h2>
    </div>

    <Carousel.Root>
      <Carousel.Content>
        {#each datingApps as { name, logo }}
          <Carousel.Item class="basis-1/4">
            <img
              src={logo}
              alt={name + " Logo"}
              class="h-16 max-h-16 object-contain mx-auto"
            />
          </Carousel.Item>
        {/each}
      </Carousel.Content>
    </Carousel.Root>
  </div>
</section>
