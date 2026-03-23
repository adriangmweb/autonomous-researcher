import { getChallenge, getRecentActivity, listAllArtifacts } from "@/lib/kb/reader";
import { MissionBanner } from "@/components/dashboard/mission-banner";
import { ActivityPulse } from "@/components/dashboard/activity-pulse";
import { InProgressPanel } from "@/components/dashboard/in-progress-panel";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { BlockedItems } from "@/components/dashboard/blocked-items";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [challenge, allArtifacts, recentActivity] = await Promise.all([
    getChallenge(),
    listAllArtifacts(),
    getRecentActivity(12),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900 mb-1">Dashboard</h1>
        <p className="text-sm text-stone-500">Research overview and live status</p>
      </div>

      <MissionBanner challenge={challenge} />
      <ActivityPulse artifacts={allArtifacts} />
      <BlockedItems artifacts={allArtifacts} />
      <InProgressPanel artifacts={allArtifacts} />
      <RecentActivity activity={recentActivity} />
    </div>
  );
}
