<script lang="ts">
	import { getEmblaContext } from "./context.js";
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		variant = "white",
		...restProps
	}: {
		class?: string;
		variant?: "white" | "primary";
	} = $props();

	const emblaContext = getEmblaContext();
</script>

<div class={cn("flex justify-center space-x-2 mt-4", className)} {...restProps}>
	{#each emblaContext.scrollSnaps as _, index}
		<button
			class={cn(
				"w-2 h-2 rounded-full transition-colors duration-200",
				variant === "primary"
					? emblaContext.selectedIndex === index
						? "bg-primary"
						: "bg-primary/30 hover:bg-primary/50"
					: emblaContext.selectedIndex === index
						? "bg-white"
						: "bg-white/30 hover:bg-white/50"
			)}
			onclick={() => emblaContext.scrollTo(index)}
			aria-label="Go to slide {index + 1}"
		></button>
	{/each}
</div>