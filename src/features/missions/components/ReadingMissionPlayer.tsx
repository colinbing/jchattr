import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MistakeExplanationDrawer } from '../../../components/MistakeExplanationDrawer';
import { SurfaceCard } from '../../../components/layout/PageShell';
import type { ExampleSentence, Mission, ReadingCheck } from '../../../lib/content/types';
import { getReadingMistakeExplanation } from '../../../lib/feedback/mistakeExplanations';
import {
  readContinueState,
  resolveContinueStepIndex,
  updateContinueState,
} from '../../../lib/progress/continueState';
import { hasDistinctReading } from '../../../lib/japaneseText';
import {
  getMissionProgressEntry,
  useMissionProgress,
} from '../../../lib/progress/missionProgress';
import { recordWeakPoint } from '../../../lib/progress/weakPoints';
import { MissionCompletionCard } from './MissionCompletionCard';
import {
  buildMissionCompletionRouteState,
  formatMissionReplayVariant,
  selectMissionReplayVariant,
  type MissionSessionMode,
} from '../lib/missionSession';
import { useMissionAutoComplete } from '../lib/useMissionAutoComplete';

type ReadingMissionPlayerProps = {
  mission: Mission;
  checks: ReadingCheck[];
  examplesById: Record<string, ExampleSentence>;
  sessionMode: MissionSessionMode;
};

type ReadingCheckFeedback = 'correct' | 'incorrect' | null;

