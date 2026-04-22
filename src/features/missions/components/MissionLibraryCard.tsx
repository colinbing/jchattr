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
        <p className="mission-card__skill-label">Target skill</p>
        <p className="mission-card__skill-value">{formatTargetSkill(mission.targetSkill)}</p>

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

        <ul className="mission-library-card__stats">
          <li>
            {progress.isCompleted
              ? `Completed ${progress.completionCount} time${
                  progress.completionCount === 1 ? '' : 's'
                }`
              : 'No saved completions yet'}
          </li>
          <li>
            {weakPointCount > 0
              ? `${totalMisses} recorded miss${totalMisses === 1 ? '' : 'es'} across ${weakPointCount} weak point${
                  weakPointCount === 1 ? '' : 's'
                }`
              : 'No weak-point pressure recorded'}
          </li>
          <li>
            {progress.lastCompletedAt
              ? `Last completed ${formatCompletedAt(progress.lastCompletedAt)}`
              : 'Not completed on this device yet'}
          </li>
        </ul>

        {!isUnlocked && unlockRequirement ? (
          <p className="mission-library-card__lock-note">{unlockRequirement}</p>
        ) : null}

        <p className="mission-library-card__content-note">
          {buildContentNote(mission, starterContent)}
        </p>
      </div>

      {isUnlocked ? (
        <Link
          to={`/mission/${mission.id}`}
          className="mission-card__cta"
          aria-label={`Open ${mission.title}`}
        >
          Open mission
        </Link>
      ) : (
        <span className="mission-card__cta mission-card__cta--disabled" aria-disabled="true">
          Locked for now
        </span>
      )}
    </article>
  );
}

function buildContentNote(mission: Mission, starterContent: StarterContent) {
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

  const taskCount = mission.outputTasks?.length ?? 0;
  return `${taskCount} output task${taskCount === 1 ? '' : 's'} in this set`;
}

function formatMissionType(type: Mission['type']) {
  switch (type) {
    case 'grammar':
      return 'Grammar';
    case 'listening':
      return 'Listening';
    case 'output':
      return 'Output';
  }
}

function formatTargetSkill(targetSkill: Mission['targetSkill']) {
  return targetSkill.replace(/-/g, ' ');
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
