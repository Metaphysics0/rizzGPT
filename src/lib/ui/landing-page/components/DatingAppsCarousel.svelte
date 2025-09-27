<script lang="ts">
  import * as Carousel from "$lib/components/carousel";

  import BadooLogo from "$lib/assets/dating-app-logos/badoo.svg";
  import BumbleLogo from "$lib/assets/dating-app-logos/bumble.svg";
  import HingeLogo from "$lib/assets/dating-app-logos/hinge.svg";
  import OkcupidLogo from "$lib/assets/dating-app-logos/okcupid.svg";
  import TinderLogo from "$lib/assets/dating-app-logos/tinder.svg";
  import { m } from "$lib/paraglide/messages";

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

<section class="py-10 pt-15 bg-secondary">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-shadow-lg">
    <div class="text-center mb-16">
      <h2 class="text-4xl font-bold text-white mb-4">
        {m.dating_app_carousel_header()}
      </h2>
    </div>

    <Carousel.Root opts={{ loop: false, containScroll: "trimSnaps" }}>
      <Carousel.Content class="ml-0">
        {#each datingApps as { name, logo }}
          <Carousel.Item class="basis-1/4 pl-2 pr-2 flex-shrink-0">
            <img
              src={logo}
              alt={name + " Logo"}
              class="h-16 max-h-16 object-contain mx-auto"
            />
          </Carousel.Item>
        {/each}
      </Carousel.Content>
      <Carousel.Dots class="mt-10" />
    </Carousel.Root>
  </div>
</section>
