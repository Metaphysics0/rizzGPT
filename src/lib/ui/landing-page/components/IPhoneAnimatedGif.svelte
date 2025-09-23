<script lang="ts">
  import IPhoneGif from "$lib/assets/iphone-vid.gif";
  import CircleAndEmojiSvg from "$lib/assets/ui-svgs/CircleAndEmojiSvg.svelte";
  import CircleAndEmojiSvgSmall from "$lib/assets/ui-svgs/CircleAndEmojiSvgSmall.svelte";
</script>

<div class="relative bottom-14 lg:bottom-0 h-[415px] lg:h-[600px]">
  <img
    src={IPhoneGif}
    alt="iphone-vid"
    class="z-10 object-contain scale-90 lg:scale-100 absolute h-full w-full inset-0"
  />
  <div class="relative top-24 lg:absolute lg:-right-14 xl:right-4 lg:top-10">
    <CircleAndEmojiSvgSmall />
    <div class="hidden lg:block">
      <CircleAndEmojiSvg />
    </div>
  </div>
  <h4
    class="w-[200px] md:w-[360px] mx-auto absolute bottom-[-78px] left-24 text-2xl lg:text-3xl font-bold"
  >
    Upload their Bio &amp; Get suggestions for chats...
  </h4>
</div>
