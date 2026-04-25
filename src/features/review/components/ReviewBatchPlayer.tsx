import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { KanaAssistInput } from '../../../components/KanaAssistInput';
import { KanaAssistTextarea } from '../../../components/KanaAssistTextarea';
import { SurfaceCard } from '../../../components/layout/PageShell';
import type { GrammarDrill } from '../../../lib/content/types';
import { hasDistinctReading } from '../../../lib/japaneseText';
import { evaluateOutputResponse, type OutputEvaluationResult } from '../../../lib/outputEvaluation';
import { getReorderTokens } from '../../../lib/reorderDrill';
import type { ReviewBatchItem } from '../lib/reviewBatch';
import {
  getListeningReviewChoices,
  getReviewBatchSummary,
  normalizeReviewAnswer,
} from '../lib/reviewBatch';

type ReviewBatchPlayerProps = {
  items: ReviewBatchItem[];
  onComplete: (itemIds: string[], resultsByItemId: Record<string, ReviewResult>) => void;
  onSuccessfulRetry: (itemId: string) => void;
};

type ReviewResult = 'correct' | 'incorrect';

export function ReviewBatchPlayer({
  items,
  onComplete,
  onSuccessfulRetry,
}: ReviewBatchPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [resultsByItemId, setResultsByItemId] = useState<Record<string, ReviewResult>>({});
  const currentItem = items[currentIndex];
  const currentResult = resultsByItemId[currentItem.weakPoint.itemId];
  const isLastItem = currentIndex === items.length - 1;
  const allItemsAttempted = items.every((item) => resultsByItemId[item.weakPoint.itemId]);
  const progressValue = ((currentIndex + 1) / items.length) * 100;
  const summary = getReviewBatchSummary(currentItem);
  const recentListeningTranslations = items
    .slice(0, currentIndex)
    .filter(
      (
        item,
      ): item is Extract<ReviewBatchItem, { type: 'listening-check' }> =>
        item.type === 'listening-check',
    )
    .slice(-2)
    .map((item) => item.listeningItem.translation);

  const completedCount = useMemo(
    () => items.filter((item) => resultsByItemId[item.weakPoint.itemId]).length,
    [items, resultsByItemId],
  );

  return (
    <div className="review-batch-player">
      <nav className="mission-route-bar review-route-bar" aria-label="Review navigation">
        <Link to="/" className="mission-route-bar__link">
          Today
        </Link>
        <span className="mission-route-bar__link mission-route-bar__link--secondary">
          Focused retry
        </span>
      </nav>

      <SurfaceCard
        className="mission-session-card review-session-card"
        title="Retry batch"
        description="Stay with the current saved miss."
      >
        <div className="mission-session-card__meta-row">
          <p className="mission-session-card__meta">
            Item {currentIndex + 1} of {items.length}
          </p>
          <p className="mission-session-card__meta">
            {completedCount}/{items.length} attempted
          </p>
        </div>

        <div className="mission-progress">
          <div className="mission-progress__meta">
            <p className="mission-progress__label">Current focus</p>
            <p className="mission-progress__step">{formatReviewFocusLabel(currentItem)}</p>
          </div>
          <div
            className="mission-progress__track"
            role="progressbar"
            aria-label="Review batch progress"
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
      </SurfaceCard>

      <SurfaceCard
        className="review-task-card"
        title={summary.title}
        description={getReviewTaskDescription(currentItem)}
      >
        <div className="review-current-item">
          <div className="review-current-item__header">
            <div className="review-chip-row review-chip-row--active" aria-label="Review item context">
              <span className="review-chip">{summary.eyebrow}</span>
              <span className="review-chip">
                Missed {currentItem.weakPoint.missCount} time
                {currentItem.weakPoint.missCount === 1 ? '' : 's'}
              </span>
            </div>

            <details className="review-support-details">
              <summary className="review-support-details__summary">Item context</summary>
              <div className="review-support-note">
                <p className="review-support-details__body">
                  Mission: {summary.missionTitle}
                </p>
                <p className="review-support-details__body">
                  Saved from earlier misses in this mission and ready for one focused retry.
                </p>
              </div>
            </details>
          </div>

          {currentItem.type === 'grammar-drill' ? (
            <GrammarReviewCard
              key={currentItem.weakPoint.itemId}
              item={currentItem}
              onReviewed={(result) => {
                if (
                  result === 'correct' &&
                  resultsByItemId[currentItem.weakPoint.itemId] !== 'correct'
                ) {
                  onSuccessfulRetry(currentItem.weakPoint.itemId);
                }
                setResultsByItemId((current) => ({
                  ...current,
                  [currentItem.weakPoint.itemId]: result,
                }));
              }}
            />
          ) : null}

          {currentItem.type === 'listening-check' ? (
            <ListeningReviewCard
              key={currentItem.weakPoint.itemId}
              item={currentItem}
              avoidTranslations={recentListeningTranslations}
              onReviewed={(result) => {
                if (
                  result === 'correct' &&
                  resultsByItemId[currentItem.weakPoint.itemId] !== 'correct'
                ) {
                  onSuccessfulRetry(currentItem.weakPoint.itemId);
                }
                setResultsByItemId((current) => ({
                  ...current,
                  [currentItem.weakPoint.itemId]: result,
                }));
              }}
            />
          ) : null}

          {currentItem.type === 'output-task' ? (
            <OutputReviewCard
              key={currentItem.weakPoint.itemId}
              item={currentItem}
              onReviewed={(result) => {
                if (
                  result === 'correct' &&
                  resultsByItemId[currentItem.weakPoint.itemId] !== 'correct'
                ) {
                  onSuccessfulRetry(currentItem.weakPoint.itemId);
                }
                setResultsByItemId((current) => ({
                  ...current,
                  [currentItem.weakPoint.itemId]: result,
                }));
              }}
            />
          ) : null}

          {currentItem.type === 'reading-check' ? (
            <ReadingReviewCard
              key={currentItem.weakPoint.itemId}
              item={currentItem}
              onReviewed={(result) => {
                if (
                  result === 'correct' &&
                  resultsByItemId[currentItem.weakPoint.itemId] !== 'correct'
                ) {
                  onSuccessfulRetry(currentItem.weakPoint.itemId);
                }
                setResultsByItemId((current) => ({
                  ...current,
                  [currentItem.weakPoint.itemId]: result,
                }));
              }}
            />
          ) : null}

          <div className="mission-step-actions">
            <button
              type="button"
              className="mission-button mission-button--secondary"
              onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
              disabled={currentIndex === 0}
            >
              Previous
            </button>

            {!isLastItem ? (
              <button
                type="button"
                className="mission-button"
                onClick={() =>
                  setCurrentIndex((index) => Math.min(items.length - 1, index + 1))
                }
                disabled={!currentResult}
              >
                Next retry
              </button>
            ) : (
              <button
                type="button"
                className="mission-button"
                onClick={() =>
                  onComplete(
                    items.map((item) => item.weakPoint.itemId),
                    resultsByItemId,
                  )
                }
                disabled={!allItemsAttempted}
              >
                Finish review batch
              </button>
            )}
          </div>
        </div>
      </SurfaceCard>
    </div>
  );
}

