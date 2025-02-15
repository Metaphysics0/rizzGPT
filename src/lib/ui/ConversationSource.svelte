<script lang="ts">
	import { selectedApp } from '$lib/stores/form.store';
	import { SupportedApps } from '$lib/constants/supported-apps.constant';
	import Icon from '@iconify/svelte';

	const apps = [
		{ value: SupportedApps.INSTAGRAM, label: 'Instagram', icon: 'mdi:instagram' },
		{ value: SupportedApps.WHATSAPP, label: 'WhatsApp', icon: 'mdi:whatsapp' },
		{ value: SupportedApps.TINDER, label: 'Tinder', icon: 'mdi:fire' },
		{ value: SupportedApps.BUMBLE, label: 'Bumble', icon: 'mdi:bee' },
		{ value: SupportedApps.OKCUPID, label: 'OkCupid', icon: 'mdi:heart' },
		{ value: SupportedApps.OTHER, label: 'Other', icon: 'mdi:chat' }
	];
</script>

<div class="flex flex-wrap gap-2">
	{#each apps as app}
		<button
			on:click={() => selectedApp.set(app.value)}
			class:selected={$selectedApp === app.value}
			class="
				flex cursor-pointer items-center gap-2 rounded-full
				border border-slate-200 bg-slate-50 px-4
        py-2
				text-sm text-slate-600
				transition-colors
				hover:border-slate-300 hover:bg-slate-100
				[&.selected]:border-slate-600 [&.selected]:bg-slate-600 [&.selected]:text-white
			"
		>
			<Icon icon={app.icon} class="h-4 w-4 [&.selected]:text-white" />
			<span>{app.label}</span>
		</button>
	{/each}
</div>
