import { describe, expect, it } from 'vitest';
import { getStarterContent } from '../../../lib/content/loader';
import type { TodayRecommendation } from './todayRecommendations';
import {
  filterBonusRecommendations,
  getTodayRecommendationPlanKey,
} from './todayBonusRecommendations';

const starterContent = getStarterContent();

describe('filterBonusRecommendations', () => {
  it('does not show the same mission as both a core item and a bonus option', () => {
    const coreMission = starterContent.missions[0];
    const bonusMission = starterContent.missions[1];
    const coreRecommendation = createMissionRecommendation(coreMission, 'default');
    const duplicateReinforceRecommendation = createMissionRecommendation(
      coreMission,
      'reinforce',
    );
    const distinctBonusRecommendation = createMissionRecommendation(bonusMission, 'default');

    const bonusRecommendations = filterBonusRecommendations(
      [duplicateReinforceRecommendation, distinctBonusRecommendation],
      {
        planKeys: new Set([getTodayRecommendationPlanKey(coreRecommendation)]),
        missionIds: new Set([coreMission.id]),
        capstoneStoryIds: new Set(),
      },
    );

    expect(bonusRecommendations).toEqual([distinctBonusRecommendation]);
  });
});

function createMissionRecommendation(
  mission: typeof starterContent.missions[number],
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
