<script>
	import ImageInput from '$lib/ui/ImageInput.svelte';
	import ProcessedText from '$lib/ui/ProcessedText.svelte';
</script>

<div class="min-h-screen p-8">
	<div
		class="
		mx-auto grid
		h-[calc(100vh-4rem)] max-w-7xl grid-cols-1
		gap-8
		md:grid-cols-2
	"
	>
		<div class="h-full rounded-xl bg-white p-4 shadow-lg">
			<ImageInput />
		</div>

		<div class="h-full rounded-xl bg-white p-4 shadow-lg">
			<ProcessedText />
		</div>
	</div>
</div>
