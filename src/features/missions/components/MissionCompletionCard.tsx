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
      description="Clear every drill or check to finish this mission."
    >
      <div className="mission-completion-card">
        <div className="mission-completion-card__summary">
          <p className="mission-completion-card__status">
            {completion.isCompleted
              ? isAutoCompleteReady
                ? 'Mission complete'
                : 'Completed earlier on this device'
              : 'Keep going'}
          </p>
          <p className="mission-completion-card__meta">
            {Math.min(clearedCount, totalCount)}/{totalCount} {unitLabel}
            {totalCount === 1 ? '' : 's'} done
          </p>
          <p className="mission-completion-card__meta">
            {completion.completionCount > 0
              ? `Completed ${completion.completionCount} time${
                  completion.completionCount === 1 ? '' : 's'
                }`
              : 'Not completed yet'}
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
