<script lang="ts">
  import IPhoneGif from "$lib/assets/iphone-vid.gif";
  import CircleAndEmojiSvg from "$lib/assets/ui-svgs/CircleAndEmojiSvg.svelte";
</script>

<div class="relative">
  <CircleAndEmojiSvg className="absolute -right-11 top-11" />
  <img src={IPhoneGif} alt="iphone-vid" class="relative z-10" />
  <h4 class="pl-3 text-3xl font-bold w-[calc(100%-3rem)]">
    Upload their Bio &amp; Get suggestions for chats...
  </h4>
</div>
