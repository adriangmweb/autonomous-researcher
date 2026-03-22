import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/artifacts/status-badge";
import { PriorityBadge } from "@/components/artifacts/priority-badge";
import { TypeBadge } from "@/components/artifacts/type-badge";
import type { ArtifactSummary } from "@/lib/kb/types";

interface Props {
  tasks: ArtifactSummary[];
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export function TaskTable({ tasks }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-stone-400">
        No tasks yet. Tasks will appear here as agents create them.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-20">ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead className="w-28">Status</TableHead>
          <TableHead className="w-24">Priority</TableHead>
          <TableHead className="w-28">Type</TableHead>
          <TableHead className="w-20 text-right">Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id} className="group">
            <TableCell>
              <Link
                href={`/tasks/${task.id}`}
                className="font-mono text-xs text-stone-500 group-hover:text-stone-900 transition-colors"
              >
                {task.id}
              </Link>
            </TableCell>
            <TableCell>
              <Link
                href={`/tasks/${task.id}`}
                className="text-sm text-stone-800 group-hover:text-stone-900 transition-colors"
              >
                {task.title}
              </Link>
            </TableCell>
            <TableCell>
              <StatusBadge status={task.metadata["Status"]} />
            </TableCell>
            <TableCell>
              <PriorityBadge priority={task.metadata["Priority"]} />
            </TableCell>
            <TableCell>
              <TypeBadge type={task.metadata["Type"]} />
            </TableCell>
            <TableCell className="text-right text-xs text-stone-400">
              {timeAgo(task.mtime)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
