<script>
  import { m } from "$lib/paraglide/messages";
  import LinkButton from "$lib/ui/general/LinkButton.svelte";
  import IPhoneAnimatedGif from "./IPhoneAnimatedGif.svelte";
  import SatisfiedUsers from "./SatisfiedUsers.svelte";
  import TrustpilotScore from "./TrustpilotScore.svelte";
</script>

<section
  class="grid lg:grid-cols-2 lg:grid-rows-2 gap-x-4 gap-y-24 lg:gap-y-10 px-4 sm:px-8 md:px-12 lg:px-20 pt-6 sm:pt-8 lg:pt-10"
  id="home"
>
  <div class="flex flex-col justify-center gap-4">
    <TrustpilotScore />
    <h4 class="heading-hero">
      {m.landing_header()}
    </h4>
    <p class="text-responsive-lg mb-3">
      {m.landing_subheader()}
    </p>

    <LinkButton
      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-xl hover:scale-105 transform transition-all duration-300 w-1/2 rounded-2xl mx-auto lg:mx-0"
      label="Start Now"
      href="/sign-in"
    />
  </div>
  <div class="lg:row-span-2 lg:col-start-2 lg:row-start-1 aos-init aos-animate">
    <IPhoneAnimatedGif />
  </div>
  <div
    class="z-10 order-3 lg:col-start-1 lg:row-start-2 flex flex-col items-center lg:items-start aos-init aos-animate"
  >
    <SatisfiedUsers />
  </div>
</section>
