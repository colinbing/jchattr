import type { Mission, StarterContent } from '../../../lib/content/types';
import type { CapstoneProgressRecord } from '../../../lib/progress/capstoneProgress';
import type { MissionProgressRecord } from '../../../lib/progress/missionProgress';
import type { MissionSessionMode } from '../../missions/lib/missionSession';
import { getTodayRecommendationPlanKey } from './todayBonusRecommendations';
import { isTodayPlanItemCompleteForStudyDay } from './todayPlanCompletion';
import {
  formatMissionTypeLabel,
  formatTargetSkillLabel,
} from './todayPlanFormatting';
import { getTodayPlanItemKey } from './todayPlanKeys';
import { shouldRecreateTodayPlanSnapshotForLiveRecommendations } from './todayPlanSnapshot';
import type { TodayRecommendation } from './todayRecommendations';

export type ContinueMissionSummary = {
  mission: Mission;
  detail: string;
};

export type TodayPlanSnapshot = {
  version: 1;
  items: TodayPlanSnapshotItem[];
};

export type TodayPlanSnapshotItem = {
  key: string;
  kind: TodayRecommendation['kind'];
  title: string;
  to: string;
  minutes: number;
  missionId?: string;
  missionType?: Mission['type'];
  targetSkill?: Mission['targetSkill'];
  sessionMode?: MissionSessionMode;
  capstoneStoryId?: string;
  capstoneMode?: 'closeout' | 'recombination';
  capstoneLineCount?: number;
  capstoneCheckCount?: number;
  batchSize?: number;
};

export type TodayPlanSummaryItem = {
  id: string;
  title: string;
  meta: string;
  status: 'done' | 'current' | 'waiting';
};

export type TodayPlanAction = {
  to: string;
  state?: unknown;
  label: string;
};

export type TodayPlanState = {
  snapshot: TodayPlanSnapshot;
  planKeys: Set<string>;
  planMissionIds: Set<string>;
  planCapstoneStoryIds: Set<string>;
  summaryItems: TodayPlanSummaryItem[];
  completedCount: number;
  remainingCount: number;
  remainingMinutes: number;
  primaryAction: TodayPlanAction | null;
};

export type ResolveTodayPlanStateParams = {
  snapshot: TodayPlanSnapshot;
  starterContent: StarterContent;
  liveCoreRecommendations: TodayRecommendation[];
  liveRecommendationByKey: Map<string, TodayRecommendation>;
  liveReviewRecommendation: TodayRecommendation | null;
  missionProgress: MissionProgressRecord;
  capstoneProgress: CapstoneProgressRecord;
  completedPlanItemKeys: Set<string>;
  weakPointCount: number;
  continueMission: ContinueMissionSummary | null;
};

