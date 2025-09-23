<script>
  import DownloadAppButtons from "./components/DownloadAppButtons.svelte";
  import IPhoneAnimatedGif from "./components/IPhoneAnimatedGif.svelte";
  import SatisfiedUsers from "./components/SatisfiedUsers.svelte";
  import TrustpilotScore from "./components/TrustpilotScore.svelte";
</script>

<section
  class="grid lg:grid-cols-2 lg:grid-rows-2 gap-x-4 gap-y-24 lg:gap-y-10 px-5 pt-10"
>
  <div class="flex flex-col justify-center gap-4">
    <TrustpilotScore />
    <h4 class="text-6xl font-bold tracking-wide leading-20">
      Land 3.5x More Dates Using RizzGPT. Guaranteed.
    </h4>
    <p class="text-2xl mb-3">
      We've tested 100,000+ messages and trained our AI to land you more dates.
      And we're going to let you try it free for 7 days.
    </p>
    <DownloadAppButtons className="h-16" />
  </div>
  <div>
    <IPhoneAnimatedGif />
  </div>
  <div>
    <SatisfiedUsers />
  </div>
</section>
