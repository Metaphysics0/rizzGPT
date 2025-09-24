<script lang="ts">
  import type { RelationshipContext } from "$lib/types";

  interface Props {
    value: number;
    onUpdate: (context: Partial<RelationshipContext>) => void;
    showDuration?: boolean;
  }

  let { value, onUpdate }: Props = $props();

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
</script>

<div class="mt-4">
  <label class="mb-3 block text-sm font-medium text-gray-700" for="duration">
    Duration of communication
  </label>

  <div class="relative">
    <input
      id="duration"
      type="range"
      min="0"
      max="100"
      step="1"
      {value}
      oninput={(e) =>
        updateDuration(Number((e.target as HTMLInputElement).value))}
      class="
            h-2 w-full cursor-pointer appearance-none rounded-lg
            bg-gray-200 accent-purple-500
          "
    />

    <!-- Slider Labels -->
    <div class="mt-2 flex justify-between text-xs text-gray-500">
      <span class="text-left">Just started talking</span>
      <span class="text-center font-medium text-pink-500"
        >{getDurationLabel(value)}</span
      >
      <span class="text-right">Long established</span>
    </div>
  </div>
</div>
