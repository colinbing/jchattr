import { Link } from 'react-router-dom';
import type { Mission, StarterContent } from '../../../lib/content/types';
import type { MissionProgressEntry } from '../../../lib/progress/missionProgress';

export type MissionLibraryCardData = {
  mission: Mission;
  progress: MissionProgressEntry;
  isUnlocked: boolean;
  isRecommended: boolean;
  recommendedSlotLabel?: string;
  recommendedReason?: string;
  weakPointCount: number;
  totalMisses: number;
  unlockRequirement: string | null;
};

type MissionLibraryCardProps = {
  item: MissionLibraryCardData;
  starterContent: StarterContent;
};

export function MissionLibraryCard({
  item,
  starterContent,
}: MissionLibraryCardProps) {
  const {
    mission,
    progress,
    isUnlocked,
    isRecommended,
    recommendedSlotLabel,
    recommendedReason,
    weakPointCount,
    totalMisses,
    unlockRequirement,
  } = item;
  const cardClassName = [
    'mission-card',
    'mission-library-card',
    isRecommended ? 'mission-card--recommended' : '',
    !isUnlocked ? 'mission-card--locked' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article className={cardClassName}>
      <div className="mission-card__header">
        <div className="mission-card__meta">
          <span className="mission-badge">{formatMissionType(mission.type)}</span>
          <span className="mission-card__minutes">{mission.estimatedMinutes} min</span>
        </div>
        <h3 className="mission-card__title">{mission.title}</h3>
      </div>

      <div className="mission-card__details">
        <div className="mission-library-card__quick-row" aria-label="Mission details">
          <p className="mission-card__skill-value">{formatTargetSkill(mission.targetSkill)}</p>
          <p className="mission-library-card__content-note">
            {buildContentNote(mission, starterContent)}
          </p>
        </div>

        <div className="mission-library-card__state-row" aria-label="Mission state">
          <span
            className={`mission-state-pill mission-state-pill--${
              isUnlocked ? 'ready' : 'locked'
            }`}
          >
            {isUnlocked ? 'Unlocked' : 'Locked'}
          </span>
          {progress.isCompleted ? (
            <span className="mission-state-pill mission-state-pill--completed">
              Completed
            </span>
          ) : null}
          {isRecommended ? (
            <span className="mission-state-pill mission-state-pill--recommended">
              {recommendedSlotLabel ?? 'Recommended'}
            </span>
          ) : null}
          {weakPointCount > 0 ? (
            <span className="mission-state-pill mission-state-pill--review">
              Needs review
            </span>
          ) : null}
        </div>

        {isRecommended && recommendedReason ? (
          <p className="mission-library-card__reason">{recommendedReason}</p>
        ) : null}

        <details className="mission-library-card__details">
          <summary className="mission-library-card__details-summary">
            Mission details
          </summary>
          <div className="mission-library-card__detail-stack">
            <p className="mission-library-card__detail-text">
              {buildProgressNote(progress, isUnlocked)}
            </p>
            <p className="mission-library-card__detail-text">
              {weakPointCount > 0
                ? `${totalMisses} miss${totalMisses === 1 ? '' : 'es'} across ${weakPointCount} review item${
                    weakPointCount === 1 ? '' : 's'
                  }.`
                : 'No review pressure recorded yet.'}
            </p>
            {progress.lastCompletedAt ? (
              <p className="mission-library-card__detail-text">
                Last cleared {formatCompletedAt(progress.lastCompletedAt)}.
              </p>
            ) : null}
            {!isUnlocked && unlockRequirement ? (
              <p className="mission-library-card__lock-note">{unlockRequirement}</p>
            ) : null}
          </div>
        </details>
      </div>

      {isUnlocked ? (
        <Link
          to={`/mission/${mission.id}`}
          className="mission-card__cta"
          aria-label={`Open ${mission.title}`}
        >
          {progress.isCompleted ? 'Open again' : 'Start mission'}
        </Link>
      ) : (
        <span className="mission-card__cta mission-card__cta--disabled" aria-disabled="true">
          Locked for now
        </span>
      )}
    </article>
  );
}

export function buildContentNote(mission: Mission, starterContent: StarterContent) {
  if (mission.type === 'grammar') {
    const lessonId = mission.contentRefs.grammarLessonIds?.[0];
    const lesson = lessonId ? starterContent.byId.grammarLessons[lessonId] : null;
    return lesson
      ? `${lesson.drills.length} drill${lesson.drills.length === 1 ? '' : 's'} in the linked lesson`
      : 'Starter grammar lesson';
  }

  if (mission.type === 'listening') {
    const listeningCount = mission.contentRefs.listeningItemIds?.length ?? 0;
    return `${listeningCount} listening item${listeningCount === 1 ? '' : 's'} in this set`;
  }

  if (mission.type === 'reading') {
    const checkCount = mission.readingChecks?.length ?? 0;
    return `${checkCount} reading check${checkCount === 1 ? '' : 's'} in this set`;
  }

  const taskCount = mission.outputTasks?.length ?? 0;
  return `${taskCount} output task${taskCount === 1 ? '' : 's'} in this set`;
}

export function formatMissionType(type: Mission['type']) {
  switch (type) {
    case 'grammar':
      return 'Grammar';
    case 'listening':
      return 'Listening';
    case 'output':
      return 'Output';
    case 'reading':
      return 'Reading';
  }
}

export function formatTargetSkill(targetSkill: Mission['targetSkill']) {
  return targetSkill.replace(/-/g, ' ');
}

function buildProgressNote(progress: MissionProgressEntry, isUnlocked: boolean) {
  if (progress.isCompleted) {
    return progress.completionCount > 1
      ? `Mission complete. Cleared ${progress.completionCount} times.`
      : 'Mission complete.';
  }

  return isUnlocked ? 'Ready for a first clear.' : 'Locked until the earlier requirement is cleared.';
}

function formatCompletedAt(timestamp: string) {
  const date = new Date(timestamp);

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}
