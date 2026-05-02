import { describe, expect, it } from 'vitest';
import type { Mission, ScenarioSetting } from './types';
import { createScenarioInventory, formatPackRanges } from './scenarioInventory';

describe('scenario inventory', () => {
  it('summarizes scenario coverage by setting and pack', () => {
    const inventory = createScenarioInventory(
      [
        scenarioMission('mission-scenario-class', 'classroom', [1, 2]),
        scenarioMission('mission-scenario-store', 'store', [4]),
        regularMission('mission-output-regular'),
      ],
      [1, 2, 3, 4],
    );

    expect(inventory.scenarioMissions).toEqual([
      expect.objectContaining({
        missionId: 'mission-scenario-class',
        setting: 'classroom',
        sourcePackIds: [1, 2],
        stepCount: 1,
      }),
      expect.objectContaining({
        missionId: 'mission-scenario-store',
        setting: 'store',
        sourcePackIds: [4],
        stepCount: 1,
      }),
    ]);
    expect(inventory.settingCounts).toEqual({
      classroom: 1,
      store: 1,
    });
    expect(inventory.packCoverage).toEqual([
      { packNumber: 1, scenarioMissionIds: ['mission-scenario-class'] },
      { packNumber: 2, scenarioMissionIds: ['mission-scenario-class'] },
      { packNumber: 3, scenarioMissionIds: [] },
      { packNumber: 4, scenarioMissionIds: ['mission-scenario-store'] },
    ]);
    expect(inventory.uncoveredPackRanges).toEqual(['3']);
    expect(inventory.gaps).toEqual([
      {
        severity: 'warning',
        scope: 'Packs 3',
        message: 'No scenario/application mission is linked to this pack range.',
      },
    ]);
  });

  it('flags source packs outside the shipped pack registry', () => {
    const inventory = createScenarioInventory(
      [scenarioMission('mission-scenario-travel', 'travel', [2, 99])],
      [1, 2],
    );

    expect(inventory.gaps).toEqual([
      {
        severity: 'warning',
        scope: 'Packs 1',
        message: 'No scenario/application mission is linked to this pack range.',
      },
      {
        severity: 'warning',
        scope: 'mission-scenario-travel',
        message: 'References source pack 99 outside the shipped pack registry.',
      },
    ]);
  });

  it('flags an empty scenario lane', () => {
    const inventory = createScenarioInventory([regularMission('mission-output-regular')], [1, 2]);

    expect(inventory.scenarioMissions).toEqual([]);
    expect(inventory.uncoveredPackRanges).toEqual(['1-2']);
    expect(inventory.gaps).toEqual([
      {
        severity: 'warning',
        scope: 'Scenario inventory',
        message: 'No scenario/application missions exist yet.',
      },
      {
        severity: 'warning',
        scope: 'Packs 1-2',
        message: 'No scenario/application mission is linked to this pack range.',
      },
    ]);
  });

  it('formats contiguous pack ranges compactly', () => {
    expect(formatPackRanges([5, 1, 2, 3, 7, 8, 8])).toEqual(['1-3', '5', '7-8']);
  });
});

function scenarioMission(
  id: string,
  setting: ScenarioSetting,
  sourcePackIds: number[],
): Mission {
  return {
    id,
    type: 'output',
    title: id,
    targetSkill: 'output-confidence',
    estimatedMinutes: 5,
    contentRefs: {
      grammarLessonIds: ['grammar-test'],
      vocabIds: ['vocab-test'],
      exampleIds: ['ex-test'],
    },
    unlockRules: {
      requiredMissionIds: ['mission-required'],
    },
    outputTasks: [
      {
        id: `${id}-step`,
        prompt: 'Type one line.',
        acceptableAnswers: ['これはほんです。'],
      },
    ],
    scenario: {
      kind: 'scenario',
      scenarioId: id.replace('mission-', ''),
      setting,
      communicativeGoal: 'Practice one controlled move.',
      sourcePackIds,
      grammarLessonIds: ['grammar-test'],
      vocabIds: ['vocab-test'],
      exampleIds: ['ex-test'],
      steps: [
        {
          id: `${id}-step`,
          actor: 'learner',
          moveType: 'type',
          prompt: 'Type one line.',
          supportExampleIds: ['ex-test'],
          acceptableAnswers: ['これはほんです。'],
        },
      ],
    },
  };
}

function regularMission(id: string): Mission {
  return {
    id,
    type: 'output',
    title: id,
    targetSkill: 'output-confidence',
    estimatedMinutes: 5,
    contentRefs: {
      exampleIds: ['ex-test'],
    },
    outputTasks: [
      {
        id: `${id}-task`,
        prompt: 'Type one line.',
        acceptableAnswers: ['これはほんです。'],
      },
    ],
  };
}
