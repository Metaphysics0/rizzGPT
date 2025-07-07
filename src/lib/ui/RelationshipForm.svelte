<script lang="ts">
	import { relationshipDetails, isStep1Complete } from '$lib/stores/form.store';
	import { relationshipObjectives } from '$lib/constants/relationship-objectives.constant';

	function getDurationLabel(duration: number): string {
		if (duration === 0) return 'Just started talking';
		if (duration <= 25) return 'Few messages exchanged';
		if (duration <= 50) return 'Been chatting a while';
		if (duration <= 75) return 'Getting to know each other';
		return 'Long established conversation';
	}

	function getObjectiveEmoji(objective: string): string {
		if (objective.includes('New Friends')) return '😊';
		if (objective.includes('Long-term partner')) return '💑';
		if (objective.includes('Short-term fun')) return '🎉';
		if (objective.includes('Long-term, open to short')) return '😄';
		if (objective.includes('Short-term, open to long')) return '😊';
		if (objective.includes('Still figuring')) return '🤔';
		return '💕';
	}

	function getObjectiveLabel(objective: string): string {
		return objective.replace(/[^\w\s,'-]/g, '').trim();
	}
</script>

<fieldset disabled={!$isStep1Complete}>
	<div class="space-y-6">
		<!-- Duration of Communication -->
		<div>
			<label
				class="mb-3 block text-sm font-medium text-gray-700 {!$isStep1Complete ? 'opacity-75' : ''}"
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
						{!$isStep1Complete ? 'cursor-not-allowed opacity-75' : ''}
					"
					disabled={!$isStep1Complete}
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
				class="mb-4 block text-sm font-medium text-gray-700 {!$isStep1Complete ? 'opacity-75' : ''}"
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
							{$relationshipDetails.objective === objective
							? 'border-purple-400 bg-purple-50 ring-2 shadow-lg ring-purple-200'
							: ''}
							{!$isStep1Complete ? 'cursor-not-allowed opacity-75' : ''}
						"
					>
						<input
							type="radio"
							name="objective"
							value={objective}
							bind:group={$relationshipDetails.objective}
							class="sr-only"
							disabled={!$isStep1Complete}
						/>
						<div class="flex h-7 w-7 items-center justify-center rounded-lg text-lg">
							{getObjectiveEmoji(objective)}
						</div>
						<span class="font-medium text-gray-700 group-hover:text-gray-900">
							{getObjectiveLabel(objective)}
						</span>
					</label>
				{/each}
			</div>
		</div>

		<!-- Additional Notes Section -->
		<div>
			<label
				for="additionalNotes"
				class="mb-3 block text-sm font-medium text-gray-700 {!$isStep1Complete ? 'opacity-75' : ''}"
			>
				Additional Notes <span class="text-gray-400">(optional)</span>
			</label>
			<textarea
				id="additionalNotes"
				bind:value={$relationshipDetails.additionalNotes}
				placeholder="Add any additional context about your conversation, their personality, shared interests, or what kind of vibe you're going for..."
				class="
					w-full rounded-xl border-2 border-gray-200
					bg-white p-4 text-sm text-gray-700
					transition-all duration-200 placeholder:text-gray-400
					focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:outline-none
					disabled:cursor-not-allowed disabled:opacity-75
				"
				rows="4"
				disabled={!$isStep1Complete}
			></textarea>
		</div>
	</div>
</fieldset>
