<script lang="ts">
  let { header, subheader }: { header: string; subheader: string } = $props();
</script>

<h1 class="heading-secondary mb-2">{header}</h1>
<p class="text-responsive-md">{subheader}</p>
