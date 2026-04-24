import { PageShell, SurfaceCard } from '../../../components/layout/PageShell';
import { getStarterContent } from '../../../lib/content/loader';
import { useMissionProgress } from '../../../lib/progress/missionProgress';
import {
  deriveProgressOverview,
  formatSkillTierLabel,
  type SkillAreaProgress,
} from '../../../lib/progress/skillMap';
import { useWeakPoints } from '../../../lib/progress/weakPoints';

export function ProgressPage() {
  const starterContent = getStarterContent();
  const missionProgress = useMissionProgress();
  const weakPoints = useWeakPoints();
  const overview = deriveProgressOverview(starterContent, missionProgress, weakPoints);
  const prioritizedSkillAreas = [...overview.skillAreas].sort(compareSkillAreasForFocus);
  const focusSkillAreas = prioritizedSkillAreas.filter(isPrioritySkillArea);
  const secondarySkillAreas = prioritizedSkillAreas.filter(
    (skillArea) => !isPrioritySkillArea(skillArea),
  );
  const topFocusSkillArea = focusSkillAreas[0] ?? null;

  return (
    <PageShell
      variant="compact"
      eyebrow="Skill Map"
      title="Progress"
      description="See what feels solid, what needs another pass, and keep the rest tucked away."
      aside={<span className="status-chip">Local progress</span>}
    >
      <SurfaceCard
        className="progress-page__snapshot-card"
        title="Progress snapshot"
        description="Quick view first. Open the details only if you want the full breakdown."
      >
        <dl className="progress-summary-grid">
          <div className="progress-summary-grid__stat">
            <dt>Missions cleared</dt>
            <dd>{overview.completedMissionCount}</dd>
          </div>
          <div className="progress-summary-grid__stat">
            <dt>Weak points</dt>
            <dd>{overview.trackedWeakPointCount}</dd>
          </div>
          <div className="progress-summary-grid__stat">
            <dt>Focus now</dt>
            <dd>{topFocusSkillArea ? topFocusSkillArea.label : 'Keep going'}</dd>
          </div>
        </dl>

        <details className="today-details">
          <summary className="today-details__summary">Completion details</summary>
          <div className="progress-page__detail-copy">
            <p className="today-details__body">
              {overview.completedMissionCount} starter mission
              {overview.completedMissionCount === 1 ? '' : 's'} cleared on this device.
            </p>
            <p className="today-details__body">
              {overview.totalCompletionCount} total clear
              {overview.totalCompletionCount === 1 ? '' : 's'} recorded.
            </p>
            <p className="today-details__body">
              {overview.lastCompletedAt
                ? `Most recent clear ${formatTimestamp(overview.lastCompletedAt)}.`
                : 'No saved clears yet.'}
            </p>
          </div>
        </details>

        <details className="today-details">
          <summary className="today-details__summary">Weak-point details</summary>
          <div className="progress-page__detail-copy">
            <p className="today-details__body">
              {overview.trackedWeakPointCount} tracked weak point
              {overview.trackedWeakPointCount === 1 ? '' : 's'}.
            </p>
            <p className="today-details__body">
              {overview.totalMissCount} recorded miss
              {overview.totalMissCount === 1 ? '' : 'es'}.
            </p>
            <p className="today-details__body">
              {overview.lastMissedAt
                ? `Most recent miss ${formatTimestamp(overview.lastMissedAt)}.`
                : 'No weak points recorded yet.'}
            </p>
          </div>
        </details>
      </SurfaceCard>

      <SurfaceCard
        className="progress-page__skill-map-card"
        title="Skill map"
        description="Priority areas stay visible first. Secondary tier logic and extra counts are tucked away."
      >
        {focusSkillAreas.length > 0 ? (
          <div className="progress-page__focus-stack">
            <div className="progress-page__section-copy">
              <p className="progress-page__section-eyebrow">Needs attention now</p>
              <p className="progress-page__section-body">
                These areas have the most review pressure or the shakiest current signal.
              </p>
            </div>

            <div className="skill-map-list progress-page__skill-map-list">
              {focusSkillAreas.map((skillArea) => (
                <SkillCard key={skillArea.id} skillArea={skillArea} />
              ))}
            </div>
          </div>
        ) : (
          <div className="progress-page__section-copy">
            <p className="progress-page__section-eyebrow">No urgent weak-point pressure</p>
            <p className="progress-page__section-body">
              The current signal is stable enough to browse the full skill map below.
            </p>
          </div>
        )}

        {secondarySkillAreas.length > 0 ? (
          <details className="today-details">
            <summary className="today-details__summary">
              {focusSkillAreas.length > 0
                ? `Other skill areas (${secondarySkillAreas.length})`
                : `All skill areas (${overview.skillAreas.length})`}
            </summary>
            <div className="skill-map-list progress-page__skill-map-list">
              {secondarySkillAreas.map((skillArea) => (
                <SkillCard key={skillArea.id} skillArea={skillArea} />
              ))}
            </div>
          </details>
        ) : null}

        <details className="today-details">
          <summary className="today-details__summary">How these tiers work</summary>
          <p className="today-details__body">
            Tiers are derived only from saved completions and recorded misses. They stay intentionally
            simple and readable rather than pretending to be precise mastery scores.
          </p>
        </details>
      </SurfaceCard>
    </PageShell>
  );
}

