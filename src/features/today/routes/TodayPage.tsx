import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PageShell, SurfaceCard } from '../../../components/layout/PageShell';
import type { StarterContent } from '../../../lib/content/types';
import { SessionSummary } from '../components/SessionSummary';
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
import { useCapstoneProgress } from '../../../lib/progress/capstoneProgress';
import {
  getCurrentStudyDayKey,
  getStudyDayLabel,
  getWeekTrackerDays,
  markDailySessionPlanItemComplete,
  readDailySessionRecord,
  writeDailySessionPlan,
} from '../../../lib/progress/dailySession';
import { useReviewLoopProgress } from '../../../lib/progress/reviewLoop';
import { getWeakPointList, useWeakPoints } from '../../../lib/progress/weakPoints';
import { deriveProgressOverview } from '../../../lib/progress/skillMap';
import {
  deriveTodayRecommendations,
  type TodayRecommendation,
} from '../lib/todayRecommendations';
import { filterBonusRecommendations } from '../lib/todayBonusRecommendations';
import { getTodayPlanItemKey } from '../lib/todayPlanKeys';
import {
  createRecommendationByKey,
  createTodayPlanSnapshot,
  getRecommendationKey,
  getRecommendationMinuteTotal,
  isTodayPlanSnapshot,
  resolveTodayPlanState,
  type ContinueMissionSummary,
  type TodayPlanSnapshot,
} from '../lib/todayPlanState';
import {
  buildMissionPracticeRecap,
  buildMissionReviewImpact,
  buildMissionSkillRecap,
  formatMissionTypeLabel,
  formatTargetSkillLabel,
} from '../lib/todayPlanFormatting';
import { formatContinueDetailFromPosition } from '../lib/todayContinueDetail';
import type { MissionCompletionSummary } from '../../missions/lib/missionSession';

