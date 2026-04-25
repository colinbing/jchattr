import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SurfaceCard } from '../../../components/layout/PageShell';
import { hasDistinctReading } from '../../../lib/japaneseText';
import {
  getCapstoneProgressEntry,
  markCapstoneComplete,
  useCapstoneProgress,
} from '../../../lib/progress/capstoneProgress';
import type {
  CapstoneCheck,
  CapstoneLine,
  CapstoneStory,
} from '../../../lib/content/types';

type CapstoneStoryPlayerProps = {
  story: CapstoneStory;
  lines: CapstoneLine[];
  checksByLineId: Record<string, CapstoneCheck[]>;
};

type CheckFeedback = 'correct' | 'incorrect' | null;

export function CapstoneStoryPlayer({
  story,
  lines,
  checksByLineId,
}: CapstoneStoryPlayerProps) {
  const capstoneProgress = useCapstoneProgress();
  const completion = getCapstoneProgressEntry(capstoneProgress, story.id);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [revealedLineIds, setRevealedLineIds] = useState<string[]>([]);
  const [clearedCheckIds, setClearedCheckIds] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(completion.isCompleted);
  const currentLine = lines[currentLineIndex];
  const currentChecks = checksByLineId[currentLine.id] ?? [];
  const currentCheck = currentChecks[0] ?? null;
  const isCurrentLineRevealed = revealedLineIds.includes(currentLine.id);
  const isCurrentCheckCleared = currentCheck
    ? clearedCheckIds.includes(currentCheck.id)
    : true;
  const progressValue = ((currentLineIndex + 1) / lines.length) * 100;
  const clearedCheckCount = clearedCheckIds.length;
  const totalCheckCount = story.checkIds.length;

  const grammarTags = useMemo(
    () => Array.from(new Set(lines.flatMap((line) => line.grammarTags))).slice(0, 8),
    [lines],
  );

  function revealCurrentLine() {
    setRevealedLineIds((currentIds) =>
      currentIds.includes(currentLine.id) ? currentIds : [...currentIds, currentLine.id],
    );
  }

  function clearCheck(checkId: string) {
    setClearedCheckIds((currentIds) =>
      currentIds.includes(checkId) ? currentIds : [...currentIds, checkId],
    );
  }

  function advance() {
    if (!isCurrentLineRevealed) {
      revealCurrentLine();
      return;
    }

    if (!isCurrentCheckCleared) {
      return;
    }

    if (currentLineIndex < lines.length - 1) {
      setCurrentLineIndex((index) => Math.min(lines.length - 1, index + 1));
      return;
    }

    markCapstoneComplete(story.id);
    setIsFinished(true);
  }

  return (
    <div className="mission-player-shell capstone-player">
      <SurfaceCard
        className="mission-session-card"
        title={story.title}
        description="Chapter closeout. Read one line, reveal support, then clear the checks."
      >
        <div className="mission-session-card__meta-row">
          <p className="mission-session-card__meta">
            Line {currentLineIndex + 1} of {lines.length}
          </p>
          <p className="mission-session-card__meta">{story.estimatedMinutes} min</p>
        </div>

        <div className="mission-progress">
          <div className="mission-progress__meta">
            <p className="mission-progress__label">Current focus</p>
            <p className="mission-progress__step">
              Read first, then reveal the support
            </p>
          </div>
          <div
            className="mission-progress__track"
            role="progressbar"
            aria-label="Capstone progress"
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
          <summary className="mission-session-details__summary">Capstone details</summary>
          <div className="capstone-tag-stack">
            <p className="mission-session-details__body">{story.summary}</p>
            <div className="review-chip-row" aria-label="Capstone source packs">
              {story.sourcePackIds.map((packId) => (
                <span key={packId} className="review-chip">
                  Pack {packId}
                </span>
              ))}
            </div>
            {grammarTags.length > 0 ? (
              <div className="review-chip-row" aria-label="Capstone grammar tags">
                {grammarTags.map((tag) => (
                  <span key={tag} className="review-chip">
                    {tag.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </details>
      </SurfaceCard>

      <SurfaceCard
        title={`Story line ${currentLineIndex + 1}`}
        description="Stay with this line until the meaning is clear."
      >
        <div className="mission-step-panel">
          <CapstoneLineCard
            key={currentLine.id}
            line={currentLine}
            check={currentCheck}
            isRevealed={isCurrentLineRevealed}
            isCheckCleared={isCurrentCheckCleared}
            hasNextLine={currentLineIndex < lines.length - 1}
            isFinished={isFinished}
            onReveal={revealCurrentLine}
            onCheckCleared={clearCheck}
            onAdvance={advance}
          />

          <p className="list-meta">
            {clearedCheckCount}/{totalCheckCount} comprehension checks cleared.
          </p>

          {currentLineIndex > 0 && !isFinished ? (
            <div className="mission-step-actions mission-step-actions--single">
              <button
                type="button"
                className="mission-button mission-button--secondary"
                onClick={() => setCurrentLineIndex((index) => Math.max(0, index - 1))}
              >
                Previous line
              </button>
            </div>
          ) : null}
        </div>
      </SurfaceCard>

      {isFinished ? (
        <SurfaceCard
          title="Capstone complete"
          description="This chapter closeout is saved locally. Today recommendations are unchanged for now."
        >
          <div className="mission-completion-card">
            <div className="mission-completion-card__summary">
              <p className="mission-completion-card__status">Chapter closeout saved</p>
              <div className="review-chip-row review-chip-row--active" aria-label="Capstone summary">
                <span className="review-chip">
                  {lines.length} story line{lines.length === 1 ? '' : 's'}
                </span>
                <span className="review-chip">
                  {totalCheckCount} check{totalCheckCount === 1 ? '' : 's'}
                </span>
                {completion.completionCount > 0 ? (
                  <span className="review-chip">
                    Completed {completion.completionCount} time
                    {completion.completionCount === 1 ? '' : 's'}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="mission-step-actions mission-completion-card__actions">
              <Link
                to="/missions"
                className="mission-button mission-button--link"
              >
                Back to Missions
              </Link>
              <Link
                to="/"
                className="mission-button mission-button--secondary mission-button--link"
              >
                Open Today
              </Link>
            </div>
          </div>
        </SurfaceCard>
      ) : null}
    </div>
  );
}

type CapstoneLineCardProps = {
  line: CapstoneLine;
  check: CapstoneCheck | null;
  isRevealed: boolean;
  isCheckCleared: boolean;
  hasNextLine: boolean;
  isFinished: boolean;
  onReveal: () => void;
  onCheckCleared: (checkId: string) => void;
  onAdvance: () => void;
};

function CapstoneLineCard({
  line,
  check,
  isRevealed,
  isCheckCleared,
  hasNextLine,
  isFinished,
  onReveal,
  onCheckCleared,
  onAdvance,
}: CapstoneLineCardProps) {
  const [selectedChoice, setSelectedChoice] = useState('');
  const [feedback, setFeedback] = useState<CheckFeedback>(null);
  const showReading = hasDistinctReading(line.japanese, line.reading);
  const hasSubmitted = feedback !== null;
  const canAdvance = isRevealed && (isCheckCleared || feedback === 'correct') && !isFinished;

  function submitCheck() {
    if (!check || !selectedChoice) {
      return;
    }

    const nextFeedback = selectedChoice === check.answer ? 'correct' : 'incorrect';

    if (nextFeedback === 'correct') {
      onCheckCleared(check.id);
    }

    setFeedback(nextFeedback);
  }

  return (
    <div className="reading-check-card capstone-line-card">
      <div className="reading-check-card__prompt">
        <p className="mission-copy-block__eyebrow">Japanese first</p>
        <p className="reading-check-card__sentence">{line.japanese}</p>
      </div>

      {!isRevealed ? (
        <div className="mission-drill-card__actions">
          <button type="button" className="mission-button" onClick={onReveal}>
            Reveal support
          </button>
        </div>
      ) : null}

      {isRevealed ? (
        <div className="reading-reveal-card">
          {showReading ? (
            <div className="reading-reveal-card__section">
              <p className="mission-copy-block__eyebrow">Reading</p>
              <p className="mission-copy-block__body">{line.reading}</p>
            </div>
          ) : null}
          <div className="reading-reveal-card__section">
            <p className="mission-copy-block__eyebrow">Meaning</p>
            <p className="mission-copy-block__body">{line.english}</p>
          </div>
          <div className="reading-reveal-card__section">
            <p className="mission-copy-block__eyebrow">Source</p>
            <p className="mission-copy-block__body">
              Built from {line.sourceExampleIds.join(', ')}.
            </p>
          </div>
        </div>
      ) : null}

      {isRevealed && check ? (
        <div className="capstone-check-panel">
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
            {isCheckCleared && !hasSubmitted ? (
              <button
                type="button"
                className="mission-button"
                onClick={onAdvance}
                disabled={!canAdvance}
              >
                {hasNextLine ? 'Next line' : 'Finish capstone'}
              </button>
            ) : hasSubmitted ? (
              <>
                <button
                  type="button"
                  className="mission-button"
                  onClick={onAdvance}
                  disabled={!canAdvance}
                >
                  {hasNextLine ? 'Next line' : 'Finish capstone'}
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
                  Check answer
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
        </div>
      ) : null}

      {isRevealed && !check ? (
        <div className="mission-drill-card__actions">
          <button
            type="button"
            className="mission-button"
            onClick={onAdvance}
            disabled={!canAdvance}
          >
            {hasNextLine ? 'Next line' : 'Finish capstone'}
          </button>
        </div>
      ) : null}

      {feedback ? (
        <div
          className={`mission-feedback mission-feedback--${feedback}`}
          role="status"
          aria-live="polite"
        >
          <p className="mission-feedback__title">
            {feedback === 'correct' ? 'Correct.' : 'Not this one yet.'}
          </p>
          <p className="mission-feedback__body">
            {feedback === 'correct'
              ? 'That check is cleared.'
              : `Look back at the line. The best answer is: ${check?.answer}`}
          </p>
          {feedback === 'incorrect' && check?.support ? (
            <p className="mission-feedback__body">{check.support}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
