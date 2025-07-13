<script lang="ts">
  import emblaCarouselSvelte from "embla-carousel-svelte";
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

  const emblaOptions = {
    loop: true,
  };

  let emblaApi: any;
  let selectedIndex = 0;
  let scrollSnaps: number[] = [];

  function onInit(event: any) {
    emblaApi = event.detail;
    scrollSnaps = emblaApi.scrollSnapList();
    selectedIndex = emblaApi.selectedScrollSnap();

    emblaApi.on("select", () => {
      selectedIndex = emblaApi.selectedScrollSnap();
    });
  }

  function scrollTo(index: number) {
    if (emblaApi) emblaApi.scrollTo(index);
  }
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

    <div class="relative">
      <div
        class="embla"
        use:emblaCarouselSvelte={{
          options: emblaOptions,
          plugins: [],
        }}
        on:emblaInit={onInit}
      >
        <div class="embla__container">
          {#each datingApps as app}
            <div class="embla__slide">
              <div
                class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mx-4 flex items-center justify-center"
              >
                <img
                  src={app.logo}
                  alt={app.name}
                  class="w-32 h-32 object-contain"
                />
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Pagination Dots -->
      <div class="flex justify-center mt-8 space-x-2">
        {#each scrollSnaps as _, index}
          <button
            class="w-3 h-3 rounded-full transition-all duration-300 {selectedIndex ===
            index
              ? 'bg-white'
              : 'bg-white/30 hover:bg-white/50'}"
            on:click={() => scrollTo(index)}
            aria-label="Go to slide {index + 1}"
          />
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .embla {
    overflow: hidden;
  }

  .embla__container {
    display: flex;
  }

  .embla__slide {
    flex: 0 0 100%;
    min-width: 0;
  }

  @media (min-width: 640px) {
    .embla__slide {
      flex: 0 0 50%;
    }
  }

  @media (min-width: 768px) {
    .embla__slide {
      flex: 0 0 33.333333%;
    }
  }

  @media (min-width: 1024px) {
    .embla__slide {
      flex: 0 0 20%;
    }
  }
</style>
