<script lang="ts">
  import GeneratedResponseItem from "$lib/ui/generated-response/GeneratedResponseItem.svelte";
  import TinderBioScreenshot from "$lib/assets/leah-app.webp";
  import LinkButton from "../general/LinkButton.svelte";

  const sampleResponses = [
    "Squat rack and dog dates? You've got an interesting idea of romance, don't you?",
    "So, you snowboard but you're stuck in Florida? You really thought this through...",
    "New to Florida and already hunting for the best taco...your priorities are spot on.",
  ];
</script>

<div class="max-w-6xl mx-auto">
  <div class="text-center mb-12">
    <h2 class="text-4xl font-bold text-gray-900 mb-4">Try it out</h2>
  </div>

  <div class="grid lg:grid-cols-2 gap-8 items-center">
    <div
      class="flex flex-col items-center gap-6 relative p-8 rounded-3xl bg-[#DDDBFE] shadow-try aos-init aos-animate"
    >
      <!-- Left side - Phone mockup -->
      <img
        src={TinderBioScreenshot}
        alt="Tinder bio screenshot"
        class="rounded-2xl border-2 border-black max-w-[260px] max-h-[391px]"
      />
      <LinkButton label="Generate messages" href="/sign-in" />
    </div>

    <!-- Right side - Generated messages -->
    <div class="space-y-6">
      <div class="bg-pink-100 rounded-2xl p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">
          Generated messages
        </h3>

        <div class="space-y-3">
          {#each sampleResponses as response, index}
            <GeneratedResponseItem {index} {response} />
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>
