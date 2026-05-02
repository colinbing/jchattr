import { describe, expect, it } from 'vitest';
import type { Mission, OutputTask } from '../../../lib/content/types';
import { evaluateOutputResponse } from '../../../lib/outputEvaluation';
import { deriveScenarioAttemptPlan, evaluateScenarioStep } from './scenarioAttempt';

const firstTask = {
  id: 'scenario-step-1',
  prompt: 'Type: This is a book.',
  acceptableAnswers: ['これはほんです。', 'これはほんです'],
  evaluation: {
    tokenPatterns: [['これ', 'は', 'ほん', 'です']],
  },
} satisfies OutputTask;

const secondTask = {
  id: 'scenario-step-2',
  prompt: 'Type: That is homework.',
  acceptableAnswers: ['それはしゅくだいです。', 'それはしゅくだいです'],
  evaluation: {
    tokenPatterns: [['それ', 'は', 'しゅくだい', 'です']],
  },
} satisfies OutputTask;

const scenarioMission = {
  id: 'mission-scenario-test',
  type: 'output',
  title: 'Scenario: test',
  targetSkill: 'output-confidence',
  estimatedMinutes: 5,
  contentRefs: {
    grammarLessonIds: ['grammar-topic-desu'],
    vocabIds: ['vocab-kore', 'vocab-hon'],
    exampleIds: ['ex-kore-hon'],
  },
  outputTasks: [firstTask, secondTask],
  scenario: {
    kind: 'scenario',
    scenarioId: 'scenario-test',
    setting: 'classroom',
    communicativeGoal: 'Say two controlled classroom lines.',
    sourcePackIds: [1],
    grammarLessonIds: ['grammar-topic-desu'],
    vocabIds: ['vocab-kore', 'vocab-hon'],
    exampleIds: ['ex-kore-hon'],
    steps: [
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
      {
        id: 'scenario-step-2',
        actor: 'learner',
        moveType: 'type',
        prompt: 'Say that is homework.',
        supportExampleIds: ['ex-sore-shukudai'],
        acceptableAnswers: ['それはしゅくだいです。', 'それはしゅくだいです'],
        requiredTokenPatterns: ['それ', 'は', 'しゅくだい', 'です'],
        weakPointItemId: 'scenario-step-2',
      },
    ],
  },
} satisfies Mission;

describe('scenario attempt helpers', () => {
  it('returns null for regular output missions', () => {
    expect(
      deriveScenarioAttemptPlan(
        {
          scenario: undefined,
        },
        [firstTask],
      ),
    ).toBeNull();
  });

  it('derives a scenario attempt plan from the active output task list', () => {
    const plan = deriveScenarioAttemptPlan(scenarioMission, [secondTask, firstTask]);

    expect(plan?.scenario.scenarioId).toBe('scenario-test');
    expect(plan?.steps.map((step) => step.step.id)).toEqual([
      'scenario-step-1',
      'scenario-step-2',
    ]);
    expect(plan?.stepsByTaskId['scenario-step-1']).toMatchObject({
      task: firstTask,
      taskIndex: 1,
    });
    expect(plan?.stepsByTaskId['scenario-step-2']).toMatchObject({
      task: secondTask,
      taskIndex: 0,
    });
  });

  it('keeps missing scenario steps out of the active plan without throwing', () => {
    const plan = deriveScenarioAttemptPlan(scenarioMission, [secondTask]);

    expect(plan?.steps.map((step) => step.step.id)).toEqual(['scenario-step-2']);
    expect(plan?.stepsByTaskId['scenario-step-1']).toBeUndefined();
  });

  it('evaluates scenario steps through the existing deterministic output evaluator', () => {
    const step = scenarioMission.scenario.steps[0];

    expect(evaluateScenarioStep(step, firstTask, 'これはほんです。').outputEvaluation).toEqual(
      evaluateOutputResponse(firstTask, 'これはほんです。'),
    );
    expect(evaluateScenarioStep(step, firstTask, 'これはですほん').outputEvaluation).toEqual(
      evaluateOutputResponse(firstTask, 'これはですほん'),
    );
  });
});
