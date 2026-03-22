import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1 text-sm text-stone-500 mb-6">
      {items.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={14} className="text-stone-300" />}
          {crumb.href ? (
            <Link
              href={crumb.href}
              className="hover:text-stone-700 transition-colors"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="text-stone-900 font-medium">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
