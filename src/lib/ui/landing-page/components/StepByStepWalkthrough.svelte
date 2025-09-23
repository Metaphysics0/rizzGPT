<script lang="ts">
  import placeholderGif from "$lib/assets/product-walkthrough/upload-screenshot.gif";

  const steps = [
    {
      id: "01",
      title: "Take screenshot",
      description:
        "Take a screenshot that includes some text you want to focus on in their bio",
      image: placeholderGif,
      bgColorClass: "bg-orange",
    },
    {
      id: "02",
      title: "Upload",
      description: "Click on the upload button and select the screenshot.",
      image: placeholderGif,
      bgColorClass: "bg-secondary",
    },
    {
      id: "03",
      title: "Get a flirty message",
      description:
        'Within moments, RizzGPT crafts a dating expert approved message based on the provided screenshot. For additional lines, simply press "Generate More".',
      image: placeholderGif,
      bgColorClass: "bg-blue",
    },
  ];
</script>

<div class="flex flex-col gap-24 md:gap-12 px-20">
  {#each steps as step, i}
    {@const reverse = i % 2 !== 0}
    <div
      class="flex flex-col items-center gap-8"
      class:md:flex-row={!reverse}
      class:md:flex-row-reverse={reverse}
    >
      <div class="flex-1 w-full">
        <div class="step relative rounded-[40px] {step.bgColorClass}">
          <img
            alt={step.title}
            loading="lazy"
            src={step.image}
            class="rounded-[40px] w-full h-full object-contain"
          />
        </div>
      </div>
      <div
        class="flex-1 flex flex-col lg:flex-row text-center lg:text-left items-center gap-8"
      >
        <div
          class="aspect-square min-w-[100px] flex items-center justify-center rounded-full bg-black shadow-lg text-white font-bold text-5xl"
        >
          {step.id}
        </div>
        <div>
          <h3 class="mb-4 font-bold text-2xl">{step.title}</h3>
          <p class="text-gray-600">{step.description}</p>
        </div>
      </div>
    </div>

    {#if i < steps.length - 1}
      <!-- NOTE: The original HTML included decorative line SVGs between steps. -->
      <!-- These assets were not found and have been omitted. -->
    {/if}
  {/each}
</div>

<style>
  .step {
    height: 450px;
    max-width: 450px;
    margin: auto;
  }
  .bg-orange {
    background-color: #ff8248;
  }
  .bg-secondary {
    background-color: #e74a7e;
  }
  .bg-blue {
    background-color: #574afb;
  }
</style>