type ReviewCardProps = {
  onReviewed: (result: ReviewResult) => void;
};

type ListeningReviewFeedback = ReviewResult | 'supported';

function GrammarReviewCard({
  item,
  onReviewed,
}: ReviewCardProps & {
  item: Extract<ReviewBatchItem, { type: 'grammar-drill' }>;
}) {
  const reorderTokens = getReorderTokens(item.drill.prompt, item.drill.id, {
    focusId: item.lesson.id,
  });
  const [selectedChoice, setSelectedChoice] = useState('');
  const [typedAnswer, setTypedAnswer] = useState('');
  const [assembledTokenIndexes, setAssembledTokenIndexes] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<ReviewResult | null>(null);

  const currentResponse = getCurrentGrammarResponse({
    drillType: item.drill.type,
    selectedChoice,
    typedAnswer,
    assembledTokenIndexes,
    reorderTokens,
  });

  function submitAnswer() {
    if (!currentResponse.trim()) {
      return;
    }

    const result =
      normalizeReviewAnswer(currentResponse) === normalizeReviewAnswer(item.drill.answer)
        ? 'correct'
        : 'incorrect';

    setFeedback(result);
    onReviewed(result);
  }

  return (
    <div className="review-retry-card">
      {item.drill.type === 'multiple-choice' && item.drill.choices ? (
        <div className="mission-choice-grid">
          {item.drill.choices.map((choice) => (
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
      ) : null}

      {item.drill.type === 'fill-in' ? (
        <KanaAssistInput
          label="Your answer"
          value={typedAnswer}
          onChange={setTypedAnswer}
          onInteraction={() => setFeedback(null)}
          placeholder="Type the missing Japanese"
        />
      ) : null}

      {item.drill.type === 'reorder' ? (
        <div className="mission-reorder">
          <div className="mission-reorder__answer" aria-live="polite">
            {assembledTokenIndexes.length > 0 ? (
              assembledTokenIndexes.map((tokenIndex) => (
                <span
                  key={`${item.drill.id}-${tokenIndex}`}
                  className="mission-token mission-token--answer"
                >
                  {reorderTokens[tokenIndex]}
                </span>
              ))
            ) : (
              <span className="mission-reorder__placeholder">Tap the chunks in order.</span>
            )}
          </div>

          <div className="mission-choice-grid mission-choice-grid--tokens">
            {reorderTokens.map((token, tokenIndex) => (
              <button
                key={`${item.drill.id}-${token}-${tokenIndex}`}
                type="button"
                className="mission-token"
                disabled={assembledTokenIndexes.includes(tokenIndex)}
                onClick={() => {
                  setAssembledTokenIndexes((indexes) => [...indexes, tokenIndex]);
                  setFeedback(null);
                }}
              >
                {token}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mission-drill-card__actions">
        <button
          type="button"
          className="mission-button"
          onClick={submitAnswer}
          disabled={!currentResponse.trim()}
        >
          Check answer
        </button>
        <button
          type="button"
          className="mission-button mission-button--secondary"
          onClick={() => {
            setSelectedChoice('');
            setTypedAnswer('');
            setAssembledTokenIndexes([]);
            setFeedback(null);
          }}
        >
          Reset
        </button>
      </div>

      {feedback ? <ReviewFeedback result={feedback} answer={item.drill.answer} /> : null}
    </div>
  );
}

function ListeningReviewCard({
  item,
  avoidTranslations,
  onReviewed,
}: ReviewCardProps & {
  item: Extract<ReviewBatchItem, { type: 'listening-check' }>;
  avoidTranslations: string[];
}) {
  const [selectedChoice, setSelectedChoice] = useState('');
  const [feedback, setFeedback] = useState<ListeningReviewFeedback | null>(null);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const translationChoices = getListeningReviewChoices(
    item.listeningItem,
    item.choicePool,
    avoidTranslations,
  );

  function submitAnswer() {
    if (!selectedChoice) {
      return;
    }

    const result =
      selectedChoice === item.listeningItem.translation ? 'correct' : 'incorrect';

    setFeedback(result);
    onReviewed(result);
  }

  function revealAnswer() {
    setSelectedChoice('');
    setAnswerRevealed(true);
    setFeedback('supported');
    onReviewed('incorrect');
  }

  return (
    <div className="review-retry-card">
      <div className="review-listening-stack">
        {item.listeningItem.audioRef ? (
          <section className="listening-audio-card">
            <div className="listening-audio-card__copy">
              <p className="mission-copy-block__eyebrow">Audio retry</p>
            </div>
            <audio className="listening-audio-card__player" controls preload="none">
              <source
                src={item.listeningItem.audioRef}
                type={getAudioMimeType(item.listeningItem.audioRef)}
              />
              Your browser does not support audio playback for this item.
            </audio>
          </section>
        ) : null}

        <details className="review-support-details">
          <summary className="review-support-details__summary">Reveal transcript</summary>
          <section className="listening-reveal-card listening-reveal-card--visible">
            <p className="mission-copy-block__eyebrow">Transcript</p>
            <p className="listening-reveal-card__value">{item.listeningItem.transcript}</p>
          </section>
        </details>
      </div>

      <details className="review-support-details">
        <summary className="review-support-details__summary">Focus note</summary>
        <div className="review-support-note">
          <p className="review-support-details__body">{item.listeningItem.focusPoint}</p>
        </div>
      </details>

      <details className="review-support-details">
        <summary className="review-support-details__summary">Need the answer?</summary>
        <div className="review-support-note">
          <p className="review-support-details__body">
            Revealing the answer keeps this retry unresolved, but lets you move on.
          </p>
          <button
            type="button"
            className="mission-button mission-button--secondary"
            onClick={revealAnswer}
            disabled={answerRevealed}
          >
            Reveal answer
          </button>
          {answerRevealed ? (
            <p className="review-support-details__body">
              Correct answer: {item.listeningItem.translation}
            </p>
          ) : null}
        </div>
      </details>

      <div className="mission-choice-grid">
        {translationChoices.map((choice) => (
          <button
            key={choice}
            type="button"
            className={`mission-choice${
              selectedChoice === choice ? ' mission-choice--selected' : ''
            }`}
            disabled={answerRevealed}
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
          onClick={submitAnswer}
          disabled={!selectedChoice || answerRevealed}
        >
          Check answer
        </button>
        <button
          type="button"
          className="mission-button mission-button--secondary"
          onClick={() => {
            setSelectedChoice('');
            setFeedback(null);
            setAnswerRevealed(false);
          }}
        >
          Reset
        </button>
      </div>

      {feedback === 'supported' ? (
        <SupportedExposureFeedback />
      ) : feedback ? (
        <ReviewFeedback result={feedback} answer={item.listeningItem.translation} />
      ) : null}
    </div>
  );
}

function getAudioMimeType(audioRef: string) {
  if (audioRef.endsWith('.wav')) {
    return 'audio/wav';
  }

  if (audioRef.endsWith('.opus')) {
    return 'audio/ogg; codecs=opus';
  }

  if (audioRef.endsWith('.aac')) {
    return 'audio/aac';
  }

  if (audioRef.endsWith('.flac')) {
    return 'audio/flac';
  }

  return 'audio/mpeg';
}

function OutputReviewCard({
  item,
  onReviewed,
}: ReviewCardProps & {
  item: Extract<ReviewBatchItem, { type: 'output-task' }>;
}) {
  const [response, setResponse] = useState('');
  const [feedback, setFeedback] = useState<OutputEvaluationResult | null>(null);

  function submitAnswer() {
    if (!response.trim()) {
      return;
    }

    const result = evaluateOutputResponse(item.task, response);

    setFeedback(result);
    onReviewed(result.isAccepted ? 'correct' : 'incorrect');
  }

  return (
    <div className="review-retry-card">
      {item.task.hint ? (
        <details className="review-support-details">
          <summary className="review-support-details__summary">Hint</summary>
          <div className="review-support-note">
            <p className="review-support-details__body">{item.task.hint}</p>
          </div>
        </details>
      ) : null}

      <KanaAssistTextarea
        label="Your Japanese line"
        value={response}
        onChange={setResponse}
        onInteraction={() => setFeedback(null)}
        rows={3}
        placeholder="Type your line in Japanese"
      />

      <div className="mission-drill-card__actions">
        <button
          type="button"
          className="mission-button"
          onClick={submitAnswer}
          disabled={!response.trim()}
        >
          Check answer
        </button>
        <button
          type="button"
          className="mission-button mission-button--secondary"
          onClick={() => {
            setResponse('');
            setFeedback(null);
          }}
        >
          Reset
        </button>
      </div>

      {feedback ? <OutputReviewFeedback feedback={feedback} /> : null}
    </div>
  );
}

function OutputReviewFeedback({
  feedback,
}: {
  feedback: OutputEvaluationResult;
}) {
  return (
    <div
      className={`mission-feedback mission-feedback--${feedback.tone}`}
      role="status"
      aria-live="polite"
    >
      <p className="mission-feedback__title">{feedback.title}</p>
      <p className="mission-feedback__body">
        {feedback.isAccepted
          ? 'Retry recorded for this item.'
          : `${feedback.message} Try: ${feedback.expectedAnswer}`}
      </p>
    </div>
  );
}

function ReadingReviewCard({
  item,
  onReviewed,
}: ReviewCardProps & {
  item: Extract<ReviewBatchItem, { type: 'reading-check' }>;
}) {
  const [selectedChoice, setSelectedChoice] = useState('');
  const [feedback, setFeedback] = useState<ReviewResult | null>(null);
  const showReading = hasDistinctReading(item.example.japanese, item.example.reading);

  function submitAnswer() {
    if (!selectedChoice) {
      return;
    }

    const result = selectedChoice === item.check.answer ? 'correct' : 'incorrect';

    setFeedback(result);
    onReviewed(result);
  }

  return (
    <div className="review-retry-card">
      <div className="reading-check-card__prompt">
        <p className="mission-copy-block__eyebrow">Japanese first</p>
        <p className="reading-check-card__sentence">{item.example.japanese}</p>
      </div>

      <div className="reading-check-card__question">
        <p className="mission-copy-block__eyebrow">Comprehension check</p>
        <p className="mission-copy-block__body">{item.check.prompt}</p>
      </div>

      <div className="mission-choice-grid">
        {item.check.choices.map((choice) => (
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
          onClick={submitAnswer}
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

      {feedback ? <ReviewFeedback result={feedback} answer={item.check.answer} /> : null}

      {feedback ? (
        <div className="reading-reveal-card">
          {showReading ? (
            <div className="reading-reveal-card__section">
              <p className="mission-copy-block__eyebrow">Reading</p>
              <p className="mission-copy-block__body">{item.example.reading}</p>
            </div>
          ) : null}
          <div className="reading-reveal-card__section">
            <p className="mission-copy-block__eyebrow">Meaning</p>
            <p className="mission-copy-block__body">{item.example.english}</p>
          </div>
          {item.check.support ? (
            <div className="reading-reveal-card__section">
              <p className="mission-copy-block__eyebrow">What to notice</p>
              <p className="mission-copy-block__body">{item.check.support}</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function ReviewFeedback({
  result,
  answer,
}: {
  result: ReviewResult;
  answer: string;
}) {
  return (
    <div
      className={`mission-feedback mission-feedback--${result}`}
      role="status"
      aria-live="polite"
    >
      <p className="mission-feedback__title">
        {result === 'correct' ? 'Correct.' : 'Not quite.'}
      </p>
      <p className="mission-feedback__body">
        {result === 'correct' ? 'Retry recorded for this item.' : `Expected answer: ${answer}`}
      </p>
    </div>
  );
}

function SupportedExposureFeedback() {
  return (
    <div
      className="mission-feedback mission-feedback--supported"
      role="status"
      aria-live="polite"
    >
      <p className="mission-feedback__title">Supported exposure.</p>
      <p className="mission-feedback__body">
        You saw the answer, so this pass can continue but the retry stays open.
      </p>
    </div>
  );
}

function formatReviewFocusLabel(item: ReviewBatchItem) {
  switch (item.type) {
    case 'grammar-drill':
      return 'Grammar retry';
    case 'listening-check':
      return 'Listening retry';
    case 'output-task':
      return 'Output retry';
    case 'reading-check':
      return 'Reading retry';
  }
}

function getReviewTaskDescription(item: ReviewBatchItem) {
  switch (item.type) {
    case 'grammar-drill':
      return 'Solve one grammar retry before moving on.';
    case 'listening-check':
      return 'Choose the best meaning before opening extra support.';
    case 'output-task':
      return 'Write one short line, then check it.';
    case 'reading-check':
      return 'Read first, answer once, then reveal support.';
  }
}

function getCurrentGrammarResponse({
  drillType,
  selectedChoice,
  typedAnswer,
  assembledTokenIndexes,
  reorderTokens,
}: {
  drillType: GrammarDrill['type'];
  selectedChoice: string;
  typedAnswer: string;
  assembledTokenIndexes: number[];
  reorderTokens: string[];
}) {
  if (drillType === 'multiple-choice') {
    return selectedChoice;
  }

  if (drillType === 'reorder') {
    return assembledTokenIndexes.map((tokenIndex) => reorderTokens[tokenIndex]).join('');
  }

  return typedAnswer;
}
