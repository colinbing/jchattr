import { describe, expect, it } from 'vitest';
import type { Mission } from './types';
import { assertScenarioMissionContract } from './scenarioContracts';

describe('scenario mission contracts', () => {
  it('accepts a scenario mission whose metadata mirrors the output tasks', () => {
    expect(() => assertScenarioMissionContract(createScenarioMission())).not.toThrow();
  });

  it('rejects a scenario step order that drifts away from output tasks', () => {
    const mission = createScenarioMission({
      scenario: {
        steps: [
          {
            ...baseScenarioSteps[0],
            id: 'scenario-step-other',
          },
        ],
      },
    });

    expect(() => assertScenarioMissionContract(mission)).toThrow(
      'step 1 id "scenario-step-other" must match output task "scenario-step-1"',
    );
  });

  it('rejects scenario answers that do not mirror the linked output task', () => {
    const mission = createScenarioMission({
      scenario: {
        steps: [
          {
            ...baseScenarioSteps[0],
            acceptableAnswers: ['これはほんです。'],
          },
        ],
      },
    });

    expect(() => assertScenarioMissionContract(mission)).toThrow(
      'acceptable answers must match exactly',
    );
  });

  it('rejects scenario token patterns that do not mirror the linked output task', () => {
    const mission = createScenarioMission({
      scenario: {
        steps: [
          {
            ...baseScenarioSteps[0],
            requiredTokenPatterns: ['これ', 'が', 'ほん', 'です'],
          },
        ],
      },
    });

    expect(() => assertScenarioMissionContract(mission)).toThrow(
      'token pattern must match exactly',
    );
  });

  it('rejects scenario refs that are not mirrored by mission contentRefs', () => {
    const mission = createScenarioMission({
      scenario: {
        vocabIds: ['vocab-kore', 'vocab-hon', 'vocab-extra'],
      },
    });

    expect(() => assertScenarioMissionContract(mission)).toThrow(
      'vocab refs must match exactly',
    );
  });

  it('rejects source pack ids that are not sorted and unique', () => {
    const mission = createScenarioMission({
      scenario: {
        sourcePackIds: [2, 1],
      },
    });

    expect(() => assertScenarioMissionContract(mission)).toThrow(
      'sourcePackIds must be sorted',
    );
  });

  it('rejects scenario moves that the current output player cannot represent', () => {
    const mission = createScenarioMission({
      scenario: {
        steps: [
          {
            ...baseScenarioSteps[0],
            moveType: 'choose',
          },
        ],
      },
    });

    expect(() => assertScenarioMissionContract(mission)).toThrow('must use a typed move');
  });
});

const baseOutputTasks: NonNullable<Mission['outputTasks']> = [
  {
    id: 'scenario-step-1',
    prompt: 'Type: This is a book.',
    acceptableAnswers: ['これはほんです。', 'これはほんです'],
    evaluation: {
      tokenPatterns: [['これ', 'は', 'ほん', 'です']],
    },
  },
];

const baseScenarioSteps: NonNullable<Mission['scenario']>['steps'] = [
  {
    id: 'scenario-step-1',
    actor: 'learner',
    moveType: 'type',
    prompt: 'Say this is a book.',
    supportExampleIds: ['ex-kore-hon'],
    acceptableAnswers: ['これはほんです。', 'これはほんです'],
    requiredTokenPatterns: ['これ', 'は', 'ほん', 'です'],
    weakPointItemId: 'scenario-step-1',
  },
];

function createScenarioMission(
  overrides: {
    contentRefs?: Partial<Mission['contentRefs']>;
    outputTasks?: NonNullable<Mission['outputTasks']>;
    scenario?: Partial<NonNullable<Mission['scenario']>>;
    type?: Mission['type'];
  } = {},
): Mission {
  return {
    id: 'mission-scenario-test',
    type: overrides.type ?? 'output',
    title: 'Scenario: test',
    targetSkill: 'output-confidence',
    estimatedMinutes: 5,
    contentRefs: {
      grammarLessonIds: ['grammar-topic-desu'],
      vocabIds: ['vocab-kore', 'vocab-hon'],
      exampleIds: ['ex-kore-hon'],
      ...overrides.contentRefs,
    },
    outputTasks: overrides.outputTasks ?? baseOutputTasks,
    scenario: {
      kind: 'scenario',
      scenarioId: 'scenario-test',
      setting: 'classroom',
      communicativeGoal: 'Say one controlled classroom line.',
      sourcePackIds: [1],
      grammarLessonIds: ['grammar-topic-desu'],
      vocabIds: ['vocab-kore', 'vocab-hon'],
      exampleIds: ['ex-kore-hon'],
      steps: baseScenarioSteps,
      ...overrides.scenario,
    },
  };
}
