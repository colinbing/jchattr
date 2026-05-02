import { describe, expect, it } from 'vitest';
import { shouldRecreateTodayPlanSnapshotForLiveRecommendations } from './todayPlanSnapshot';

describe('today plan snapshot persistence', () => {
  it('keeps the same study-day snapshot when live recommendations shift after local progress changes', () => {
    expect(
      shouldRecreateTodayPlanSnapshotForLiveRecommendations({
        snapshotKeys: ['mission:mission-grammar-topic-desu:default'],
        liveCoreKeys: ['mission:mission-grammar-destination-ni:default'],
        hasLocalStudyState: true,
      }),
    ).toBe(false);
  });

  it('recreates the initial snapshot when there is no local study state and recommendations shift', () => {
    expect(
      shouldRecreateTodayPlanSnapshotForLiveRecommendations({
        snapshotKeys: ['mission:mission-grammar-topic-desu:default'],
        liveCoreKeys: ['mission:mission-grammar-destination-ni:default'],
        hasLocalStudyState: false,
      }),
    ).toBe(true);
  });
});
