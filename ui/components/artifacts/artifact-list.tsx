import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "./status-badge";
import type { ArtifactSummary, ArtifactPrefix } from "@/lib/kb/types";
import { artifactUrl } from "@/lib/kb/reader";

export interface Column {
  key: string;
  label: string;
  width?: string;
  render?: (value: string, artifact: ArtifactSummary) => React.ReactNode;
}

interface Props {
  artifacts: ArtifactSummary[];
  prefix: ArtifactPrefix;
  columns: Column[];
  emptyMessage?: string;
}

export function ArtifactList({ artifacts, prefix, columns, emptyMessage }: Props) {
  if (artifacts.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-stone-400">
        {emptyMessage || "No artifacts yet."}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-20">ID</TableHead>
          <TableHead>Title</TableHead>
          {columns.map((col) => (
            <TableHead key={col.key} className={col.width}>
              {col.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {artifacts.map((artifact) => (
          <TableRow key={artifact.id} className="group">
            <TableCell>
              <Link
                href={artifactUrl(prefix, artifact.id)}
                className="font-mono text-xs text-stone-500 group-hover:text-stone-900 transition-colors"
              >
                {artifact.id}
              </Link>
            </TableCell>
            <TableCell>
              <Link
                href={artifactUrl(prefix, artifact.id)}
                className="text-sm text-stone-800 group-hover:text-stone-900 transition-colors"
              >
                {artifact.title}
              </Link>
            </TableCell>
            {columns.map((col) => (
              <TableCell key={col.key}>
                {col.render
                  ? col.render(artifact.metadata[col.key] || "", artifact)
                  : col.key === "Status"
                    ? <StatusBadge status={artifact.metadata[col.key]} />
                    : <span className="text-sm text-stone-600">{artifact.metadata[col.key] || "—"}</span>
                }
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
