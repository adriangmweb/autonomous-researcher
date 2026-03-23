"use client";

import Link from "next/link";
import { LayoutList, Columns3 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ViewToggle({ current }: { current: "table" | "board" }) {
  return (
    <div className="flex items-center bg-stone-100 rounded-lg p-0.5">
      <Link
        href="/tasks?view=table"
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
          current === "table"
            ? "bg-white text-stone-900 shadow-sm"
            : "text-stone-500 hover:text-stone-700",
        )}
      >
        <LayoutList size={14} />
        Table
      </Link>
      <Link
        href="/tasks?view=board"
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
          current === "board"
            ? "bg-white text-stone-900 shadow-sm"
            : "text-stone-500 hover:text-stone-700",
        )}
      >
        <Columns3 size={14} />
        Board
      </Link>
    </div>
  );
}
