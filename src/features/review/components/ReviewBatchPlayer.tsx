import { useMemo, useState } from 'react';
import { SurfaceCard } from '../../../components/layout/PageShell';
import type { GrammarDrill } from '../../../lib/content/types';
import { evaluateOutputResponse, type OutputEvaluationResult } from '../../../lib/outputEvaluation';
import type { ReviewBatchItem } from '../lib/reviewBatch';
import {
  getListeningReviewChoices,
  getReviewBatchSummary,
  normalizeReviewAnswer,
} from '../lib/reviewBatch';

type ReviewBatchPlayerProps = {
  items: ReviewBatchItem[];
  onComplete: (itemIds: string[]) => void;
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

  const completedCount = useMemo(
    () => items.filter((item) => resultsByItemId[item.weakPoint.itemId]).length,
    [items, resultsByItemId],
  );

  return (
    <div className="review-batch-player">
      <SurfaceCard
        title="Focused review batch"
        description="Retry a small deterministic set of weak points. Successful retries reduce weak-point pressure immediately."
      >
        <div className="mission-progress">
          <div className="mission-progress__meta">
            <p className="mission-progress__label">
              Item {currentIndex + 1} of {items.length}
            </p>
            <p className="mission-progress__step">
              {completedCount} attempted / {items.length}
            </p>
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
        title={summary.title}
        description={`${summary.eyebrow} · ${summary.missionTitle}`}
      >
        <div className="review-current-item">
          <p className="review-current-item__body">{summary.body}</p>
          <p className="review-current-item__meta">
            Missed {currentItem.weakPoint.missCount} time
            {currentItem.weakPoint.missCount === 1 ? '' : 's'} before this retry
          </p>

          {currentItem.type === 'grammar-drill' ? (
            <GrammarReviewCard
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

          {currentItem.type === 'output-task' ? (
            <OutputReviewCard
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
                onClick={() => onComplete(items.map((item) => item.weakPoint.itemId))}
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

function GrammarReviewCard({
  item,
  onReviewed,
}: ReviewCardProps & {
  item: Extract<ReviewBatchItem, { type: 'grammar-drill' }>;
}) {
  const reorderTokens = getReorderTokens(item.drill);
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
        <label className="mission-input-group">
          <span className="mission-input-group__label">Your answer</span>
          <input
            type="text"
            className="mission-input"
            value={typedAnswer}
            onChange={(event) => {
              setTypedAnswer(event.target.value);
              setFeedback(null);
            }}
            placeholder="Type the missing Japanese"
            autoComplete="off"
          />
        </label>
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
  onReviewed,
}: ReviewCardProps & {
  item: Extract<ReviewBatchItem, { type: 'listening-check' }>;
}) {
  const [selectedChoice, setSelectedChoice] = useState('');
  const [feedback, setFeedback] = useState<ReviewResult | null>(null);
  const translationChoices = getListeningReviewChoices(
    item.listeningItem,
    item.choicePool,
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

  return (
    <div className="review-retry-card">
      <div className="review-listening-stack">
        <section className="listening-reveal-card listening-reveal-card--visible">
          <p className="mission-copy-block__eyebrow">Transcript</p>
          <p className="listening-reveal-card__value">{item.listeningItem.transcript}</p>
        </section>
        <section className="listening-reveal-card">
          <p className="mission-copy-block__eyebrow">Focus point</p>
          <p className="listening-reveal-card__value">{item.listeningItem.focusPoint}</p>
        </section>
      </div>

      <div className="mission-choice-grid">
        {translationChoices.map((choice) => (
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
      </div>

      {feedback ? <ReviewFeedback result={feedback} answer={item.listeningItem.translation} /> : null}
    </div>
  );
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
        <div className="output-task-card__hint">
          <p className="mission-copy-block__eyebrow">Hint</p>
          <p className="mission-copy-block__body">{item.task.hint}</p>
        </div>
      ) : null}

      <label className="mission-input-group">
        <span className="mission-input-group__label">Your Japanese line</span>
        <textarea
          className="mission-textarea"
          value={response}
          onChange={(event) => {
            setResponse(event.target.value);
            setFeedback(null);
          }}
          rows={3}
          placeholder="Type your line in Japanese"
        />
      </label>

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
          : `${feedback.message} Expected pattern: ${feedback.expectedAnswer}`}
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
          <div className="reading-reveal-card__section">
            <p className="mission-copy-block__eyebrow">Reading</p>
            <p className="mission-copy-block__body">{item.example.reading}</p>
          </div>
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

function getReorderTokens(drill: Extract<ReviewBatchItem, { type: 'grammar-drill' }>['drill']) {
  if (drill.type !== 'reorder') {
    return [];
  }

  const promptParts = drill.prompt.split(/[:：]/);
  const chunkSource = promptParts.length > 1 ? promptParts.slice(1).join(':') : drill.prompt;

  return chunkSource
    .split('/')
    .map((token) => token.trim())
    .filter(Boolean);
}
