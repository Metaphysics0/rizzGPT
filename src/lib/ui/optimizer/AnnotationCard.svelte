<script lang="ts">
  import type { Annotation } from "./types";

  let { annotation, isActive = false }: { annotation: Annotation; isActive?: boolean } = $props();

  const severityColors = {
    critical: "border-red-500 bg-red-50 text-red-900",
    moderate: "border-amber-500 bg-amber-50 text-amber-900",
    minor: "border-green-500 bg-green-50 text-green-900",
  };

  const severityBadgeColors = {
    critical: "bg-red-500 text-white",
    moderate: "bg-amber-500 text-white",
    minor: "bg-green-500 text-white",
  };
</script>

<div
  class="absolute z-50 w-72 rounded-lg border-2 bg-white p-4 shadow-xl transition-all duration-200 {severityColors[
    annotation.severity
  ]} {isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}"
>
  <div class="flex items-start gap-2">
    <span
      class="inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-bold {severityBadgeColors[
        annotation.severity
      ]}"
    >
      {annotation.severity.toUpperCase()}
    </span>
    <div class="flex-1">
      <h3 class="text-sm font-bold mb-1">{annotation.title}</h3>
      <p class="text-xs leading-relaxed">{annotation.suggestion}</p>
    </div>
  </div>
</div>
