import { describe, expect, it, vi } from 'vitest';
import { contentPacks } from '../../../content/contentPacks';
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

  it('puts urgent review before pushing farther into the path', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-02T12:00:00.000Z'));

    try {
      const recommendations = deriveTodayRecommendations(
        starterContent,
        getEmptyMissionProgress(),
        createWeakPointStore([
          createWeakPoint({
            itemId: 'drill-topic-1',
            lastMissedAt: '2026-05-02T11:55:00.000Z',
          }),
          createWeakPoint({
            itemId: 'drill-topic-2',
            lastMissedAt: '2026-05-02T11:56:00.000Z',
          }),
          createWeakPoint({
            itemId: 'output-self-intro',
            itemType: 'output-task',
            missionId: 'mission-output-daily-lines',
            contentId: 'output-self-intro',
            lastMissedAt: '2026-05-02T11:57:00.000Z',
          }),
        ]),
        getEmptyReviewLoopProgress(),
        getEmptyCapstoneProgress(),
      );

      expect(recommendations[0]).toMatchObject({
        kind: 'review',
        slotLabel: 'Review now',
      });
      expect(recommendations[1]).toMatchObject({
        kind: 'mission',
        sessionMode: 'default',
      });
    } finally {
      vi.useRealTimers();
    }
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

  it('does not put scenario application missions into Today mission recommendations', () => {
    const nonScenarioMissionIds = starterContent.missions
      .filter((mission) => mission.scenario?.kind !== 'scenario')
      .map((mission) => mission.id);
    const recommendations = deriveTodayRecommendations(
      starterContent,
      completeMissions(getEmptyMissionProgress(), nonScenarioMissionIds),
      emptyWeakPoints,
      getEmptyReviewLoopProgress(),
      getEmptyCapstoneProgress(),
      { limit: 100 },
    );

    expect(
      recommendations
        .filter((recommendation) => recommendation.kind === 'mission')
        .every((recommendation) => recommendation.mission.scenario?.kind !== 'scenario'),
    ).toBe(true);
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

  it('recommends a capstone when its source missions are complete', () => {
    const progress = completeMissions(
      getEmptyMissionProgress(),
      getMissionIdsForPackNumbers([1, 2, 3, 4, 5]),
    );
    const recommendations = deriveTodayRecommendations(
      starterContent,
      progress,
      emptyWeakPoints,
      getEmptyReviewLoopProgress(),
      getEmptyCapstoneProgress(),
      { limit: 10 },
    );

    expect(
      recommendations.some(
        (recommendation) =>
          recommendation.kind === 'capstone' &&
          recommendation.id === 'capstone-story-ch01-first-day' &&
          recommendation.capstoneMode === 'closeout',
      ),
    ).toBe(true);
  });

  it('does not recommend capstone closeout before source missions are complete', () => {
    const recommendations = deriveTodayRecommendations(
      starterContent,
      completeMissions(getEmptyMissionProgress(), ['mission-grammar-topic-desu']),
      emptyWeakPoints,
      getEmptyReviewLoopProgress(),
      getEmptyCapstoneProgress(),
      { limit: 10 },
    );

    expect(
      recommendations.some(
        (recommendation) =>
          recommendation.kind === 'capstone' &&
          recommendation.capstoneMode === 'closeout',
      ),
    ).toBe(false);
  });

  it('holds capstone closeout when review is urgent', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-02T12:00:00.000Z'));

    try {
      const recommendations = deriveTodayRecommendations(
        starterContent,
        completeMissions(
          getEmptyMissionProgress(),
          getMissionIdsForPackNumbers([1, 2, 3, 4, 5]),
        ),
        createWeakPointStore([
          createWeakPoint({
            itemId: 'drill-topic-1',
            lastMissedAt: '2026-05-02T11:55:00.000Z',
          }),
          createWeakPoint({
            itemId: 'drill-topic-2',
            lastMissedAt: '2026-05-02T11:56:00.000Z',
          }),
          createWeakPoint({
            itemId: 'output-self-intro',
            itemType: 'output-task',
            missionId: 'mission-output-daily-lines',
            contentId: 'output-self-intro',
            lastMissedAt: '2026-05-02T11:57:00.000Z',
          }),
        ]),
        getEmptyReviewLoopProgress(),
        getEmptyCapstoneProgress(),
        { limit: 10 },
      );

      expect(recommendations[0]?.kind).toBe('review');
      expect(
        recommendations.some(
          (recommendation) =>
            recommendation.kind === 'capstone' &&
            recommendation.capstoneMode === 'closeout',
        ),
      ).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });

  it('keeps completed missions available as reinforcement without a focus-mode option', () => {
    const progress = completeMissions(getEmptyMissionProgress(), [
      'mission-grammar-topic-desu',
      'mission-listening-place-de',
      'mission-output-daily-lines',
    ]);
    const recommendations = deriveTodayRecommendations(
      starterContent,
      progress,
      emptyWeakPoints,
      getEmptyReviewLoopProgress(),
      getEmptyCapstoneProgress(),
      { limit: 10 },
    );

    expect(
      recommendations.some(
        (recommendation) =>
          recommendation.kind === 'mission' &&
          recommendation.sessionMode === 'reinforce',
      ),
    ).toBe(true);
  });

  it('keeps unresolved weak points available for future review after today review key is satisfied', () => {
    const recommendations = deriveTodayRecommendations(
      starterContent,
      getEmptyMissionProgress(),
      createWeakPointStore([
        createWeakPoint({
          itemId: 'drill-topic-1',
          missCount: 2,
        }),
      ]),
      {
        ...getEmptyReviewLoopProgress(),
        completedBatchCount: 1,
        lastCompletedAt: '2026-05-02T12:00:00.000Z',
        lastCompletedItemIds: ['drill-topic-1'],
      },
      getEmptyCapstoneProgress(),
    );

    expect(recommendations[0]).toMatchObject({
      kind: 'review',
      id: 'review-loop',
    });
  });
});

function getMissionIdsForPackNumbers(packNumbers: number[]) {
  const selectedPackNumbers = new Set(packNumbers);

  return contentPacks
    .filter((pack) => selectedPackNumbers.has(pack.packNumber))
    .flatMap((pack) => pack.missionIds);
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

function createWeakPoint(overrides: Partial<WeakPoint>): WeakPoint {
  return {
    itemId: 'drill-topic-1',
    itemType: 'grammar-drill',
    missionId: 'mission-grammar-topic-desu',
    contentId: 'grammar-topic-desu',
    missCount: 1,
    lastMissedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function createWeakPointStore(weakPoint: WeakPoint | WeakPoint[]): WeakPointStore {
  const weakPoints = Array.isArray(weakPoint) ? weakPoint : [weakPoint];

  return {
    version: 2,
    weakPointsByKey: Object.fromEntries(
      weakPoints.map((item) => [getWeakPointKey(item), item]),
    ),
  };
}
