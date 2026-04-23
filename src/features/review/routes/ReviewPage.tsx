import { useMemo, useState } from 'react';
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
  repeatedWeakPointCount: number;
  nextBatchSize: number;
};

export function ReviewPage() {
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

  return (
    <PageShell
      eyebrow="Weak Points"
      title="Review"
      description="A focused local retry loop for currently tracked weak points. Batch selection stays deterministic and intentionally small."
      aside={
        <span className="status-chip">
          {weakPoints.length > 0 ? 'Ready to retry' : 'No misses saved'}
        </span>
      }
    >
      <SurfaceCard
        title="Focused review loop"
        description="Select the current top weak points and retry them in one compact pass. After each batch, the page now tells you what cleared and whether another short retry batch is still worth taking."
      >
        <div className="review-launch-card">
          <div className="review-launch-card__summary">
            <p className="review-launch-card__title">
              {batchItems.length > 0
                ? `${batchItems.length} item${batchItems.length === 1 ? '' : 's'} ready for retry`
                : 'No retry batch available yet'}
            </p>
            <p className="review-launch-card__body">
              Batch order is highest miss count first, then most recent miss, capped at {REVIEW_BATCH_SIZE} items.
            </p>
            <p className="review-launch-card__meta">
              {reviewLoopProgress.completedBatchCount} review batch
              {reviewLoopProgress.completedBatchCount === 1 ? '' : 'es'} completed locally
            </p>
            <p className="review-launch-card__meta">
              {reviewLoopProgress.lastCompletedAt
                ? `Last review batch ${formatTimestamp(reviewLoopProgress.lastCompletedAt)}`
                : 'No review batches completed yet'}
            </p>
            {lastBatchSummary ? (
              <ul className="simple-list">
                <li>
                  Last batch cleared {lastBatchSummary.clearedCount} of{' '}
                  {lastBatchSummary.attemptedCount} item
                  {lastBatchSummary.attemptedCount === 1 ? '' : 's'}
                </li>
                <li>
                  {lastBatchSummary.unresolvedCount > 0
                    ? `${lastBatchSummary.unresolvedCount} item${
                        lastBatchSummary.unresolvedCount === 1 ? '' : 's'
                      } still need another retry`
                    : 'All items from the last batch were cleared'}
                </li>
                <li>
                  {lastBatchSummary.remainingWeakPointCount > 0
                    ? `${lastBatchSummary.remainingWeakPointCount} weak point${
                        lastBatchSummary.remainingWeakPointCount === 1 ? '' : 's'
                      } still remain in the queue`
                    : 'No weak points remain after the last batch'}
                </li>
                {lastBatchSummary.repeatedWeakPointCount > 0 ? (
                  <li>
                    {lastBatchSummary.repeatedWeakPointCount} open weak point
                    {lastBatchSummary.repeatedWeakPointCount === 1 ? '' : 's'} still
                    have repeated misses
                  </li>
                ) : null}
              </ul>
            ) : null}
          </div>

          <button
            type="button"
            className="mission-button"
            disabled={batchItems.length === 0}
            onClick={() => {
              setLastBatchSummary(null);
              setActiveBatch(batchItems);
            }}
          >
            {lastBatchSummary && batchItems.length > 0 ? 'Continue with next batch' : 'Start focused review'}
          </button>
        </div>
      </SurfaceCard>

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

            setLastBatchSummary({
              attemptedCount: itemIds.length,
              clearedCount,
              unresolvedCount: itemIds.length - clearedCount,
              remainingWeakPointCount: remainingWeakPoints.length,
              repeatedWeakPointCount: remainingWeakPoints.filter(
                (weakPoint) => weakPoint.missCount > 1,
              ).length,
              nextBatchSize: nextBatch.length,
            });
            setActiveBatch(null);
          }}
        />
      ) : null}

      {lastBatchSummary ? (
        <SurfaceCard
          title="After your last batch"
          description={
            lastBatchSummary.nextBatchSize > 0
              ? 'The next retry batch is already prepared from the remaining weak points.'
              : 'The current review queue is empty, so there is no follow-up batch right now.'
          }
        >
          <ul className="simple-list">
            <li>
              Cleared {lastBatchSummary.clearedCount} item
              {lastBatchSummary.clearedCount === 1 ? '' : 's'} in the last batch
            </li>
            <li>
              {lastBatchSummary.unresolvedCount > 0
                ? `${lastBatchSummary.unresolvedCount} item${
                    lastBatchSummary.unresolvedCount === 1 ? '' : 's'
                  } from that batch are still unresolved`
                : 'No unresolved items remain from the last batch'}
            </li>
            <li>
              {lastBatchSummary.nextBatchSize > 0
                ? `${lastBatchSummary.nextBatchSize} item${
                    lastBatchSummary.nextBatchSize === 1 ? '' : 's'
                  } are ready in the next deterministic retry batch`
                : 'No next batch is queued right now'}
            </li>
          </ul>
        </SurfaceCard>
      ) : null}

      <SurfaceCard
        title="Weak-point summary"
        description="This local summary shows the underlying weak-point store before and after each review batch."
      >
        <ul className="simple-list">
          <li>{weakPoints.length} tracked weak point{weakPoints.length === 1 ? '' : 's'}</li>
          <li>{totalMisses} total miss{totalMisses === 1 ? '' : 'es'} saved locally</li>
          <li>
            {weakPoints.length > 0
              ? `Most recent miss ${formatTimestamp(weakPoints[0].lastMissedAt)}`
              : 'No incorrect checks recorded yet'}
          </li>
        </ul>
      </SurfaceCard>

      <SurfaceCard
        title="Recorded items"
        description="These are the currently tracked weak points available to the review loop."
      >
        {weakPoints.length > 0 ? (
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
                            Missed {weakPoint.missCount} time{weakPoint.missCount === 1 ? '' : 's'} · last missed{' '}
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
        ) : (
          <ul className="simple-list">
            <li>No weak points recorded yet.</li>
            <li>Incorrect answers from grammar, listening, output, and reading checks will appear here.</li>
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
