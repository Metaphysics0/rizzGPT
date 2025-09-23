<script lang="ts">
  import IPhoneGif from "$lib/assets/iphone-vid.gif";
  import CircleAndEmojiSvg from "$lib/assets/ui-svgs/CircleAndEmojiSvg.svelte";
</script>

<div class="relative bottom-14 lg:bottom-0 h-[415px] lg:h-[600px]">
  <img
    src={IPhoneGif}
    alt="iphone-vid"
    class="z-10 object-contain scale-90 lg:scale-100 absolute h-full w-full inset-0"
  />
  <div class="relative top-24 lg:absolute lg:-right-14 xl:right-4 lg:top-10">
    <CircleAndEmojiSvg />
  </div>
  <h4
    class="w-[200px] md:w-[360px] mx-auto absolute bottom-[-78px] lg:bottom-28 left-10 md:left-32 lg:left-10 text-2xl lg:text-3xl font-bold"
  >
    Upload their Bio &amp; Get suggestions for chats...
  </h4>
</div>
