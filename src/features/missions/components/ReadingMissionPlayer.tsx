import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SurfaceCard } from '../../../components/layout/PageShell';
import type { ExampleSentence, Mission, ReadingCheck } from '../../../lib/content/types';
import {
  readContinueState,
  resolveContinueStepIndex,
  updateContinueState,
} from '../../../lib/progress/continueState';
import { recordWeakPoint } from '../../../lib/progress/weakPoints';
import { MissionCompletionCard } from './MissionCompletionCard';

type ReadingMissionPlayerProps = {
  mission: Mission;
  checks: ReadingCheck[];
  examplesById: Record<string, ExampleSentence>;
};

type ReadingCheckFeedback = 'correct' | 'incorrect' | null;

export function ReadingMissionPlayer({
  mission,
  checks,
  examplesById,
}: ReadingMissionPlayerProps) {
  const [currentCheckIndex, setCurrentCheckIndex] = useState(() => {
    return (
      resolveContinueStepIndex(
        readContinueState(),
        mission.id,
        mission.type,
        checks.length - 1,
      ) ?? 0
    );
  });
  const currentCheck = checks[currentCheckIndex];
  const currentExample = examplesById[currentCheck.exampleId];
  const progressValue = ((currentCheckIndex + 1) / checks.length) * 100;

  useEffect(() => {
    updateContinueState({
      missionId: mission.id,
      missionType: mission.type,
      stepIndex: currentCheckIndex,
    });
  }, [currentCheckIndex, mission.id, mission.type]);

  return (
    <div className="mission-player-shell">
      <SurfaceCard
        title="Mission overview"
        description="Read the Japanese line first, commit to one interpretation, then reveal support. Progress stays local to this page for now."
      >
        <div className="mission-overview">
          <div className="mission-overview__lesson">
            <p className="mission-overview__eyebrow">Reading mission</p>
            <h2 className="mission-overview__lesson-title">{mission.title}</h2>
            <p className="mission-overview__objective">
              Build reading recognition with short beginner lines before the app reveals the reading and meaning.
            </p>
          </div>

          <dl className="mission-overview__stats">
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
              <dd>{checks.length}</dd>
            </div>
            <div className="mission-overview__stat">
              <dt>Source lines</dt>
              <dd>{checks.length}</dd>
            </div>
          </dl>

          <div className="mission-progress">
            <div className="mission-progress__meta">
              <p className="mission-progress__label">
                Check {currentCheckIndex + 1} of {checks.length}
              </p>
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
        </div>
      </SurfaceCard>

      <SurfaceCard
        title={`Reading check ${currentCheckIndex + 1}`}
        description="Choose the closest interpretation before the app reveals the support line."
      >
        <div className="mission-step-panel">
          <ReadingCheckCard
            key={currentCheck.id}
            missionId={mission.id}
            check={currentCheck}
            example={currentExample}
          />

          <div className="mission-step-actions">
            <button
              type="button"
              className="mission-button mission-button--secondary"
              onClick={() => setCurrentCheckIndex((index) => Math.max(0, index - 1))}
              disabled={currentCheckIndex === 0}
            >
              Previous check
            </button>
            {currentCheckIndex < checks.length - 1 ? (
              <button
                type="button"
                className="mission-button"
                onClick={() => setCurrentCheckIndex((index) => Math.min(checks.length - 1, index + 1))}
              >
                Next check
              </button>
            ) : (
              <Link to="/" className="mission-button mission-button--link">
                Back to today
              </Link>
            )}
          </div>
        </div>
      </SurfaceCard>

      <MissionCompletionCard missionId={mission.id} />
    </div>
  );
}

type ReadingCheckCardProps = {
  missionId: string;
  check: ReadingCheck;
  example: ExampleSentence;
};

function ReadingCheckCard({
  missionId,
  check,
  example,
}: ReadingCheckCardProps) {
  const [selectedChoice, setSelectedChoice] = useState('');
  const [feedback, setFeedback] = useState<ReadingCheckFeedback>(null);
  const hasSubmitted = feedback !== null;

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

      {hasSubmitted ? (
        <div className="reading-reveal-card">
          <div className="reading-reveal-card__section">
            <p className="mission-copy-block__eyebrow">Reading</p>
            <p className="mission-copy-block__body">{example.reading}</p>
          </div>
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
