import { useCallback, useMemo, useState } from 'react';
import {
  recordMissionItemOutcome,
  summarizeMissionItemOutcomes,
  type MissionAttemptSummary,
  type MissionItemOutcome,
} from './missionCompletion';

export type UseMissionAttemptOutcomesResult = {
  resultsByItemId: Record<string, MissionItemOutcome>;
  attemptSummary: MissionAttemptSummary;
  recordItemOutcome: (itemId: string, outcome: MissionItemOutcome) => void;
};

export function useMissionAttemptOutcomes(
  expectedItemIds: string[],
): UseMissionAttemptOutcomesResult {
  const [resultsByItemId, setResultsByItemId] = useState<Record<string, MissionItemOutcome>>({});
  const attemptSummary = useMemo(
    () => summarizeMissionItemOutcomes(resultsByItemId, expectedItemIds),
    [expectedItemIds, resultsByItemId],
  );
  const recordItemOutcome = useCallback((itemId: string, outcome: MissionItemOutcome) => {
    setResultsByItemId((currentResults) =>
      recordMissionItemOutcome(currentResults, itemId, outcome),
    );
  }, []);

  return {
    resultsByItemId,
    attemptSummary,
    recordItemOutcome,
  };
}
