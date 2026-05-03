import { describe, expect, it } from 'vitest';
import type { Mission } from '../../../lib/content/types';
import { getStarterContent } from '../../../lib/content/loader';
import { getEmptyCapstoneProgress } from '../../../lib/progress/capstoneProgress';
import { getEmptyMissionProgress } from '../../../lib/progress/missionProgress';
import {
  createTodayPlanSnapshot,
  type ContinueMissionSummary,
} from './todayPlanState';
import type { TodayRecommendation } from './todayRecommendations';
import {
  resolveTodayRecommendationPools,
  resolveTodayViewModel,
} from './todayViewModel';

const starterContent = getStarterContent();

describe('resolveTodayRecommendationPools', () => {
  it('filters the active continue mission and caps live core recommendations at two', () => {
    const firstMission = getMission('mission-grammar-topic-desu');
    const continueMission = getMission('mission-listening-place-de');
    const thirdMission = getMission('mission-output-daily-lines');
    const bonusMission = getMission('mission-grammar-destination-ni');
    const pools = resolveTodayRecommendationPools(
      [
        createMissionRecommendation(firstMission),
        createMissionRecommendation(continueMission),
        createMissionRecommendation(thirdMission),
        createMissionRecommendation(bonusMission, 'default', 'bonus'),
      ],
      createContinueMission(continueMission),
    );

    expect(pools.visibleRecommendations.map((recommendation) => recommendation.id)).toEqual([
      firstMission.id,
      thirdMission.id,
      bonusMission.id,
    ]);
    expect(pools.liveCoreRecommendations.map((recommendation) => recommendation.id)).toEqual([
      firstMission.id,
      thirdMission.id,
    ]);
  });
});

describe('resolveTodayViewModel', () => {
  it('offers an optional continue mission after the core plan is complete', () => {
    const continueMission = createContinueMission(getMission('mission-listening-place-de'));
    const pools = resolveTodayRecommendationPools([], continueMission);
    const viewModel = resolveViewModel({
      recommendationPools: pools,
      continueMission,
    });

    expect(viewModel.planState.remainingCount).toBe(0);
    expect(viewModel.optionalContinueMission).toEqual(continueMission);
  });

  it('keeps an unfinished continue mission in the core plan while work remains', () => {
    const plannedMission = getMission('mission-grammar-topic-desu');
    const continueMission = createContinueMission(getMission('mission-listening-place-de'));
    const recommendations = [createMissionRecommendation(plannedMission)];
    const pools = resolveTodayRecommendationPools(recommendations, continueMission);
    const viewModel = resolveViewModel({
      recommendationPools: pools,
      continueMission,
    });

    expect(viewModel.planState.remainingCount).toBe(2);
    expect(viewModel.optionalContinueMission).toBeNull();
    expect(viewModel.planState.primaryAction).toEqual({
      to: `/mission/${continueMission.mission.id}`,
      state: { preserveScroll: true },
      label: 'Continue mission',
    });
  });

  it('filters bonus recommendations that duplicate the core plan', () => {
    const plannedMission = getMission('mission-grammar-topic-desu');
    const bonusMission = getMission('mission-listening-place-de');
    const recommendations = [
      createMissionRecommendation(plannedMission),
      createMissionRecommendation(plannedMission, 'reinforce', 'bonus'),
      createMissionRecommendation(bonusMission, 'default', 'bonus'),
    ];
    const pools = resolveTodayRecommendationPools(recommendations, null);
    const viewModel = resolveViewModel({
      recommendationPools: pools,
      continueMission: null,
    });

    expect(viewModel.bonusRecommendations.map((recommendation) => recommendation.id)).toEqual([
      bonusMission.id,
    ]);
  });
});

function resolveViewModel({
  recommendationPools,
  continueMission,
}: {
  recommendationPools: ReturnType<typeof resolveTodayRecommendationPools>;
  continueMission: ContinueMissionSummary | null;
}) {
  return resolveTodayViewModel({
    recommendationPools,
    todayPlanSnapshot: createTodayPlanSnapshot(recommendationPools.liveCoreRecommendations),
    starterContent,
    missionProgress: getEmptyMissionProgress(),
    capstoneProgress: getEmptyCapstoneProgress(),
    completedPlanItemKeys: new Set(),
    weakPointCount: 0,
    continueMission,
  });
}

function getMission(missionId: string) {
  const mission = starterContent.byId.missions[missionId];

  if (!mission) {
    throw new Error(`Missing test mission: ${missionId}`);
  }

  return mission;
}

function createContinueMission(mission: Mission): ContinueMissionSummary {
  return {
    mission,
    detail: 'Resume unfinished mission.',
  };
}

function createMissionRecommendation(
  mission: Mission,
  sessionMode: 'default' | 'reinforce' = 'default',
  priority: 'core' | 'bonus' = 'core',
): TodayRecommendation {
  return {
    id: mission.id,
    kind: 'mission',
    slotLabel: sessionMode === 'reinforce' ? 'Reinforce' : 'Next up',
    title: mission.title,
    reason: 'Reason',
    ctaLabel: 'Open mission',
    to: `/mission/${mission.id}`,
    mission,
    sessionMode,
    personalFocus: 'Practice lane',
    priority,
  };
}