type SkillCardProps = {
  skillArea: SkillAreaProgress;
};

function SkillCard({ skillArea }: SkillCardProps) {
  return (
    <article className={`skill-card skill-card--${skillArea.tier}`}>
      <div className="skill-card__header">
        <div className="skill-card__header-content">
          <p className="skill-card__eyebrow">Skill area</p>
          <h3 className="skill-card__title">{skillArea.label}</h3>
        </div>
        <span className={`skill-card__tier skill-card__tier--${skillArea.tier}`}>
          {formatSkillTierLabel(skillArea.tier)}
        </span>
      </div>

      <dl className="skill-card__stats skill-card__stats--compact">
        <div className="skill-card__stat">
          <dt>Completions</dt>
          <dd>{skillArea.completionCount}</dd>
        </div>
        <div className="skill-card__stat">
          <dt>Weak points</dt>
          <dd>{skillArea.weakPointCount}</dd>
        </div>
      </dl>

      <details className="skill-card__details">
        <summary className="skill-card__details-summary">Why this tier</summary>
        <div className="skill-card__details-body">
          <p className="skill-card__note">{skillArea.note}</p>
          <dl className="skill-card__stats">
            <div className="skill-card__stat">
              <dt>Total misses</dt>
              <dd>{skillArea.totalMisses}</dd>
            </div>
            <div className="skill-card__stat">
              <dt>Related missions</dt>
              <dd>{skillArea.relatedMissionCount}</dd>
            </div>
          </dl>
        </div>
      </details>
    </article>
  );
}

function isPrioritySkillArea(skillArea: SkillAreaProgress) {
  return skillArea.tier === 'shaky' || skillArea.weakPointCount > 0;
}

function compareSkillAreasForFocus(left: SkillAreaProgress, right: SkillAreaProgress) {
  return (
    getSkillPriorityScore(right) - getSkillPriorityScore(left) ||
    right.totalMisses - left.totalMisses ||
    right.weakPointCount - left.weakPointCount ||
    right.completionCount - left.completionCount ||
    left.label.localeCompare(right.label)
  );
}

function getSkillPriorityScore(skillArea: SkillAreaProgress) {
  const tierWeight =
    skillArea.tier === 'shaky'
      ? 3
      : skillArea.tier === 'okay'
        ? 2
        : skillArea.tier === 'solid'
          ? 1
          : 0;

  return tierWeight * 100 + skillArea.weakPointCount * 10 + skillArea.totalMisses;
}

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}
