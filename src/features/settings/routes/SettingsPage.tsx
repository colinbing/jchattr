import { useMemo, useState } from 'react';
import { PageShell, SurfaceCard } from '../../../components/layout/PageShell';
import { getListeningAudioStatus } from '../../../lib/audio/listeningAudioAssets';
import { getStarterContent } from '../../../lib/content/loader';
import { useCapstoneProgress } from '../../../lib/progress/capstoneProgress';
import { useContinueState } from '../../../lib/progress/continueState';
import { useMissionProgress } from '../../../lib/progress/missionProgress';
import { useReviewLoopProgress } from '../../../lib/progress/reviewLoop';
import { getWeakPointList, useWeakPoints } from '../../../lib/progress/weakPoints';
import {
  resetStudyDataStore,
  type StudyDataStoreId,
} from '../../../lib/settings/studyData';
import {
  setStudyFocusMode,
  STUDY_FOCUS_MODE_OPTIONS,
  useStudyPreferences,
} from '../../../lib/settings/studyPreferences';

type ResetActionConfig = {
  id: StudyDataStoreId;
  title: string;
  description: string;
  summary: string;
  kind: 'routine' | 'destructive';
};

export function SettingsPage() {
  const starterContent = getStarterContent();
  const missionProgress = useMissionProgress();
  const capstoneProgress = useCapstoneProgress();
  const weakPoints = useWeakPoints();
  const reviewLoopProgress = useReviewLoopProgress();
  const continueState = useContinueState();
  const studyPreferences = useStudyPreferences();
  const [pendingResetId, setPendingResetId] = useState<StudyDataStoreId | null>(null);
  const [lastResetMessage, setLastResetMessage] = useState<string | null>(null);
  const [lastFocusMessage, setLastFocusMessage] = useState<string | null>(null);
  const weakPointList = getWeakPointList(weakPoints);
  const audioStatus = getListeningAudioStatus();
  const currentFocusOption =
    STUDY_FOCUS_MODE_OPTIONS.find((option) => option.id === studyPreferences.focusMode) ??
    STUDY_FOCUS_MODE_OPTIONS[0];
  const totalCompletionCount = Object.values(
    missionProgress.completionCountsByMissionId,
  ).reduce((sum, count) => sum + count, 0);
  const totalCapstoneCompletionCount = Object.values(
    capstoneProgress.completionCountsByStoryId,
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
        kind: 'routine',
      },
      {
        id: 'capstone-progress',
        title: 'Reset capstone progress',
        description:
          'Clear saved chapter closeout completions for this device.',
        summary: `${capstoneProgress.completedStoryIds.length} completed capstone${
          capstoneProgress.completedStoryIds.length === 1 ? '' : 's'
        } and ${totalCapstoneCompletionCount} total capstone clear${
          totalCapstoneCompletionCount === 1 ? '' : 's'
        } saved locally.`,
        kind: 'routine',
      },
      {
        id: 'weak-points',
        title: 'Reset weak points',
        description:
          'Clear recorded misses and remove current weak-point pressure from review surfaces.',
        summary: `${weakPointList.length} weak point${weakPointList.length === 1 ? '' : 's'} tracked locally.`,
        kind: 'routine',
      },
      {
        id: 'review-loop',
        title: 'Reset review loop',
        description:
          'Clear completed review-batch history without touching mission completions or weak points.',
        summary: `${reviewLoopProgress.completedBatchCount} completed review batch${
          reviewLoopProgress.completedBatchCount === 1 ? '' : 'es'
        } saved locally.`,
        kind: 'routine',
      },
      {
        id: 'continue-state',
        title: 'Reset continue state',
        description:
          'Forget the last active mission resume point without changing other study data.',
        summary: continueState.lastActiveMissionId
          ? `Resume state currently points to "${starterContent.byId.missions[continueState.lastActiveMissionId]?.title ?? continueState.lastActiveMissionId}".`
          : 'No saved resume state right now.',
        kind: 'routine',
      },
      {
        id: 'all-study-data',
        title: 'Reset all local study data',
        description:
          'Clear mission progress, capstone progress, weak points, review-loop history, daily tracker data, and continue state on this device.',
        summary:
          'Use this only when you want a full local reset of the current MVP study state.',
        kind: 'destructive',
      },
    ];
  }, [
    continueState.lastActiveMissionId,
    capstoneProgress.completedStoryIds.length,
    missionProgress.completedMissionIds.length,
    reviewLoopProgress.completedBatchCount,
    starterContent.byId.missions,
    totalCompletionCount,
    totalCapstoneCompletionCount,
    weakPointList.length,
  ]);
  const routineResetActions = resetActions.filter((action) => action.kind === 'routine');
  const destructiveResetAction =
    resetActions.find((action) => action.kind === 'destructive') ?? null;

  return (
    <PageShell
      variant="compact"
      eyebrow="Preferences"
      title="Settings"
      description="Local controls only. Quick resets first, heavier reset detail only when you ask for it."
      aside={<span className="status-chip">Local controls</span>}
    >
      <SurfaceCard
        className="settings-page__snapshot-card"
        title="Local snapshot"
        description="Everything here applies only to this browser on this device."
      >
        <dl className="settings-summary-grid">
          <div className="settings-summary-grid__stat">
            <dt>Completed missions</dt>
            <dd>{missionProgress.completedMissionIds.length}</dd>
          </div>
          <div className="settings-summary-grid__stat">
            <dt>Capstones</dt>
            <dd>{capstoneProgress.completedStoryIds.length}</dd>
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

        <details className="today-details">
          <summary className="today-details__summary">Audio coverage snapshot</summary>
          <div className="settings-page__detail-copy">
            <p className="today-details__body">
              {audioStatus.matchedAssetCount}/{audioStatus.itemsWithAudioRefCount} listening item
              {audioStatus.itemsWithAudioRefCount === 1 ? '' : 's'} with `audioRef` currently match
              generated audio files.
            </p>
            <p className="today-details__body">
              {audioStatus.missingItemCount === 0
                ? 'No listening items currently point to missing audio files.'
                : `${audioStatus.missingItemCount} listening item${
                    audioStatus.missingItemCount === 1 ? '' : 's'
                  } still point to missing audio files.`}
            </p>
          </div>
        </details>
      </SurfaceCard>

      <SurfaceCard
        title="Study focus"
        description="Choose the study shape you want most days."
      >
        <div className="settings-focus">
          <div className="settings-focus__current">
            <span className="mission-card__skill-label">Current mode</span>
            <strong>{currentFocusOption.label}</strong>
            <p>{currentFocusOption.summary}</p>
          </div>
          <div
            className="settings-focus__options"
            role="radiogroup"
            aria-label="Study focus mode"
          >
            {STUDY_FOCUS_MODE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`settings-focus-option${
                  option.id === studyPreferences.focusMode
                    ? ' settings-focus-option--selected'
                    : ''
                }`}
                role="radio"
                aria-checked={option.id === studyPreferences.focusMode}
                onClick={() => {
                  setStudyFocusMode(option.id);
                  setLastFocusMessage(`Focus mode saved: ${option.label}.`);
                }}
              >
                <span className="settings-focus-option__label">{option.label}</span>
              </button>
            ))}
          </div>
          {lastFocusMessage ? (
            <p className="settings-feedback" role="status" aria-live="polite">
              {lastFocusMessage}
            </p>
          ) : null}
        </div>
      </SurfaceCard>

      <SurfaceCard
        title="Quick resets"
        description="Use these when one local surface is stale and you do not want a full reset."
      >
        <div className="settings-action-list">
          {routineResetActions.map((action) => (
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
        className="today-support-card"
        title="Full reset"
        description="Open this only if you want to clear the entire local study state on this device."
      >
        <details className="today-details">
          <summary className="today-details__summary">Open full reset controls</summary>
          {destructiveResetAction ? (
            <ResetActionCard
              action={destructiveResetAction}
              isPending={pendingResetId === destructiveResetAction.id}
              onStartConfirm={() => {
                setPendingResetId(destructiveResetAction.id);
                setLastResetMessage(null);
              }}
              onCancel={() => setPendingResetId(null)}
              onConfirm={() => {
                resetStudyDataStore(destructiveResetAction.id);
                setPendingResetId(null);
                setLastResetMessage(
                  `Reset complete: ${destructiveResetAction.title.toLowerCase()}.`,
                );
              }}
            />
          ) : null}
        </details>
      </SurfaceCard>

      <SurfaceCard
        className="today-support-card"
        title="Listening audio status"
        description="Open this only if you want the local audio coverage breakdown."
      >
        <details className="today-details">
          <summary className="today-details__summary">View audio coverage</summary>
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

          <div className="settings-page__detail-copy">
            <p className="today-details__body">
              {audioStatus.matchedAssetCount === audioStatus.itemsWithAudioRefCount
                ? 'All current listening items with audio references have matching generated files.'
                : `${audioStatus.missingItemCount} listening item${
                    audioStatus.missingItemCount === 1 ? '' : 's'
                  } still point to missing audio files.`}
            </p>
            <p className="today-details__body">
              This page uses a checked-in manifest rather than runtime filesystem inspection or backend calls.
            </p>
          </div>

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
        </details>
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
        <p className="settings-action-card__summary">{action.summary}</p>
        <details className="settings-action-card__details">
          <summary className="settings-action-card__details-summary">What this clears</summary>
          <p className="settings-action-card__description">{action.description}</p>
        </details>
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
