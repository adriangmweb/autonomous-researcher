import { Badge } from "@/components/ui/badge";
import { TYPE_COLORS, type TaskType } from "@/lib/kb/types";
import { cn } from "@/lib/utils";

export function TypeBadge({ type }: { type: string | undefined }) {
  if (!type) return null;
  const t = type.toLowerCase() as TaskType;
  const color = TYPE_COLORS[t] ?? { bg: "bg-stone-100", text: "text-stone-600" };
  return (
    <Badge
      variant="outline"
      className={cn("border-0 font-medium text-xs capitalize", color.bg, color.text)}
    >
      {type}
    </Badge>
  );
}
