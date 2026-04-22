import { PageShell, SurfaceCard } from '../../../components/layout/PageShell';

export function ProgressPage() {
  return (
    <PageShell
      eyebrow="Skill Map"
      title="Progress"
      description="This page is reserved for the skill map and completion history once local persistence and starter content are in place."
      aside={<span className="status-chip">Tracking shell</span>}
    >
      <SurfaceCard
        title="Skill map"
        description="The initial version will visualize learning areas with simple tiers like shaky, okay, and solid."
      >
        <ul className="simple-list">
          <li>Particles</li>
          <li>Verb forms</li>
          <li>Sentence structure</li>
          <li>Listening comprehension</li>
        </ul>
      </SurfaceCard>

      <SurfaceCard
        title="History"
        description="A compact stream for completed sessions, mission counts, and recent movement will live here."
      >
        <ul className="simple-list">
          <li>Completed sessions</li>
          <li>Recent mission streaks</li>
          <li>Confidence changes</li>
        </ul>
      </SurfaceCard>
    </PageShell>
  );
}