export function resolveTodayPlanState({
  snapshot,
  starterContent,
  liveCoreRecommendations,
  liveRecommendationByKey,
  liveReviewRecommendation,
  missionProgress,
  capstoneProgress,
  completedPlanItemKeys,
  weakPointCount,
  continueMission,
}: ResolveTodayPlanStateParams): TodayPlanState {
  const candidateSnapshot = shouldRecreateTodayPlanSnapshot({
    snapshot,
    liveCoreRecommendations,
    missionProgress,
    capstoneProgress,
    weakPointCount,
    continueMission,
  })
    ? createTodayPlanSnapshot(liveCoreRecommendations)
    : snapshot;
  const safeSnapshot = areTodayPlanSnapshotsEqual(candidateSnapshot, snapshot)
    ? snapshot
    : candidateSnapshot;
  const baseItems = safeSnapshot.items
    .filter((item) => isValidTodayPlanItem(item))
    .map(normalizeTodayPlanSnapshotItem);
  const normalizedSnapshot: TodayPlanSnapshot =
    baseItems.length === safeSnapshot.items.length &&
    baseItems.every((item, index) => item === safeSnapshot.items[index])
      ? safeSnapshot
      : {
          ...safeSnapshot,
          items: baseItems,
        };
  const hasReviewItem = baseItems.some((item) => item.key === 'review-loop');
  const reviewPlanItem =
    liveReviewRecommendation && !hasReviewItem
      ? [createTodayPlanSnapshotItem(liveReviewRecommendation)]
      : [];
  const planItems = [...baseItems, ...reviewPlanItem].map((item) => {
    return hydrateTodayPlanItem(item, liveRecommendationByKey, starterContent);
  });
  const summaryItems = planItems.map((item) => {
    const isCompleted = isTodayPlanItemComplete(
      item,
      completedPlanItemKeys,
    );

    return {
      id: item.key,
      title: item.title,
      meta: formatTodayPlanItemMeta(item, isCompleted),
      status: isCompleted ? 'done' : 'waiting',
    } satisfies TodayPlanSummaryItem;
  });
  const continuePlanIndex = continueMission
    ? planItems.findIndex((item) => {
        return (
          item.kind === 'mission' &&
          item.missionId === continueMission.mission.id &&
          !isTodayPlanItemComplete(
            item,
            completedPlanItemKeys,
          )
        );
      })
    : -1;
  const hasContinuePlanItem = continuePlanIndex >= 0;
  const firstOpenIndex = summaryItems.findIndex((item) => item.status !== 'done');
  const activeIndex = hasContinuePlanItem ? continuePlanIndex : firstOpenIndex;
  const activeItem = firstOpenIndex >= 0 ? planItems[firstOpenIndex] : null;
  const remainingPlanItems = planItems.filter((item) => {
    return !isTodayPlanItemComplete(
      item,
      completedPlanItemKeys,
    );
  });
  const shouldPromoteExtraContinue = Boolean(
    continueMission && !hasContinuePlanItem && remainingPlanItems.length > 0,
  );
  const extraContinueCount = shouldPromoteExtraContinue ? 1 : 0;
  const remainingMinutes =
    remainingPlanItems.reduce((total, item) => total + item.minutes, 0) +
    (shouldPromoteExtraContinue ? continueMission?.mission.estimatedMinutes ?? 0 : 0);
  const primaryAction = continueMission && (hasContinuePlanItem || shouldPromoteExtraContinue)
    ? {
        to: `/mission/${continueMission.mission.id}`,
        state: { preserveScroll: true },
        label: 'Continue mission',
      }
    : activeItem
      ? buildTodayPlanAction(activeItem, firstOpenIndex === 0)
      : null;

  const continueSummaryItems: TodayPlanSummaryItem[] =
    continueMission && shouldPromoteExtraContinue
      ? [
          {
            id: `continue:${continueMission.mission.id}`,
            title: continueMission.mission.title,
            meta: `Resume unfinished mission · ${continueMission.mission.estimatedMinutes} min`,
            status: 'current',
          },
        ]
      : [];
  const decoratedPlanItems: TodayPlanSummaryItem[] = summaryItems.map((item, index) => ({
    ...item,
    status: index === activeIndex ? 'current' : item.status,
  }));
  const renderedSummaryItems = [
    ...continueSummaryItems,
    ...decoratedPlanItems,
  ];

  return {
    snapshot: normalizedSnapshot,
    planKeys: new Set(planItems.map((item) => item.key)),
    planMissionIds: new Set(
      planItems
        .map((item) => item.missionId)
        .filter((missionId): missionId is string => Boolean(missionId)),
    ),
    planCapstoneStoryIds: new Set(
      planItems
        .map((item) => item.capstoneStoryId)
        .filter((capstoneStoryId): capstoneStoryId is string => Boolean(capstoneStoryId)),
    ),
    summaryItems: renderedSummaryItems,
    completedCount: renderedSummaryItems.filter((item) => item.status === 'done').length,
    remainingCount: remainingPlanItems.length + extraContinueCount,
    remainingMinutes,
    primaryAction,
  };
}

export function createTodayPlanSnapshot(
  recommendations: TodayRecommendation[],
): TodayPlanSnapshot {
  return {
    version: 1,
    items: recommendations.map(createTodayPlanSnapshotItem),
  };
}

export function createRecommendationByKey(recommendations: TodayRecommendation[]) {
  return new Map(
    recommendations.map((recommendation) => [
      getTodayRecommendationPlanKey(recommendation),
      recommendation,
    ]),
  );
}

export function getRecommendationKey(recommendation: TodayRecommendation) {
  return getTodayRecommendationPlanKey(recommendation);
}

export function isTodayPlanSnapshot(value: unknown): value is TodayPlanSnapshot {
  if (!isRecord(value) || value.version !== 1 || !Array.isArray(value.items)) {
    return false;
  }

  return value.items.every(isTodayPlanSnapshotItem);
}

export function getRecommendationMinuteTotal(recommendations: TodayRecommendation[]) {
  return recommendations.reduce((total, recommendation) => {
    if (recommendation.kind === 'review') {
      return total + Math.max(4, recommendation.batchSize * 2);
    }

    if (recommendation.kind === 'capstone') {
      return total + recommendation.estimatedMinutes;
    }

    return total + recommendation.mission.estimatedMinutes;
  }, 0);
}

