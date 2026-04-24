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
        <p className="session-summary__eyebrow">Today&apos;s session</p>
        <h2 className="session-summary__title">Small, repeatable daily plan</h2>
        <p className="session-summary__body">
          Start with {requiredCount} core item{requiredCount === 1 ? '' : 's'} today,
          then use the bonus lane only if you want more. The full mission library is
          organized as a progression path, not a single sitting.
        </p>
      </div>

      <dl className="session-summary__stats">
        <div className="session-summary__stat">
          <dt>Do today</dt>
          <dd>{requiredMinutes} min</dd>
        </div>
        <div className="session-summary__stat">
          <dt>Bonus lane</dt>
          <dd>{bonusCount > 0 ? `+${bonusMinutes} min` : 'Optional'}</dd>
        </div>
        <div className="session-summary__stat">
          <dt>Chapters</dt>
          <dd>{chapterCount}</dd>
        </div>
        <div className="session-summary__stat">
          <dt>Full mission set</dt>
          <dd>{missionCount}</dd>
        </div>
      </dl>
    </section>
  );
}
