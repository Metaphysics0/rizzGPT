<script lang="ts">
  import { relationshipObjectives } from "$lib/constants/relationship-objectives.constant";
  import type { RelationshipContext } from "$lib/types";
  import FormStep from "./FormStep.svelte";
  import DurationSlider from "./relationship-context/DurationSlider.svelte";

  interface Props {
    title?: string;
    subtitle?: string;
    collapsible?: boolean;
    defaultCollapsed?: boolean;
    value: Partial<RelationshipContext>;
    onUpdate: (context: Partial<RelationshipContext>) => void;
    showDuration?: boolean;
  }

  let {
    title = "Additional Context",
    subtitle = "(optional)",
    collapsible = true,
    defaultCollapsed = true,
    value,
    onUpdate,
    showDuration = true,
  }: Props = $props();

  function getDurationLabel(duration: number): string {
    if (duration === 0) return "Just started talking";
    if (duration <= 25) return "Few messages exchanged";
    if (duration <= 50) return "Been chatting a while";
    if (duration <= 75) return "Getting to know each other";
    return "Long established conversation";
  }

  function updateDuration(duration: number) {
    onUpdate({ duration });
  }

  function updateObjective(objective: string) {
    onUpdate({ objective });
  }

  function updateNotes(notes: string) {
    onUpdate({ notes });
  }
</script>

<FormStep {title} {subtitle} {collapsible} {defaultCollapsed}>
  <div class="space-y-6">
    <!-- Duration of Communication -->
    {#if showDuration}
      <DurationSlider value={value.duration!} {onUpdate} />
    {/if}

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
              {value.objective === objective.id
              ? 'border-purple-400 bg-purple-50 ring-2 shadow-lg ring-purple-200'
              : ''}
            "
          >
            <input
              type="radio"
              name="objective"
              value={objective.id}
              checked={value.objective === objective.id}
              onchange={() => updateObjective(objective.id)}
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
        value={value.notes}
        oninput={(e) => updateNotes((e.target as HTMLTextAreaElement).value)}
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
