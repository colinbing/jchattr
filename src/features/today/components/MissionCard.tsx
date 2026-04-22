import { Link } from 'react-router-dom';
import type { Mission } from '../../../lib/content/types';

type MissionCardProps = {
  mission: Mission;
};

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

export function MissionCard({ mission }: MissionCardProps) {
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
