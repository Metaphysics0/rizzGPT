<script lang="ts">
  import { cn } from "$lib/utils/string/cn.util";
  let { status }: { status: "trial" | "pro" } = $props();

  const statusUiConfig = {
    trial: {
      classes: "text-slate-600 bg-slate-100 border-slate-200",
    },
    pro: {
      classes: "text-white bg-gradient-to-b from-purple-600 to-pink-600 border-purple-600 shadow-md",
    },
  } as const;
</script>

<div
  class={cn(
    "px-2 py-1 text-xs uppercase border rounded-md font-semibold",
    statusUiConfig[status].classes
  )}
>
  {status}
</div>
