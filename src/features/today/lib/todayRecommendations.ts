import type { Mission, StarterContent } from '../../../lib/content/types';
import {
  getMissionProgressEntry,
  type MissionProgressRecord,
} from '../../../lib/progress/missionProgress';
import type { ReviewLoopProgress } from '../../../lib/progress/reviewLoop';
import {
  type WeakPoint,
  getWeakPointList,
  type WeakPointStore,
} from '../../../lib/progress/weakPoints';
import type { MissionSessionMode } from '../../missions/lib/missionSession';
import { selectReviewBatch } from '../../review/lib/reviewBatch';

export const TODAY_RECOMMENDATION_LIMIT = 3;
const FRESH_WEAK_POINT_WINDOW_MS = 24 * 60 * 60 * 1000;
const RECENT_REVIEW_WINDOW_MS = 12 * 60 * 60 * 1000;
const RECENT_MISSION_COMPLETION_WINDOW_MS = 12 * 60 * 60 * 1000;
const URGENT_WEAK_POINT_COUNT = 3;
const REPEATED_MISS_THRESHOLD = 2;

export type TodayRecommendation =
  | {
      id: 'review-loop';
      kind: 'review';
      slotLabel: string;
      title: string;
      reason: string;
      ctaLabel: string;
      to: '/review';
      weakPointCount: number;
      batchSize: number;
    }
  | {
      id: string;
      kind: 'mission';
      slotLabel: string;
      title: string;
      reason: string;
      ctaLabel: string;
      to: string;
      mission: Mission;
      sessionMode: MissionSessionMode;
    };

// Keep the heuristics intentionally small and readable:
// 1. Recommend Review first when there are unresolved weak points.
// 2. Mark review as urgent when weak points are fresh, repeated, or numerous.
// 3. Recommend the next unlocked incomplete mission in starter order.
// 4. Use the third slot to stabilize the mission tied to the top open weak point when review is urgent.
// 5. Otherwise recommend one reinforcement mission, but avoid immediately repeating missions that were just reviewed.
// 6. If slots remain, fill them with the next least-practiced unlocked missions, while lightly de-prioritizing just-reviewed missions.
export function deriveTodayRecommendations(
  starterContent: StarterContent,
  missionProgress: MissionProgressRecord,
  weakPoints: WeakPointStore,
  reviewLoopProgress: ReviewLoopProgress,
  limit = TODAY_RECOMMENDATION_LIMIT,
): TodayRecommendation[] {
  const recommendations: TodayRecommendation[] = [];
  const selectedMissionIds = new Set<string>();
  const unlockedMissions = starterContent.missions.filter((mission) =>
    isMissionUnlocked(mission, missionProgress),
  );
  const reviewAwareness = deriveReviewAwareness(
    starterContent,
    missionProgress,
    weakPoints,
    reviewLoopProgress,
  );

  const reviewRecommendation = getReviewRecommendation(
    reviewAwareness,
  );

  if (reviewRecommendation) {
    recommendations.push(reviewRecommendation);
  }

  const nextMission = unlockedMissions.find((mission) => {
    return getMissionProgressEntry(missionProgress, mission.id).completionCount === 0;
  });

  if (nextMission) {
    recommendations.push({
      id: nextMission.id,
      kind: 'mission',
      slotLabel: 'Next up',
      title: nextMission.title,
      reason: reviewRecommendation
        ? 'This is the cleanest next step once the retry pass is done.'
        : reviewAwareness.hasRecentReview
          ? 'You just cleared review, so this keeps the path moving without extra noise.'
          : 'This keeps the core path moving with one fresh mission.',
      ctaLabel: 'Open mission',
      to: `/mission/${nextMission.id}`,
      mission: nextMission,
      sessionMode: 'default',
    });
    selectedMissionIds.add(nextMission.id);
  }

  const supportMission = selectSupportMission(
    unlockedMissions,
    missionProgress,
    selectedMissionIds,
    reviewAwareness,
  );

  if (supportMission) {
    recommendations.push({
      id: supportMission.mission.id,
      kind: 'mission',
      slotLabel: supportMission.slotLabel,
      title: supportMission.mission.title,
      reason: supportMission.reason,
      ctaLabel: supportMission.ctaLabel,
      to: `/mission/${supportMission.mission.id}`,
      mission: supportMission.mission,
      sessionMode: supportMission.sessionMode,
    });
    selectedMissionIds.add(supportMission.mission.id);
  }

  if (recommendations.length >= limit) {
    return recommendations.slice(0, limit);
  }

  const remainingMissions = unlockedMissions
    .filter((mission) => !selectedMissionIds.has(mission.id))
    .sort((left, right) => {
      const leftWasReviewed = reviewAwareness.recentlyReviewedMissionIds.has(left.id);
      const rightWasReviewed = reviewAwareness.recentlyReviewedMissionIds.has(right.id);

      if (leftWasReviewed !== rightWasReviewed) {
        return leftWasReviewed ? 1 : -1;
      }

      const leftProgress = getMissionProgressEntry(missionProgress, left.id);
      const rightProgress = getMissionProgressEntry(missionProgress, right.id);

      if (leftProgress.completionCount !== rightProgress.completionCount) {
        return leftProgress.completionCount - rightProgress.completionCount;
      }

      const leftTime = leftProgress.lastCompletedAt
        ? Date.parse(leftProgress.lastCompletedAt)
        : -Infinity;
      const rightTime = rightProgress.lastCompletedAt
        ? Date.parse(rightProgress.lastCompletedAt)
        : -Infinity;

      if (leftTime !== rightTime) {
        return leftTime - rightTime;
      }

      return (
        starterContent.missions.findIndex((mission) => mission.id === left.id) -
        starterContent.missions.findIndex((mission) => mission.id === right.id)
      );
    });

  remainingMissions.forEach((mission) => {
    if (recommendations.length >= limit) {
      return;
    }

    const progress = getMissionProgressEntry(missionProgress, mission.id);
    const slotLabel = progress.completionCount === 0 ? 'Keep moving' : 'Light pass';

    recommendations.push({
      id: mission.id,
      kind: 'mission',
      slotLabel,
      title: mission.title,
      reason:
        progress.completionCount === 0
          ? 'This is another open step if you want to keep the path moving.'
          : 'This has had lighter practice than your other completed missions.',
      ctaLabel: 'Open mission',
      to: `/mission/${mission.id}`,
      mission,
      sessionMode: progress.completionCount > 0 ? 'reinforce' : 'default',
    });
  });

  return recommendations.slice(0, limit);
}

