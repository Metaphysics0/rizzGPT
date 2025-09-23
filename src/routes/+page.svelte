<script lang="ts">
  import LinkButton from "$lib/ui/general/LinkButton.svelte";
  import HowItWorks from "$lib/ui/landing-page/components/HowItWorks.svelte";
  import StepByStepWalkthrough from "$lib/ui/landing-page/components/StepByStepWalkthrough.svelte";
  import Testimonials from "$lib/ui/landing-page/components/Testimonials.svelte";
  import DatingAppsCarousel from "$lib/ui/landing-page/components/DatingAppsCarousel.svelte";
  import HeroSection from "$lib/ui/landing-page/HeroSection.svelte";
  import TryItOut from "$lib/ui/landing-page/TryItOut.svelte";

  console.log("hello");
</script>

<HeroSection />
<DatingAppsCarousel />

<section class="py-20 bg-white">
  <Testimonials />
  <div class="flex justify-center pt-24 pb-10">
    <LinkButton label="Try it for free" href="/sign-in" />
  </div>
</section>

<HowItWorks />
<StepByStepWalkthrough />

<div class="flex justify-center py-36">
  <LinkButton label="Try it for free" href="/sign-in" />
</div>

<section class="py-16 px-4 bg-gray-50">
  <TryItOut />

  <div class="flex justify-center py-32">
    <LinkButton label="Try it for free" href="/sign-in" />
  </div>
</section>
<!-- <div class="flex justify-center py-36">
</div> -->
