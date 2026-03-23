import { notFound } from "next/navigation";
import { getArtifact } from "@/lib/kb/reader";
import { ArtifactDetail } from "@/components/artifacts/artifact-detail";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import type { ArtifactPrefix } from "@/lib/kb/types";

export const dynamic = "force-dynamic";

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Determine if it's a CR or SR from the ID prefix
  const prefix: ArtifactPrefix = id.startsWith("SR") ? "SR" : "CR";
  const artifact = await getArtifact(prefix, id);
  if (!artifact) notFound();

  const typeLabel = prefix === "CR" ? "Challenge Reviews" : "Strategic Reviews";

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Reviews", href: "/reviews" },
          { label: typeLabel, href: "/reviews" },
          { label: `${artifact.id} — ${artifact.title}` },
        ]}
      />
      <ArtifactDetail artifact={artifact} />
    </div>
  );
}
