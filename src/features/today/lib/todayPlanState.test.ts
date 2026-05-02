import { describe, expect, it } from 'vitest';
import type { CapstoneStory, Mission } from '../../../lib/content/types';
import { getStarterContent } from '../../../lib/content/loader';
import { getEmptyCapstoneProgress } from '../../../lib/progress/capstoneProgress';
import {
  getEmptyMissionProgress,
  type MissionProgressRecord,
} from '../../../lib/progress/missionProgress';
import { filterBonusRecommendations } from './todayBonusRecommendations';
import { getTodayPlanItemKey } from './todayPlanKeys';
import type { TodayRecommendation } from './todayRecommendations';
import {
  createRecommendationByKey,
  createTodayPlanSnapshot,
  resolveTodayPlanState,
  type ContinueMissionSummary,
  type TodayPlanSnapshot,
} from './todayPlanState';

const starterContent = getStarterContent();

describe('resolveTodayPlanState', () => {
  it('does not mark a historically completed mission reinforce item done for today', () => {
    const mission = getMission('mission-grammar-topic-desu');
    const reinforceRecommendation = createMissionRecommendation(mission, 'reinforce');
    const state = resolveState({
      recommendations: [reinforceRecommendation],
      missionProgress: completeMissions(getEmptyMissionProgress(), [mission.id]),
    });

    expect(state.summaryItems).toEqual([
      expect.objectContaining({
        id: getTodayPlanItemKey({
          kind: 'mission',
          missionId: mission.id,
          sessionMode: 'reinforce',
        }),
        status: 'current',
      }),
    ]);
    expect(state.completedCount).toBe(0);
    expect(state.remainingCount).toBe(1);
  });

  it('keeps default and reinforce plan items distinct for the same mission', () => {
    const mission = getMission('mission-grammar-topic-desu');
    const defaultKey = getTodayPlanItemKey({
      kind: 'mission',
      missionId: mission.id,
      sessionMode: 'default',
    });
    const reinforceKey = getTodayPlanItemKey({
      kind: 'mission',
      missionId: mission.id,
      sessionMode: 'reinforce',
    });
    const state = resolveState({
      recommendations: [
        createMissionRecommendation(mission, 'default'),
        createMissionRecommendation(mission, 'reinforce'),
      ],
      completedPlanItemKeys: new Set([defaultKey]),
    });

    expect(state.summaryItems).toEqual([
      expect.objectContaining({
        id: defaultKey,
        status: 'done',
      }),
      expect.objectContaining({
        id: reinforceKey,
        status: 'current',
      }),
    ]);
    expect(state.completedCount).toBe(1);
    expect(state.remainingCount).toBe(1);
  });

  it('promotes an unfinished continue mission ahead of the remaining plan', () => {
    const plannedMission = getMission('mission-grammar-topic-desu');
    const continueMission = getMission('mission-listening-place-de');
    const state = resolveState({
      recommendations: [createMissionRecommendation(plannedMission, 'default')],
      continueMission: {
        mission: continueMission,
        detail: 'Resume listening item 1 of 2.',
      },
    });

    expect(state.summaryItems[0]).toEqual(
      expect.objectContaining({
        id: `continue:${continueMission.id}`,
        title: continueMission.title,
        status: 'current',
      }),
    );
    expect(state.primaryAction).toEqual({
      to: `/mission/${continueMission.id}`,
      state: { preserveScroll: true },
      label: 'Continue mission',
    });
    expect(state.remainingCount).toBe(2);
  });

  it('exposes plan key, mission, and capstone sets for bonus duplicate filtering', () => {
    const plannedMission = getMission('mission-grammar-topic-desu');
    const bonusMission = getMission('mission-listening-place-de');
    const capstoneStory = starterContent.capstoneStories[0];
    const plannedMissionRecommendation = createMissionRecommendation(
      plannedMission,
      'default',
    );
    const plannedCapstoneRecommendation = createCapstoneRecommendation(
      capstoneStory,
      'closeout',
    );
    const state = resolveState({
      recommendations: [
        plannedMissionRecommendation,
        plannedCapstoneRecommendation,
      ],
    });

    const filteredBonusRecommendations = filterBonusRecommendations(
      [
        createMissionRecommendation(plannedMission, 'reinforce'),
        createCapstoneRecommendation(capstoneStory, 'recombination'),
        createMissionRecommendation(bonusMission, 'default'),
      ],
      {
        planKeys: state.planKeys,
        missionIds: state.planMissionIds,
        capstoneStoryIds: state.planCapstoneStoryIds,
      },
    );

    expect(state.planKeys.has(getTodayPlanItemKey({
      kind: 'mission',
      missionId: plannedMission.id,
      sessionMode: 'default',
    }))).toBe(true);
    expect(state.planMissionIds.has(plannedMission.id)).toBe(true);
    expect(state.planCapstoneStoryIds.has(capstoneStory.id)).toBe(true);
    expect(filteredBonusRecommendations).toEqual([
      expect.objectContaining({
        kind: 'mission',
        id: bonusMission.id,
      }),
    ]);
  });

  it('selects the first unfinished plan item as the primary action', () => {
    const firstMission = getMission('mission-grammar-topic-desu');
    const secondMission = getMission('mission-listening-place-de');
    const completedKey = getTodayPlanItemKey({
      kind: 'mission',
      missionId: firstMission.id,
      sessionMode: 'default',
    });
    const state = resolveState({
      recommendations: [
        createMissionRecommendation(firstMission, 'default'),
        createMissionRecommendation(secondMission, 'default'),
      ],
      completedPlanItemKeys: new Set([completedKey]),
    });

    expect(state.primaryAction).toEqual({
      to: `/mission/${secondMission.id}`,
      state: undefined,
      label: 'Continue today',
    });
    expect(state.summaryItems).toEqual([
      expect.objectContaining({
        id: completedKey,
        status: 'done',
      }),
      expect.objectContaining({
        id: getTodayPlanItemKey({
          kind: 'mission',
          missionId: secondMission.id,
          sessionMode: 'default',
        }),
        status: 'current',
      }),
    ]);
  });

  it('uses completed plan item keys to mark summary items done', () => {
    const reviewRecommendation = createReviewRecommendation();
    const state = resolveState({
      recommendations: [reviewRecommendation],
      completedPlanItemKeys: new Set([getTodayPlanItemKey({ kind: 'review' })]),
    });

    expect(state.summaryItems).toEqual([
      expect.objectContaining({
        id: 'review-loop',
        meta: 'Review clear.',
        status: 'done',
      }),
    ]);
    expect(state.completedCount).toBe(1);
    expect(state.remainingCount).toBe(0);
    expect(state.primaryAction).toBeNull();
  });
});

