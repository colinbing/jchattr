import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PageShell, SurfaceCard } from '../../../components/layout/PageShell';
import type { Mission, StarterContent } from '../../../lib/content/types';
import { ContinueMissionCard } from '../components/ContinueMissionCard';
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
import { useReviewLoopProgress } from '../../../lib/progress/reviewLoop';
import { useWeakPoints } from '../../../lib/progress/weakPoints';
import {
  deriveTodayRecommendations,
  type TodayRecommendation,
  isMissionUnlocked,
} from '../lib/todayRecommendations';
import { missionLibraryChapters } from '../../missions/lib/missionLibraryStructure';
import type { MissionCompletionSummary } from '../../missions/lib/missionSession';

export function TodayPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const starterContent = getStarterContent();
  const missionProgress = useMissionProgress();
  const weakPoints = useWeakPoints();
  const reviewLoopProgress = useReviewLoopProgress();
  const continueState = useContinueState();
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
  );
  const continueMission = resolveContinueMission(
    starterContent,
    missionProgress,
    continueState,
  );
  const requiredRecommendations =
    recommendations.length > 2 ? recommendations.slice(0, 2) : recommendations;
  const bonusRecommendations =
    recommendations.length > 2 ? recommendations.slice(2) : [];
  const primaryReturnAction = getPrimaryReturnAction(requiredRecommendations);
  const currentCoreChapter =
    missionLibraryChapters
      .filter((chapter) => chapter.kind === 'core')
      .map((chapter) => {
        const chapterMissions = chapter.missionIds.map(
          (missionId) => starterContent.byId.missions[missionId],
        );
        const completedCount = chapterMissions.filter((mission) =>
          getMissionProgressEntry(missionProgress, mission.id).isCompleted,
        ).length;
        const nextMission =
          chapterMissions.find((mission) => {
            const progress = getMissionProgressEntry(missionProgress, mission.id);
            return isMissionUnlocked(mission, missionProgress) && progress.completionCount === 0;
          }) ?? null;

        return {
          chapter,
          missionCount: chapterMissions.length,
          completedCount,
          nextMission,
        };
      })
      .find((entry) => entry.nextMission) ??
    null;
  const readingChapter = missionLibraryChapters.find(
    (chapter) => chapter.kind === 'reading',
  );
  const readingCounts = readingChapter
    ? readingChapter.missionIds.reduce(
        (summary, missionId) => {
          const progress = getMissionProgressEntry(missionProgress, missionId);
          return {
            missionCount: summary.missionCount + 1,
            completedCount: summary.completedCount + (progress.isCompleted ? 1 : 0),
          };
        },
        { missionCount: 0, completedCount: 0 },
      )
    : null;

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

  return (
    <PageShell
      variant="compact"
      eyebrow="Daily Entry"
      title="Today"
      description="Start with the small daily plan. Open the rest only if you want more."
      aside={<span className="status-chip">Daily loop</span>}
    >
      <SessionSummary
        missionCount={starterContent.summary.missionCount}
        chapterCount={missionLibraryChapters.length}
        requiredCount={requiredRecommendations.length}
        requiredMinutes={getRecommendationMinuteTotal(requiredRecommendations)}
        bonusCount={bonusRecommendations.length}
        bonusMinutes={getRecommendationMinuteTotal(bonusRecommendations)}
      />

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

            <div className="review-chip-row" aria-label="Returned mission summary">
              <span className="review-chip">
                {missionCompletion.sessionMode === 'reinforce' ? 'Short reinforce pass' : 'Core mission pass'}
              </span>
              <span className="review-chip">Today is ready with the next step</span>
            </div>

            {primaryReturnAction ? (
              <div className="mission-step-actions review-card-actions">
                <Link
                  to={primaryReturnAction.to}
                  state={primaryReturnAction.state}
                  className="mission-button mission-button--link"
                >
                  {primaryReturnAction.label}
                </Link>
                <Link
                  to="/missions"
                  className="mission-button mission-button--secondary mission-button--link"
                >
                  Mission path
                </Link>
              </div>
            ) : null}
          </div>
        </SurfaceCard>
      ) : null}

      {reviewCompletion ? (
        <SurfaceCard
          className="today-support-card"
          title="Review finished"
          description={
            reviewCompletion.nextBatchSize > 0
              ? 'The queue is lighter. Keep moving with Today first.'
              : 'The review queue is clear. Move straight into Today.'
          }
        >
          <div className="review-return-card">
            <p className="review-launch-card__title">
              {reviewCompletion.clearedCount}/{reviewCompletion.attemptedCount} retries cleared
            </p>
            <p className="review-launch-card__body">
              {reviewCompletion.unresolvedCount > 0
                ? `${reviewCompletion.unresolvedCount} item${
                    reviewCompletion.unresolvedCount === 1 ? '' : 's'
                  } still need another pass.`
                : 'That batch is fully cleared.'}{' '}
              {reviewCompletion.nextBatchSize > 0
                ? `${reviewCompletion.nextBatchSize} more item${
                    reviewCompletion.nextBatchSize === 1 ? '' : 's'
                  } are waiting in Review.`
                : 'No next review batch is queued right now.'}
            </p>

            <div className="review-chip-row" aria-label="Returned review summary">
              <span className="review-chip">
                {reviewCompletion.remainingWeakPointCount} weak point
                {reviewCompletion.remainingWeakPointCount === 1 ? '' : 's'} left
              </span>
              <span className="review-chip">
                {reviewCompletion.nextBatchSize > 0
                  ? `${reviewCompletion.nextBatchSize} ready in Review`
                  : 'Queue clear for now'}
              </span>
            </div>

            {primaryReturnAction ? (
              <div className="mission-step-actions review-card-actions">
                <Link
                  to={primaryReturnAction.to}
                  state={primaryReturnAction.state}
                  className="mission-button mission-button--link"
                >
                  {primaryReturnAction.label}
                </Link>
                {reviewCompletion.nextBatchSize > 0 ? (
                  <Link
                    to="/review"
                    className="mission-button mission-button--secondary mission-button--link"
                  >
                    Review again later
                  </Link>
                ) : (
                  <Link
                    to="/missions"
                    className="mission-button mission-button--secondary mission-button--link"
                  >
                    Mission path
                  </Link>
                )}
              </div>
            ) : null}
          </div>
        </SurfaceCard>
      ) : null}

      <SurfaceCard
        title="Do this today"
        description="Do the core plan first. Keep it short."
      >
        <div className="mission-list" role="list" aria-label="Do this today">
          {requiredRecommendations.map((recommendation) => (
            <div key={recommendation.id} role="listitem">
              <TodayRecommendationCard
                recommendation={recommendation}
                missionProgress={missionProgress}
                linkState={
                  recommendation.kind === 'review'
                    ? { returnTo: 'today' }
                    : undefined
                }
              />
            </div>
          ))}
        </div>
      </SurfaceCard>

      {continueMission ? (
        <SurfaceCard
          className="today-support-card"
          title="Pick up where you stopped"
          description="Use this only if you want to resume the unfinished mission before browsing elsewhere."
        >
          <ContinueMissionCard
            mission={continueMission.mission}
            detail={continueMission.detail}
            lastVisitedAt={continueState.lastVisitedAt}
          />
        </SurfaceCard>
      ) : null}

      <SurfaceCard
        className="today-support-card"
        title="Bonus later"
        description="Open this only if you want more after the main plan."
      >
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

      <SurfaceCard
        className="today-support-card"
        title="More context"
        description="Open this only when you want the path view or loop notes."
      >
        <details className="today-details">
          <summary className="today-details__summary">Path and loop notes</summary>

          <div className="path-summary">
            <div className="path-summary__card">
              <p className="path-summary__label">Current core chapter</p>
              <h3 className="path-summary__title">
                {currentCoreChapter ? currentCoreChapter.chapter.title : 'Core path complete'}
              </h3>
              <p className="path-summary__body">
                {currentCoreChapter
                  ? `${currentCoreChapter.completedCount} of ${currentCoreChapter.missionCount} missions cleared.`
                  : 'Every core chapter is cleared on this device.'}
              </p>
              {currentCoreChapter?.nextMission ? (
                <p className="path-summary__meta">
                  Next mission: {currentCoreChapter.nextMission.title}
                </p>
              ) : null}
              <Link
                to={
                  currentCoreChapter
                    ? `/missions#${currentCoreChapter.chapter.id}`
                    : '/missions'
                }
                className="inline-link"
              >
                Open mission path
              </Link>
            </div>

            {readingCounts ? (
              <div className="path-summary__card">
                <p className="path-summary__label">Reading lane</p>
                <h3 className="path-summary__title">
                  {readingChapter?.title ?? 'Reading checkpoints'}
                </h3>
                <p className="path-summary__body">
                  {readingCounts.completedCount} of {readingCounts.missionCount} reading missions
                  cleared.
                </p>
                <p className="path-summary__meta">
                  Use this lane to recombine prior content after the core path keeps moving.
                </p>
                <Link to="/missions#chapter-reading-path" className="inline-link">
                  Open reading path
                </Link>
              </div>
            ) : null}
          </div>

          <ul className="simple-list">
            <li>Do the core plan first: review when needed, then the cleanest next mission.</li>
            <li>Use the bonus lane only if you want more while momentum is still good.</li>
            <li>Browse the full path on Missions instead of using Today as a backlog screen.</li>
          </ul>
        </details>
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

type TodayReturnAction = {
  to: string;
  state?: unknown;
  label: string;
};

function getRecommendationMinuteTotal(recommendations: TodayRecommendation[]) {
  return recommendations.reduce((total, recommendation) => {
    if (recommendation.kind === 'review') {
      return total + Math.max(4, recommendation.batchSize * 2);
    }

  return total + recommendation.mission.estimatedMinutes;
  }, 0);
}

function getPrimaryReturnAction(recommendations: TodayRecommendation[]): TodayReturnAction | null {
  const recommendation = recommendations[0];

  if (!recommendation) {
    return null;
  }

  return {
    to: recommendation.to,
    state:
      recommendation.kind === 'review'
        ? { returnTo: 'today' as const }
        : recommendation.sessionMode === 'reinforce'
          ? { sessionMode: 'reinforce' as const }
          : undefined,
    label: recommendation.ctaLabel,
  };
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
