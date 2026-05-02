import type { Mission, StarterContent } from '../../../lib/content/types';
import type { MissionProgressRecord } from '../../../lib/progress/missionProgress';
import type { ReviewLoopProgress } from '../../../lib/progress/reviewLoop';
import {
  getWeakPointList,
  type WeakPoint,
  type WeakPointStore,
} from '../../../lib/progress/weakPoints';
import { selectReviewBatch } from '../../review/lib/reviewBatch';
import type { TodayRecommendation } from './todayRecommendationTypes';

const FRESH_WEAK_POINT_WINDOW_MS = 24 * 60 * 60 * 1000;
const RECENT_REVIEW_WINDOW_MS = 12 * 60 * 60 * 1000;
const RECENT_MISSION_COMPLETION_WINDOW_MS = 12 * 60 * 60 * 1000;
const URGENT_WEAK_POINT_COUNT = 3;
const REPEATED_MISS_THRESHOLD = 2;

export type ReviewAwareness = {
  weakPointList: WeakPoint[];
  reviewBatch: ReturnType<typeof selectReviewBatch>;
  lastReviewAt: number | null;
  latestWeakPointAt: number | null;
  hasFreshWeakPoints: boolean;
  hasRecentReview: boolean;
  isUrgent: boolean;
  topWeakPoint: WeakPoint | null;
  recentlyReviewedMissionIds: Set<string>;
  recentlyCompletedMissionIds: Set<string>;
};

export function deriveReviewAwareness(
  starterContent: StarterContent,
  missionProgress: MissionProgressRecord,
  weakPoints: WeakPointStore,
  reviewLoopProgress: ReviewLoopProgress,
): ReviewAwareness {
  const weakPointList = getWeakPointList(weakPoints);
  const reviewBatch = selectReviewBatch(weakPoints, starterContent);
  const lastReviewAt = reviewLoopProgress.lastCompletedAt
    ? Date.parse(reviewLoopProgress.lastCompletedAt)
    : null;
  const latestWeakPointAt = weakPointList[0]
    ? Date.parse(weakPointList[0].lastMissedAt)
    : null;
  const now = Date.now();
  const hasFreshWeakPoints =
    latestWeakPointAt !== null && now - latestWeakPointAt <= FRESH_WEAK_POINT_WINDOW_MS;
  const hasRecentReview =
    lastReviewAt !== null && now - lastReviewAt <= RECENT_REVIEW_WINDOW_MS;
  const hasRepeatedWeakPoint = weakPointList.some(
    (weakPoint) => weakPoint.missCount >= REPEATED_MISS_THRESHOLD,
  );
  const needsReviewRefresh =
    latestWeakPointAt !== null && (lastReviewAt === null || latestWeakPointAt > lastReviewAt);
  const isUrgent =
    weakPointList.length > 0 &&
    (weakPointList.length >= URGENT_WEAK_POINT_COUNT ||
      hasRepeatedWeakPoint ||
      (hasFreshWeakPoints && needsReviewRefresh));

  return {
    weakPointList,
    reviewBatch,
    lastReviewAt,
    latestWeakPointAt,
    hasFreshWeakPoints,
    hasRecentReview,
    isUrgent,
    topWeakPoint: selectTopWeakPoint(weakPointList),
    recentlyReviewedMissionIds: hasRecentReview
      ? resolveRecentlyReviewedMissionIds(starterContent, reviewLoopProgress.lastCompletedItemIds)
      : new Set<string>(),
    recentlyCompletedMissionIds: resolveRecentlyCompletedMissionIds(missionProgress),
  };
}

