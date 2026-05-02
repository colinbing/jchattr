import { useCallback, useEffect, useRef } from 'react';
import { clearContinueState } from '../../../lib/progress/continueState';
import { markMissionExposureComplete } from '../../../lib/progress/missionProgress';
import type { MissionAttemptSummary } from './missionCompletion';

type UseMissionAutoCompleteParams = {
  missionId: string;
  attemptSummary: MissionAttemptSummary;
};

export function useMissionAutoComplete({
  missionId,
  attemptSummary,
}: UseMissionAutoCompleteParams) {
  const hasAutoCompletedRef = useRef(false);
  const completeMissionIfReady = useCallback(() => {
    if (hasAutoCompletedRef.current) {
      return true;
    }

    const didComplete = completeMissionExposureIfReady(missionId, attemptSummary);

    if (didComplete) {
      hasAutoCompletedRef.current = true;
    }

    return didComplete;
  }, [attemptSummary, missionId]);

  useEffect(() => {
    completeMissionIfReady();
  }, [completeMissionIfReady]);

  return completeMissionIfReady;
}

export function completeMissionExposureIfReady(
  missionId: string,
  attemptSummary: MissionAttemptSummary,
) {
  if (!missionId.trim() || attemptSummary.totalCount <= 0) {
    return false;
  }

  if (!attemptSummary.isExposureComplete) {
    return false;
  }

  markMissionExposureComplete(missionId, attemptSummary);
  clearContinueState(missionId);
  return true;
}
