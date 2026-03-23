import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "./status-badge";
import { PriorityBadge } from "./priority-badge";
import { TypeBadge } from "./type-badge";
import { MarkdownRenderer } from "@/components/markdown/md-renderer";
import {
  type Artifact,
  type ArtifactPrefix,
  ARTIFACT_LABELS,
  extractRelations,
} from "@/lib/kb/types";
import { artifactUrl } from "@/lib/kb/reader";
import { FileText, ExternalLink } from "lucide-react";

interface Props {
  artifact: Artifact;
}

/** Which metadata keys to show in the sidebar card */
const DISPLAY_META_KEYS = [
  "Status", "Priority", "Type", "Task", "Hypothesis", "Experiment",
  "Feature", "Investigation", "Implementation", "Challenge Review",
  "Impact", "Relevance", "Created", "Completed", "Date", "Last updated",
  "Date reviewed", "Requested by", "Reviewer", "Scope", "Target",
];

/** Parse an artifact ID reference like "T001" into a link */
function parseRef(value: string): { prefix: ArtifactPrefix; id: string } | null {
  const match = value.match(/^(FT|INV|IMP|RET|CR|SR|T|H|E|F|L)(\d{3})$/);
  if (!match) return null;
  return { prefix: match[1] as ArtifactPrefix, id: match[0] };
}

function MetadataValue({ label, value }: { label: string; value: string }) {
  const ref = parseRef(value.trim());
  if (ref) {
    return (
      <Link
        href={artifactUrl(ref.prefix, ref.id)}
        className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
      >
        {value}
      </Link>
    );
  }
  if (label === "Status") return <StatusBadge status={value} />;
  if (label === "Priority") return <PriorityBadge priority={value} />;
  if (label === "Type") return <TypeBadge type={value} />;
  return <span className="text-sm text-stone-700">{value}</span>;
}

export function ArtifactDetail({ artifact }: Props) {
  const relations = extractRelations(artifact.metadata);

  // Build related artifacts list
  const relatedLinks: { label: string; id: string; prefix: ArtifactPrefix }[] = [];
  const refFields = [
    { key: "task", label: "Task", prefixes: ["T"] },
    { key: "hypothesis", label: "Hypothesis", prefixes: ["H"] },
    { key: "experiment", label: "Experiment", prefixes: ["E"] },
    { key: "feature", label: "Feature", prefixes: ["FT"] },
    { key: "investigation", label: "Investigation", prefixes: ["INV"] },
    { key: "implementation", label: "Implementation", prefixes: ["IMP"] },
    { key: "challengeReview", label: "Challenge Review", prefixes: ["CR"] },
  ];
  for (const { key, label, prefixes } of refFields) {
    const val = relations[key as keyof typeof relations];
    if (val) {
      const ref = parseRef(val.trim());
      if (ref && prefixes.includes(ref.prefix)) {
        relatedLinks.push({ label, id: ref.id, prefix: ref.prefix });
      }
    }
  }

  // Filter sections — skip _preamble (metadata area) and empty sections
  const bodyEntries = Object.entries(artifact.sections).filter(
    ([key, val]) => key !== "_preamble" && val.trim().length > 0,
  );

  return (
    <div className="flex gap-8">
      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-sm text-stone-400">
              {artifact.id}
            </span>
            <span className="text-stone-300">|</span>
            <span className="text-xs text-stone-400">
              {ARTIFACT_LABELS[artifact.prefix]}
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-stone-900 mb-3">
            {artifact.title}
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            {artifact.metadata["Status"] && (
              <StatusBadge status={artifact.metadata["Status"]} />
            )}
            {artifact.metadata["Priority"] && (
              <PriorityBadge priority={artifact.metadata["Priority"]} />
            )}
            {artifact.metadata["Type"] && (
              <TypeBadge type={artifact.metadata["Type"]} />
            )}
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Body sections */}
        {bodyEntries.length > 0 ? (
          <div className="space-y-6">
            {bodyEntries.map(([heading, content]) => (
              <section key={heading}>
                <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3">
                  {heading}
                </h2>
                <MarkdownRenderer content={content} />
              </section>
            ))}
          </div>
        ) : (
          <p className="text-sm text-stone-400 italic">
            No content sections yet.
          </p>
        )}
      </div>

      {/* Sidebar */}
      <aside className="w-64 shrink-0 hidden lg:block">
        {/* Metadata */}
        <Card className="border-stone-200 bg-white mb-4">
          <CardContent className="py-4 px-4">
            <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
              Metadata
            </h3>
            <dl className="space-y-2">
              {DISPLAY_META_KEYS.filter((k) => artifact.metadata[k]).map(
                (key) => (
                  <div key={key}>
                    <dt className="text-xs text-stone-400">{key}</dt>
                    <dd>
                      <MetadataValue label={key} value={artifact.metadata[key]} />
                    </dd>
                  </div>
                ),
              )}
            </dl>
          </CardContent>
        </Card>

        {/* Related artifacts */}
        {relatedLinks.length > 0 && (
          <Card className="border-stone-200 bg-white mb-4">
            <CardContent className="py-4 px-4">
              <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
                Related
              </h3>
              <ul className="space-y-2">
                {relatedLinks.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={artifactUrl(link.prefix, link.id)}
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      <ExternalLink size={12} />
                      <span className="font-mono text-xs">{link.id}</span>
                      <span className="text-stone-400 text-xs">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* File info */}
        <Card className="border-stone-200 bg-stone-50/50">
          <CardContent className="py-3 px-4">
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <FileText size={12} />
              <span className="truncate">{artifact.filename}</span>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Modified {artifact.mtime.toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
