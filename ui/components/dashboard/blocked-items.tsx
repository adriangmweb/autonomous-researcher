import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { ArtifactSummary } from "@/lib/kb/types";
import { artifactUrl } from "@/lib/kb/reader";
import { isBlockedStatus } from "@/lib/kb/types";
import { AlertOctagon } from "lucide-react";

interface Props {
  artifacts: ArtifactSummary[];
}

export function BlockedItems({ artifacts }: Props) {
  const blocked = artifacts.filter((a) =>
    isBlockedStatus(a.metadata["Status"]),
  );

  if (blocked.length === 0) return null;

  return (
    <section>
      <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wider mb-3 flex items-center gap-2">
        <AlertOctagon size={14} />
        Blocked
      </h3>
      <Card className="border-red-200 bg-red-50/50">
        <CardContent className="py-2 px-0">
          <ul className="divide-y divide-red-100">
            {blocked.map((a) => (
              <li key={a.id}>
                <Link
                  href={artifactUrl(a.prefix, a.id)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors"
                >
                  <span className="font-mono text-xs text-red-400 w-12 shrink-0">
                    {a.id}
                  </span>
                  <span className="text-sm text-red-800 flex-1 min-w-0 truncate">
                    {a.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
