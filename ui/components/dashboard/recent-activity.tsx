import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { ActivityEntry, ArtifactPrefix } from "@/lib/kb/types";
import { artifactUrl } from "@/lib/kb/reader";
import { Clock } from "lucide-react";

function timeAgo(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface Props {
  activity: ActivityEntry[];
}

export function RecentActivity({ activity }: Props) {
  if (activity.length === 0) {
    return (
      <section>
        <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3">
          Recent Activity
        </h3>
        <Card className="border-dashed border-stone-200 bg-stone-50/50">
          <CardContent className="py-6 text-center">
            <p className="text-sm text-stone-400">
              No activity yet. Artifacts will appear here as agents create them.
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section>
      <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-2">
        <Clock size={14} className="text-stone-400" />
        Recent Activity
      </h3>
      <Card className="border-stone-200 bg-white">
        <CardContent className="py-2 px-0">
          <ul className="divide-y divide-stone-100">
            {activity.map((entry) => (
              <li key={entry.id}>
                <Link
                  href={artifactUrl(entry.prefix as ArtifactPrefix, entry.id)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-stone-50 transition-colors"
                >
                  <span className="text-xs text-stone-400 w-16 shrink-0">
                    {timeAgo(entry.mtime)}
                  </span>
                  <span className="font-mono text-xs text-stone-400 w-12 shrink-0">
                    {entry.id}
                  </span>
                  <span className="text-sm text-stone-700 flex-1 min-w-0 truncate">
                    {entry.title}
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
