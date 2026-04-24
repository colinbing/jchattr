import { Link } from 'react-router-dom';
import type { Mission } from '../../../lib/content/types';
import {
  getMissionProgressEntry,
  type MissionProgressRecord,
} from '../../../lib/progress/missionProgress';
import { missionLibraryChapters } from '../../missions/lib/missionLibraryStructure';
import { type TodayRecommendation } from '../lib/todayRecommendations';

type TodayRecommendationCardProps = {
  recommendation: TodayRecommendation;
  missionProgress: MissionProgressRecord;
};

export function TodayRecommendationCard({
  recommendation,
  missionProgress,
}: TodayRecommendationCardProps) {
  const progress =
    recommendation.kind === 'mission'
      ? getMissionProgressEntry(missionProgress, recommendation.mission.id)
      : null;

  return (
    <article className="mission-card mission-card--recommended">
      <div className="mission-card__header">
        <div className="mission-card__meta">
          <span className="mission-badge">{recommendation.slotLabel}</span>
          <span className="mission-card__minutes">
            {recommendation.kind === 'review'
              ? `${recommendation.batchSize} item${recommendation.batchSize === 1 ? '' : 's'}`
              : `${recommendation.mission.estimatedMinutes} min`}
          </span>
        </div>
        <h3 className="mission-card__title">{recommendation.title}</h3>
      </div>

      <div className="mission-card__details">
        <p className="mission-card__skill-label">
          {recommendation.kind === 'review' ? 'Why now' : 'Path focus'}
        </p>
        <p className="mission-card__skill-value">
          {recommendation.kind === 'review'
            ? recommendation.reason
            : formatMissionPathContext(recommendation.mission)}
        </p>
        {recommendation.kind === 'mission' && progress ? (
          <p className="mission-card__progress">{recommendation.reason}</p>
        ) : null}
        {recommendation.kind === 'review' ? (
          <p className="mission-card__progress">
            {recommendation.weakPointCount} tracked weak point
            {recommendation.weakPointCount === 1 ? '' : 's'}
          </p>
        ) : null}
        {recommendation.kind === 'mission' ? (
          <p className="list-meta">
            {progress?.isCompleted
              ? `Completed ${progress.completionCount} time${
                  progress.completionCount === 1 ? '' : 's'
                } on this device. `
              : ''}
            Target skill: {formatTargetSkill(recommendation.mission.targetSkill)}
          </p>
        ) : null}
      </div>

      <Link
        to={recommendation.to}
        className="mission-card__cta"
        aria-label={recommendation.title}
      >
        {recommendation.ctaLabel}
      </Link>
    </article>
  );
}

function formatTargetSkill(targetSkill: Mission['targetSkill']) {
  return targetSkill.replace(/-/g, ' ');
}

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

function formatMissionPathContext(mission: Mission) {
  const chapter = missionLibraryChapters.find((entry) => entry.missionIds.includes(mission.id));

  if (!chapter) {
    return formatMissionType(mission.type);
  }

  const missionIndex = chapter.missionIds.indexOf(mission.id) + 1;
  return `${formatMissionType(mission.type)} · ${chapter.label} · ${missionIndex} of ${chapter.missionIds.length}`;
}
