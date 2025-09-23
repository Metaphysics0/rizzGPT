<script lang="ts">
  import HowItWorks from "$lib/ui/landing-page/components/HowItWorks.svelte";
  import StepByStepWalkthrough from "$lib/ui/landing-page/components/StepByStepWalkthrough.svelte";
  import Testimonials from "$lib/ui/landing-page/components/Testimonials.svelte";
  import DatingAppsCarousel from "$lib/ui/landing-page/components/DatingAppsCarousel.svelte";
  import HeroSection from "$lib/ui/landing-page/HeroSection.svelte";
  import TryItOut from "$lib/ui/landing-page/TryItOut.svelte";
  import Pricing from "$lib/ui/landing-page/components/Pricing.svelte";
  import FAQ from "$lib/ui/landing-page/components/FAQ.svelte";
  import Footer from "$lib/ui/landing-page/components/Footer.svelte";
  import TryItForFreeButton from "$lib/ui/landing-page/components/TryItForFreeButton.svelte";
</script>

<HeroSection />
<DatingAppsCarousel />

<section class="py-20 bg-white">
  <Testimonials />
  <TryItForFreeButton className="pt-24 pb-10" />
</section>

<HowItWorks />
<StepByStepWalkthrough />
<TryItForFreeButton className="py-36" />

<section class="py-16 px-4 bg-gray-50">
  <TryItOut />

  <TryItForFreeButton className="py-32" />
</section>

<Pricing />
<FAQ />
<TryItForFreeButton className="pb-20" />
<Footer />