function hydrateTodayPlanItem(
  item: TodayPlanSnapshotItem,
  liveRecommendationByKey: Map<string, TodayRecommendation>,
  starterContent: StarterContent,
) {
  const liveRecommendation = liveRecommendationByKey.get(item.key);

  if (liveRecommendation) {
    return createTodayPlanSnapshotItem(liveRecommendation);
  }

  if (item.kind === 'capstone' && item.capstoneStoryId) {
    const capstoneStory = starterContent.byId.capstoneStories[item.capstoneStoryId];

    return capstoneStory
      ? {
          ...item,
          title: capstoneStory.title,
          minutes: capstoneStory.estimatedMinutes,
          capstoneLineCount: capstoneStory.lineIds.length,
          capstoneCheckCount: capstoneStory.checkIds.length,
        }
      : item;
  }

  if (item.kind !== 'mission' || !item.missionId) {
    return item;
  }

  const mission = starterContent.byId.missions[item.missionId];

  return mission
    ? {
        ...item,
        title: mission.title,
        minutes: mission.estimatedMinutes,
        missionType: mission.type,
        targetSkill: mission.targetSkill,
      }
    : item;
}

function createTodayPlanSnapshotItem(
  recommendation: TodayRecommendation,
): TodayPlanSnapshotItem {
  if (recommendation.kind === 'review') {
    return {
      key: getRecommendationKey(recommendation),
      kind: 'review',
      title: recommendation.title,
      to: recommendation.to,
      minutes: getRecommendationMinuteTotal([recommendation]),
      batchSize: recommendation.batchSize,
    };
  }

  if (recommendation.kind === 'capstone') {
    return {
      key: getRecommendationKey(recommendation),
      kind: 'capstone',
      title: recommendation.title,
      to: recommendation.to,
      minutes: recommendation.estimatedMinutes,
      capstoneStoryId: recommendation.capstoneStory.id,
      capstoneMode: recommendation.capstoneMode,
      capstoneLineCount: recommendation.lineCount,
      capstoneCheckCount: recommendation.checkCount,
    };
  }

  return {
    key: getRecommendationKey(recommendation),
    kind: 'mission',
    title: recommendation.title,
    to: recommendation.to,
    minutes: recommendation.mission.estimatedMinutes,
    missionId: recommendation.mission.id,
    missionType: recommendation.mission.type,
    targetSkill: recommendation.mission.targetSkill,
    sessionMode: recommendation.sessionMode,
  };
}

function normalizeTodayPlanSnapshotItem(
  item: TodayPlanSnapshotItem,
): TodayPlanSnapshotItem {
  if (item.kind === 'review') {
    const key = getTodayPlanItemKey({ kind: 'review' });

    if (item.key === key) {
      return item;
    }

    return {
      ...item,
      key,
    };
  }

  if (item.kind === 'capstone' && item.capstoneStoryId) {
    const key = getTodayPlanItemKey({
      kind: 'capstone',
      capstoneStoryId: item.capstoneStoryId,
      capstoneMode: item.capstoneMode,
    });

    if (item.key === key) {
      return item;
    }

    return {
      ...item,
      key,
    };
  }

  if (item.kind === 'mission' && item.missionId) {
    const key = getTodayPlanItemKey({
      kind: 'mission',
      missionId: item.missionId,
      sessionMode: item.sessionMode,
    });

    if (item.key === key) {
      return item;
    }

    return {
      ...item,
      key,
    };
  }

  return item;
}

function areTodayPlanSnapshotsEqual(
  left: TodayPlanSnapshot,
  right: TodayPlanSnapshot,
) {
  return (
    left.version === right.version &&
    left.items.length === right.items.length &&
    left.items.every((item, index) => {
      return areTodayPlanSnapshotItemsEqual(item, right.items[index]);
    })
  );
}

function areTodayPlanSnapshotItemsEqual(
  left: TodayPlanSnapshotItem,
  right: TodayPlanSnapshotItem | undefined,
) {
  if (!right) {
    return false;
  }

  return (
    left.key === right.key &&
    left.kind === right.kind &&
    left.title === right.title &&
    left.to === right.to &&
    left.minutes === right.minutes &&
    left.missionId === right.missionId &&
    left.missionType === right.missionType &&
    left.targetSkill === right.targetSkill &&
    left.sessionMode === right.sessionMode &&
    left.capstoneStoryId === right.capstoneStoryId &&
    left.capstoneMode === right.capstoneMode &&
    left.capstoneLineCount === right.capstoneLineCount &&
    left.capstoneCheckCount === right.capstoneCheckCount &&
    left.batchSize === right.batchSize
  );
}

