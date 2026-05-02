import { describe, expect, it } from 'vitest';
import { getTodayPlanItemKey } from './todayPlanKeys';

describe('today plan keys', () => {
  it('keeps default and reinforce entries for the same mission distinct', () => {
    const missionId = 'mission-grammar-topic-desu';

    expect(
      getTodayPlanItemKey({
        kind: 'mission',
        missionId,
        sessionMode: 'default',
      }),
    ).toBe('mission:mission-grammar-topic-desu:default');
    expect(
      getTodayPlanItemKey({
        kind: 'mission',
        missionId,
        sessionMode: 'reinforce',
      }),
    ).toBe('mission:mission-grammar-topic-desu:reinforce');
  });

  it('uses stable keys for review, mission, and capstone plan items', () => {
    expect(getTodayPlanItemKey({ kind: 'review' })).toBe('review-loop');
    expect(
      getTodayPlanItemKey({
        kind: 'mission',
        missionId: 'mission-grammar-topic-desu',
      }),
    ).toBe('mission:mission-grammar-topic-desu:default');
    expect(
      getTodayPlanItemKey({
        kind: 'capstone',
        capstoneStoryId: 'capstone-pack-1',
      }),
    ).toBe('capstone:capstone-pack-1:closeout');
  });

  it('keeps closeout and recombination entries for the same capstone distinct', () => {
    const capstoneStoryId = 'capstone-pack-1';

    expect(
      getTodayPlanItemKey({
        kind: 'capstone',
        capstoneStoryId,
        capstoneMode: 'closeout',
      }),
    ).toBe('capstone:capstone-pack-1:closeout');
    expect(
      getTodayPlanItemKey({
        kind: 'capstone',
        capstoneStoryId,
        capstoneMode: 'recombination',
      }),
    ).toBe('capstone:capstone-pack-1:recombination');
  });
});
