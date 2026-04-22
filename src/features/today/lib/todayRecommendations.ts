import type { Mission, StarterContent } from '../../../lib/content/types';
import {
  getMissionProgressEntry,
  type MissionProgressRecord,
} from '../../../lib/progress/missionProgress';
import type { ReviewLoopProgress } from '../../../lib/progress/reviewLoop';
import {
  getWeakPointList,
  type WeakPointStore,
} from '../../../lib/progress/weakPoints';
import { selectReviewBatch } from '../../review/lib/reviewBatch';

export const TODAY_RECOMMENDATION_LIMIT = 3;

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
    };

// Keep the heuristics intentionally small and readable:
// 1. Recommend Review first when there are unresolved weak points.
// 2. Recommend the next unlocked incomplete mission in starter order.
// 3. Recommend one reinforcement mission from completed or lightly practiced work.
// 4. If slots remain, fill them with the next least-practiced unlocked missions.
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

  const reviewRecommendation = getReviewRecommendation(
    starterContent,
    weakPoints,
    reviewLoopProgress,
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
      reason: 'This unlocked mission is still incomplete, so it is the cleanest next step.',
      ctaLabel: 'Open mission',
      to: `/mission/${nextMission.id}`,
      mission: nextMission,
    });
    selectedMissionIds.add(nextMission.id);
  }

  const reinforcementMission = selectReinforcementMission(
    unlockedMissions,
    missionProgress,
    selectedMissionIds,
  );

  if (reinforcementMission) {
    recommendations.push({
      id: reinforcementMission.id,
      kind: 'mission',
      slotLabel: 'Reinforce',
      title: reinforcementMission.title,
      reason: buildReinforcementReason(reinforcementMission, missionProgress),
      ctaLabel: 'Reinforce mission',
      to: `/mission/${reinforcementMission.id}`,
      mission: reinforcementMission,
    });
    selectedMissionIds.add(reinforcementMission.id);
  }

  if (recommendations.length >= limit) {
    return recommendations.slice(0, limit);
  }

  const remainingMissions = unlockedMissions
    .filter((mission) => !selectedMissionIds.has(mission.id))
    .sort((left, right) => {
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
          ? 'It is unlocked and still waiting, so it keeps the daily plan moving.'
          : 'It has less repetition than your other completed missions.',
      ctaLabel: 'Open mission',
      to: `/mission/${mission.id}`,
      mission,
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
  starterContent: StarterContent,
  weakPoints: WeakPointStore,
  reviewLoopProgress: ReviewLoopProgress,
): TodayRecommendation | null {
  const weakPointList = getWeakPointList(weakPoints);
  const reviewBatch = selectReviewBatch(weakPoints, starterContent);

  if (weakPointList.length === 0 || reviewBatch.length === 0) {
    return null;
  }

  const reviewReason = reviewLoopProgress.lastCompletedAt
    ? `${weakPointList.length} weak point${weakPointList.length === 1 ? '' : 's'} are still open after your last review pass, so start by retrying them.`
    : `${weakPointList.length} weak point${weakPointList.length === 1 ? '' : 's'} are waiting for a retry, so lead with a short review batch.`;

  return {
    id: 'review-loop',
    kind: 'review',
    slotLabel: 'Review',
    title: 'Retry weak spots first',
    reason: reviewReason,
    ctaLabel: 'Open review',
    to: '/review',
    weakPointCount: weakPointList.length,
    batchSize: reviewBatch.length,
  };
}

function selectReinforcementMission(
  unlockedMissions: Mission[],
  missionProgress: MissionProgressRecord,
  selectedMissionIds: Set<string>,
) {
  const remainingMissions = unlockedMissions.filter(
    (mission) => !selectedMissionIds.has(mission.id),
  );
  const completedCandidates = remainingMissions.filter((mission) => {
    return getMissionProgressEntry(missionProgress, mission.id).completionCount > 0;
  });

  if (completedCandidates.length > 0) {
    return completedCandidates.sort((left, right) => {
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
  }

  return remainingMissions[0] ?? null;
}

function buildReinforcementReason(
  mission: Mission,
  missionProgress: MissionProgressRecord,
) {
  const progress = getMissionProgressEntry(missionProgress, mission.id);

  if (progress.completionCount <= 1) {
    return 'You have only cleared this once, so one more pass will make it less brittle.';
  }

  return 'This mission is already in rotation, but it still has a lighter practice count than the rest.';
}
