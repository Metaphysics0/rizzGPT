<script lang="ts">
	import { Pagination as PaginationPrimitive } from "bits-ui";
	import Icon from "@iconify/svelte";
	import { buttonVariants } from "$lib/components/button/index.js";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: PaginationPrimitive.NextButtonProps = $props();
</script>

{#snippet Fallback()}
	<Icon icon="mingcute:right-line" class="size-4" />
{/snippet}

<PaginationPrimitive.NextButton
	bind:ref
	aria-label="Go to next page"
	class={cn(
		buttonVariants({
			size: "default",
			variant: "ghost",
			class: "gap-1 px-2.5 sm:pr-2.5",
		}),
		className
	)}
	children={children || Fallback}
	{...restProps}
/>
