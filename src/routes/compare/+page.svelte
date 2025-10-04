<script>
  import { wingAiComparison } from "$lib/constants/comparison/wingai";
  import ComparisonTable from "$lib/ui/landing-page/components/ComparisonTable.svelte";
</script>

<svelte:head>
  <title>RizzGPT - Comparison</title>
</svelte:head>

<ComparisonTable competitorName="Others" features={wingAiComparison} />
