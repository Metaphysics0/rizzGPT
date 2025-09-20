<script lang="ts">
  import { cn } from "$lib/utils/string/cn.util";
  let { status }: { status: "trial" | "pro" } = $props();

  const statusUiConfig = {
    trial: {
      color: "text-slate-600",
      bgColor: "bg-slate-100",
    },
    pro: {
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  } as const;
</script>

<div
  class={cn(
    "px-2 py-1 text-xs uppercase border rounded-md border-slate-200 bg-slate-100",
    statusUiConfig[status].color,
    statusUiConfig[status].bgColor
  )}
>
  {status}
</div>
