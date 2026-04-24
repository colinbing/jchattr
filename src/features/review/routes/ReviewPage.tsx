import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PageShell, SurfaceCard } from '../../../components/layout/PageShell';
import { getStarterContent } from '../../../lib/content/loader';
import {
  markReviewBatchComplete,
  useReviewLoopProgress,
} from '../../../lib/progress/reviewLoop';
import {
  getWeakPointList,
  readWeakPoints,
  resolveWeakPointSuccess,
  type WeakPoint,
  type WeakPointItemType,
  useWeakPoints,
} from '../../../lib/progress/weakPoints';
import { ReviewBatchPlayer } from '../components/ReviewBatchPlayer';
import {
  getReviewBatchSummary,
  REVIEW_BATCH_SIZE,
  resolveReviewBatchItem,
  selectReviewBatch,
  type ReviewBatchItem,
} from '../lib/reviewBatch';

const WEAK_POINT_GROUPS: WeakPointItemType[] = [
  'grammar-drill',
  'listening-check',
  'output-task',
  'reading-check',
];

type LastBatchSummary = {
  attemptedCount: number;
  clearedCount: number;
  unresolvedCount: number;
  remainingWeakPointCount: number;
  nextBatchSize: number;
};

type ReviewRouteState = {
  returnTo?: 'today';
};

type ReviewCompletionRouteState = {
  reviewCompletion: {
    attemptedCount: number;
    clearedCount: number;
    unresolvedCount: number;
    remainingWeakPointCount: number;
    nextBatchSize: number;
  };
};

