import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/artifacts/status-badge";
import type { ArtifactSummary, ArtifactPrefix } from "@/lib/kb/types";
import { ARTIFACT_LABELS, isActiveStatus } from "@/lib/kb/types";
import { artifactUrl } from "@/lib/kb/reader";
import { Loader2 } from "lucide-react";

interface Props {
  artifacts: ArtifactSummary[];
}

export function InProgressPanel({ artifacts }: Props) {
  const active = artifacts
    .filter((a) => isActiveStatus(a.metadata["Status"]))
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

  if (active.length === 0) {
    return (
      <section>
        <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3">
          In Progress
        </h3>
        <Card className="border-dashed border-stone-200 bg-stone-50/50">
          <CardContent className="py-6 text-center">
            <p className="text-sm text-stone-400">Nothing in progress right now</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section>
      <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-2">
        <Loader2 size={14} className="animate-spin text-blue-500" />
        In Progress
      </h3>
      <Card className="border-stone-200 bg-white">
        <CardContent className="py-2 px-0">
          <ul className="divide-y divide-stone-100">
            {active.map((a) => (
              <li key={a.id}>
                <Link
                  href={artifactUrl(a.prefix as ArtifactPrefix, a.id)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors"
                >
                  <span className="font-mono text-xs text-stone-400 w-12 shrink-0">
                    {a.id}
                  </span>
                  <span className="text-sm text-stone-800 flex-1 min-w-0 truncate">
                    {a.title}
                  </span>
                  <span className="text-xs text-stone-400 shrink-0">
                    {ARTIFACT_LABELS[a.prefix]}
                  </span>
                  <StatusBadge status={a.metadata["Status"]} />
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
