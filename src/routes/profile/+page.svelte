<script lang="ts">
  import type { PageData } from "./$types";
  import UsageDisplay from "$lib/ui/subscription/UsageDisplay.svelte";
  import ProfileBadge from "$lib/ui/profile/ProfileBadge.svelte";
  import SubscribeToProCard from "$lib/ui/subscription/SubscribeToProCard.svelte";

  let { data }: { data: PageData } = $props();
</script>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
  <!-- <ProfileBadge user={data.user} /> -->

  <SubscribeToProCard />
</div>
