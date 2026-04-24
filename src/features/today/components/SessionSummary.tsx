type SessionSummaryProps = {
  missionCount: number;
  chapterCount: number;
  requiredCount: number;
  requiredMinutes: number;
  bonusCount: number;
  bonusMinutes: number;
};

export function SessionSummary({
  missionCount,
  chapterCount,
  requiredCount,
  requiredMinutes,
  bonusCount,
  bonusMinutes,
}: SessionSummaryProps) {
  return (
    <section className="session-summary" aria-label="Daily session summary">
      <div className="session-summary__content">
        <p className="session-summary__eyebrow">Today&apos;s plan</p>
        <h2 className="session-summary__title">
          Start with {requiredCount} core item{requiredCount === 1 ? '' : 's'}
        </h2>
        <p className="session-summary__body">
          {requiredMinutes} min for the main plan. Bonus stays optional.
        </p>
      </div>

      <dl className="session-summary__stats">
        <div className="session-summary__stat">
          <dt>Core plan</dt>
          <dd>
            {requiredCount} item{requiredCount === 1 ? '' : 's'}
          </dd>
        </div>
        <div className="session-summary__stat">
          <dt>Bonus lane</dt>
          <dd>{bonusCount > 0 ? `+${bonusMinutes} min` : 'Optional'}</dd>
        </div>
        <div className="session-summary__stat">
          <dt>Time now</dt>
          <dd>{requiredMinutes} min</dd>
        </div>
      </dl>

      <details className="session-summary__details">
        <summary className="session-summary__details-summary">Path details</summary>
        <p className="session-summary__details-body">
          {chapterCount} chapters and {missionCount} total missions are available in the mission
          path.
        </p>
      </details>
    </section>
  );
}
