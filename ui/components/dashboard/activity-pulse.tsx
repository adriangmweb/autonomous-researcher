import { Card, CardContent } from "@/components/ui/card";
import type { ArtifactSummary } from "@/lib/kb/types";
import { CheckSquare, FlaskConical, Lightbulb, AlertTriangle } from "lucide-react";

interface PulseProps {
  artifacts: ArtifactSummary[];
}

export function ActivityPulse({ artifacts }: PulseProps) {
  const tasks = artifacts.filter((a) => a.prefix === "T");
  const experiments = artifacts.filter((a) => a.prefix === "E");
  const findings = artifacts.filter((a) => a.prefix === "F");
  const blocked = tasks.filter(
    (a) => a.metadata["Status"]?.toUpperCase() === "BLOCKED",
  );

  const tasksDone = tasks.filter(
    (a) => a.metadata["Status"]?.toUpperCase() === "DONE",
  ).length;

  const activeExperiments = experiments.filter((a) => {
    const s = a.metadata["Status"]?.toUpperCase();
    return s === "RUNNING" || s === "DESIGNED";
  }).length;

  const cards = [
    {
      label: "Tasks",
      value: tasks.length,
      sub: tasks.length > 0 ? `${tasksDone} done` : "none yet",
      icon: CheckSquare,
      color: "text-blue-600",
    },
    {
      label: "Experiments",
      value: experiments.length,
      sub: activeExperiments > 0 ? `${activeExperiments} active` : "none active",
      icon: FlaskConical,
      color: "text-violet-600",
    },
    {
      label: "Findings",
      value: findings.length,
      sub: findings.filter((f) => f.metadata["Impact"] === "HIGH").length > 0
        ? `${findings.filter((f) => f.metadata["Impact"] === "HIGH").length} high-impact`
        : "none yet",
      icon: Lightbulb,
      color: "text-amber-600",
    },
    {
      label: "Blocked",
      value: blocked.length,
      sub: blocked.length > 0 ? "needs attention" : "all clear",
      icon: AlertTriangle,
      color: blocked.length > 0 ? "text-red-600" : "text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map(({ label, value, sub, icon: Icon, color }) => (
        <Card key={label} className="border-stone-200 bg-white">
          <CardContent className="py-4 px-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon size={16} className={color} />
              <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                {label}
              </span>
            </div>
            <p className="text-2xl font-semibold text-stone-900">{value}</p>
            <p className="text-xs text-stone-400 mt-0.5">{sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
