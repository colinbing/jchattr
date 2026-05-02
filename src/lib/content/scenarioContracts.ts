import type { Mission, ScenarioStep } from './types';

export function assertScenarioMissionContracts(missions: Mission[]) {
  missions.forEach((mission) => {
    if (!mission.scenario) {
      return;
    }

    assertScenarioMissionContract(mission);
  });
}

export function assertScenarioMissionContract(mission: Mission) {
  const scenario = mission.scenario;

  if (!scenario) {
    return;
  }

  if (mission.type !== 'output') {
    throw new Error(`Scenario mission ${mission.id} must be an output mission.`);
  }

  const outputTasks = mission.outputTasks ?? [];

  if (outputTasks.length === 0) {
    throw new Error(`Scenario mission ${mission.id} must include output tasks.`);
  }

  assertSortedUniquePositivePackIds(mission.id, scenario.sourcePackIds);
  assertSameStringArray(
    `Scenario mission ${mission.id} grammar refs`,
    scenario.grammarLessonIds,
    mission.contentRefs.grammarLessonIds ?? [],
  );
  assertSameStringArray(
    `Scenario mission ${mission.id} vocab refs`,
    scenario.vocabIds,
    mission.contentRefs.vocabIds ?? [],
  );
  assertSameStringArray(
    `Scenario mission ${mission.id} example refs`,
    scenario.exampleIds,
    mission.contentRefs.exampleIds ?? [],
  );

  if (scenario.steps.length !== outputTasks.length) {
    throw new Error(
      `Scenario mission ${mission.id} has ${scenario.steps.length} scenario steps but ${outputTasks.length} output tasks.`,
    );
  }

  scenario.steps.forEach((step, stepIndex) => {
    const outputTask = outputTasks[stepIndex];

    if (!outputTask) {
      return;
    }

    if (step.actor !== 'learner') {
      throw new Error(`Scenario mission ${mission.id} step ${step.id} must be a learner move.`);
    }

    if (step.moveType !== 'type') {
      throw new Error(`Scenario mission ${mission.id} step ${step.id} must use a typed move.`);
    }

    if (step.id !== outputTask.id) {
      throw new Error(
        `Scenario mission ${mission.id} step ${stepIndex + 1} id "${step.id}" must match output task "${outputTask.id}".`,
      );
    }

    assertStepMirrorsOutputTask(mission.id, step, outputTask);
  });
}

function assertStepMirrorsOutputTask(
  missionId: string,
  step: ScenarioStep,
  outputTask: NonNullable<Mission['outputTasks']>[number],
) {
  assertSameStringArray(
    `Scenario mission ${missionId} step ${step.id} acceptable answers`,
    step.acceptableAnswers,
    outputTask.acceptableAnswers,
  );

  if (!step.requiredTokenPatterns?.length) {
    throw new Error(
      `Scenario mission ${missionId} step ${step.id} must include required token patterns.`,
    );
  }

  const outputTokenPattern = outputTask.evaluation?.tokenPatterns?.[0] ?? [];

  assertSameStringArray(
    `Scenario mission ${missionId} step ${step.id} token pattern`,
    step.requiredTokenPatterns,
    outputTokenPattern,
  );

  if (step.weakPointItemId && step.weakPointItemId !== outputTask.id) {
    throw new Error(
      `Scenario mission ${missionId} step ${step.id} weakPointItemId must match its output task id.`,
    );
  }
}

function assertSortedUniquePositivePackIds(missionId: string, sourcePackIds: number[]) {
  sourcePackIds.forEach((packId, index) => {
    if (!Number.isInteger(packId) || packId <= 0) {
      throw new Error(`Scenario mission ${missionId} sourcePackIds must be positive integers.`);
    }

    const previousPackId = sourcePackIds[index - 1];

    if (previousPackId === undefined) {
      return;
    }

    if (packId === previousPackId) {
      throw new Error(`Scenario mission ${missionId} sourcePackIds must be unique.`);
    }

    if (packId < previousPackId) {
      throw new Error(`Scenario mission ${missionId} sourcePackIds must be sorted.`);
    }
  });
}

function assertSameStringArray(label: string, actual: string[], expected: string[]) {
  if (actual.length !== expected.length) {
    throw new Error(`${label} must match exactly.`);
  }

  const hasMismatch = actual.some((value, index) => value !== expected[index]);

  if (hasMismatch) {
    throw new Error(`${label} must match exactly.`);
  }
}
