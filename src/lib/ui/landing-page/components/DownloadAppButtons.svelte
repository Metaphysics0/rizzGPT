<script lang="ts">
  import AppStoreButton from "$lib/assets/app-store.svg";
  import GooglePlayButton from "$lib/assets/google-play.svg";
  import { cn } from "$lib/utils";

  let { className }: { className?: string } = $props();
</script>

<div class={cn("flex items-center gap-2", className)}>
  <img src={GooglePlayButton} alt="google-play-store-button" class="h-full w-auto" />
  <img src={AppStoreButton} alt="app-store-button" class="h-full w-auto" />
</div>
