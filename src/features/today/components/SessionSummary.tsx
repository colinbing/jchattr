type SessionSummaryProps = {
  missionCount: number;
  totalMinutes: number;
};

export function SessionSummary({
  missionCount,
  totalMinutes,
}: SessionSummaryProps) {
  return (
    <section className="session-summary" aria-label="Daily session summary">
      <div className="session-summary__content">
        <p className="session-summary__eyebrow">Today&apos;s session</p>
        <h2 className="session-summary__title">{totalMinutes} minute daily loop</h2>
        <p className="session-summary__body">
          Three short missions covering grammar, listening, and output. Built for a
          single focused session on mobile first.
        </p>
      </div>

      <dl className="session-summary__stats">
        <div className="session-summary__stat">
          <dt>Missions</dt>
          <dd>{missionCount}</dd>
        </div>
        <div className="session-summary__stat">
          <dt>Total time</dt>
          <dd>{totalMinutes} min</dd>
        </div>
      </dl>
    </section>
  );
}
