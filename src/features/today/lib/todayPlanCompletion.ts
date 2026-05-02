export type TodayPlanCompletionItem = {
  key: string;
  kind: 'review' | 'mission' | 'capstone';
};

export function isTodayPlanItemCompleteForStudyDay(
  item: TodayPlanCompletionItem,
  completedPlanItemKeys: Set<string>,
) {
  return completedPlanItemKeys.has(item.key);
}
