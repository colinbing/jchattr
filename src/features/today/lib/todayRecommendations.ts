import type { StarterContent } from '../../../lib/content/types';
import {
  getMissionProgressEntry,
  type MissionProgressRecord,
} from '../../../lib/progress/missionProgress';
import type { CapstoneProgressRecord } from '../../../lib/progress/capstoneProgress';
import type { ReviewLoopProgress } from '../../../lib/progress/reviewLoop';
import type { WeakPointStore } from '../../../lib/progress/weakPoints';
import {
  getCapstoneRecommendation,
  getCapstoneRecombinationRecommendation,
} from './todayCapstoneRecommendation';
import {
  buildMissionPersonalization,
  buildNextMissionReason,
  createMissionRecommendationContextById,
  getFallbackReinforcementAnchor,
  isMissionUnlocked,
  isScenarioMission,
  selectSupportMission,
  sortRemainingMissionsByRecommendationPriority,
} from './todayMissionRecommendation';
import {
  deriveReviewAwareness,
  getReviewRecommendation,
} from './todayRecommendationReview';
import type {
  TodayRecommendation,
  TodayRecommendationOptions,
} from './todayRecommendationTypes';

export type {
  TodayRecommendation,
  TodayRecommendationOptions,
  TodayRecommendationPriority,
} from './todayRecommendationTypes';
export { isMissionUnlocked } from './todayMissionRecommendation';

export const TODAY_RECOMMENDATION_LIMIT = 3;

// Keep the heuristics intentionally small and readable:
// 1. Recommend Review first when there are unresolved weak points.
// 2. Mark review as urgent when weak points are fresh, repeated, or numerous.
// 3. Recommend the next unlocked incomplete mission in starter order.
// 4. When a chapter is finished, add its capstone as a closeout only if Review is not urgent.
// 5. Once the capstone is complete, offer bonus story-mode or recombination rereads through the same capstone surface.
// 6. Use the third slot to stabilize the mission tied to the top open weak point when review is urgent.
// 7. Otherwise recommend one reinforcement mission, preferring related alternate missions by target skill and linked grammar tags.
// 8. If slots remain, fill them with the next least-practiced unlocked missions, while lightly de-prioritizing just-reviewed missions.
export function deriveTodayRecommendations(
  starterContent: StarterContent,
  missionProgress: MissionProgressRecord,
  weakPoints: WeakPointStore,
  reviewLoopProgress: ReviewLoopProgress,
  capstoneProgress?: CapstoneProgressRecord,
  options: TodayRecommendationOptions = {},
): TodayRecommendation[] {
  const limit = options.limit ?? TODAY_RECOMMENDATION_LIMIT;
  const recommendations: TodayRecommendation[] = [];
  const missionContextById = createMissionRecommendationContextById(starterContent);
  const selectedMissionIds = new Set<string>();
  const unlockedMissions = starterContent.missions.filter(
    (mission) => !isScenarioMission(mission) && isMissionUnlocked(mission, missionProgress),
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
    const nextMissionPersonalization = buildMissionPersonalization(
      starterContent,
      nextMission,
      missionProgress,
      reviewAwareness,
      missionContextById,
    );

    recommendations.push({
      id: nextMission.id,
      kind: 'mission',
      slotLabel: 'Next up',
      title: nextMission.title,
      reason: buildNextMissionReason(
        Boolean(reviewRecommendation),
        reviewAwareness,
        nextMissionPersonalization,
      ),
      ctaLabel: 'Open mission',
      to: `/mission/${nextMission.id}`,
      mission: nextMission,
      sessionMode: 'default',
      personalFocus: nextMissionPersonalization.focus,
    });
    selectedMissionIds.add(nextMission.id);
  }

  const capstoneRecommendation = getCapstoneRecommendation(
    starterContent,
    missionProgress,
    capstoneProgress,
    reviewAwareness,
  );

  if (capstoneRecommendation) {
    recommendations.push(capstoneRecommendation);
  }

  const recombinationRecommendation = getCapstoneRecombinationRecommendation(
    starterContent,
    missionProgress,
    capstoneProgress,
    reviewAwareness,
    Boolean(capstoneRecommendation),
  );

  if (recombinationRecommendation) {
    recommendations.push(recombinationRecommendation);
  }

  const supportMission = selectSupportMission(
    unlockedMissions,
    missionProgress,
    selectedMissionIds,
    reviewAwareness,
    missionContextById,
    nextMission
      ? { mission: nextMission, source: 'next-step' }
      : getFallbackReinforcementAnchor(
          unlockedMissions,
          selectedMissionIds,
          reviewAwareness.topWeakPoint,
        ),
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
      personalFocus: buildMissionPersonalization(
        starterContent,
        supportMission.mission,
        missionProgress,
        reviewAwareness,
        missionContextById,
      ).focus,
    });
    selectedMissionIds.add(supportMission.mission.id);
  }

  if (recommendations.length >= limit) {
    return recommendations.slice(0, limit);
  }

  const remainingMissions = sortRemainingMissionsByRecommendationPriority(
    unlockedMissions.filter((mission) => !selectedMissionIds.has(mission.id)),
    starterContent,
    missionProgress,
    reviewAwareness,
  );

  remainingMissions.forEach((mission) => {
    if (recommendations.length >= limit) {
      return;
    }

    const progress = getMissionProgressEntry(missionProgress, mission.id);
    const slotLabel = progress.completionCount === 0 ? 'Keep moving' : 'Light pass';
    const baseReason =
      progress.completionCount === 0
        ? 'This is another open step if you want to keep the path moving.'
        : 'This has had lighter practice than your other completed missions.';

    recommendations.push({
      id: mission.id,
      kind: 'mission',
      slotLabel,
      title: mission.title,
      reason: baseReason,
      ctaLabel: 'Open mission',
      to: `/mission/${mission.id}`,
      mission,
      sessionMode: progress.completionCount > 0 ? 'reinforce' : 'default',
      personalFocus: buildMissionPersonalization(
        starterContent,
        mission,
        missionProgress,
        reviewAwareness,
        missionContextById,
      ).focus,
    });
  });

  return recommendations.slice(0, limit);
}
