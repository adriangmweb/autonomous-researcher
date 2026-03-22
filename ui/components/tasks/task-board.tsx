import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { PriorityBadge } from "@/components/artifacts/priority-badge";
import { TypeBadge } from "@/components/artifacts/type-badge";
import type { ArtifactSummary, TaskStatus } from "@/lib/kb/types";

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: "BACKLOG", label: "Backlog" },
  { status: "TODO", label: "To Do" },
  { status: "IN_PROGRESS", label: "In Progress" },
  { status: "DONE", label: "Done" },
  { status: "BLOCKED", label: "Blocked" },
];

interface Props {
  tasks: ArtifactSummary[];
}

export function TaskBoard({ tasks }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-stone-400">
        No tasks yet. Tasks will appear here as agents create them.
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map(({ status, label }) => {
        const columnTasks = tasks.filter((t) => {
          const s = t.metadata["Status"]?.toUpperCase().replace(/ /g, "_");
          return s === status;
        });
        return (
          <div key={status} className="flex-shrink-0 w-64">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {label}
              </h3>
              <span className="text-xs text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded-full">
                {columnTasks.length}
              </span>
            </div>
            <div className="space-y-2">
              {columnTasks.map((task) => (
                <Link key={task.id} href={`/tasks/${task.id}`}>
                  <Card className="border-stone-200 bg-white hover:shadow-sm transition-shadow cursor-pointer">
                    <CardContent className="py-3 px-3.5">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-mono text-xs text-stone-400">
                          {task.id}
                        </span>
                        <PriorityBadge priority={task.metadata["Priority"]} />
                      </div>
                      <p className="text-sm text-stone-800 leading-snug mb-2">
                        {task.title}
                      </p>
                      <TypeBadge type={task.metadata["Type"]} />
                    </CardContent>
                  </Card>
                </Link>
              ))}
              {columnTasks.length === 0 && (
                <div className="text-xs text-stone-300 text-center py-6 border border-dashed border-stone-200 rounded-lg">
                  Empty
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
