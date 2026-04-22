import { Link } from 'react-router-dom';
import type { Mission } from '../../../lib/content/types';
import type { MissionProgressEntry } from '../../../lib/progress/missionProgress';

type MissionCardProps = {
  mission: Mission;
  progress: MissionProgressEntry;
};

function formatMissionType(type: Mission['type']) {
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

function formatTargetSkill(targetSkill: Mission['targetSkill']) {
  return targetSkill.replace(/-/g, ' ');
}

export function MissionCard({ mission, progress }: MissionCardProps) {
  return (
    <article className="mission-card">
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
        <p className="mission-card__progress">
          {progress.isCompleted
            ? `Completed ${progress.completionCount} time${
                progress.completionCount === 1 ? '' : 's'
              }`
            : 'Not completed yet'}
        </p>
        {progress.lastCompletedAt ? (
          <p className="list-meta">
            Last completed {formatCompletedAt(progress.lastCompletedAt)}
          </p>
        ) : null}
      </div>

      <Link
        to={`/mission/${mission.id}`}
        className="mission-card__cta"
        aria-label={`Open ${mission.title}`}
      >
        Open mission
      </Link>
    </article>
  );
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
