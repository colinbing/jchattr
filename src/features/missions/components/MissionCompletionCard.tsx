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
import type { MissionAttemptSummary } from '../lib/missionCompletion';

type MissionCompletionCardProps = {
  missionId: string;
  attemptSummary: MissionAttemptSummary;
  totalCount: number;
  unitLabel: string;
  sessionMode: MissionSessionMode;
  returnState: MissionCompletionRouteState;
  onReturn?: () => void;
};

export function MissionCompletionCard({
  missionId,
  attemptSummary,
  totalCount,
  unitLabel,
  sessionMode,
  returnState,
  onReturn,
}: MissionCompletionCardProps) {
  const progress = useMissionProgress();
  const completion = getMissionProgressEntry(progress, missionId);
  const isAutoCompleteReady = attemptSummary.isExposureComplete;
  const showReturnActions = isAutoCompleteReady || completion.isCompleted;
  const progressLabel = `${attemptSummary.attemptedCount}/${totalCount} ${unitLabel}${
    totalCount === 1 ? '' : 's'
  } attempted`;
  const reviewItemCount = attemptSummary.incorrectCount + attemptSummary.supportedCount;

  return (
    <SurfaceCard
      title={showReturnActions ? 'Ready for Today' : 'Keep this pass moving'}
      description={
        showReturnActions
          ? sessionMode === 'reinforce'
            ? 'This short pass is done. Use Today for the next best move.'
            : 'This mission pass is done. Head back into Today for the next step.'
          : 'Clear the remaining items in this pass, then return to Today.'
      }
    >
      <div className="mission-completion-card">
        <div className="mission-completion-card__summary">
          <p className="mission-completion-card__status">
            {completion.isCompleted
              ? isAutoCompleteReady
                ? attemptSummary.isMasteryComplete
                  ? 'Clean pass'
                  : reviewItemCount > 0
                    ? 'Finished with review needed'
                    : sessionMode === 'reinforce'
                      ? 'Short reinforce pass finished'
                      : 'Mission pass finished'
                : 'Finished earlier on this device'
              : 'Keep going'}
          </p>
          <div className="review-chip-row review-chip-row--active" aria-label="Mission pass summary">
            <span className="review-chip">{progressLabel}</span>
            <span className="review-chip">{attemptSummary.correctCount} correct</span>
            {reviewItemCount > 0 ? (
              <span className="review-chip">{reviewItemCount} review item{reviewItemCount === 1 ? '' : 's'}</span>
            ) : null}
            {showReturnActions ? (
              <span className="review-chip">
                {sessionMode === 'reinforce' ? 'Short reinforce pass' : 'Core mission pass'}
              </span>
            ) : (
              <span className="review-chip">Still in progress</span>
            )}
          </div>
          {completion.lastCompletedAt ? (
            <details className="mission-completion-card__details">
              <summary className="mission-completion-card__summary-toggle">Earlier on this device</summary>
              <p className="mission-completion-card__meta">
                Finished {completion.completionCount} time{completion.completionCount === 1 ? '' : 's'}.
              </p>
              {completion.masteryCount > 0 ? (
                <p className="mission-completion-card__meta">
                  Clean pass {completion.masteryCount} time{completion.masteryCount === 1 ? '' : 's'}.
                </p>
              ) : null}
              <p className="mission-completion-card__meta">
                Last finished {formatCompletedAt(completion.lastCompletedAt)}
              </p>
            </details>
          ) : null}
        </div>

        {showReturnActions ? (
          <div className="mission-step-actions mission-completion-card__actions">
            <Link
              to="/"
              state={returnState}
              className="mission-button mission-button--link"
              onClick={onReturn}
            >
              Open Today plan
            </Link>
            <Link
              to="/missions"
              className="mission-button mission-button--secondary mission-button--link"
            >
              Mission path
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
