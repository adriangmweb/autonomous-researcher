import { Card, CardContent } from "@/components/ui/card";
import type { Challenge } from "@/lib/kb/types";
import { Target } from "lucide-react";

export function MissionBanner({ challenge }: { challenge: Challenge }) {
  if (!challenge.isSet) {
    return (
      <Card className="border-dashed border-stone-300 bg-stone-50/50">
        <CardContent className="py-8 text-center">
          <Target size={32} className="mx-auto mb-3 text-stone-300" />
          <h2 className="text-lg font-medium text-stone-500 mb-1">
            No mission defined yet
          </h2>
          <p className="text-sm text-stone-400">
            Define your research challenge in{" "}
            <code className="text-xs bg-stone-100 px-1.5 py-0.5 rounded">
              kb/mission/CHALLENGE.md
            </code>
          </p>
        </CardContent>
      </Card>
    );
  }

  const objective =
    challenge.sections["Objective"] || challenge.sections["_preamble"] || "";

  return (
    <Card className="border-stone-200 bg-white">
      <CardContent className="py-5">
        <div className="flex items-start gap-3">
          <Target size={20} className="mt-0.5 text-violet-500 shrink-0" />
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Mission
            </h2>
            <p className="text-stone-800 text-sm leading-relaxed">
              {objective.split("\n").filter(Boolean)[0] || "Challenge is set — view details for more."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
