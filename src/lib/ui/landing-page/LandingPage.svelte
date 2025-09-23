<script lang="ts">
  import TryItForFreeButton from "./components/TryItForFreeButton.svelte";
  import HowItWorks from "./components/HowItWorks.svelte";
  import { Footer } from "../dialog";
  import DatingAppsCarousel from "./components/DatingAppsCarousel.svelte";
  import FAQ from "./components/FAQ.svelte";
  import HeroSection from "./components/HeroSection.svelte";
  import Pricing from "./components/Pricing.svelte";
  import StepByStepWalkthrough from "./components/StepByStepWalkthrough.svelte";
  import Testimonials from "./components/Testimonials.svelte";
  import TryItOut from "./components/TryItOut.svelte";
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
