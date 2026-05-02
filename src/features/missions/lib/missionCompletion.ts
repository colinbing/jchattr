export type MissionItemOutcome = 'correct' | 'incorrect' | 'supported';

export type MissionAttemptSummary = {
  attemptedCount: number;
  correctCount: number;
  incorrectCount: number;
  supportedCount: number;
  totalCount: number;
  isExposureComplete: boolean;
  isMasteryComplete: boolean;
};

export function summarizeMissionItemOutcomes(
  outcomesByItemId: Record<string, MissionItemOutcome>,
  expectedItemIds: string[],
): MissionAttemptSummary {
  const uniqueExpectedItemIds = Array.from(
    new Set(expectedItemIds.filter((itemId) => itemId.trim().length > 0)),
  );
  const safeTotalCount = uniqueExpectedItemIds.length;
  const boundedOutcomes = uniqueExpectedItemIds
    .map((itemId) => outcomesByItemId[itemId])
    .filter(isMissionItemOutcome);
  const correctCount = boundedOutcomes.filter((outcome) => outcome === 'correct').length;
  const incorrectCount = boundedOutcomes.filter((outcome) => outcome === 'incorrect').length;
  const supportedCount = boundedOutcomes.filter((outcome) => outcome === 'supported').length;
  const attemptedCount = boundedOutcomes.length;

  return {
    attemptedCount,
    correctCount,
    incorrectCount,
    supportedCount,
    totalCount: safeTotalCount,
    isExposureComplete: safeTotalCount > 0 && attemptedCount >= safeTotalCount,
    isMasteryComplete: safeTotalCount > 0 && correctCount >= safeTotalCount,
  };
}

export function mergeMissionItemOutcome(
  currentOutcome: MissionItemOutcome | undefined,
  nextOutcome: MissionItemOutcome,
): MissionItemOutcome {
  if (currentOutcome === 'incorrect' || nextOutcome === 'incorrect') {
    return 'incorrect';
  }

  if (currentOutcome === 'supported' || nextOutcome === 'supported') {
    return 'supported';
  }

  return 'correct';
}

function isMissionItemOutcome(value: unknown): value is MissionItemOutcome {
  return value === 'correct' || value === 'incorrect' || value === 'supported';
}
