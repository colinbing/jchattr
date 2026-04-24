import { useEffect, useRef } from 'react';
import { clearContinueState } from '../../../lib/progress/continueState';
import { markMissionComplete } from '../../../lib/progress/missionProgress';

type UseMissionAutoCompleteParams = {
  missionId: string;
  clearedCount: number;
  totalCount: number;
};

export function useMissionAutoComplete({
  missionId,
  clearedCount,
  totalCount,
}: UseMissionAutoCompleteParams) {
  const hasAutoCompletedRef = useRef(false);

  useEffect(() => {
    if (!missionId.trim() || totalCount <= 0) {
      return;
    }

    if (clearedCount < totalCount || hasAutoCompletedRef.current) {
      return;
    }

    markMissionComplete(missionId);
    clearContinueState(missionId);
    hasAutoCompletedRef.current = true;
  }, [clearedCount, missionId, totalCount]);
}
