<script lang="ts">
  const { amountOfUsersToDisplay = 5 }: { amountOfUsersToDisplay?: number } =
    $props();

  function generateRandomAvatars(count: number) {
    return Array.from({ length: count }, (_, idx) => {
      const gender = Math.random() > 0.5 ? "men" : "women";
      const userNumber = Math.floor(Math.random() * 99) + 1; // 1-99 for more variety
      return {
        id: idx,
        avatar: `https://randomuser.me/api/portraits/${gender}/${userNumber}.jpg`,
        alt: `User ${gender.slice(0, -1)} avatar ${idx + 1}`,
      };
    });
  }

  const randomAvatars = generateRandomAvatars(amountOfUsersToDisplay);
</script>

<div
  class="relative flex flex-col items-center justify-end gap-8 px-6 bg-primary text-center text-white rounded-t-full h-[310px] mt-auto w-[278px]"
>
  <div class="absolute -top-6 flex items-center">
    {#each randomAvatars as user (user.id)}
      <img
        alt={user.alt}
        loading="lazy"
        width="62"
        height="62"
        decoding="async"
        class="aspect-square rounded-full -ml-4 border border-white bg-black"
        src={user.avatar}
      />
    {/each}
    <div
      class="aspect-square w-[62px] bg-black rounded-full -ml-4 flex items-center justify-center text-white text-xl"
    >
      +1000
    </div>
  </div>
  <h5 class="text-3xl">Join 1000s of satisfied users ;)</h5>
  <a
    class="font-light border py-2 px-8 mb-10 rounded-full hover:text-primary hover:bg-white duration-300"
    href="#review">See reviews</a
  >
</div>
