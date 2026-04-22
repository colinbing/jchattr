import { useMemo, useState } from 'react';
import { PageShell, SurfaceCard } from '../../../components/layout/PageShell';
import { getListeningAudioStatus } from '../../../lib/audio/listeningAudioAssets';
import { getStarterContent } from '../../../lib/content/loader';
import { useContinueState } from '../../../lib/progress/continueState';
import { useMissionProgress } from '../../../lib/progress/missionProgress';
import { useReviewLoopProgress } from '../../../lib/progress/reviewLoop';
import { getWeakPointList, useWeakPoints } from '../../../lib/progress/weakPoints';
import {
  resetStudyDataStore,
  type StudyDataStoreId,
} from '../../../lib/settings/studyData';

type ResetActionConfig = {
  id: StudyDataStoreId;
  title: string;
  description: string;
  summary: string;
};

export function SettingsPage() {
  const starterContent = getStarterContent();
  const missionProgress = useMissionProgress();
  const weakPoints = useWeakPoints();
  const reviewLoopProgress = useReviewLoopProgress();
  const continueState = useContinueState();
  const [pendingResetId, setPendingResetId] = useState<StudyDataStoreId | null>(null);
  const [lastResetMessage, setLastResetMessage] = useState<string | null>(null);
  const weakPointList = getWeakPointList(weakPoints);
  const audioStatus = getListeningAudioStatus();
  const totalCompletionCount = Object.values(
    missionProgress.completionCountsByMissionId,
  ).reduce((sum, count) => sum + count, 0);
  const resetActions = useMemo<ResetActionConfig[]>(() => {
    return [
      {
        id: 'mission-progress',
        title: 'Reset mission progress',
        description:
          'Clear saved mission completions and repeat counts for this device.',
        summary: `${missionProgress.completedMissionIds.length} completed mission${
          missionProgress.completedMissionIds.length === 1 ? '' : 's'
        } and ${totalCompletionCount} total completion tap${
          totalCompletionCount === 1 ? '' : 's'
        } saved locally.`,
      },
      {
        id: 'weak-points',
        title: 'Reset weak points',
        description:
          'Clear recorded misses and remove current weak-point pressure from review surfaces.',
        summary: `${weakPointList.length} weak point${weakPointList.length === 1 ? '' : 's'} tracked locally.`,
      },
      {
        id: 'review-loop',
        title: 'Reset review loop',
        description:
          'Clear completed review-batch history without touching mission completions or weak points.',
        summary: `${reviewLoopProgress.completedBatchCount} completed review batch${
          reviewLoopProgress.completedBatchCount === 1 ? '' : 'es'
        } saved locally.`,
      },
      {
        id: 'continue-state',
        title: 'Reset continue state',
        description:
          'Forget the last active mission resume point without changing other study data.',
        summary: continueState.lastActiveMissionId
          ? `Resume state currently points to "${starterContent.byId.missions[continueState.lastActiveMissionId]?.title ?? continueState.lastActiveMissionId}".`
          : 'No saved resume state right now.',
      },
      {
        id: 'all-study-data',
        title: 'Reset all local study data',
        description:
          'Clear mission progress, weak points, review-loop history, and continue state on this device.',
        summary:
          'Use this only when you want a full local reset of the current MVP study state.',
      },
    ];
  }, [
    continueState.lastActiveMissionId,
    missionProgress.completedMissionIds.length,
    reviewLoopProgress.completedBatchCount,
    starterContent.byId.missions,
    totalCompletionCount,
    weakPointList.length,
  ]);

  return (
    <PageShell
      eyebrow="Preferences"
      title="Settings"
      description="A compact local control surface for study data and listening-audio coverage. Nothing here depends on an account or backend."
      aside={<span className="status-chip">Local controls</span>}
    >
      <SurfaceCard
        title="Local study data"
        description="These summaries reflect only the current browser and device."
      >
        <dl className="settings-summary-grid">
          <div className="settings-summary-grid__stat">
            <dt>Completed missions</dt>
            <dd>{missionProgress.completedMissionIds.length}</dd>
          </div>
          <div className="settings-summary-grid__stat">
            <dt>Weak points</dt>
            <dd>{weakPointList.length}</dd>
          </div>
          <div className="settings-summary-grid__stat">
            <dt>Review batches</dt>
            <dd>{reviewLoopProgress.completedBatchCount}</dd>
          </div>
          <div className="settings-summary-grid__stat">
            <dt>Resume state</dt>
            <dd>{continueState.lastActiveMissionId ? 'Saved' : 'Empty'}</dd>
          </div>
        </dl>

        {lastResetMessage ? (
          <p className="settings-feedback" role="status" aria-live="polite">
            {lastResetMessage}
          </p>
        ) : null}
      </SurfaceCard>

      <SurfaceCard
        title="Reset local data"
        description="Reset controls are explicit and local-only. Each action requires one extra confirmation step before it runs."
      >
        <div className="settings-action-list">
          {resetActions.map((action) => (
            <ResetActionCard
              key={action.id}
              action={action}
              isPending={pendingResetId === action.id}
              onStartConfirm={() => {
                setPendingResetId(action.id);
                setLastResetMessage(null);
              }}
              onCancel={() => setPendingResetId(null)}
              onConfirm={() => {
                resetStudyDataStore(action.id);
                setPendingResetId(null);
                setLastResetMessage(`Reset complete: ${action.title.toLowerCase()}.`);
              }}
            />
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard
        title="Listening audio status"
        description="Audio coverage is derived from listening content plus a tiny local manifest of generated asset paths already present in the repo."
      >
        <dl className="settings-summary-grid">
          <div className="settings-summary-grid__stat">
            <dt>Listening items</dt>
            <dd>{audioStatus.listeningItemCount}</dd>
          </div>
          <div className="settings-summary-grid__stat">
            <dt>With `audioRef`</dt>
            <dd>{audioStatus.itemsWithAudioRefCount}</dd>
          </div>
          <div className="settings-summary-grid__stat">
            <dt>Matched assets</dt>
            <dd>{audioStatus.matchedAssetCount}</dd>
          </div>
          <div className="settings-summary-grid__stat">
            <dt>Missing files</dt>
            <dd>{audioStatus.missingItemCount}</dd>
          </div>
        </dl>

        <ul className="simple-list">
          <li>
            {audioStatus.matchedAssetCount === audioStatus.itemsWithAudioRefCount
              ? 'All current listening items with audio references have matching generated files.'
              : `${audioStatus.missingItemCount} listening item${
                  audioStatus.missingItemCount === 1 ? '' : 's'
                } still point to missing audio files.`}
          </li>
          <li>
            The current page uses a checked-in manifest rather than runtime filesystem inspection or backend calls.
          </li>
        </ul>

        {audioStatus.missingItems.length > 0 ? (
          <div className="settings-audio-missing">
            <p className="mission-card__skill-label">Missing audio items</p>
            <ul className="simple-list">
              {audioStatus.missingItems.map((item) => (
                <li key={item.id}>
                  <strong>{item.id}</strong>
                  <span className="settings-audio-missing__copy">{item.transcript}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </SurfaceCard>
    </PageShell>
  );
}

type ResetActionCardProps = {
  action: ResetActionConfig;
  isPending: boolean;
  onStartConfirm: () => void;
  onCancel: () => void;
  onConfirm: () => void;
};

function ResetActionCard({
  action,
  isPending,
  onStartConfirm,
  onCancel,
  onConfirm,
}: ResetActionCardProps) {
  return (
    <article className="settings-action-card">
      <div className="settings-action-card__copy">
        <h3 className="settings-action-card__title">{action.title}</h3>
        <p className="settings-action-card__description">{action.description}</p>
        <p className="settings-action-card__summary">{action.summary}</p>
      </div>

      {!isPending ? (
        <button
          type="button"
          className="mission-button mission-button--secondary settings-action-card__button"
          onClick={onStartConfirm}
        >
          Reset
        </button>
      ) : (
        <div className="settings-confirmation">
          <p className="settings-confirmation__copy">
            This clears local data on this device. Continue?
          </p>
          <div className="settings-confirmation__actions">
            <button
              type="button"
              className="mission-button settings-action-card__button settings-action-card__button--danger"
              onClick={onConfirm}
            >
              Confirm reset
            </button>
            <button
              type="button"
              className="mission-button mission-button--secondary settings-action-card__button"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
