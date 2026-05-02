import { describe, expect, it } from 'vitest';
import type { Mission } from '../../../lib/content/types';
import { getApplicationMissionIdsForPackRange } from './missionLibraryStructure';

describe('getApplicationMissionIdsForPackRange', () => {
  it('returns only scenario missions whose source packs overlap the chapter range', () => {
    const missions = [
      scenarioMission('scenario-early', [1, 2, 3]),
      scenarioMission('scenario-late', [24, 25]),
      regularMission('regular-output'),
      scenarioMission('scenario-missing-range', []),
    ];

    expect(getApplicationMissionIdsForPackRange(missions, 1, 5)).toEqual([
      'scenario-early',
    ]);
    expect(getApplicationMissionIdsForPackRange(missions, 21, 25)).toEqual([
      'scenario-late',
    ]);
  });
});

function scenarioMission(id: string, sourcePackIds: number[]) {
  return {
    id,
    type: 'output',
    scenario: {
      kind: 'scenario',
      sourcePackIds,
    },
  } as Mission;
}

function regularMission(id: string) {
  return {
    id,
    type: 'output',
  } as Mission;
}
