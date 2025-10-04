<script lang="ts">
  import * as Carousel from "$lib/components/carousel";
  import { landingPageReviews } from "$lib/constants/landing-page-reviews.constant";
  import { m } from "$lib/paraglide/messages";
  import { sample } from "$lib/utils/array.util";
  import Icon from "@iconify/svelte";

  const reviews = sample(landingPageReviews, 6);
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="reviews">
  <div class="text-center mb-16">
    <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
      {m.testimonials_header()}
    </h2>
  </div>

  <Carousel.Root
    opts={{ loop: false, containScroll: "trimSnaps", align: "start" }}
  >
    <Carousel.Content class="ml-0">
      {#each reviews as review}
        <Carousel.Item class="basis-full md:basis-1/2 lg:basis-1/3 pl-4 pr-4">
          <div
            class="bg-white rounded-lg border-2 {review.borderColor} p-6 h-full"
          >
            <!-- Star Rating -->
            <div class="flex mb-3">
              {#each Array(review.rating) as _}
                <Icon icon="mdi:star" class="w-6 h-6 text-yellow-400" />
              {/each}
            </div>

            <!-- Name and Date -->
            <div class="text-gray-600 text-sm mb-4">
              {review.name}, {review.date}
            </div>

            <!-- Title -->
            <h3 class="font-bold text-gray-900 text-lg mb-3">
              {review.title}
            </h3>

            <!-- Content -->
            <p class="text-gray-700 leading-relaxed">
              {review.content}
            </p>
          </div>
        </Carousel.Item>
      {/each}
    </Carousel.Content>
    <Carousel.Dots class="mt-10" variant="primary" />
  </Carousel.Root>
</div>