export function ReviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const starterContent = getStarterContent();
  const weakPointStore = useWeakPoints();
  const reviewLoopProgress = useReviewLoopProgress();
  const weakPoints = getWeakPointList(weakPointStore);
  const totalMisses = weakPoints.reduce((sum, weakPoint) => sum + weakPoint.missCount, 0);
  const batchItems = useMemo(
    () => selectReviewBatch(weakPointStore, starterContent),
    [starterContent, weakPointStore],
  );
  const [activeBatch, setActiveBatch] = useState<ReviewBatchItem[] | null>(null);
  const [lastBatchSummary, setLastBatchSummary] = useState<LastBatchSummary | null>(null);
  const returnToToday = (location.state as ReviewRouteState | null)?.returnTo === 'today';

  return (
    <PageShell
      eyebrow="Retry Loop"
      title="Review"
      description="Take one short retry batch, then get back to Today. The queue stays local, deterministic, and intentionally small."
      aside={
        <span className="status-chip">
          {batchItems.length > 0 ? `${batchItems.length} ready` : 'All clear'}
        </span>
      }
    >
      <SurfaceCard
        title="Review queue"
        description="Keep review short on purpose. Retry the top weak points once, then move on."
      >
        <div className="review-queue-card">
          <div className="review-queue-card__copy">
            <p className="review-launch-card__title">
              {batchItems.length > 0
                ? `${batchItems.length} retry item${batchItems.length === 1 ? '' : 's'} ready`
                : 'No retry batch ready right now'}
            </p>
            <p className="review-launch-card__body">
              {batchItems.length > 0
                ? `Batch order is highest miss count first, then most recent miss, capped at ${REVIEW_BATCH_SIZE} items.`
                : 'Nothing needs an immediate retry. New misses from missions will show up here automatically.'}
            </p>
          </div>

          <div className="review-chip-row" aria-label="Review queue summary">
            <span className="review-chip">
              {weakPoints.length} tracked weak point{weakPoints.length === 1 ? '' : 's'}
            </span>
            <span className="review-chip">
              {totalMisses} saved miss{totalMisses === 1 ? '' : 'es'}
            </span>
            <span className="review-chip">
              {reviewLoopProgress.lastCompletedAt
                ? `Last batch ${formatTimestamp(reviewLoopProgress.lastCompletedAt)}`
                : 'No review batch yet'}
            </span>
          </div>

          <div className="mission-step-actions review-card-actions">
            <button
              type="button"
              className="mission-button"
              disabled={batchItems.length === 0}
              onClick={() => {
                setLastBatchSummary(null);
                setActiveBatch(batchItems);
              }}
            >
              {lastBatchSummary && batchItems.length > 0 ? 'Start next batch' : 'Start review'}
            </button>

            <Link to="/" className="mission-button mission-button--secondary mission-button--link">
              Back to Today
            </Link>
          </div>
        </div>
      </SurfaceCard>

      {lastBatchSummary ? (
        <SurfaceCard
          title="Batch finished"
          description={
            lastBatchSummary.nextBatchSize > 0
              ? 'Good. The queue is lighter. Take another short pass only if you still want it.'
              : 'Good. This batch is done and there is no next retry batch waiting right now.'
          }
        >
          <div className="review-post-batch-card">
            <div className="review-post-batch-card__copy">
              <p className="review-launch-card__title">
                {lastBatchSummary.clearedCount}/{lastBatchSummary.attemptedCount} retries cleared
              </p>
              <p className="review-launch-card__body">
                {lastBatchSummary.unresolvedCount > 0
                  ? `${lastBatchSummary.unresolvedCount} item${
                      lastBatchSummary.unresolvedCount === 1 ? '' : 's'
                    } still need another pass.`
                  : 'That batch is fully cleared.'}{' '}
                {lastBatchSummary.nextBatchSize > 0
                  ? `${lastBatchSummary.nextBatchSize} more item${
                      lastBatchSummary.nextBatchSize === 1 ? '' : 's'
                    } are ready if you want one more short batch.`
                  : 'No next batch is queued.'}
              </p>
            </div>

            <div className="review-chip-row" aria-label="Last batch summary">
              <span className="review-chip">
                {lastBatchSummary.remainingWeakPointCount} weak point
                {lastBatchSummary.remainingWeakPointCount === 1 ? '' : 's'} left
              </span>
              <span className="review-chip">
                {lastBatchSummary.unresolvedCount} unresolved from last batch
              </span>
              <span className="review-chip">
                {lastBatchSummary.nextBatchSize > 0
                  ? `${lastBatchSummary.nextBatchSize} ready next`
                  : 'Queue clear for now'}
              </span>
            </div>

            <div className="mission-step-actions review-card-actions">
              {lastBatchSummary.nextBatchSize > 0 ? (
                <button
                  type="button"
                  className="mission-button"
                  onClick={() => {
                    setLastBatchSummary(null);
                    setActiveBatch(batchItems);
                  }}
                >
                  Start next batch
                </button>
              ) : (
                <Link to="/" className="mission-button mission-button--link">
                  Back to Today
                </Link>
              )}

              {lastBatchSummary.nextBatchSize > 0 ? (
                <Link
                  to="/"
                  className="mission-button mission-button--secondary mission-button--link"
                >
                  Back to Today
                </Link>
              ) : null}
            </div>
          </div>
        </SurfaceCard>
      ) : null}

      {activeBatch && activeBatch.length > 0 ? (
        <ReviewBatchPlayer
          items={activeBatch}
          onSuccessfulRetry={(itemId) => {
            resolveWeakPointSuccess(itemId);
          }}
          onComplete={(itemIds, resultsByItemId) => {
            markReviewBatchComplete(itemIds);
            const latestWeakPointStore = readWeakPoints();
            const remainingWeakPoints = getWeakPointList(latestWeakPointStore);
            const nextBatch = selectReviewBatch(latestWeakPointStore, starterContent);
            const clearedCount = itemIds.filter((itemId) => resultsByItemId[itemId] === 'correct')
              .length;

            if (returnToToday) {
              setActiveBatch(null);
              navigate('/', {
                replace: true,
                state: {
                  reviewCompletion: {
                    attemptedCount: itemIds.length,
                    clearedCount,
                    unresolvedCount: itemIds.length - clearedCount,
                    remainingWeakPointCount: remainingWeakPoints.length,
                    nextBatchSize: nextBatch.length,
                  },
                } satisfies ReviewCompletionRouteState,
              });
              return;
            }

            setLastBatchSummary({
              attemptedCount: itemIds.length,
              clearedCount,
              unresolvedCount: itemIds.length - clearedCount,
              remainingWeakPointCount: remainingWeakPoints.length,
              nextBatchSize: nextBatch.length,
            });
            setActiveBatch(null);
          }}
        />
      ) : null}

      <SurfaceCard
        title="Tracked items"
        description="Open this only when you want the queue details."
      >
        {weakPoints.length > 0 ? (
          <details className="review-details">
            <summary className="review-details__summary">
              {weakPoints.length} tracked weak point{weakPoints.length === 1 ? '' : 's'}
            </summary>

            <div className="review-group-list">
              {WEAK_POINT_GROUPS.map((itemType) => {
                const items = weakPoints.filter((weakPoint) => weakPoint.itemType === itemType);

                if (items.length === 0) {
                  return null;
                }

                return (
                  <section key={itemType} className="review-group">
                    <div className="review-group__header">
                      <h3 className="review-group__title">{formatGroupLabel(itemType)}</h3>
                      <p className="review-group__meta">
                        {items.length} item{items.length === 1 ? '' : 's'}
                      </p>
                    </div>

                    <div className="review-item-list">
                      {items.map((weakPoint) => {
                        const summary = resolveWeakPointSummary(weakPoint, starterContent);

                        return (
                          <article key={weakPoint.itemId} className="review-item-card">
                            <p className="review-item-card__eyebrow">{summary.eyebrow}</p>
                            <h4 className="review-item-card__title">{summary.title}</h4>
                            <p className="review-item-card__body">{summary.body}</p>
                            <p className="review-item-card__meta">
                              Mission: {summary.missionTitle}
                            </p>
                            <p className="review-item-card__meta">
                              Missed {weakPoint.missCount} time
                              {weakPoint.missCount === 1 ? '' : 's'} · last missed{' '}
                              {formatTimestamp(weakPoint.lastMissedAt)}
                            </p>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </details>
        ) : (
          <ul className="simple-list">
            <li>No weak points recorded yet.</li>
            <li>Incorrect answers from missions will appear here automatically.</li>
          </ul>
        )}
      </SurfaceCard>
    </PageShell>
  );
}

function resolveWeakPointSummary(
  weakPoint: WeakPoint,
  starterContent: ReturnType<typeof getStarterContent>,
) {
  const resolvedItem = resolveReviewBatchItem(weakPoint, starterContent);

  if (resolvedItem) {
    return getReviewBatchSummary(resolvedItem);
  }

  const missionTitle =
    starterContent.byId.missions[weakPoint.missionId]?.title ?? 'Unknown mission';

  return {
    eyebrow: weakPoint.itemType,
    title: weakPoint.itemId,
    body: 'This weak point could not be resolved cleanly from current starter content.',
    missionTitle,
  };
}

function formatGroupLabel(itemType: WeakPointItemType) {
  switch (itemType) {
    case 'grammar-drill':
      return 'Grammar drills';
    case 'listening-check':
      return 'Listening checks';
    case 'output-task':
      return 'Output tasks';
    case 'reading-check':
      return 'Reading checks';
  }
}

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}
