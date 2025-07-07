<script lang="ts">
	import { selectedApp } from '$lib/stores/form.store';
	import { SupportedApps } from '$lib/constants/supported-apps.constant';
	import Icon from '@iconify/svelte';

	const appToUiDataMap: Record<SupportedApps, { label: string; icon: string }> = {
		[SupportedApps.INSTAGRAM]: { label: 'Instagram', icon: 'mdi:instagram' },
		[SupportedApps.WHATSAPP]: { label: 'WhatsApp', icon: 'mdi:whatsapp' },
		[SupportedApps.TINDER]: { label: 'Tinder', icon: 'mdi:fire' },
		[SupportedApps.BUMBLE]: { label: 'Bumble', icon: 'mdi:bee' },
		[SupportedApps.OKCUPID]: { label: 'OkCupid', icon: 'mdi:heart' },
		[SupportedApps.HINGE]: { label: 'Hinge', icon: 'mdi:heart' },
		[SupportedApps.OTHER]: { label: 'Other', icon: 'mdi:chat' }
	};
</script>

<div class="flex flex-wrap gap-2">
	{#each Object.entries(appToUiDataMap) as [appName, appData]}
		<button
			on:click={() => selectedApp.set(appName as SupportedApps)}
			class:selected={$selectedApp === appName}
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
			<Icon icon={appData.icon} class="h-4 w-4 [&.selected]:text-white" />
			<span>{appData.label}</span>
		</button>
	{/each}
</div>
