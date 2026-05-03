import type { StarterContent } from '../../../lib/content/types';
import type { CapstoneProgressRecord } from '../../../lib/progress/capstoneProgress';
import type { MissionProgressRecord } from '../../../lib/progress/missionProgress';
import { filterBonusRecommendations } from './todayBonusRecommendations';
import { getTodayPlanItemKey } from './todayPlanKeys';
import {
  createRecommendationByKey,
  resolveTodayPlanState,
  type ContinueMissionSummary,
  type TodayPlanSnapshot,
  type TodayPlanState,
} from './todayPlanState';
import type { TodayRecommendation } from './todayRecommendations';

export type TodayRecommendationPools = {
  visibleRecommendations: TodayRecommendation[];
  liveCoreRecommendations: TodayRecommendation[];
  liveRecommendationByKey: Map<string, TodayRecommendation>;
  liveReviewRecommendation: TodayRecommendation | null;
};

export type TodayViewModel = {
  planState: TodayPlanState;
  bonusRecommendations: TodayRecommendation[];
  optionalContinueMission: ContinueMissionSummary | null;
};

export function resolveTodayRecommendationPools(
  recommendations: TodayRecommendation[],
  continueMission: ContinueMissionSummary | null,
): TodayRecommendationPools {
  const visibleRecommendations = filterContinueMissionRecommendation(
    recommendations,
    continueMission?.mission.id ?? null,
  );
  const coreEligibleRecommendations = visibleRecommendations.filter(isCoreRecommendation);
  const liveCoreRecommendations =
    coreEligibleRecommendations.length > 2
      ? coreEligibleRecommendations.slice(0, 2)
      : coreEligibleRecommendations;

  return {
    visibleRecommendations,
    liveCoreRecommendations,
    liveRecommendationByKey: createRecommendationByKey(visibleRecommendations),
    liveReviewRecommendation:
      recommendations.find((recommendation) => recommendation.kind === 'review') ?? null,
  };
}

export function resolveTodayViewModel({
  recommendationPools,
  todayPlanSnapshot,
  starterContent,
  missionProgress,
  capstoneProgress,
  completedPlanItemKeys,
  weakPointCount,
  continueMission,
}: {
  recommendationPools: TodayRecommendationPools;
  todayPlanSnapshot: TodayPlanSnapshot;
  starterContent: StarterContent;
  missionProgress: MissionProgressRecord;
  capstoneProgress: CapstoneProgressRecord;
  completedPlanItemKeys: Set<string>;
  weakPointCount: number;
  continueMission: ContinueMissionSummary | null;
}): TodayViewModel {
  const planState = resolveTodayPlanState({
    snapshot: todayPlanSnapshot,
    starterContent,
    liveCoreRecommendations: recommendationPools.liveCoreRecommendations,
    liveRecommendationByKey: recommendationPools.liveRecommendationByKey,
    liveReviewRecommendation: recommendationPools.liveReviewRecommendation,
    missionProgress,
    capstoneProgress,
    completedPlanItemKeys,
    weakPointCount,
    continueMission,
  });

  return {
    planState,
    bonusRecommendations: filterBonusRecommendations(
      recommendationPools.visibleRecommendations,
      {
        planKeys: planState.planKeys,
        missionIds: planState.planMissionIds,
        capstoneStoryIds: planState.planCapstoneStoryIds,
      },
    ),
    optionalContinueMission: resolveOptionalContinueMission(
      continueMission,
      planState.planKeys,
      planState.remainingCount,
    ),
  };
}

function resolveOptionalContinueMission(
  continueMission: ContinueMissionSummary | null,
  planKeys: Set<string>,
  remainingCount: number,
) {
  if (!continueMission || remainingCount !== 0) {
    return null;
  }

  const continuePlanKey = getTodayPlanItemKey({
    kind: 'mission',
    missionId: continueMission.mission.id,
    sessionMode: 'default',
  });

  return planKeys.has(continuePlanKey) ? null : continueMission;
}

function filterContinueMissionRecommendation(
  recommendations: TodayRecommendation[],
  continueMissionId: string | null,
) {
  if (!continueMissionId) {
    return recommendations;
  }

  return recommendations.filter((recommendation) => {
    return (
      recommendation.kind !== 'mission' ||
      recommendation.mission.id !== continueMissionId
    );
  });
}

function isCoreRecommendation(recommendation: TodayRecommendation) {
  return recommendation.priority !== 'bonus';
}
