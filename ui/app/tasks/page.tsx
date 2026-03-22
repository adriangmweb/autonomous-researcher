import { listArtifacts } from "@/lib/kb/reader";
import { TaskTable } from "@/components/tasks/task-table";
import { TaskBoard } from "@/components/tasks/task-board";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ViewToggle } from "@/components/tasks/view-toggle";

export const dynamic = "force-dynamic";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const params = await searchParams;
  const tasks = await listArtifacts("T");
  const view = params.view === "board" ? "board" : "table";

  return (
    <div>
      <Breadcrumbs items={[{ label: "Dashboard", href: "/" }, { label: "Tasks" }]} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 mb-1">Tasks</h1>
          <p className="text-sm text-stone-500">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""}
          </p>
        </div>
        <ViewToggle current={view} />
      </div>

      {view === "board" ? (
        <TaskBoard tasks={tasks} />
      ) : (
        <TaskTable tasks={tasks} />
      )}
    </div>
  );
}
