import { notFound } from "next/navigation";
import { getArtifact } from "@/lib/kb/reader";
import { ArtifactDetail } from "@/components/artifacts/artifact-detail";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export const dynamic = "force-dynamic";

export default async function FindingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artifact = await getArtifact("F", id);
  if (!artifact) notFound();

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Research", href: "/research" },
          { label: "Findings", href: "/research" },
          { label: `${artifact.id} — ${artifact.title}` },
        ]}
      />
      <ArtifactDetail artifact={artifact} />
    </div>
  );
}
