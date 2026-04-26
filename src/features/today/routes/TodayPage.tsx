import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PageShell, SurfaceCard } from '../../../components/layout/PageShell';
import type { Mission, StarterContent } from '../../../lib/content/types';
import {
  SessionSummary,
  type SessionSummaryAction,
  type SessionSummaryItem,
} from '../components/SessionSummary';
import { TodayRecommendationCard } from '../components/TodayRecommendationCard';
import { getStarterContent } from '../../../lib/content/loader';
import {
  type ContinueStateRecord,
  useContinueState,
} from '../../../lib/progress/continueState';
import {
  getMissionProgressEntry,
  useMissionProgress,
} from '../../../lib/progress/missionProgress';
import {
  getCapstoneProgressEntry,
  useCapstoneProgress,
} from '../../../lib/progress/capstoneProgress';
import {
  getCurrentStudyDayKey,
  getStudyDayLabel,
  getWeekTrackerDays,
  readDailySessionRecord,
  writeDailySessionPlan,
} from '../../../lib/progress/dailySession';
import { useReviewLoopProgress } from '../../../lib/progress/reviewLoop';
import { getWeakPointList, useWeakPoints } from '../../../lib/progress/weakPoints';
import {
  deriveProgressOverview,
  formatSkillTierLabel,
  type SkillAreaProgress,
} from '../../../lib/progress/skillMap';
import {
  deriveTodayRecommendations,
  type TodayRecommendation,
} from '../lib/todayRecommendations';
import type { MissionCompletionSummary } from '../../missions/lib/missionSession';
import {
  setStudyFocusMode,
  STUDY_FOCUS_MODE_OPTIONS,
  type StudyFocusMode,
  useStudyPreferences,
} from '../../../lib/settings/studyPreferences';

