import { describe, expect, it } from 'vitest';
import { getTodayPlanItemKey } from './todayPlanKeys';
import { isTodayPlanItemCompleteForStudyDay } from './todayPlanCompletion';

describe('today plan completion', () => {
  it('does not auto-complete a reinforce mission item from previous mission progress', () => {
    const reinforceKey = getTodayPlanItemKey({
      kind: 'mission',
      missionId: 'mission-grammar-topic-desu',
      sessionMode: 'reinforce',
    });

    expect(
      isTodayPlanItemCompleteForStudyDay(
        {
          key: reinforceKey,
          kind: 'mission',
        },
        new Set(),
      ),
    ).toBe(false);
  });

  it('marks today reinforce mission item complete only after the reinforce key is completed', () => {
    const reinforceKey = getTodayPlanItemKey({
      kind: 'mission',
      missionId: 'mission-grammar-topic-desu',
      sessionMode: 'reinforce',
    });

    expect(
      isTodayPlanItemCompleteForStudyDay(
        {
          key: reinforceKey,
          kind: 'mission',
        },
        new Set([reinforceKey]),
      ),
    ).toBe(true);
  });

  it('does not let a completed default key satisfy the same mission reinforce item', () => {
    const defaultKey = getTodayPlanItemKey({
      kind: 'mission',
      missionId: 'mission-grammar-topic-desu',
      sessionMode: 'default',
    });
    const reinforceKey = getTodayPlanItemKey({
      kind: 'mission',
      missionId: 'mission-grammar-topic-desu',
      sessionMode: 'reinforce',
    });

    expect(
      isTodayPlanItemCompleteForStudyDay(
        {
          key: reinforceKey,
          kind: 'mission',
        },
        new Set([defaultKey]),
      ),
    ).toBe(false);
    expect(
      isTodayPlanItemCompleteForStudyDay(
        {
          key: defaultKey,
          kind: 'mission',
        },
        new Set([reinforceKey]),
      ),
    ).toBe(false);
  });

  it('marks review complete only when today review key is completed', () => {
    expect(
      isTodayPlanItemCompleteForStudyDay(
        {
          key: getTodayPlanItemKey({ kind: 'review' }),
          kind: 'review',
        },
        new Set(),
      ),
    ).toBe(false);

    expect(
      isTodayPlanItemCompleteForStudyDay(
        {
          key: getTodayPlanItemKey({ kind: 'review' }),
          kind: 'review',
        },
        new Set([getTodayPlanItemKey({ kind: 'review' })]),
      ),
    ).toBe(true);
  });

  it('does not auto-complete a capstone item from global capstone progress alone', () => {
    const capstoneKey = getTodayPlanItemKey({
      kind: 'capstone',
      capstoneStoryId: 'capstone-pack-1',
      capstoneMode: 'closeout',
    });

    expect(
      isTodayPlanItemCompleteForStudyDay(
        {
          key: capstoneKey,
          kind: 'capstone',
        },
        new Set(),
      ),
    ).toBe(false);
    expect(
      isTodayPlanItemCompleteForStudyDay(
        {
          key: capstoneKey,
          kind: 'capstone',
        },
        new Set([capstoneKey]),
      ),
    ).toBe(true);
  });
});