export function ReadingMissionPlayer({
  mission,
  checks,
  examplesById,
  sessionMode,
}: ReadingMissionPlayerProps) {
  const navigate = useNavigate();
  const missionProgress = useMissionProgress();
  const [sessionRotation] = useState(() => {
    return getMissionProgressEntry(missionProgress, mission.id).completionCount;
  });
  const sessionCheckVariant = useMemo(
    () => selectMissionReplayVariant(checks, sessionMode, sessionRotation, 2),
    [checks, sessionMode, sessionRotation],
  );
  const sessionChecks = sessionCheckVariant.items;
  const [clearedCheckIds, setClearedCheckIds] = useState<string[]>([]);
  const [currentCheckIndex, setCurrentCheckIndex] = useState(() => {
    return (
      resolveContinueStepIndex(
        readContinueState(),
        mission.id,
        mission.type,
        sessionChecks.length - 1,
      ) ?? 0
    );
  });
  const currentCheck = sessionChecks[currentCheckIndex];
  const currentExample = examplesById[currentCheck.exampleId];
  const progressValue = ((currentCheckIndex + 1) / sessionChecks.length) * 100;

  useEffect(() => {
    updateContinueState({
      missionId: mission.id,
      missionType: mission.type,
      stepIndex: currentCheckIndex,
    });
  }, [currentCheckIndex, mission.id, mission.type]);

  useEffect(() => {
    setCurrentCheckIndex((index) => Math.min(index, Math.max(0, sessionChecks.length - 1)));
  }, [sessionChecks.length]);

  useMissionAutoComplete({
    missionId: mission.id,
    clearedCount: clearedCheckIds.length,
    totalCount: sessionChecks.length,
  });

  function handleCheckCleared(checkId: string) {
    setClearedCheckIds((currentIds) =>
      currentIds.includes(checkId) ? currentIds : [...currentIds, checkId],
    );
  }

  function goToNextCheck() {
    if (currentCheckIndex < sessionChecks.length - 1) {
      setCurrentCheckIndex((index) => Math.min(sessionChecks.length - 1, index + 1));
      return;
    }

    navigate('/', {
      state: buildMissionCompletionRouteState(
        mission,
        sessionMode,
        Math.min(clearedCheckIds.length, sessionChecks.length),
        sessionChecks.length,
      ),
    });
  }

  return (
    <div className="mission-player-shell">
      <SurfaceCard
        className="mission-session-card"
        title={mission.title}
        description={
          sessionMode === 'reinforce'
            ? `Short reinforce pass · ${formatTargetSkill(mission.targetSkill)}`
            : `Reading check ${currentCheckIndex + 1} · ${formatTargetSkill(mission.targetSkill)}`
        }
      >
        <div className="mission-session-card__meta-row">
          <p className="mission-session-card__meta">
            Check {currentCheckIndex + 1} of {sessionChecks.length}
          </p>
          <p className="mission-session-card__meta">{mission.estimatedMinutes} min</p>
        </div>

        <div className="mission-progress">
          <div className="mission-progress__meta">
            <p className="mission-progress__label">Current focus</p>
            <p className="mission-progress__step">Read first, reveal second</p>
          </div>
          <div
            className="mission-progress__track"
            role="progressbar"
            aria-label="Mission progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressValue}
          >
            <span
              className="mission-progress__fill"
              style={{ width: `${progressValue}%` }}
            />
          </div>
        </div>

        <details className="mission-session-details">
          <summary className="mission-session-details__summary">Mission details</summary>
          <dl className="mission-overview__stats mission-overview__stats--compact">
            <div className="mission-overview__stat">
              <dt>Target skill</dt>
              <dd>{formatTargetSkill(mission.targetSkill)}</dd>
            </div>
            <div className="mission-overview__stat">
              <dt>Estimated time</dt>
              <dd>{mission.estimatedMinutes} min</dd>
            </div>
            <div className="mission-overview__stat">
              <dt>Reading checks</dt>
              <dd>{sessionChecks.length}</dd>
            </div>
            <div className="mission-overview__stat">
              <dt>Source lines</dt>
              <dd>{sessionChecks.length}</dd>
            </div>
            {sessionMode === 'reinforce' ? (
              <div className="mission-overview__stat">
                <dt>Replay</dt>
                <dd>{formatMissionReplayVariant(sessionCheckVariant.meta, 'check')}</dd>
              </div>
            ) : null}
          </dl>
          <p className="mission-session-details__body">
            {sessionMode === 'reinforce'
              ? 'This short pass rotates a smaller reading set so you can re-check recognition without replaying the full mission.'
              : 'Build reading recognition with short beginner lines before the app reveals the reading and meaning.'}
          </p>
        </details>
      </SurfaceCard>

      <SurfaceCard
        title={`Reading check ${currentCheckIndex + 1}`}
        description={
          sessionMode === 'reinforce'
            ? 'One active line at a time from a shorter rotated reinforce set.'
            : 'One active line at a time. Answer first, then reveal support.'
        }
      >
        <div className="mission-step-panel">
          <ReadingCheckCard
            key={currentCheck.id}
            missionId={mission.id}
            check={currentCheck}
            example={currentExample}
            hasNextCheck={currentCheckIndex < sessionChecks.length - 1}
            onAdvance={goToNextCheck}
            onCleared={handleCheckCleared}
          />
          <p className="list-meta">
            {clearedCheckIds.length}/{sessionChecks.length} reading checks done.
          </p>

          {currentCheckIndex > 0 ? (
            <div className="mission-step-actions mission-step-actions--single">
              <button
                type="button"
                className="mission-button mission-button--secondary"
                onClick={() => setCurrentCheckIndex((index) => Math.max(0, index - 1))}
              >
                Previous check
              </button>
            </div>
          ) : null}
        </div>
      </SurfaceCard>

      <MissionCompletionCard
        missionId={mission.id}
        clearedCount={clearedCheckIds.length}
        totalCount={sessionChecks.length}
        unitLabel="reading check"
        sessionMode={sessionMode}
        returnState={buildMissionCompletionRouteState(
          mission,
          sessionMode,
          Math.min(clearedCheckIds.length, sessionChecks.length),
          sessionChecks.length,
        )}
      />
    </div>
  );
}

type ReadingCheckCardProps = {
  missionId: string;
  check: ReadingCheck;
  example: ExampleSentence;
  hasNextCheck: boolean;
  onAdvance: () => void;
  onCleared: (checkId: string) => void;
};

