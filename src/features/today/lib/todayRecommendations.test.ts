import { describe, expect, it } from 'vitest';
import { getEmptyCapstoneProgress } from '../../../lib/progress/capstoneProgress';
import { getEmptyMissionProgress, type MissionProgressRecord } from '../../../lib/progress/missionProgress';
import { getEmptyReviewLoopProgress } from '../../../lib/progress/reviewLoop';
import {
  getWeakPointKey,
  type WeakPoint,
  type WeakPointStore,
} from '../../../lib/progress/weakPoints';
import { getStarterContent } from '../../../lib/content/loader';
import { deriveTodayRecommendations } from './todayRecommendations';

const starterContent = getStarterContent();
const emptyWeakPoints: WeakPointStore = {
  version: 2,
  weakPointsByKey: {},
};

describe('deriveTodayRecommendations', () => {
  it('recommends review when resolvable weak points exist', () => {
    const recommendations = deriveTodayRecommendations(
      starterContent,
      getEmptyMissionProgress(),
      createWeakPointStore({
        itemId: 'drill-topic-1',
        itemType: 'grammar-drill',
        missionId: 'mission-grammar-topic-desu',
        contentId: 'grammar-topic-desu',
        missCount: 1,
        lastMissedAt: new Date().toISOString(),
      }),
      getEmptyReviewLoopProgress(),
      getEmptyCapstoneProgress(),
    );

    expect(recommendations[0]?.kind).toBe('review');
  });

  it('recommends an unlocked incomplete mission', () => {
    const recommendations = deriveTodayRecommendations(
      starterContent,
      getEmptyMissionProgress(),
      emptyWeakPoints,
      getEmptyReviewLoopProgress(),
      getEmptyCapstoneProgress(),
    );

    expect(recommendations.some((recommendation) => recommendation.id === 'mission-grammar-topic-desu')).toBe(true);
  });

  it('does not recommend a locked mission before its requirement is completed', () => {
    const recommendations = deriveTodayRecommendations(
      starterContent,
      getEmptyMissionProgress(),
      emptyWeakPoints,
      getEmptyReviewLoopProgress(),
      getEmptyCapstoneProgress(),
      { limit: 20 },
    );

    expect(recommendations.some((recommendation) => recommendation.id === 'mission-output-daily-lines')).toBe(false);
  });

  it('can recommend a mission after its required mission is completed', () => {
    const progress = completeMissions(getEmptyMissionProgress(), ['mission-grammar-topic-desu']);
    const recommendations = deriveTodayRecommendations(
      starterContent,
      progress,
      emptyWeakPoints,
      getEmptyReviewLoopProgress(),
      getEmptyCapstoneProgress(),
      { limit: 20 },
    );

    expect(recommendations.some((recommendation) => recommendation.id === 'mission-output-daily-lines')).toBe(true);
  });
});

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

function createWeakPointStore(weakPoint: WeakPoint): WeakPointStore {
  return {
    version: 2,
    weakPointsByKey: {
      [getWeakPointKey(weakPoint)]: weakPoint,
    },
  };
}
