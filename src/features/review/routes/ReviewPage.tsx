import { useMemo, useState } from 'react';
import { PageShell, SurfaceCard } from '../../../components/layout/PageShell';
import { getStarterContent } from '../../../lib/content/loader';
import {
  markReviewBatchComplete,
  useReviewLoopProgress,
} from '../../../lib/progress/reviewLoop';
import {
  getWeakPointList,
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
];

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
  const [activeBatchItemIds, setActiveBatchItemIds] = useState<string[] | null>(null);

  const activeBatch = activeBatchItemIds
    ? activeBatchItemIds
        .map((itemId) => weakPointStore.weakPointsByItemId[itemId])
        .map((weakPoint) =>
          weakPoint ? resolveReviewBatchItem(weakPoint, starterContent) : null,
        )
        .filter((item): item is ReviewBatchItem => Boolean(item))
    : [];
  const activeBatchHasAllItems =
    activeBatchItemIds !== null && activeBatch.length === activeBatchItemIds.length;

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
        description="Select the current top weak points and retry them in one compact pass. No clearance, recommendation, or scheduling logic is applied yet."
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
          </div>

          <button
            type="button"
            className="mission-button"
            disabled={batchItems.length === 0}
            onClick={() =>
              setActiveBatchItemIds(batchItems.map((item) => item.weakPoint.itemId))
            }
          >
            Start focused review
          </button>
        </div>
      </SurfaceCard>

      {activeBatchHasAllItems ? (
        <ReviewBatchPlayer
          items={activeBatch}
          onComplete={(itemIds) => {
            markReviewBatchComplete(itemIds);
            setActiveBatchItemIds(null);
          }}
        />
      ) : null}

      <SurfaceCard
        title="Weak-point summary"
        description="This local summary still shows the underlying weak-point store even after a review batch finishes."
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
            <li>Incorrect answers from grammar, listening, and output checks will appear here.</li>
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