export function TodayPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const starterContent = getStarterContent();
  const missionProgress = useMissionProgress();
  const capstoneProgress = useCapstoneProgress();
  const weakPoints = useWeakPoints();
  const reviewLoopProgress = useReviewLoopProgress();
  const continueState = useContinueState();
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
  const completedPlanItemKeys = new Set(
    dailySessionRecord.completedPlanItemKeysByStudyDay[studyDayKey] ?? [],
  );
  const planState = resolveTodayPlanState({
    snapshot: todayPlanSnapshot,
    starterContent,
    liveCoreRecommendations,
    liveRecommendationByKey,
    liveReviewRecommendation,
    missionProgress,
    capstoneProgress,
    completedPlanItemKeys,
    weakPointCount: weakPointList.length,
    continueMission,
  });
  const bonusRecommendations = filterBonusRecommendations(
    visibleRecommendations,
    {
      planKeys: planState.planKeys,
      missionIds: planState.planMissionIds,
      capstoneStoryIds: planState.planCapstoneStoryIds,
    },
  );
  const optionalContinueMission =
    continueMission &&
    !planState.planKeys.has(
      getTodayPlanItemKey({
        kind: 'mission',
        missionId: continueMission.mission.id,
        sessionMode: 'default',
      }),
    ) &&
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
      setDailySessionRecord(
        markDailySessionPlanItemComplete(
          studyDayKey,
          getTodayPlanItemKey({
            kind: 'mission',
            missionId: nextMissionCompletion.missionId,
            sessionMode: nextMissionCompletion.sessionMode,
          }),
        ),
      );
    }

    if (nextReviewCompletion) {
      setReviewCompletion(nextReviewCompletion);
      setDailySessionRecord(
        markDailySessionPlanItemComplete(
          studyDayKey,
          getTodayPlanItemKey({ kind: 'review' }),
        ),
      );
    }

    navigate(location.pathname, { replace: true });
  }, [location.pathname, location.state, navigate, studyDayKey]);

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
      description="Follow the core plan first. Bonus practice stays optional after the daily work."
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
          description="Core work is finished. Resume this only if you want more practice."
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
        <details
          className="today-completion-disclosure"
          aria-label="Finished mission details"
        >
          <summary className="today-completion-disclosure__summary">
            <span className="today-completion-disclosure__copy">
              <span className="today-completion-disclosure__eyebrow">
                Finished today
              </span>
              <strong>{missionCompletion.missionTitle}</strong>
            </span>
            <span className="today-completion-disclosure__stats">
              {formatMissionCompletionStats(missionCompletion)}
            </span>
          </summary>

          <div className="today-completion-disclosure__body">
            <p className="review-launch-card__body">
              {formatMissionCompletionBody(missionCompletion)}
            </p>
            <p className="review-launch-card__body today-completion-disclosure__meta">
              {formatMissionTypeLabel(missionCompletion.missionType)} ·{' '}
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
                ? 'Use the core plan above for the next unfinished step.'
                : 'Core work is finished for today. Bonus practice is optional.'}
            </p>
          </div>
        </details>
      ) : null}

      {reviewCompletion ? (
        <SurfaceCard
          className="today-support-card"
          title={reviewCompletion.unresolvedCount > 0 ? 'Review pass ended' : 'Review finished'}
          description={
            reviewCompletion.unresolvedCount > 0
              ? 'Some retry work is still open. The core plan can keep moving.'
              : reviewCompletion.nextBatchSize > 0
              ? 'Review pass done. Today will show whether another retry belongs in the plan.'
              : 'The review queue is clear. Move into the core plan.'
          }
        >
          <div className="review-return-card">
            <p className="review-launch-card__title">
              {reviewCompletion.unresolvedCount > 0
                ? `${reviewCompletion.unresolvedCount}/${reviewCompletion.attemptedCount} still open`
                : `${reviewCompletion.clearedCount}/${reviewCompletion.attemptedCount} retries cleared`}
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
                ? 'Use the core plan above for the next unfinished step.'
                : 'Core work is finished for today. Bonus practice is optional.'}
            </p>
          </div>
        </SurfaceCard>
      ) : null}

      <SurfaceCard
        className="today-support-card today-bonus-card"
        title={planState.remainingCount === 0 ? 'Optional bonus practice' : 'Bonus later'}
        description={
          planState.remainingCount === 0
            ? 'Core work is finished. Add one short pass only if you still want more.'
            : 'Extra practice stays available after the core plan.'
        }
      >
        <div className="today-bonus-card__header">
          <p className="today-bonus-card__meta">
            {bonusRecommendations.length > 0
              ? `${bonusRecommendations.length} option${
                  bonusRecommendations.length === 1 ? '' : 's'
                } · about ${getRecommendationMinuteTotal(bonusRecommendations)} min`
              : 'No bonus slot right now'}
          </p>
        </div>

        {bonusRecommendations.length > 0 ? (
          <div
            className="mission-list today-bonus-list"
            role="list"
            aria-label="Bonus practice"
          >
            {bonusRecommendations.map((recommendation) => (
              <div key={getRecommendationKey(recommendation)} role="listitem">
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
      </SurfaceCard>
    </PageShell>
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

function formatMissionCompletionStats(missionCompletion: MissionCompletionSummary) {
  const reviewItemCount = missionCompletion.incorrectCount + missionCompletion.supportedCount;

  return `${missionCompletion.attemptedCount}/${missionCompletion.totalCount} attempted · ${
    missionCompletion.correctCount
  } correct · ${reviewItemCount} review item${reviewItemCount === 1 ? '' : 's'}`;
}

function formatMissionCompletionBody(missionCompletion: MissionCompletionSummary) {
  if (missionCompletion.sessionMode === 'reinforce') {
    return 'Short follow-up pass saved. Expand this only when you want the pass details.';
  }

  return 'Mission pass saved. Expand this only when you want the pass details.';
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

function buildReviewCompletionBody(reviewCompletion: TodayReviewCompletion) {
  if (reviewCompletion.remainingWeakPointCount === 0) {
    return 'Review is clear now. Today will not add another required Review step unless a new miss is saved.';
  }

  if (reviewCompletion.unresolvedCount > 0) {
    return `${formatCountedNoun(
      reviewCompletion.unresolvedCount,
      'attempted item',
    )} stayed open for another pass. Today can continue without pretending it was cleared.`;
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
): ContinueMissionSummary | null {
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
    detail: formatContinueDetailFromPosition({
      starterContent,
      mission,
      continueState,
    }),
  };
}

function formatCountedNoun(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? '' : 's'}`;
}
