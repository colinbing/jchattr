import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (!missionId.trim() || attemptSummary.totalCount <= 0) {
      return;
    }

    if (!attemptSummary.isExposureComplete || hasAutoCompletedRef.current) {
      return;
    }

    markMissionExposureComplete(missionId, attemptSummary);
    clearContinueState(missionId);
    hasAutoCompletedRef.current = true;
  }, [attemptSummary, missionId]);
}
