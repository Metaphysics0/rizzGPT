<script lang="ts">
  import IPhoneGif from "$lib/assets/product-walkthrough/upload-screenshot.gif";
  import CircleAndEmojiSvg from "$lib/assets/ui-svgs/CircleAndEmojiSvg.svelte";
  import CircleAndEmojiSvgSmall from "$lib/assets/ui-svgs/CircleAndEmojiSvgSmall.svelte";
  import { m } from "$lib/paraglide/messages";
</script>

<div class="relative bottom-14 lg:bottom-0 h-[415px] lg:h-[600px] mb-16 lg:mb-0">
  <img
    src={IPhoneGif}
    alt="Iphone video of uploading a screenshot"
    class="z-10 object-contain scale-90 lg:scale-100 absolute h-full w-full inset-0"
  />
  <div class="hidden lg:block lg:absolute lg:-right-14 xl:right-4 lg:top-10">
    <CircleAndEmojiSvgSmall />
    <CircleAndEmojiSvg />
  </div>
  <h4
    class="w-[200px] md:w-[360px] mx-auto absolute bottom-[-78px] left-24 text-2xl lg:text-3xl font-bold"
  >
    {m.upload_their_bio()}
  </h4>
</div>
