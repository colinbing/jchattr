import { SurfaceCard } from '../../../components/layout/PageShell';
import {
  getMissionProgressEntry,
  markMissionComplete,
  useMissionProgress,
} from '../../../lib/progress/missionProgress';

type MissionCompletionCardProps = {
  missionId: string;
};

export function MissionCompletionCard({
  missionId,
}: MissionCompletionCardProps) {
  const progress = useMissionProgress();
  const completion = getMissionProgressEntry(progress, missionId);

  return (
    <SurfaceCard
      title="Completion"
      description="Completion is manual for now. Mark the mission complete when you decide the pass is finished."
    >
      <div className="mission-completion-card">
        <div className="mission-completion-card__summary">
          <p className="mission-completion-card__status">
            {completion.isCompleted ? 'Completed on this device' : 'Not completed yet'}
          </p>
          <p className="mission-completion-card__meta">
            {completion.completionCount > 0
              ? `Completed ${completion.completionCount} time${
                  completion.completionCount === 1 ? '' : 's'
                }`
              : 'No saved completions yet'}
          </p>
          {completion.lastCompletedAt ? (
            <p className="mission-completion-card__meta">
              Last completed {formatCompletedAt(completion.lastCompletedAt)}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          className="mission-button"
          onClick={() => {
            markMissionComplete(missionId);
          }}
        >
          {completion.isCompleted ? 'Mark complete again' : 'Mark complete'}
        </button>
      </div>
    </SurfaceCard>
  );
}

function formatCompletedAt(timestamp: string) {
  const date = new Date(timestamp);

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}
