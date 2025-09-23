<script lang="ts">
  import placeholderGif from "$lib/assets/product-walkthrough/upload-screenshot.gif";
  import OrangeLine from "$lib/assets/ui-svgs/orange-line.svg";
  import BlueLine from "$lib/assets/ui-svgs/blue-line.svg";

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
  {#each steps as step, idx}
    {@const reverse = idx % 2 !== 0}
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
        class="flex-1 flex flex-col lg:flex-row text-center lg:text-left items-center gap-4 md:gap-6 lg:gap-8"
      >
        <div
          class="aspect-square min-w-[60px] md:min-w-[80px] lg:min-w-[100px] flex items-center justify-center rounded-full bg-black shadow-lg text-white font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
        >
          {step.id}
        </div>
        <div>
          <h3
            class="mb-2 md:mb-3 lg:mb-4 font-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl"
          >
            {step.title}
          </h3>
          <p class="text-gray-600 text-lg md:text-base lg:text-lg xl:text-xl">
            {step.description}
          </p>
        </div>
      </div>
    </div>

    {#if idx === 0}
      <img
        src={OrangeLine}
        alt="decorative line"
        class="w-[52%] hidden md:block mx-auto"
      />
    {:else if idx === 1}
      <img
        src={BlueLine}
        alt="decorative line"
        class="w-[52%] hidden md:block mx-auto"
      />
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
