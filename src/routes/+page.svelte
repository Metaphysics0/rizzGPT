<script>
	import ImageInput from '$lib/ui/ImageInput.svelte';
	import ProcessedText from '$lib/ui/ProcessedText.svelte';
</script>

<div class="min-h-screen p-8">
	<div class="mx-auto mb-12 max-w-7xl text-center">
		<h1 class="text-4xl font-bold md:text-5xl">
			<span class="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
				RizzGPT
			</span>
		</h1>
		<p class="mt-4 text-lg text-gray-600 md:text-xl">
			Get the perfect response for bae 💌
			<span class="mt-2 block text-sm text-gray-400"> Snap → Scan → Sweet Talk </span>
		</p>
	</div>

	<div
		class="
		mx-auto grid
		h-[calc(100vh-12rem)] max-w-7xl grid-cols-1
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
