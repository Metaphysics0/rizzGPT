<script lang="ts">
  import * as Carousel from "$lib/components/carousel";
  import { m } from "$lib/paraglide/messages";
  import Icon from "@iconify/svelte";

  const testimonials = [
    {
      id: 1,
      name: "Marcus_T",
      date: "08/14/2024",
      rating: 5,
      title: "Actually saved my dating life fr",
      content:
        "no cap this app is clutch. used to send the most basic 'hey' messages and wonder why girls never replied 💀 now i'm getting actual convos started. the AI suggestions are lowkey genius and don't sound cringe like other apps",
      borderColor: "border-blue-400",
    },
    {
      id: 2,
      name: "SarahK_23",
      date: "09/03/2024",
      rating: 5,
      title: "Finally something that gets it",
      content:
        "As someone who's terrible at small talk, this has been a lifesaver! The conversation starters actually feel natural and help me show my personality instead of just being another boring opener.",
      borderColor: "border-red-400",
    },
    {
      id: 3,
      name: "zay_vibes",
      date: "07/28/2024",
      rating: 5,
      title: "this app is actually goated 🔥",
      content:
        "bro i was skeptical at first but this thing generates some FIRE openers. went from getting left on read to actually having decent convos. premium is definitely worth it if you're serious about not being single forever lmao",
      borderColor: "border-pink-400",
    },
    {
      id: 4,
      name: "Emma_Rodriguez",
      date: "06/19/2024",
      rating: 5,
      title: "Game changer for introverts",
      content:
        "I'm naturally shy and always struggled with making the first move. This app gives me confidence by suggesting conversation starters that actually match the person's profile. My match rate has improved so much!",
      borderColor: "border-purple-400",
    },
    {
      id: 5,
      name: "jayden.codes",
      date: "08/07/2024",
      rating: 5,
      title: "developer approved ✅",
      content:
        "as a software engineer i appreciate good UX and this app delivers. the AI actually reads profiles and suggests relevant openers instead of generic garbage. been using it for months and still impressed",
      borderColor: "border-green-400",
    },
    {
      id: 6,
      name: "riley_adventures",
      date: "09/12/2024",
      rating: 5,
      title: "Perfect for busy people",
      content:
        "Between work and grad school I barely have time to craft thoughtful messages. This app does the heavy lifting while still letting me sound like myself. Honestly wish I found this sooner!",
      borderColor: "border-yellow-400",
    },
  ];
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
      {#each testimonials as testimonial}
        <Carousel.Item class="basis-full md:basis-1/2 lg:basis-1/3 pl-4 pr-4">
          <div
            class="bg-white rounded-lg border-2 {testimonial.borderColor} p-6 h-full"
          >
            <!-- Star Rating -->
            <div class="flex mb-3">
              {#each Array(testimonial.rating) as _}
                <Icon icon="mdi:star" class="w-6 h-6 text-yellow-400" />
              {/each}
            </div>

            <!-- Name and Date -->
            <div class="text-gray-600 text-sm mb-4">
              {testimonial.name}, {testimonial.date}
            </div>

            <!-- Title -->
            <h3 class="font-bold text-gray-900 text-lg mb-3">
              {testimonial.title}
            </h3>

            <!-- Content -->
            <p class="text-gray-700 leading-relaxed">
              {testimonial.content}
            </p>
          </div>
        </Carousel.Item>
      {/each}
    </Carousel.Content>
    <Carousel.Dots class="mt-10" variant="primary" />
  </Carousel.Root>
</div>
