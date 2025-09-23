<script lang="ts">
  import LinkButton from "$lib/ui/general/LinkButton.svelte";
  import HowItWorks from "$lib/ui/landing-page/components/HowItWorks.svelte";
  import StepByStepWalkthrough from "$lib/ui/landing-page/components/StepByStepWalkthrough.svelte";
  import Testimonials from "$lib/ui/landing-page/components/Testimonials.svelte";
  import DatingAppsCarousel from "$lib/ui/landing-page/DatingAppsCarousel.svelte";
  import HeroSection from "$lib/ui/landing-page/HeroSection.svelte";

  console.log("hello");
</script>

<HeroSection />
<DatingAppsCarousel />
<Testimonials />

<div class="flex justify-center pb-32">
  <LinkButton label="Try it for free" href="/sign-in" />
</div>

<HowItWorks />
<StepByStepWalkthrough />

<div class="flex justify-center py-36">
  <LinkButton label="Try it for free" href="/sign-in" />
</div>
