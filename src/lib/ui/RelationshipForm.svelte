<script lang="ts">
	import { relationshipDetails, isStep1Complete } from '$lib/stores/form.store';
	import { relationshipObjectives } from '$lib/constants/relationship-objectives.constant';
</script>

<fieldset disabled={!$isStep1Complete}>
	<div class="space-y-6">
		<div>
			<label
				class="mb-2 block text-sm font-medium text-slate-700 {!$isStep1Complete
					? 'opacity-75'
					: ''}"
			>
				Duration of communication

				<span class="ml-2 text-slate-600">
					{#if $relationshipDetails.duration === 0}
						Just started talking
					{:else if $relationshipDetails.duration < 12}
						{$relationshipDetails.duration} month{$relationshipDetails.duration === 1 ? '' : 's'}
					{:else}
						1+ years
					{/if}
				</span>
			</label>
			<input
				type="range"
				min="0"
				max="12"
				step="1"
				bind:value={$relationshipDetails.duration}
				class="
					h-2 w-full cursor-pointer appearance-none rounded-lg
					bg-slate-200 accent-slate-600
					{!$isStep1Complete ? 'cursor-not-allowed opacity-75' : ''}
				"
				disabled={!$isStep1Complete}
			/>
		</div>

		<fieldset>
			<legend
				class="mb-4 text-sm font-medium text-slate-700 {!$isStep1Complete ? 'opacity-75' : ''}"
			>
				Relationship objective
			</legend>
			<div class="grid grid-cols-1 gap-2">
				{#each relationshipObjectives as objective}
					<label
						class="
							relative flex cursor-pointer items-center rounded-lg border
							border-slate-200 bg-white p-3 text-sm
							hover:border-slate-300
							has-[:checked]:border-slate-600 has-[:checked]:bg-slate-50
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
						<span class="text-slate-700">{objective}</span>
					</label>
				{/each}
			</div>
		</fieldset>

		<!-- Additional Notes Section -->
		<div>
			<label
				for="additionalNotes"
				class="mb-2 block text-sm font-medium text-slate-700 {!$isStep1Complete
					? 'opacity-75'
					: ''}"
			>
				Additional Notes <span class="text-slate-400">(optional)</span>
			</label>
			<textarea
				id="additionalNotes"
				bind:value={$relationshipDetails.additionalNotes}
				placeholder="Add any additional context about your relationship..."
				class="
					w-full rounded-lg border border-slate-200
					bg-white p-3 text-sm text-slate-700
					placeholder:text-slate-400
					focus:border-slate-400 focus:outline-none
					disabled:cursor-not-allowed disabled:opacity-75
				"
				rows="3"
				disabled={!$isStep1Complete}
			/>
		</div>
	</div>
</fieldset>
