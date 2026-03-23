import { listArtifacts } from "@/lib/kb/reader";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ArtifactList, type Column } from "@/components/artifacts/artifact-list";
import { StatusBadge } from "@/components/artifacts/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const dynamic = "force-dynamic";

const featureColumns: Column[] = [
  { key: "Status", label: "Status", width: "w-28", render: (v) => <StatusBadge status={v} /> },
  { key: "Task", label: "Task", width: "w-20" },
];

const investigationColumns: Column[] = [
  { key: "Status", label: "Status", width: "w-28", render: (v) => <StatusBadge status={v} /> },
  { key: "Feature", label: "Feature", width: "w-20" },
  { key: "Task", label: "Task", width: "w-20" },
];

const implementationColumns: Column[] = [
  { key: "Status", label: "Status", width: "w-28", render: (v) => <StatusBadge status={v} /> },
  { key: "Feature", label: "Feature", width: "w-20" },
  { key: "Task", label: "Task", width: "w-20" },
];

const retrospectiveColumns: Column[] = [
  { key: "Feature", label: "Feature", width: "w-20" },
  { key: "Task", label: "Task", width: "w-20" },
];

export default async function EngineeringPage() {
  const [features, investigations, implementations, retrospectives] =
    await Promise.all([
      listArtifacts("FT"),
      listArtifacts("INV"),
      listArtifacts("IMP"),
      listArtifacts("RET"),
    ]);

  return (
    <div>
      <Breadcrumbs
        items={[{ label: "Dashboard", href: "/" }, { label: "Engineering" }]}
      />
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-stone-900 mb-1">
          Engineering
        </h1>
        <p className="text-sm text-stone-500">
          Features, investigations, implementations, and retrospectives
        </p>
      </div>

      <Tabs defaultValue="features">
        <TabsList className="mb-4">
          <TabsTrigger value="features">
            Features{" "}
            <span className="ml-1.5 text-stone-400">{features.length}</span>
          </TabsTrigger>
          <TabsTrigger value="investigations">
            Investigations{" "}
            <span className="ml-1.5 text-stone-400">
              {investigations.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="implementations">
            Implementations{" "}
            <span className="ml-1.5 text-stone-400">
              {implementations.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="retrospectives">
            Retrospectives{" "}
            <span className="ml-1.5 text-stone-400">
              {retrospectives.length}
            </span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="features">
          <ArtifactList
            artifacts={features}
            prefix="FT"
            columns={featureColumns}
            emptyMessage="No features yet."
          />
        </TabsContent>
        <TabsContent value="investigations">
          <ArtifactList
            artifacts={investigations}
            prefix="INV"
            columns={investigationColumns}
            emptyMessage="No investigations yet."
          />
        </TabsContent>
        <TabsContent value="implementations">
          <ArtifactList
            artifacts={implementations}
            prefix="IMP"
            columns={implementationColumns}
            emptyMessage="No implementations yet."
          />
        </TabsContent>
        <TabsContent value="retrospectives">
          <ArtifactList
            artifacts={retrospectives}
            prefix="RET"
            columns={retrospectiveColumns}
            emptyMessage="No retrospectives yet."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
