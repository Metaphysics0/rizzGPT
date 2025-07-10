<script lang="ts">
  import { relationshipObjectives } from "$lib/constants/relationship-objectives.constant";
  import { relationshipDetails } from "$lib/stores/form.store";
  import FormStep from "./FormStep.svelte";

  function getDurationLabel(duration: number): string {
    if (duration === 0) return "Just started talking";
    if (duration <= 25) return "Few messages exchanged";
    if (duration <= 50) return "Been chatting a while";
    if (duration <= 75) return "Getting to know each other";
    return "Long established conversation";
  }
</script>

<FormStep
  title="2. Relationship Context"
  subtitle="(optional)"
  collapsible={true}
  defaultCollapsed={true}
>
  <div class="space-y-6">
    <!-- Duration of Communication -->
    <div>
      <label
        class="mb-3 block text-sm font-medium text-gray-700"
        for="duration"
      >
        Duration of communication
      </label>

      <div class="relative">
        <input
          id="duration"
          type="range"
          min="0"
          max="100"
          step="1"
          bind:value={$relationshipDetails.duration}
          class="
            h-2 w-full cursor-pointer appearance-none rounded-lg
            bg-gray-200 accent-purple-500
          "
        />

        <!-- Slider Labels -->
        <div class="mt-2 flex justify-between text-xs text-gray-500">
          <span class="text-left">Just started talking</span>
          <span class="text-center font-medium text-pink-500"
            >{getDurationLabel($relationshipDetails.duration)}</span
          >
          <span class="text-right">Long established</span>
        </div>
      </div>
    </div>

    <!-- Relationship Objective -->
    <div>
      <label
        class="mb-4 block text-sm font-medium text-gray-700"
        for="objective"
      >
        Relationship objective
      </label>
      <div class="grid grid-cols-2 gap-3">
        {#each relationshipObjectives as objective}
          <label
            class="
              group relative flex cursor-pointer items-center gap-3 rounded-xl border-2
              border-gray-200 bg-white p-4 text-sm transition-all duration-200
              hover:scale-105 hover:border-gray-300 hover:shadow-md
              {$relationshipDetails.objective === objective.id
              ? 'border-purple-400 bg-purple-50 ring-2 shadow-lg ring-purple-200'
              : ''}
            "
          >
            <input
              type="radio"
              name="objective"
              value={objective.id}
              bind:group={$relationshipDetails.objective}
              class="sr-only"
            />
            <div
              class="flex h-7 w-7 items-center justify-center rounded-lg text-lg"
            >
              {objective.emoji}
            </div>
            <span class="font-medium text-gray-700 group-hover:text-gray-900">
              {objective.label}
            </span>
          </label>
        {/each}
      </div>
    </div>

    <!-- Additional Notes Section -->
    <div>
      <label for="notes" class="mb-3 block text-sm font-medium text-gray-700">
        Additional Notes <span class="text-gray-400">(optional)</span>
      </label>
      <textarea
        id="notes"
        bind:value={$relationshipDetails.notes}
        placeholder="Add any additional context about your conversation, their personality, shared interests, or what kind of vibe you're going for..."
        class="
          w-full rounded-xl border-2 border-gray-200
          bg-white p-4 text-sm text-gray-700
          transition-all duration-200 placeholder:text-gray-400
          focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:outline-none
        "
        rows="4"
      ></textarea>
    </div>
  </div>
</FormStep>
