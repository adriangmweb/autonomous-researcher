import { Badge } from "@/components/ui/badge";
import { STATUS_COLORS, type StatusColor } from "@/lib/kb/types";
import { cn } from "@/lib/utils";

const DEFAULT_COLOR: StatusColor = { bg: "bg-stone-100", text: "text-stone-600" };

export function StatusBadge({ status }: { status: string | undefined }) {
  if (!status) return null;
  const color = STATUS_COLORS[status.toUpperCase()] ?? STATUS_COLORS[status] ?? DEFAULT_COLOR;
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-0 font-medium text-xs",
        color.bg,
        color.text,
      )}
    >
      {status}
    </Badge>
  );
}