export function getReviewRecommendation(
  reviewAwareness: ReviewAwareness,
): TodayRecommendation | null {
  const { weakPointList, reviewBatch } = reviewAwareness;

  if (weakPointList.length === 0 || reviewBatch.length === 0) {
    return null;
  }

  const repeatedWeakPointCount = weakPointList.filter(
    (weakPoint) => weakPoint.missCount >= REPEATED_MISS_THRESHOLD,
  ).length;
  const reviewReason = reviewAwareness.isUrgent
    ? buildUrgentReviewReason(reviewAwareness, repeatedWeakPointCount)
    : reviewAwareness.lastReviewAt
      ? `${formatWeakPointCount(weakPointList.length)} ${
          weakPointList.length === 1 ? 'is' : 'are'
        } still open after your last review pass, so start by retrying ${
          weakPointList.length === 1 ? 'it' : 'them'
        }.`
      : `${formatWeakPointCount(weakPointList.length)} ${
          weakPointList.length === 1 ? 'is' : 'are'
        } waiting for a retry, so lead with a short review batch.`;

  return {
    id: 'review-loop',
    kind: 'review',
    slotLabel: reviewAwareness.isUrgent ? 'Review now' : 'Review',
    title: reviewAwareness.isUrgent ? 'Fresh weak spots need a retry' : 'Retry weak spots first',
    reason: reviewReason,
    ctaLabel: 'Open review',
    to: '/review',
    weakPointCount: weakPointList.length,
    batchSize: reviewBatch.length,
  };
}

export function formatWeakPointCount(count: number) {
  return `${count} weak point${count === 1 ? '' : 's'}`;
}

function selectTopWeakPoint(weakPointList: WeakPoint[]) {
  return [...weakPointList].sort((left, right) => {
    if (right.missCount !== left.missCount) {
      return right.missCount - left.missCount;
    }

    return Date.parse(right.lastMissedAt) - Date.parse(left.lastMissedAt);
  })[0] ?? null;
}

function buildUrgentReviewReason(
  reviewAwareness: ReviewAwareness,
  repeatedWeakPointCount: number,
) {
  const weakPointCount = reviewAwareness.weakPointList.length;

  if (repeatedWeakPointCount > 0 && reviewAwareness.hasFreshWeakPoints) {
    const freshnessContext = reviewAwareness.lastReviewAt
      ? 'fresh errors since your last review'
      : 'fresh errors from this local session';

    return `${formatWeakPointCount(weakPointCount)} ${
      weakPointCount === 1 ? 'is' : 'are'
    } open, including ${repeatedWeakPointCount} with repeated misses and ${freshnessContext}.`;
  }

  if (repeatedWeakPointCount > 0) {
    return `${formatWeakPointCount(weakPointCount)} ${
      weakPointCount === 1 ? 'is' : 'are'
    } still open, and ${repeatedWeakPointCount} already ${
      repeatedWeakPointCount === 1 ? 'has' : 'have'
    } repeated misses.`;
  }

  return `${formatWeakPointCount(weakPointCount)} ${
    weakPointCount === 1 ? 'is' : 'are'
  } open and still fresh, so retry ${weakPointCount === 1 ? 'it' : 'them'} before taking on something broader.`;
}

function resolveRecentlyCompletedMissionIds(missionProgress: MissionProgressRecord) {
  const now = Date.now();

  return new Set(
    Object.entries(missionProgress.lastCompletedAtByMissionId)
      .filter(([, timestamp]) => now - Date.parse(timestamp) <= RECENT_MISSION_COMPLETION_WINDOW_MS)
      .map(([missionId]) => missionId),
  );
}

function resolveRecentlyReviewedMissionIds(
  starterContent: StarterContent,
  itemIds: string[],
) {
  return new Set(
    itemIds
      .map((itemId) => findMissionIdForReviewItem(starterContent, itemId))
      .filter((missionId): missionId is string => Boolean(missionId)),
  );
}

function findMissionIdForReviewItem(
  starterContent: StarterContent,
  itemId: string,
) {
  return (
    starterContent.missions.find((mission) => missionContainsReviewItem(starterContent, mission, itemId))
      ?.id ?? null
  );
}

function missionContainsReviewItem(
  starterContent: StarterContent,
  mission: Mission,
  itemId: string,
) {
  if (mission.contentRefs.listeningItemIds?.includes(itemId)) {
    return true;
  }

  if (mission.outputTasks?.some((task) => task.id === itemId)) {
    return true;
  }

  if (mission.readingChecks?.some((check) => check.id === itemId)) {
    return true;
  }

  return (mission.contentRefs.grammarLessonIds ?? []).some((lessonId) => {
    const lesson = starterContent.byId.grammarLessons[lessonId];
    return lesson?.drills.some((drill) => drill.id === itemId);
  });
}
