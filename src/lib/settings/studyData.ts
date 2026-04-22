import { clearContinueState } from '../progress/continueState';
import { resetMissionProgress } from '../progress/missionProgress';
import { resetReviewLoopProgress } from '../progress/reviewLoop';
import { resetWeakPoints } from '../progress/weakPoints';

export type StudyDataStoreId =
  | 'mission-progress'
  | 'weak-points'
  | 'review-loop'
  | 'continue-state'
  | 'all-study-data';

export function resetStudyDataStore(storeId: StudyDataStoreId) {
  switch (storeId) {
    case 'mission-progress':
      return resetMissionProgress();
    case 'weak-points':
      return resetWeakPoints();
    case 'review-loop':
      return resetReviewLoopProgress();
    case 'continue-state':
      return clearContinueState();
    case 'all-study-data':
      resetMissionProgress();
      resetWeakPoints();
      resetReviewLoopProgress();
      return clearContinueState();
  }
}