export function TodayPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const starterContent = getStarterContent();
  const missionProgress = useMissionProgress();
  const capstoneProgress = useCapstoneProgress();
  const weakPoints = useWeakPoints();
  const reviewLoopProgress = useReviewLoopProgress();
  const continueState = useContinueState();
  const studyPreferences = useStudyPreferences();
  const [studyDayKey, setStudyDayKey] = useState(() => getCurrentStudyDayKey());
  const [dailySessionRecord, setDailySessionRecord] = useState(() =>
    readDailySessionRecord(studyDayKey),
  );
  const weakPointList = getWeakPointList(weakPoints);
  const [missionCompletion, setMissionCompletion] = useState<TodayMissionCompletion | null>(() => {
    return ((location.state as TodayLocationState | null)?.missionCompletion ?? null);
  });
  const [reviewCompletion, setReviewCompletion] = useState<TodayReviewCompletion | null>(() => {
    return ((location.state as TodayLocationState | null)?.reviewCompletion ?? null);
  });
  const recommendations = deriveTodayRecommendations(
    starterContent,
    missionProgress,
    weakPoints,
    reviewLoopProgress,
    capstoneProgress,
    { studyFocusMode: studyPreferences.focusMode },
  );
  const progressOverview = deriveProgressOverview(starterContent, missionProgress, weakPoints);
  const continueMission = resolveContinueMission(
    starterContent,
    missionProgress,
    continueState,
  );
  const visibleRecommendations = filterContinueMissionRecommendation(
    recommendations,
    continueMission?.mission.id ?? null,
  );
  const coreEligibleRecommendations = visibleRecommendations.filter(isCoreRecommendation);
  const liveCoreRecommendations =
    coreEligibleRecommendations.length > 2
      ? coreEligibleRecommendations.slice(0, 2)
      : coreEligibleRecommendations;
  const [todayPlanSnapshot, setTodayPlanSnapshot] = useState<TodayPlanSnapshot>(() => {
    const storedPlan = dailySessionRecord.plansByStudyDay[studyDayKey];
    return isTodayPlanSnapshot(storedPlan)
      ? storedPlan
      : createTodayPlanSnapshot(liveCoreRecommendations);
  });
  const liveRecommendationByKey = createRecommendationByKey(visibleRecommendations);
  const liveReviewRecommendation =
    recommendations.find((recommendation) => recommendation.kind === 'review') ?? null;
  const planState = resolveTodayPlanState({
    snapshot: todayPlanSnapshot,
    starterContent,
    liveCoreRecommendations,
    liveRecommendationByKey,
    liveReviewRecommendation,
    missionProgress,
    capstoneProgress,
    weakPointCount: weakPointList.length,
    continueMission,
  });
  const bonusRecommendations =
    visibleRecommendations.filter((recommendation) => {
      return !planState.planKeys.has(getRecommendationKey(recommendation));
    });
  const optionalContinueMission =
    continueMission &&
    !planState.planKeys.has(`mission:${continueMission.mission.id}`) &&
    planState.remainingCount === 0
      ? continueMission
      : null;
  const missionCompletionSkill = missionCompletion
    ? progressOverview.skillAreas.find(
        (skillArea) => skillArea.id === missionCompletion.targetSkill,
      ) ?? null
    : null;
  const missionCompletionWeakPointCount = missionCompletion
    ? weakPointList.filter((weakPoint) => weakPoint.missionId === missionCompletion.missionId)
        .length
    : 0;
  const studyDateLabel = getStudyDayLabel(studyDayKey);
  const weekTrackerDays = getWeekTrackerDays(
    studyDayKey,
    dailySessionRecord.completedStudyDayKeys,
  );

  useEffect(() => {
    const nextState = (location.state as TodayLocationState | null) ?? null;
    const nextMissionCompletion = nextState?.missionCompletion ?? null;
    const nextReviewCompletion = nextState?.reviewCompletion ?? null;

    if (!nextMissionCompletion && !nextReviewCompletion) {
      return;
    }

    if (nextMissionCompletion) {
      setMissionCompletion(nextMissionCompletion);
    }

    if (nextReviewCompletion) {
      setReviewCompletion(nextReviewCompletion);
    }

    navigate(location.pathname, { replace: true });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    const nextRecord = writeDailySessionPlan(
      studyDayKey,
      planState.snapshot,
      planState.remainingCount === 0,
    );
    setDailySessionRecord(nextRecord);

    if (planState.snapshot !== todayPlanSnapshot) {
      setTodayPlanSnapshot(planState.snapshot);
    }
  }, [planState.snapshot, planState.remainingCount, studyDayKey, todayPlanSnapshot]);

  useEffect(() => {
    function refreshStudyDay() {
      const nextStudyDayKey = getCurrentStudyDayKey();

      if (nextStudyDayKey === studyDayKey) {
        return;
      }

      const nextRecord = readDailySessionRecord(nextStudyDayKey);
      const storedPlan = nextRecord.plansByStudyDay[nextStudyDayKey];

      setStudyDayKey(nextStudyDayKey);
      setDailySessionRecord(nextRecord);
      setTodayPlanSnapshot(
        isTodayPlanSnapshot(storedPlan)
          ? storedPlan
          : createTodayPlanSnapshot(liveCoreRecommendations),
      );
    }

    window.addEventListener('focus', refreshStudyDay);
    document.addEventListener('visibilitychange', refreshStudyDay);

    const intervalId = window.setInterval(refreshStudyDay, 60_000);

    return () => {
      window.removeEventListener('focus', refreshStudyDay);
      document.removeEventListener('visibilitychange', refreshStudyDay);
      window.clearInterval(intervalId);
    };
  }, [liveCoreRecommendations, studyDayKey]);

  return (
    <PageShell
      variant="compact"
      eyebrow="Daily Entry"
      title="Today"
      description="Start with the small daily plan. Open the rest only if you want more."
      aside={<span className="status-chip">Daily loop</span>}
    >
      <SessionSummary
        brandName="JCHATTR"
        studyDateLabel={studyDateLabel}
        weekDays={weekTrackerDays}
        items={planState.summaryItems}
        completedCount={planState.completedCount}
        remainingCount={planState.remainingCount}
        remainingMinutes={planState.remainingMinutes}
        bonusCount={bonusRecommendations.length}
        bonusMinutes={getRecommendationMinuteTotal(bonusRecommendations)}
        primaryAction={planState.primaryAction}
      />

      {optionalContinueMission ? (
        <SurfaceCard
          className="today-support-card"
          title="Optional in-progress practice"
          description="Today is complete. Resume this only if you want extra practice."
        >
          <div className="review-return-card">
            <p className="review-launch-card__title">
              {optionalContinueMission.mission.title}
            </p>
            <p className="review-launch-card__body">
              {optionalContinueMission.detail}
            </p>
            <Link
              to={`/mission/${optionalContinueMission.mission.id}`}
              state={{ preserveScroll: true }}
              className="mission-button mission-button--link"
            >
              Continue bonus
            </Link>
          </div>
        </SurfaceCard>
      ) : null}

      {missionCompletion ? (
        <SurfaceCard
          className="today-support-card"
          title="Mission finished"
          description={
            missionCompletion.sessionMode === 'reinforce'
              ? 'Short follow-up pass done. Keep the loop moving with the next Today step.'
              : 'That mission pass is done. Keep moving with the next Today step.'
          }
        >
          <div className="review-return-card mission-return-card">
            <p className="review-launch-card__title">
              {missionCompletion.clearedCount}/{missionCompletion.totalCount}{' '}
              {formatMissionUnitLabel(missionCompletion.missionType, missionCompletion.totalCount)} cleared
            </p>
            <p className="review-launch-card__body">
              {missionCompletion.missionTitle} · {formatMissionTypeLabel(missionCompletion.missionType)} ·{' '}
              {formatTargetSkillLabel(missionCompletion.targetSkill)}
            </p>

            <CompletionRecap
              items={[
                {
                  label: 'Practiced',
                  body: buildMissionPracticeRecap(missionCompletion),
                },
                {
                  label: 'Skill signal',
                  body: buildMissionSkillRecap(missionCompletionSkill, missionCompletion),
                },
                {
                  label: 'Review impact',
                  body: buildMissionReviewImpact(missionCompletionWeakPointCount),
                },
              ]}
            />

            <p className="review-launch-card__body">
              {planState.remainingCount > 0
                ? 'Use the Today lesson card above for the next step.'
                : 'Today core work is complete. Bonus practice is optional.'}
            </p>
          </div>
        </SurfaceCard>
      ) : null}

      {reviewCompletion ? (
        <SurfaceCard
          className="today-support-card"
          title="Review finished"
          description={
            reviewCompletion.nextBatchSize > 0
              ? 'Review pass done. Today will show whether to retry or move on.'
              : 'The review queue is clear. Move straight into Today.'
          }
        >
          <div className="review-return-card">
            <p className="review-launch-card__title">
              {reviewCompletion.clearedCount}/{reviewCompletion.attemptedCount} retries cleared
            </p>
            <p className="review-launch-card__body">
              {buildReviewCompletionBody(reviewCompletion)}
            </p>

            <CompletionRecap
              items={[
                {
                  label: 'Practiced',
                  body: `Retried ${reviewCompletion.attemptedCount} saved weak point${
                    reviewCompletion.attemptedCount === 1 ? '' : 's'
                  }.`,
                },
                {
                  label: 'Skill signal',
                  body: buildReviewSkillSignal(reviewCompletion),
                },
                {
                  label: 'Review impact',
                  body:
                    reviewCompletion.unresolvedCount > 0
                      ? `${reviewCompletion.unresolvedCount} ${
                          reviewCompletion.unresolvedCount === 1 ? 'item still needs' : 'items still need'
                        } another pass.`
                      : 'No item from that batch still needs a retry.',
                },
              ]}
            />

            <p className="review-launch-card__body">
              {planState.remainingCount > 0
                ? 'Use the Today lesson card above for the next step.'
                : 'Today core work is complete. Bonus practice is optional.'}
            </p>
          </div>
        </SurfaceCard>
      ) : null}

      <SurfaceCard
        className="today-support-card"
        title={planState.remainingCount === 0 ? 'Optional bonus practice' : 'Bonus later'}
        description={
          planState.remainingCount === 0
            ? 'Today is complete. Open this only if you want extra practice.'
            : 'Open this only if you want more after the main plan.'
        }
      >
        <TodayFocusModeControl focusMode={studyPreferences.focusMode} />

        <details className="today-details">
          <summary className="today-details__summary">
            {bonusRecommendations.length > 0
              ? `${bonusRecommendations.length} bonus option${
                  bonusRecommendations.length === 1 ? '' : 's'
                }`
              : 'No bonus slot right now'}
          </summary>
          {bonusRecommendations.length > 0 ? (
            <div className="mission-list" role="list" aria-label="Bonus practice">
              {bonusRecommendations.map((recommendation) => (
                <div key={recommendation.id} role="listitem">
                  <TodayRecommendationCard
                    recommendation={recommendation}
                    missionProgress={missionProgress}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="today-details__body">
              No extra slot is needed right now. Clear the main plan, then come back later if you
              want more.
            </p>
          )}
        </details>
      </SurfaceCard>
    </PageShell>
  );
}

function TodayFocusModeControl({ focusMode }: { focusMode: StudyFocusMode }) {
  const currentFocusOption =
    STUDY_FOCUS_MODE_OPTIONS.find((option) => option.id === focusMode) ??
    STUDY_FOCUS_MODE_OPTIONS[0];

  return (
    <details className="today-focus-control">
      <summary className="today-focus-control__summary">
        <span>Focus</span>
        <strong>{currentFocusOption.label}</strong>
      </summary>
      <div
        className="today-focus-control__options"
        role="radiogroup"
        aria-label="Today focus mode"
      >
        {STUDY_FOCUS_MODE_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`today-focus-control__option${
              option.id === focusMode ? ' today-focus-control__option--selected' : ''
            }`}
            role="radio"
            aria-checked={option.id === focusMode}
            onClick={() => setStudyFocusMode(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </details>
  );
}

type TodayReviewCompletion = {
  attemptedCount: number;
  clearedCount: number;
  unresolvedCount: number;
  remainingWeakPointCount: number;
  nextBatchSize: number;
};

type TodayMissionCompletion = MissionCompletionSummary;

type TodayLocationState = {
  missionCompletion?: TodayMissionCompletion;
  reviewCompletion?: TodayReviewCompletion;
};

type ContinueMissionSummary = {
  mission: Mission;
  detail: string;
};

type TodayPlanSnapshot = {
  version: 1;
  items: TodayPlanSnapshotItem[];
};

type TodayPlanSnapshotItem = {
  key: string;
  kind: TodayRecommendation['kind'];
  title: string;
  to: string;
  minutes: number;
  missionId?: string;
  missionType?: Mission['type'];
  targetSkill?: Mission['targetSkill'];
  sessionMode?: 'default' | 'reinforce';
  capstoneStoryId?: string;
  capstoneMode?: 'closeout' | 'recombination';
  capstoneLineCount?: number;
  capstoneCheckCount?: number;
  batchSize?: number;
};

type TodayPlanState = {
  snapshot: TodayPlanSnapshot;
  planKeys: Set<string>;
  summaryItems: SessionSummaryItem[];
  completedCount: number;
  remainingCount: number;
  remainingMinutes: number;
  primaryAction: SessionSummaryAction | null;
};

type ResolveTodayPlanStateParams = {
  snapshot: TodayPlanSnapshot;
  starterContent: StarterContent;
  liveCoreRecommendations: TodayRecommendation[];
  liveRecommendationByKey: Map<string, TodayRecommendation>;
  liveReviewRecommendation: TodayRecommendation | null;
  missionProgress: ReturnType<typeof useMissionProgress>;
  capstoneProgress: ReturnType<typeof useCapstoneProgress>;
  weakPointCount: number;
  continueMission: ContinueMissionSummary | null;
};

type CompletionRecapItem = {
  label: string;
  body: string;
};

function CompletionRecap({ items }: { items: CompletionRecapItem[] }) {
  return (
    <div className="completion-recap" aria-label="Completion recap">
      {items.map((item) => (
        <div key={item.label} className="completion-recap__item">
          <p className="completion-recap__label">{item.label}</p>
          <p className="completion-recap__body">{item.body}</p>
        </div>
      ))}
    </div>
  );
}

function resolveTodayPlanState({
  snapshot,
  starterContent,
  liveCoreRecommendations,
  liveRecommendationByKey,
  liveReviewRecommendation,
  missionProgress,
  capstoneProgress,
  weakPointCount,
  continueMission,
}: ResolveTodayPlanStateParams): TodayPlanState {
  const safeSnapshot = shouldRecreateTodayPlanSnapshot({
    snapshot,
    liveCoreRecommendations,
    missionProgress,
    capstoneProgress,
    weakPointCount,
    continueMission,
  })
    ? createTodayPlanSnapshot(liveCoreRecommendations)
    : snapshot;
  const baseItems = safeSnapshot.items.filter((item) => isValidTodayPlanItem(item));
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
      missionProgress,
      capstoneProgress,
      liveReviewRecommendation,
    );

    return {
      id: item.key,
      title: item.title,
      meta: formatTodayPlanItemMeta(item, isCompleted),
      status: isCompleted ? 'done' : 'waiting',
    } satisfies SessionSummaryItem;
  });
  const continuePlanIndex = continueMission
    ? planItems.findIndex((item) => {
        return (
          item.kind === 'mission' &&
          item.missionId === continueMission.mission.id &&
          !isTodayPlanItemComplete(
            item,
            missionProgress,
            capstoneProgress,
            liveReviewRecommendation,
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
      missionProgress,
      capstoneProgress,
      liveReviewRecommendation,
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

  const continueSummaryItems: SessionSummaryItem[] =
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
  const decoratedPlanItems: SessionSummaryItem[] = summaryItems.map((item, index) => ({
    ...item,
    status: index === activeIndex ? 'current' : item.status,
  }));
  const renderedSummaryItems = [
    ...continueSummaryItems,
    ...decoratedPlanItems,
  ];

  return {
    snapshot: safeSnapshot,
    planKeys: new Set(planItems.map((item) => item.key)),
    summaryItems: renderedSummaryItems,
    completedCount: renderedSummaryItems.filter((item) => item.status === 'done').length,
    remainingCount: remainingPlanItems.length + extraContinueCount,
    remainingMinutes,
    primaryAction,
  };
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

function createTodayPlanSnapshot(recommendations: TodayRecommendation[]): TodayPlanSnapshot {
  return {
    version: 1,
    items: recommendations.map(createTodayPlanSnapshotItem),
  };
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
  missionProgress: ReturnType<typeof useMissionProgress>;
  capstoneProgress: ReturnType<typeof useCapstoneProgress>;
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

  if (hasNoLocalStudyState && snapshotKeys.join('|') !== liveCoreKeys.join('|')) {
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
  missionProgress: ReturnType<typeof useMissionProgress>,
  capstoneProgress: ReturnType<typeof useCapstoneProgress>,
  liveReviewRecommendation: TodayRecommendation | null,
) {
  if (item.kind === 'review') {
    return !liveReviewRecommendation;
  }

  if (item.kind === 'capstone') {
    return item.capstoneStoryId
      ? getCapstoneProgressEntry(capstoneProgress, item.capstoneStoryId).isCompleted
      : false;
  }

  return item.missionId
    ? getMissionProgressEntry(missionProgress, item.missionId).isCompleted
    : false;
}

function buildTodayPlanAction(
  item: TodayPlanSnapshotItem,
  isFirstOpenItem: boolean,
): SessionSummaryAction {
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

function createRecommendationByKey(recommendations: TodayRecommendation[]) {
  return new Map(
    recommendations.map((recommendation) => [
      getRecommendationKey(recommendation),
      recommendation,
    ]),
  );
}

function getRecommendationKey(recommendation: TodayRecommendation) {
  if (recommendation.kind === 'review') {
    return 'review-loop';
  }

  if (recommendation.kind === 'capstone') {
    return recommendation.capstoneMode === 'recombination'
      ? `capstone-recombination:${recommendation.capstoneStory.id}`
      : `capstone:${recommendation.capstoneStory.id}`;
  }

  return `mission:${recommendation.mission.id}`;
}

function isTodayPlanSnapshot(value: unknown): value is TodayPlanSnapshot {
  if (!isRecord(value) || value.version !== 1 || !Array.isArray(value.items)) {
    return false;
  }

  return value.items.every(isTodayPlanSnapshotItem);
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

function getRecommendationMinuteTotal(recommendations: TodayRecommendation[]) {
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

function filterContinueMissionRecommendation(
  recommendations: TodayRecommendation[],
  continueMissionId: string | null,
) {
  if (!continueMissionId) {
    return recommendations;
  }

  return recommendations.filter((recommendation) => {
    return (
      recommendation.kind !== 'mission' ||
      recommendation.mission.id !== continueMissionId
    );
  });
}

function isCoreRecommendation(recommendation: TodayRecommendation) {
  return recommendation.priority !== 'bonus';
}

function buildMissionPracticeRecap(missionCompletion: TodayMissionCompletion) {
  return `${missionCompletion.clearedCount}/${missionCompletion.totalCount} ${formatMissionUnitLabel(
    missionCompletion.missionType,
    missionCompletion.totalCount,
  )} in ${formatTargetSkillLabel(missionCompletion.targetSkill)}.`;
}

function buildMissionSkillRecap(
  skillArea: SkillAreaProgress | null,
  missionCompletion: TodayMissionCompletion,
) {
  if (!skillArea) {
    return `${formatTargetSkillLabel(missionCompletion.targetSkill)} got one more local practice signal.`;
  }

  const tierLabel = formatSkillTierLabel(skillArea.tier).toLowerCase();
  const completionLabel = `${skillArea.completionCount} related completion${
    skillArea.completionCount === 1 ? '' : 's'
  }`;

  return `${skillArea.label} is ${tierLabel}; ${completionLabel} on this device.`;
}

function buildMissionReviewImpact(missionWeakPointCount: number) {
  if (missionWeakPointCount > 0) {
    return `${missionWeakPointCount} item${
      missionWeakPointCount === 1 ? '' : 's'
    } from this mission still ${missionWeakPointCount === 1 ? 'needs' : 'need'} review.`;
  }

  return 'No open weak point from this mission right now.';
}

function buildReviewCompletionBody(reviewCompletion: TodayReviewCompletion) {
  if (reviewCompletion.remainingWeakPointCount === 0) {
    return 'Review is clear now. Today will not add another required Review step unless a new miss is saved.';
  }

  const remainingCopy = `${formatCountedNoun(
    reviewCompletion.remainingWeakPointCount,
    'weak point',
  )} still ${reviewCompletion.remainingWeakPointCount === 1 ? 'needs' : 'need'} review.`;

  const nextBatchCopy =
    reviewCompletion.nextBatchSize > 0
      ? `${formatCountedNoun(reviewCompletion.nextBatchSize, 'retry item')} ${
          reviewCompletion.nextBatchSize === 1 ? 'is' : 'are'
        } ready now.`
      : 'No next short batch is ready right now.';

  return `${remainingCopy} ${nextBatchCopy}`;
}

function buildReviewSkillSignal(reviewCompletion: TodayReviewCompletion) {
  if (reviewCompletion.clearedCount === 0) {
    return 'No retry cleared yet, so the item stays queued for another pass.';
  }

  return `${formatCountedNoun(reviewCompletion.clearedCount, 'retry item')} ${
    reviewCompletion.clearedCount === 1 ? 'was' : 'were'
  } cleared.`;
}

function resolveContinueMission(
  starterContent: StarterContent,
  missionProgress: ReturnType<typeof useMissionProgress>,
  continueState: ContinueStateRecord,
) {
  if (!continueState.lastActiveMissionId || !continueState.missionType) {
    return null;
  }

  const mission = starterContent.byId.missions[continueState.lastActiveMissionId];

  if (!mission || mission.type !== continueState.missionType) {
    return null;
  }

  const progress = getMissionProgressEntry(missionProgress, mission.id);

  if (progress.isCompleted) {
    return null;
  }

  return {
    mission,
    detail: formatContinueDetail(starterContent, mission, continueState.stepIndex),
  };
}

function formatContinueDetail(
  starterContent: StarterContent,
  mission: Mission,
  stepIndex: number | null,
) {
  if (mission.type === 'grammar') {
    const sectionNames = ['lesson intro', 'examples', 'common mistakes', 'drills'];
    const safeStepIndex =
      typeof stepIndex === 'number' && sectionNames[stepIndex]
        ? stepIndex
        : 0;

    return `Resume ${sectionNames[safeStepIndex]} (${safeStepIndex + 1} of ${sectionNames.length}).`;
  }

  if (mission.type === 'listening') {
    const totalItems = mission.contentRefs.listeningItemIds?.length ?? 0;
    const safeStepIndex =
      typeof stepIndex === 'number' && stepIndex >= 0 && stepIndex < totalItems
        ? stepIndex
        : 0;

    return `Resume listening item ${safeStepIndex + 1} of ${totalItems}.`;
  }

  if (mission.type === 'reading') {
    const totalChecks = starterContent.byId.missions[mission.id].readingChecks?.length ?? 0;
    const safeStepIndex =
      typeof stepIndex === 'number' && stepIndex >= 0 && stepIndex < totalChecks
        ? stepIndex
        : 0;

    return `Resume reading check ${safeStepIndex + 1} of ${totalChecks}.`;
  }

  const totalTasks = starterContent.byId.missions[mission.id].outputTasks?.length ?? 0;
  const safeStepIndex =
    typeof stepIndex === 'number' && stepIndex >= 0 && stepIndex < totalTasks
      ? stepIndex
      : 0;

  return `Resume output task ${safeStepIndex + 1} of ${totalTasks}.`;
}

function formatMissionTypeLabel(type: TodayMissionCompletion['missionType']) {
  switch (type) {
    case 'grammar':
      return 'Grammar';
    case 'listening':
      return 'Listening';
    case 'output':
      return 'Output';
    case 'reading':
      return 'Reading';
  }
}

function formatTargetSkillLabel(targetSkill: TodayMissionCompletion['targetSkill']) {
  return targetSkill.replace(/-/g, ' ');
}

function formatCountedNoun(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? '' : 's'}`;
}

function formatMissionUnitLabel(
  missionType: TodayMissionCompletion['missionType'],
  totalCount: number,
) {
  const unitLabel =
    missionType === 'grammar'
      ? 'drill'
      : missionType === 'listening'
        ? 'listening check'
        : missionType === 'output'
          ? 'output task'
          : 'reading check';

  return `${unitLabel}${totalCount === 1 ? '' : 's'}`;
}
