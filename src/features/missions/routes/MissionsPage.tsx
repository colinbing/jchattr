import { PageShell, SurfaceCard } from '../../../components/layout/PageShell';

export function MissionsPage() {
  return (
    <PageShell
      eyebrow="Mission Library"
      title="Missions"
      description="This route will hold the mission queue and, later, the mission player entry points for grammar, listening, and output work."
      aside={<span className="status-chip">Ready for schema data</span>}
    >
      <SurfaceCard
        title="Mission queue"
        description="The primary list of available or recommended missions will render here."
      >
        <ul className="simple-list">
          <li>Grammar missions</li>
          <li>Listening missions</li>
          <li>Output missions</li>
        </ul>
      </SurfaceCard>

      <SurfaceCard
        title="Filters and states"
        description="This secondary panel is reserved for mission categories, completion state, and future unlocking rules."
      >
        <ul className="simple-list">
          <li>Target skill</li>
          <li>Estimated minutes</li>
          <li>Availability status</li>
        </ul>
      </SurfaceCard>
    </PageShell>
  );
}
