import { PageShell, SurfaceCard } from '../../../components/layout/PageShell';
import { MissionCard } from '../components/MissionCard';
import { SessionSummary } from '../components/SessionSummary';
import { getStarterContent } from '../../../lib/content/loader';

export function TodayPage() {
  const starterContent = getStarterContent();
  const missions = starterContent.missions;

  return (
    <PageShell
      eyebrow="Daily Entry"
      title="Today"
      description="A focused daily mission list built from starter content. Short, touch-friendly, and ready to grow into the first serious learning loop."
      aside={<span className="status-chip">Starter session</span>}
    >
      <SessionSummary
        missionCount={starterContent.summary.missionCount}
        totalMinutes={starterContent.summary.totalMissionMinutes}
      />

      <SurfaceCard
        title="Daily session"
        description="Open any mission to move into the placeholder route for the next slice. No recommendation or persistence logic is applied yet."
      >
        <div className="mission-list" role="list" aria-label="Daily missions">
          {missions.map((mission) => (
            <div key={mission.id} role="listitem">
              <MissionCard mission={mission} />
            </div>
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard
        title="Session shape"
        description="This slice keeps the mapping from content to UI explicit so the next player routes can plug into the same typed mission records."
      >
        <ul className="simple-list">
          <li>
            {starterContent.summary.missionCount} missions across grammar,
            listening, and output
          </li>
          <li>
            {starterContent.summary.totalMissionMinutes} minutes total for a
            complete session
          </li>
          <li>
            Starter content remains local, typed, and hand-editable under
            `src/content`
          </li>
        </ul>
      </SurfaceCard>
    </PageShell>
  );
}