function ReadingCheckCard({
  missionId,
  check,
  example,
  hasNextCheck,
  onAdvance,
  onCleared,
}: ReadingCheckCardProps) {
  const [selectedChoice, setSelectedChoice] = useState('');
  const [feedback, setFeedback] = useState<ReadingCheckFeedback>(null);
  const hasSubmitted = feedback !== null;
  const showReading = hasDistinctReading(example.japanese, example.reading);
  const mistakeExplanation =
    feedback === 'incorrect'
      ? getReadingMistakeExplanation({
          check,
          example,
          learnerAnswer: selectedChoice,
        })
      : null;

  function submitCheck() {
    if (!selectedChoice) {
      return;
    }

    const nextFeedback = selectedChoice === check.answer ? 'correct' : 'incorrect';

    if (nextFeedback === 'incorrect') {
      recordWeakPoint({
        itemId: check.id,
        itemType: 'reading-check',
        missionId,
        contentId: check.exampleId,
      });
    }

    setFeedback(nextFeedback);
    onCleared(check.id);
  }

  return (
    <div className="reading-check-card">
      <div className="reading-check-card__prompt">
        <p className="mission-copy-block__eyebrow">Japanese first</p>
        <p className="reading-check-card__sentence">{example.japanese}</p>
      </div>

      <div className="reading-check-card__question">
        <p className="mission-copy-block__eyebrow">Comprehension check</p>
        <p className="mission-copy-block__body">{check.prompt}</p>
      </div>

      <div className="mission-choice-grid">
        {check.choices.map((choice) => (
          <button
            key={choice}
            type="button"
            className={`mission-choice${
              selectedChoice === choice ? ' mission-choice--selected' : ''
            }`}
            onClick={() => {
              setSelectedChoice(choice);
              setFeedback(null);
            }}
          >
            {choice}
          </button>
        ))}
      </div>

      <div className="mission-drill-card__actions">
        {hasSubmitted ? (
          <>
            <button
              type="button"
              className="mission-button"
              onClick={onAdvance}
            >
              {hasNextCheck ? 'Next check' : 'Finish to Today'}
            </button>
            <button
              type="button"
              className="mission-button mission-button--secondary"
              onClick={() => setFeedback(null)}
            >
              Edit answer
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="mission-button"
              onClick={submitCheck}
              disabled={!selectedChoice}
            >
              Check reading
            </button>
            <button
              type="button"
              className="mission-button mission-button--secondary"
              onClick={() => {
                setSelectedChoice('');
                setFeedback(null);
              }}
            >
              Reset
            </button>
          </>
        )}
      </div>

      {feedback ? (
        <div
          className={`mission-feedback mission-feedback--${feedback}`}
          role="status"
          aria-live="polite"
        >
          <p className="mission-feedback__title">
            {feedback === 'correct' ? 'Correct.' : 'Close read, but not this one.'}
          </p>
          <p className="mission-feedback__body">
            {feedback === 'correct'
              ? 'You matched the line before the reveal.'
              : `The best match here is: ${check.answer}`}
          </p>
        </div>
      ) : null}

      {mistakeExplanation ? (
        <MistakeExplanationDrawer explanation={mistakeExplanation} />
      ) : null}

      {hasSubmitted ? (
        <div className="reading-reveal-card">
          {showReading ? (
            <div className="reading-reveal-card__section">
              <p className="mission-copy-block__eyebrow">Reading</p>
              <p className="mission-copy-block__body">{example.reading}</p>
            </div>
          ) : null}
          <div className="reading-reveal-card__section">
            <p className="mission-copy-block__eyebrow">Meaning</p>
            <p className="mission-copy-block__body">{example.english}</p>
          </div>
          {check.support ? (
            <div className="reading-reveal-card__section">
              <p className="mission-copy-block__eyebrow">What to notice</p>
              <p className="mission-copy-block__body">{check.support}</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function formatTargetSkill(targetSkill: Mission['targetSkill']) {
  return targetSkill.replace(/-/g, ' ');
}
