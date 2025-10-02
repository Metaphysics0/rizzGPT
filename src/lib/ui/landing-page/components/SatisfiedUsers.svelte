<script lang="ts">
  import RandomAvatars from "./RandomAvatars.svelte";

  const { amountOfUsersToDisplay = 5 }: { amountOfUsersToDisplay?: number } =
    $props();
</script>

<div
  class="relative flex flex-col items-center justify-end gap-8 px-6 bg-primary text-center text-white rounded-t-full h-[310px] mt-auto w-[278px]"
>
  <RandomAvatars {amountOfUsersToDisplay} className="absolute -top-6" />
  <h5 class="text-3xl">Join 1000s of satisfied users ;)</h5>
  <a
    class="font-light border py-2 px-8 mb-10 rounded-full hover:text-primary hover:bg-white duration-300"
    href="#review">See reviews</a
  >
</div>