function resolveState({
  recommendations,
  snapshot = createTodayPlanSnapshot(recommendations),
  missionProgress = getEmptyMissionProgress(),
  completedPlanItemKeys = new Set<string>(),
  continueMission = null,
  weakPointCount = 0,
  liveReviewRecommendation = null,
}: {
  recommendations: TodayRecommendation[];
  snapshot?: TodayPlanSnapshot;
  missionProgress?: MissionProgressRecord;
  completedPlanItemKeys?: Set<string>;
  continueMission?: ContinueMissionSummary | null;
  weakPointCount?: number;
  liveReviewRecommendation?: TodayRecommendation | null;
}) {
  return resolveTodayPlanState({
    snapshot,
    starterContent,
    liveCoreRecommendations: recommendations,
    liveRecommendationByKey: createRecommendationByKey([
      ...recommendations,
      ...(liveReviewRecommendation ? [liveReviewRecommendation] : []),
    ]),
    liveReviewRecommendation,
    missionProgress,
    capstoneProgress: getEmptyCapstoneProgress(),
    completedPlanItemKeys,
    weakPointCount,
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

function createMissionRecommendation(
  mission: Mission,
  sessionMode: 'default' | 'reinforce',
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
  };
}

function createCapstoneRecommendation(
  capstoneStory: CapstoneStory,
  capstoneMode: 'closeout' | 'recombination',
): TodayRecommendation {
  return {
    id: capstoneStory.id,
    kind: 'capstone',
    slotLabel: capstoneMode === 'closeout' ? 'Capstone' : 'Recombine',
    title: capstoneStory.title,
    reason: 'Reason',
    ctaLabel: 'Open capstone',
    to: `/capstone/${capstoneStory.id}`,
    capstoneStory,
    capstoneMode,
    lineCount: capstoneStory.lineIds.length,
    checkCount: capstoneStory.checkIds.length,
    estimatedMinutes: capstoneStory.estimatedMinutes,
    personalFocus: 'Story practice',
  };
}

function createReviewRecommendation(): TodayRecommendation {
  return {
    id: 'review-loop',
    kind: 'review',
    slotLabel: 'Review now',
    title: 'Review weak points',
    reason: 'Retry saved misses.',
    ctaLabel: 'Start review',
    to: '/review',
    weakPointCount: 2,
    batchSize: 2,
  };
}

function completeMissions(
  baseProgress: MissionProgressRecord,
  missionIds: string[],
): MissionProgressRecord {
  return {
    ...baseProgress,
    completedMissionIds: missionIds,
    completionCountsByMissionId: Object.fromEntries(
      missionIds.map((missionId) => [missionId, 1]),
    ),
    lastCompletedAtByMissionId: Object.fromEntries(
      missionIds.map((missionId) => [missionId, '2026-01-01T00:00:00.000Z']),
    ),
  };
}
