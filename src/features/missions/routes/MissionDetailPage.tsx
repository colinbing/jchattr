import { Link, useParams } from 'react-router-dom';
import { PageShell, SurfaceCard } from '../../../components/layout/PageShell';
import { getStarterContent } from '../../../lib/content/loader';

export function MissionDetailPage() {
  const { missionId } = useParams<{ missionId: string }>();
  const starterContent = getStarterContent();
  const mission = missionId ? starterContent.byId.missions[missionId] : undefined;

  if (!mission) {
    return (
      <PageShell
        eyebrow="Mission"
        title="Mission not found"
        description="This placeholder route is ready for the mission player slice, but the requested mission id does not exist in starter content."
      >
        <SurfaceCard
          title="Back to today"
          description="Return to the daily session list and open one of the starter missions."
        >
          <Link to="/" className="inline-link">
            View today&apos;s missions
          </Link>
        </SurfaceCard>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Mission"
      title={mission.title}
      description="This is a temporary route target so the Today page can expose an obvious mission CTA before the player slice is implemented."
      aside={<span className="status-chip">Player placeholder</span>}
    >
      <SurfaceCard
        title="Mission overview"
        description="The future mission player will take over this route. For now it confirms the selected mission and keeps the CTA path stable."
      >
        <ul className="simple-list">
          <li>Type: {mission.type}</li>
          <li>Target skill: {mission.targetSkill}</li>
          <li>Estimated time: {mission.estimatedMinutes} min</li>
        </ul>
      </SurfaceCard>

      <SurfaceCard
        title="Next slice"
        description="The grammar mission player can be implemented on this route without changing the Today page card structure."
      >
        <Link to="/" className="inline-link">
          Back to today
        </Link>
      </SurfaceCard>
    </PageShell>
  );
}
