import { Link } from 'react-router-dom';
import type { Mission } from '../../../lib/content/types';

type ContinueMissionCardProps = {
  mission: Mission;
  detail: string;
  lastVisitedAt: string | null;
};

export function ContinueMissionCard({
  mission,
  detail,
  lastVisitedAt,
}: ContinueMissionCardProps) {
  return (
    <article className="mission-card mission-card--continue">
      <div className="mission-card__header">
        <div className="mission-card__meta">
          <span className="mission-badge">Continue</span>
          <span className="mission-card__minutes">{mission.estimatedMinutes} min</span>
        </div>
        <h3 className="mission-card__title">{mission.title}</h3>
      </div>

      <div className="mission-card__details">
        <p className="mission-card__skill-label">Resume point</p>
        <p className="mission-card__skill-value">{detail}</p>
        {lastVisitedAt ? (
          <p className="mission-card__progress">
            Last active {formatVisitedAt(lastVisitedAt)}
          </p>
        ) : null}
      </div>

      <Link
        to={`/mission/${mission.id}`}
        state={{ preserveScroll: true }}
        className="mission-card__cta"
        aria-label={`Continue ${mission.title}`}
      >
        Continue mission
      </Link>
    </article>
  );
}

function formatVisitedAt(timestamp: string) {
  const date = new Date(timestamp);

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}
