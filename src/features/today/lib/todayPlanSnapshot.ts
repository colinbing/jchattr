export type TodayPlanSnapshotRecommendationState = {
  snapshotKeys: string[];
  liveCoreKeys: string[];
  hasLocalStudyState: boolean;
};

export function shouldRecreateTodayPlanSnapshotForLiveRecommendations({
  snapshotKeys,
  liveCoreKeys,
  hasLocalStudyState,
}: TodayPlanSnapshotRecommendationState) {
  if (hasLocalStudyState) {
    return false;
  }

  return snapshotKeys.join('|') !== liveCoreKeys.join('|');
}
