import { PRIORITY_COLORS, type Priority } from "@/lib/kb/types";
import { cn } from "@/lib/utils";

const LABELS: Record<Priority, string> = {
  P0: "Critical",
  P1: "High",
  P2: "Normal",
  P3: "Low",
};

export function PriorityBadge({ priority }: { priority: string | undefined }) {
  if (!priority) return null;
  const p = priority.toUpperCase() as Priority;
  const color = PRIORITY_COLORS[p] ?? "text-stone-400";
  const label = LABELS[p] ?? priority;

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", color)}>
      <span className="inline-block w-2 h-2 rounded-full bg-current" />
      {label}
    </span>
  );
}