export function isMissionUnlocked(
  mission: Mission,
  missionProgress: MissionProgressRecord,
) {
  const requiredMissionIds = mission.unlockRules?.requiredMissionIds;

  if (!requiredMissionIds?.length) {
    return true;
  }

  return requiredMissionIds.every((requiredMissionId) => {
    return getMissionProgressEntry(missionProgress, requiredMissionId).isCompleted;
  });
}

function getReviewRecommendation(
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
      ? `${weakPointList.length} weak point${weakPointList.length === 1 ? '' : 's'} are still open after your last review pass, so start by retrying them.`
      : `${weakPointList.length} weak point${weakPointList.length === 1 ? '' : 's'} are waiting for a retry, so lead with a short review batch.`;

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

type ReviewAwareness = {
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

type SupportMissionSelection = {
  mission: Mission;
  slotLabel: string;
  reason: string;
  ctaLabel: string;
  sessionMode: MissionSessionMode;
};

function selectSupportMission(
  unlockedMissions: Mission[],
  missionProgress: MissionProgressRecord,
  selectedMissionIds: Set<string>,
  reviewAwareness: ReviewAwareness,
): SupportMissionSelection | null {
  if (reviewAwareness.isUrgent) {
    const stabilizeMission = selectTopWeakPointMission(
      unlockedMissions,
      selectedMissionIds,
      reviewAwareness.topWeakPoint,
    );

    if (stabilizeMission) {
      return {
        mission: stabilizeMission,
        slotLabel: 'Stabilize',
        reason: buildStabilizeReason(reviewAwareness.topWeakPoint),
        ctaLabel: 'Open short pass',
        sessionMode: 'reinforce',
      };
    }
  }

  const remainingMissions = unlockedMissions.filter(
    (mission) =>
      !selectedMissionIds.has(mission.id) &&
      !reviewAwareness.recentlyReviewedMissionIds.has(mission.id),
  );
  const fallbackMissions = remainingMissions.length > 0
    ? remainingMissions
    : unlockedMissions.filter((mission) => !selectedMissionIds.has(mission.id));
  const completedCandidates = fallbackMissions.filter((mission) => {
    return getMissionProgressEntry(missionProgress, mission.id).completionCount > 0;
  });
  const alternateCompletedCandidates = completedCandidates.filter(
    (mission) => !reviewAwareness.recentlyCompletedMissionIds.has(mission.id),
  );
  const reinforceCandidates =
    alternateCompletedCandidates.length > 0
      ? alternateCompletedCandidates
      : completedCandidates;

  if (reinforceCandidates.length > 0) {
    const mission = reinforceCandidates.sort((left, right) => {
      const leftProgress = getMissionProgressEntry(missionProgress, left.id);
      const rightProgress = getMissionProgressEntry(missionProgress, right.id);

      if (leftProgress.completionCount !== rightProgress.completionCount) {
        return leftProgress.completionCount - rightProgress.completionCount;
      }

      const leftTime = leftProgress.lastCompletedAt
        ? Date.parse(leftProgress.lastCompletedAt)
        : -Infinity;
      const rightTime = rightProgress.lastCompletedAt
        ? Date.parse(rightProgress.lastCompletedAt)
        : -Infinity;

      return leftTime - rightTime;
    })[0];

    return {
      mission,
      slotLabel: 'Reinforce',
      reason: buildReinforcementReason(mission, missionProgress, reviewAwareness),
      ctaLabel: 'Open short pass',
      sessionMode: 'reinforce',
    };
  }

  const mission = fallbackMissions[0] ?? null;

  if (!mission) {
    return null;
  }

  return {
    mission,
    slotLabel: 'Light pass',
    reason: buildReinforcementReason(mission, missionProgress, reviewAwareness),
    ctaLabel:
      getMissionProgressEntry(missionProgress, mission.id).completionCount > 0
        ? 'Open short pass'
        : 'Open mission',
    sessionMode:
      getMissionProgressEntry(missionProgress, mission.id).completionCount > 0
        ? 'reinforce'
        : 'default',
  };
}

function buildReinforcementReason(
  mission: Mission,
  missionProgress: MissionProgressRecord,
  reviewAwareness: ReviewAwareness,
) {
  const progress = getMissionProgressEntry(missionProgress, mission.id);

  if (reviewAwareness.hasRecentReview && !reviewAwareness.isUrgent) {
    return 'You reviewed recently, so this uses a shorter follow-up pass instead of another full retry loop.';
  }

  if (progress.completionCount <= 1) {
    return 'You have only cleared this once, so a short alternate follow-up pass should make it stick better.';
  }

  return 'This is already in rotation, but it still has a lighter practice count than the rest, so use a short pass instead of replaying the full mission.';
}

function deriveReviewAwareness(
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

function selectTopWeakPoint(weakPointList: WeakPoint[]) {
  return [...weakPointList].sort((left, right) => {
    if (right.missCount !== left.missCount) {
      return right.missCount - left.missCount;
    }

    return Date.parse(right.lastMissedAt) - Date.parse(left.lastMissedAt);
  })[0] ?? null;
}

function selectTopWeakPointMission(
  unlockedMissions: Mission[],
  selectedMissionIds: Set<string>,
  topWeakPoint: WeakPoint | null,
) {
  if (!topWeakPoint) {
    return null;
  }

  return (
    unlockedMissions.find(
      (mission) =>
        mission.id === topWeakPoint.missionId && !selectedMissionIds.has(mission.id),
    ) ?? null
  );
}

function buildUrgentReviewReason(
  reviewAwareness: ReviewAwareness,
  repeatedWeakPointCount: number,
) {
  const weakPointCount = reviewAwareness.weakPointList.length;

  if (repeatedWeakPointCount > 0 && reviewAwareness.hasFreshWeakPoints) {
    return `${weakPointCount} weak point${weakPointCount === 1 ? '' : 's'} are open, including ${repeatedWeakPointCount} with repeated misses and fresh errors since your last review.`;
  }

  if (repeatedWeakPointCount > 0) {
    return `${weakPointCount} weak point${weakPointCount === 1 ? '' : 's'} are still open, and ${repeatedWeakPointCount} already have repeated misses.`;
  }

  return `${weakPointCount} weak point${weakPointCount === 1 ? '' : 's'} are open and still fresh, so retry them before taking on something broader.`;
}

function buildStabilizeReason(topWeakPoint: WeakPoint | null) {
  if (!topWeakPoint) {
    return 'This mission is tied to your most urgent open weak point, so it is the best support slot after review.';
  }

  const repeatedMisses = topWeakPoint.missCount > 1
    ? ` with ${topWeakPoint.missCount} recorded misses`
    : '';

  return `This mission owns your strongest open weak point${repeatedMisses}, so use one short stabilize pass instead of replaying the full lesson.`;
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
