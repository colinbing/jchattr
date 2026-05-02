import type { Mission, OutputTask, ScenarioStep } from '../../../lib/content/types';
import {
  evaluateOutputResponse,
  type OutputEvaluationResult,
} from '../../../lib/outputEvaluation';

export type ScenarioAttemptStep = {
  step: ScenarioStep;
  task: OutputTask;
  taskIndex: number;
};

export type ScenarioAttemptPlan = {
  scenario: NonNullable<Mission['scenario']>;
  steps: ScenarioAttemptStep[];
  stepsByTaskId: Record<string, ScenarioAttemptStep>;
};

export type ScenarioStepEvaluation = {
  step: ScenarioStep;
  task: OutputTask;
  outputEvaluation: OutputEvaluationResult;
};

export function deriveScenarioAttemptPlan(
  mission: Pick<Mission, 'scenario'>,
  tasks: OutputTask[],
): ScenarioAttemptPlan | null {
  const scenario = mission.scenario;

  if (!scenario) {
    return null;
  }

  const taskIndexById = new Map(tasks.map((task, index) => [task.id, index]));
  const taskById = new Map(tasks.map((task) => [task.id, task]));
  const steps = scenario.steps.flatMap<ScenarioAttemptStep>((step) => {
    const task = taskById.get(step.id);
    const taskIndex = taskIndexById.get(step.id);

    if (!task || taskIndex === undefined) {
      return [];
    }

    return [
      {
        step,
        task,
        taskIndex,
      },
    ];
  });

  return {
    scenario,
    steps,
    stepsByTaskId: Object.fromEntries(
      steps.map((step) => [step.task.id, step]),
    ),
  };
}

export function evaluateScenarioStep(
  step: ScenarioStep,
  task: OutputTask,
  response: string,
): ScenarioStepEvaluation {
  return {
    step,
    task,
    outputEvaluation: evaluateOutputResponse(task, response),
  };
}
