import { Link } from 'react-router-dom';
import {
  getMissionProgressEntry,
  type MissionProgressRecord,
} from '../../../lib/progress/missionProgress';
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
          {recommendation.kind === 'review' ? 'Why now' : 'Recommended because'}
        </p>
        <p className="mission-card__skill-value">{recommendation.reason}</p>
        {recommendation.kind === 'mission' && progress ? (
          <p className="mission-card__progress">
            {progress.isCompleted
              ? `Completed ${progress.completionCount} time${
                  progress.completionCount === 1 ? '' : 's'
                }`
              : 'Unlocked and ready to start'}
          </p>
        ) : null}
        {recommendation.kind === 'review' ? (
          <p className="mission-card__progress">
            {recommendation.weakPointCount} tracked weak point
            {recommendation.weakPointCount === 1 ? '' : 's'}
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
