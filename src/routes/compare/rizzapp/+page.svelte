<script>
  import { rizzAppComparison } from "$lib/constants/comparison/rizz-app";
  import { wingAiComparison } from "$lib/constants/comparison/wingai";
  import ComparisonTable from "$lib/ui/landing-page/components/ComparisonTable.svelte";
  import TextContentCard from "$lib/ui/layout/TextContentCard.svelte";
</script>

<svelte:head>
  <title>Better than RizzApp</title>
</svelte:head>

<TextContentCard fullHeight={false} header="Rizz App">
  <p>
    <a class="text-blue-400" href="https://rizz.app/" target="_blank"
      >Rizz.app</a
    >
    is a dating assistant mobile app that gives the ability to generate follow up
    responses to a partner. After using it extensively, the responses are extremly
    low quality, it is overpriced, and watered down.
  </p>
</TextContentCard>
<ComparisonTable competitorName="RizzApp" features={rizzAppComparison} />
