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

  return (
    <PageShell
      eyebrow="Skill Map"
      title="Progress"
      description="A lightweight local view of current strengths, completion momentum, and weak-point pressure. Tiering stays intentionally simple and easy to inspect."
      aside={<span className="status-chip">Local progress</span>}
    >
      <SurfaceCard
        title="Skill map v1"
        description="These tiers are derived from mission completions and recorded weak points only. They are meant to be useful, not precise."
      >
        <div className="skill-map-list">
          {overview.skillAreas.map((skillArea) => (
            <SkillCard key={skillArea.id} skillArea={skillArea} />
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard
        title="Mission completion"
        description="Manual mission completion is the current source of momentum and coverage data."
      >
        <ul className="simple-list">
          <li>
            {overview.completedMissionCount} starter mission{overview.completedMissionCount === 1 ? '' : 's'} completed on this device
          </li>
          <li>
            {overview.totalCompletionCount} total completion tap{overview.totalCompletionCount === 1 ? '' : 's'}
          </li>
          <li>
            {overview.lastCompletedAt
              ? `Most recent completion ${formatTimestamp(overview.lastCompletedAt)}`
              : 'No saved completions yet'}
          </li>
        </ul>
      </SurfaceCard>

      <SurfaceCard
        title="Weak-point pressure"
        description="Weak points come only from explicit incorrect checks in current mission players."
      >
        <ul className="simple-list">
          <li>
            {overview.trackedWeakPointCount} tracked weak point{overview.trackedWeakPointCount === 1 ? '' : 's'}
          </li>
          <li>
            {overview.totalMissCount} total recorded miss{overview.totalMissCount === 1 ? '' : 'es'}
          </li>
          <li>
            {overview.lastMissedAt
              ? `Most recent miss ${formatTimestamp(overview.lastMissedAt)}`
              : 'No weak points recorded yet'}
          </li>
        </ul>
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
        <div>
          <p className="skill-card__eyebrow">Skill area</p>
          <h3 className="skill-card__title">{skillArea.label}</h3>
        </div>
        <span className={`skill-card__tier skill-card__tier--${skillArea.tier}`}>
          {formatSkillTierLabel(skillArea.tier)}
        </span>
      </div>

      <p className="skill-card__note">{skillArea.note}</p>

      <dl className="skill-card__stats">
        <div className="skill-card__stat">
          <dt>Completions</dt>
          <dd>{skillArea.completionCount}</dd>
        </div>
        <div className="skill-card__stat">
          <dt>Weak points</dt>
          <dd>{skillArea.weakPointCount}</dd>
        </div>
        <div className="skill-card__stat">
          <dt>Total misses</dt>
          <dd>{skillArea.totalMisses}</dd>
        </div>
      </dl>
    </article>
  );
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
