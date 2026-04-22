import { PageShell, SurfaceCard } from '../../../components/layout/PageShell';

export function ReviewPage() {
  return (
    <PageShell
      eyebrow="Weak Points"
      title="Review"
      description="This screen is reserved for missed items, recurring confusion, and suggested follow-up work."
      aside={<span className="status-chip">Reinforcement shell</span>}
    >
      <SurfaceCard
        title="Needs review"
        description="Problem areas will surface here once progress data and mission outcomes are being stored locally."
      >
        <ul className="simple-list">
          <li>Recently missed items</li>
          <li>Confusion pairs</li>
          <li>Suggested follow-up missions</li>
        </ul>
      </SurfaceCard>

      <SurfaceCard
        title="Review rhythm"
        description="This panel can later guide the user toward small, high-value reinforcement loops instead of passive browsing."
      >
        <ul className="simple-list">
          <li>Short revisit batches</li>
          <li>Priority ordering</li>
          <li>Completion feedback</li>
        </ul>
      </SurfaceCard>
    </PageShell>
  );
}
