import { SurfaceCard } from '../../../components/layout/PageShell';
import {
  getMissionProgressEntry,
  useMissionProgress,
} from '../../../lib/progress/missionProgress';

type MissionCompletionCardProps = {
  missionId: string;
  clearedCount: number;
  totalCount: number;
  unitLabel: string;
};

export function MissionCompletionCard({
  missionId,
  clearedCount,
  totalCount,
  unitLabel,
}: MissionCompletionCardProps) {
  const progress = useMissionProgress();
  const completion = getMissionProgressEntry(progress, missionId);
  const isAutoCompleteReady = totalCount > 0 && clearedCount >= totalCount;

  return (
    <SurfaceCard
      title="Completion"
      description="This mission now completes automatically when you clear every drill or check in the current pass."
    >
      <div className="mission-completion-card">
        <div className="mission-completion-card__summary">
          <p className="mission-completion-card__status">
            {completion.isCompleted
              ? isAutoCompleteReady
                ? 'Completed automatically in this pass'
                : 'Completed on this device'
              : 'In progress'}
          </p>
          <p className="mission-completion-card__meta">
            Cleared {Math.min(clearedCount, totalCount)} of {totalCount} {unitLabel}
            {totalCount === 1 ? '' : 's'} in this pass
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
