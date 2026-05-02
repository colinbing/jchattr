import type { TodayRecommendation } from './todayRecommendations';
import { getTodayPlanItemKey } from './todayPlanKeys';

export type TodayBonusExclusions = {
  planKeys: ReadonlySet<string>;
  missionIds: ReadonlySet<string>;
  capstoneStoryIds: ReadonlySet<string>;
};

export function filterBonusRecommendations(
  recommendations: TodayRecommendation[],
  exclusions: TodayBonusExclusions,
) {
  return recommendations.filter((recommendation) => {
    if (exclusions.planKeys.has(getTodayRecommendationPlanKey(recommendation))) {
      return false;
    }

    if (
      recommendation.kind === 'mission' &&
      exclusions.missionIds.has(recommendation.mission.id)
    ) {
      return false;
    }

    if (
      recommendation.kind === 'capstone' &&
      exclusions.capstoneStoryIds.has(recommendation.capstoneStory.id)
    ) {
      return false;
    }

    return true;
  });
}

export function getTodayRecommendationPlanKey(recommendation: TodayRecommendation) {
  if (recommendation.kind === 'review') {
    return getTodayPlanItemKey({ kind: 'review' });
  }

  if (recommendation.kind === 'capstone') {
    return getTodayPlanItemKey({
      kind: 'capstone',
      capstoneStoryId: recommendation.capstoneStory.id,
      capstoneMode: recommendation.capstoneMode,
    });
  }

  return getTodayPlanItemKey({
    kind: 'mission',
    missionId: recommendation.mission.id,
    sessionMode: recommendation.sessionMode,
  });
}
