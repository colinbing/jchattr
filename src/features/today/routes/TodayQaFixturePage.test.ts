import { describe, expect, it } from 'vitest';
import {
  createTodayQaFixture,
  todayQaFixtureIds,
  type TodayQaFixtureId,
} from './TodayQaFixturePage';

describe('Today QA fixtures', () => {
  it('keeps the required dev QA fixture states available', () => {
    expect(todayQaFixtureIds).toEqual([
      'no-bonus',
      'one-bonus',
      'review-return',
      'reinforce-plan',
      'completed-summary',
      'completed-no-bonus',
    ]);
  });

  it('represents review return as unresolved work without queue-clear copy', () => {
    const fixture = createTodayQaFixture('review-return');

    expect(fixture.remainingMinutes).toBeGreaterThan(0);
    expect(fixture.items.some((item) => item.status !== 'done')).toBe(true);
    expect(fixture.items.map((item) => item.meta).join(' ')).toContain('Review pass done.');
    expect(JSON.stringify(fixture)).not.toContain('Review clear.');
  });

  it('includes a completed core state with no bonus recommendations', () => {
    const fixture = createTodayQaFixture('completed-no-bonus');

    expect(fixture.remainingMinutes).toBe(0);
    expect(fixture.bonusRecommendations).toHaveLength(0);
    expect(fixture.items.every((item) => item.status === 'done')).toBe(true);
    expect(fixture.supportCard?.body).toContain('No extra slot is needed right now.');
  });

  it('does not reuse ids across fixture definitions', () => {
    const fixtureIds = new Set<TodayQaFixtureId>();
    const itemIds = new Set<string>();

    todayQaFixtureIds.forEach((id) => {
      const fixture = createTodayQaFixture(id);
      expect(fixtureIds.has(fixture.id)).toBe(false);
      fixtureIds.add(fixture.id);

      fixture.items.forEach((item) => {
        expect(itemIds.has(`${fixture.id}:${item.id}`)).toBe(false);
        itemIds.add(`${fixture.id}:${item.id}`);
      });
    });
  });
});
