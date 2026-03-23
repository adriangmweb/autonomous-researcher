import { getDecisions } from "@/lib/kb/reader";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DecisionsPage() {
  const decisions = await getDecisions();

  return (
    <div>
      <Breadcrumbs items={[{ label: "Dashboard", href: "/" }, { label: "Decisions" }]} />
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-stone-900 mb-1">Decisions</h1>
        <p className="text-sm text-stone-500">
          Decision log with reasoning and alternatives
        </p>
      </div>

      {decisions.length === 0 ? (
        <Card className="border-dashed border-stone-300 bg-stone-50/50">
          <CardContent className="py-12 text-center">
            <Scale size={32} className="mx-auto mb-3 text-stone-300" />
            <p className="text-sm text-stone-400">
              No decisions logged yet. Decisions are recorded as the agent makes
              significant choices.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {decisions.map((d) => (
            <Card key={d.number} className="border-stone-200 bg-white">
              <CardContent className="py-4 px-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-xs text-stone-400">{d.number}</span>
                  {d.date && (
                    <span className="text-xs text-stone-400">{d.date}</span>
                  )}
                  {d.type && (
                    <Badge
                      variant="outline"
                      className="border-0 text-xs font-medium bg-stone-100 text-stone-600"
                    >
                      {d.type}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-stone-800">{d.decision}</p>
                {d.summary && d.summary !== d.decision && (
                  <p className="text-xs text-stone-500 mt-1">{d.summary}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
