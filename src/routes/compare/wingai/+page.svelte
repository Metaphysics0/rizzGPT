<script>
  import { wingAiComparison } from "$lib/constants/comparison/wingai";
  import ComparisonTable from "$lib/ui/landing-page/components/ComparisonTable.svelte";
  import TextContentCard from "$lib/ui/layout/TextContentCard.svelte";
</script>

<svelte:head>
  <title>Better than WingAI</title>
</svelte:head>

<TextContentCard fullHeight={false} header="WingAI">
  <p>
    <a class="text-blue-400" href="https://www.wingai.app/" target="_blank"
      >WingAI</a
    > is marketed as an 'ai wingman dating assistant', but it essentially just has
    one small feature of generating a first move, and is honestly kind of a joke
    to use.
  </p>
</TextContentCard>
<ComparisonTable competitorName="WingAI" features={wingAiComparison} />
