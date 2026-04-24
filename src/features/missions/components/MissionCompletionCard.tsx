import { Link } from 'react-router-dom';
import { SurfaceCard } from '../../../components/layout/PageShell';
import {
  getMissionProgressEntry,
  useMissionProgress,
} from '../../../lib/progress/missionProgress';
import type {
  MissionCompletionRouteState,
  MissionSessionMode,
} from '../lib/missionSession';

type MissionCompletionCardProps = {
  missionId: string;
  clearedCount: number;
  totalCount: number;
  unitLabel: string;
  sessionMode: MissionSessionMode;
  returnState: MissionCompletionRouteState;
};

export function MissionCompletionCard({
  missionId,
  clearedCount,
  totalCount,
  unitLabel,
  sessionMode,
  returnState,
}: MissionCompletionCardProps) {
  const progress = useMissionProgress();
  const completion = getMissionProgressEntry(progress, missionId);
  const isAutoCompleteReady = totalCount > 0 && clearedCount >= totalCount;
  const showReturnActions = isAutoCompleteReady || completion.isCompleted;

  return (
    <SurfaceCard
      title={sessionMode === 'reinforce' ? 'Short pass status' : 'Mission status'}
      description={
        sessionMode === 'reinforce'
          ? 'Short reinforce passes stay local and count as quick follow-up practice.'
          : 'Clear every drill or check in this pass to finish the mission.'
      }
    >
      <div className="mission-completion-card">
        <div className="mission-completion-card__summary">
          <p className="mission-completion-card__status">
            {completion.isCompleted
              ? isAutoCompleteReady
                ? sessionMode === 'reinforce'
                  ? 'Short reinforce pass complete'
                  : 'Mission complete'
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

        {showReturnActions ? (
          <div className="mission-step-actions mission-completion-card__actions">
            <Link to="/" state={returnState} className="mission-button mission-button--link">
              Back to Today plan
            </Link>
            <Link
              to="/missions"
              className="mission-button mission-button--secondary mission-button--link"
            >
              Open mission path
            </Link>
          </div>
        ) : null}
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
