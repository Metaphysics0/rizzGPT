<!--
  DEPRECATED: This component is no longer used in the main form flow.
  The conversation source selector has been removed to simplify the user experience.
  Keeping this component for potential future use.
-->

<script lang="ts">
  import { SupportedApps } from "$lib/constants/supported-apps.constant";
  import { selectedApp } from "$lib/stores/form.store";

  const appToUiDataMap: Record<
    SupportedApps,
    { label: string; emoji: string }
  > = {
    [SupportedApps.INSTAGRAM]: { label: "Instagram", emoji: "📷" },
    [SupportedApps.WHATSAPP]: { label: "WhatsApp", emoji: "💬" },
    [SupportedApps.TINDER]: { label: "Tinder", emoji: "🔥" },
    [SupportedApps.BUMBLE]: { label: "Bumble", emoji: "🐝" },
    [SupportedApps.OKCUPID]: { label: "OkCupid", emoji: "💖" },
    [SupportedApps.HINGE]: { label: "Hinge", emoji: "🔗" },
    [SupportedApps.OTHER]: { label: "Other", emoji: "💕" },
  };
</script>

<div class="grid grid-cols-4 gap-4">
  {#each Object.entries(appToUiDataMap) as [appName, appData]}
    <button
      on:click={() => selectedApp.set(appName as SupportedApps)}
      class="
				group relative flex cursor-pointer flex-col items-center gap-3
				rounded-2xl border-2 border-gray-200 bg-white p-4 transition-all
				duration-200 hover:scale-105 hover:border-gray-300
				hover:shadow-md
				{$selectedApp === appName
        ? 'border-purple-400 bg-purple-50 ring-2 shadow-lg ring-purple-200'
        : ''}
			"
    >
      <div
        class="
				flex h-12 w-12 items-center justify-center rounded-xl text-3xl
			"
      >
        {appData.emoji}
      </div>
      <span class="text-sm font-medium text-gray-700 group-hover:text-gray-900">
        {appData.label}
      </span>
    </button>
  {/each}
</div>
