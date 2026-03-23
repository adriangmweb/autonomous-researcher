import { listArtifacts } from "@/lib/kb/reader";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ArtifactList, type Column } from "@/components/artifacts/artifact-list";
import { StatusBadge } from "@/components/artifacts/status-badge";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IMPACT_COLORS, type FindingImpact } from "@/lib/kb/types";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const hypothesisColumns: Column[] = [
  { key: "Status", label: "Status", width: "w-28", render: (v) => <StatusBadge status={v} /> },
  { key: "Task", label: "Task", width: "w-20" },
];

const experimentColumns: Column[] = [
  { key: "Status", label: "Status", width: "w-28", render: (v) => <StatusBadge status={v} /> },
  { key: "Hypothesis", label: "Hypothesis", width: "w-20" },
  { key: "Task", label: "Task", width: "w-20" },
];

const findingColumns: Column[] = [
  {
    key: "Impact",
    label: "Impact",
    width: "w-24",
    render: (v) => {
      const colors = IMPACT_COLORS[v as FindingImpact];
      if (!colors) return <span className="text-sm text-stone-500">{v || "—"}</span>;
      return (
        <Badge variant="outline" className={cn("border-0 text-xs font-medium", colors.bg, colors.text)}>
          {v}
        </Badge>
      );
    },
  },
  { key: "Experiment", label: "Experiment", width: "w-20" },
  { key: "Task", label: "Task", width: "w-20" },
];

const literatureColumns: Column[] = [
  { key: "Type", label: "Type", width: "w-24" },
  { key: "Relevance", label: "Relevance", width: "w-24" },
  { key: "Task", label: "Task", width: "w-20" },
];

export default async function ResearchPage() {
  const [hypotheses, experiments, findings, literature] = await Promise.all([
    listArtifacts("H"),
    listArtifacts("E"),
    listArtifacts("F"),
    listArtifacts("L"),
  ]);

  return (
    <div>
      <Breadcrumbs items={[{ label: "Dashboard", href: "/" }, { label: "Research" }]} />
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-stone-900 mb-1">Research</h1>
        <p className="text-sm text-stone-500">
          Hypotheses, experiments, findings, and literature
        </p>
      </div>

      <Tabs defaultValue="hypotheses">
        <TabsList className="mb-4">
          <TabsTrigger value="hypotheses">
            Hypotheses <span className="ml-1.5 text-stone-400">{hypotheses.length}</span>
          </TabsTrigger>
          <TabsTrigger value="experiments">
            Experiments <span className="ml-1.5 text-stone-400">{experiments.length}</span>
          </TabsTrigger>
          <TabsTrigger value="findings">
            Findings <span className="ml-1.5 text-stone-400">{findings.length}</span>
          </TabsTrigger>
          <TabsTrigger value="literature">
            Literature <span className="ml-1.5 text-stone-400">{literature.length}</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="hypotheses">
          <ArtifactList
            artifacts={hypotheses}
            prefix="H"
            columns={hypothesisColumns}
            emptyMessage="No hypotheses yet. They will appear here when the agent formulates them."
          />
        </TabsContent>
        <TabsContent value="experiments">
          <ArtifactList
            artifacts={experiments}
            prefix="E"
            columns={experimentColumns}
            emptyMessage="No experiments yet. They will appear after hypotheses are created."
          />
        </TabsContent>
        <TabsContent value="findings">
          <ArtifactList
            artifacts={findings}
            prefix="F"
            columns={findingColumns}
            emptyMessage="No findings yet. Findings are generated after experiments complete."
          />
        </TabsContent>
        <TabsContent value="literature">
          <ArtifactList
            artifacts={literature}
            prefix="L"
            columns={literatureColumns}
            emptyMessage="No literature reviews yet."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
