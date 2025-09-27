<script>
  import { m } from "$lib/paraglide/messages";
  import DownloadAppButtons from "./DownloadAppButtons.svelte";
  import IPhoneAnimatedGif from "./IPhoneAnimatedGif.svelte";
  import SatisfiedUsers from "./SatisfiedUsers.svelte";
  import TrustpilotScore from "./TrustpilotScore.svelte";
</script>

<section
  class="grid lg:grid-cols-2 lg:grid-rows-2 gap-x-4 gap-y-24 lg:gap-y-10 px-4 sm:px-8 md:px-12 lg:px-20 pt-6 sm:pt-8 lg:pt-10"
>
  <div class="flex flex-col justify-center gap-4">
    <TrustpilotScore />
    <h4
      class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide leading-tight sm:leading-snug md:leading-normal"
    >
      {m.landing_header()}
    </h4>
    <p class="text-lg sm:text-xl md:text-2xl mb-3">
      {m.landing_subheader()}
    </p>
    <DownloadAppButtons className="h-12 md:h-16" />
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