function shouldRecreateTodayPlanSnapshot({
  snapshot,
  liveCoreRecommendations,
  missionProgress,
  capstoneProgress,
  weakPointCount,
  continueMission,
}: {
  snapshot: TodayPlanSnapshot;
  liveCoreRecommendations: TodayRecommendation[];
  missionProgress: MissionProgressRecord;
  capstoneProgress: CapstoneProgressRecord;
  weakPointCount: number;
  continueMission: ContinueMissionSummary | null;
}) {
  const liveCoreKeys = liveCoreRecommendations.map(getRecommendationKey);
  const snapshotKeys = snapshot.items.map((item) => item.key);
  const hasNoLocalStudyState =
    missionProgress.completedMissionIds.length === 0 &&
    Object.keys(missionProgress.completionCountsByMissionId).length === 0 &&
    capstoneProgress.completedStoryIds.length === 0 &&
    Object.keys(capstoneProgress.completionCountsByStoryId).length === 0 &&
    weakPointCount === 0 &&
    !continueMission;

  if (snapshot.items.length === 0 || snapshot.items.some((item) => !isValidTodayPlanItem(item))) {
    return true;
  }

  if (
    shouldRecreateTodayPlanSnapshotForLiveRecommendations({
      snapshotKeys,
      liveCoreKeys,
      hasLocalStudyState: !hasNoLocalStudyState,
    })
  ) {
    return true;
  }

  return false;
}

function isValidTodayPlanItem(item: TodayPlanSnapshotItem) {
  if (item.kind === 'review') {
    return item.key === 'review-loop';
  }

  if (item.kind === 'capstone') {
    return Boolean(item.capstoneStoryId && item.to && item.title && item.minutes > 0);
  }

  return Boolean(item.missionId && item.to && item.title && item.minutes > 0);
}

function isTodayPlanItemComplete(
  item: TodayPlanSnapshotItem,
  completedPlanItemKeys: Set<string>,
) {
  return isTodayPlanItemCompleteForStudyDay(item, completedPlanItemKeys);
}

function buildTodayPlanAction(
  item: TodayPlanSnapshotItem,
  isFirstOpenItem: boolean,
): TodayPlanAction {
  if (item.kind === 'review') {
    return {
      to: item.to,
      state: { returnTo: 'today' as const },
      label: isFirstOpenItem ? 'Start review' : 'Continue today',
    };
  }

  if (item.kind === 'capstone') {
    return {
      to: item.to,
      label:
        item.capstoneMode === 'recombination'
          ? 'Start recombination'
          : isFirstOpenItem
            ? 'Read capstone'
            : 'Continue today',
    };
  }

  return {
    to: item.to,
    state:
      item.sessionMode === 'reinforce'
        ? { sessionMode: 'reinforce' as const }
        : undefined,
    label: isFirstOpenItem ? "Start today's lesson" : 'Continue today',
  };
}

function formatTodayPlanItemMeta(item: TodayPlanSnapshotItem, isCompleted: boolean) {
  if (item.kind === 'review') {
    if (isCompleted) {
      return 'Review clear.';
    }

    return `${item.batchSize ?? 1} retry item${(item.batchSize ?? 1) === 1 ? '' : 's'} · about ${
      item.minutes
    } min`;
  }

  if (item.kind === 'capstone') {
    if (item.capstoneMode === 'recombination') {
      return `${item.capstoneLineCount ?? 0} familiar story lines · optional`;
    }

    if (isCompleted) {
      return 'Chapter closeout complete.';
    }

    return `${item.capstoneLineCount ?? 0} story lines · ${
      item.capstoneCheckCount ?? 0
    } checks · ${item.minutes} min`;
  }

  const missionType = item.missionType ? formatMissionTypeLabel(item.missionType) : 'Mission';
  const targetSkill = item.targetSkill ? formatTargetSkillLabel(item.targetSkill) : 'practice';
  return `${missionType} · ${targetSkill} · ${item.minutes} min`;
}

function isTodayPlanSnapshotItem(value: unknown): value is TodayPlanSnapshotItem {
  if (!isRecord(value)) {
    return false;
  }

  if (value.kind !== 'review' && value.kind !== 'mission' && value.kind !== 'capstone') {
    return false;
  }

  return (
    typeof value.key === 'string' &&
    typeof value.title === 'string' &&
    typeof value.to === 'string' &&
    typeof value.minutes === 'number'
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
