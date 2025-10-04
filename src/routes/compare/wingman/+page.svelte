<script>
  import { wingAiComparison } from "$lib/constants/comparison/wingai";
  import ComparisonTable from "$lib/ui/landing-page/components/ComparisonTable.svelte";
  import TextContentCard from "$lib/ui/layout/TextContentCard.svelte";
</script>

<svelte:head>
  <title>Better than Wingman</title>
</svelte:head>

<TextContentCard fullHeight={false} header="Wingman">
  <p>
    <a class="text-blue-400" href="https://wingman.live/" target="_blank"
      >Wingman</a
    > is a mobile app that has a few features for helping with matches
  </p>
</TextContentCard>
<ComparisonTable competitorName="Wingman" features={wingAiComparison} />
