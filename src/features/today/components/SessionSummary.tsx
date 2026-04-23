type SessionSummaryProps = {
  missionCount: number;
  recommendedCount: number;
  totalMinutes: number;
};

export function SessionSummary({
  missionCount,
  recommendedCount,
  totalMinutes,
}: SessionSummaryProps) {
  return (
    <section className="session-summary" aria-label="Daily session summary">
      <div className="session-summary__content">
        <p className="session-summary__eyebrow">Today&apos;s session</p>
        <h2 className="session-summary__title">Small, repeatable daily plan</h2>
        <p className="session-summary__body">
          Start with up to {recommendedCount} recommended item
          {recommendedCount === 1 ? '' : 's'} today. The full starter set stays
          available below, but it is not meant to be completed in one sitting.
        </p>
      </div>

      <dl className="session-summary__stats">
        <div className="session-summary__stat">
          <dt>Recommended now</dt>
          <dd>{recommendedCount}</dd>
        </div>
        <div className="session-summary__stat">
          <dt>Full mission set</dt>
          <dd>{missionCount}</dd>
        </div>
        <div className="session-summary__stat">
          <dt>Starter-set estimate</dt>
          <dd>{totalMinutes} min</dd>
        </div>
      </dl>
    </section>
  );
}
