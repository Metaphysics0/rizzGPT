<script lang="ts">
  import { cn } from "$lib/utils";

  const {
    amountOfUsersToDisplay = 5,
    plusButtonNumber = 1000,
    className,
  }: {
    amountOfUsersToDisplay?: number;
    plusButtonNumber?: number;
    className?: string;
  } = $props();

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

<div class={cn("flex items-center", className)}>
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
    +{plusButtonNumber}
  </div>
</div>
