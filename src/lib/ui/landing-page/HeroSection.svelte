<script>
  import DownloadAppButtons from "./components/DownloadAppButtons.svelte";
  import IPhoneAnimatedGif from "./components/IPhoneAnimatedGif.svelte";
  import TrustpilotScore from "./components/TrustpilotScore.svelte";
</script>

<section class="grid grid-cols-2 px-5">
  <div class="flex flex-col justify-center gap-4">
    <TrustpilotScore />
    <h4 class="text-5xl">Land 3.5x More Dates Using RizzGPT. Guaranteed</h4>
    <p class="text-2xl">
      We've tested 100,000+ messages and trained our AI to land you more dates.
      And we're going to let you try it free for 7 days.
    </p>
    <DownloadAppButtons />
  </div>
  <div>
    <IPhoneAnimatedGif />
  </div>
</section>
