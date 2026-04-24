import { Link } from 'react-router-dom';
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

export function TodayPage() {
  const starterContent = getStarterContent();
  const missionProgress = useMissionProgress();
  const weakPoints = useWeakPoints();
  const reviewLoopProgress = useReviewLoopProgress();
  const continueState = useContinueState();
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

  return (
    <PageShell
      eyebrow="Daily Entry"
      title="Today"
      description="Start from a small local-first daily plan, then use the mission path only when you want more. Recommendations stay deterministic and the bonus lane stays explicit."
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

      {continueMission ? (
        <SurfaceCard
          title="Continue where you left off"
          description="Jump back into the most recent unfinished mission without preserving the full page state."
        >
          <ContinueMissionCard
            mission={continueMission.mission}
            detail={continueMission.detail}
            lastVisitedAt={continueState.lastVisitedAt}
          />
        </SurfaceCard>
      ) : null}

      <SurfaceCard
        title="Do this today"
        description="This is the core daily loop. Keep it short on purpose: urgent review first when needed, then the cleanest next step in the path."
      >
        <div className="mission-list" role="list" aria-label="Do this today">
          {requiredRecommendations.map((recommendation) => (
            <div key={recommendation.id} role="listitem">
              <TodayRecommendationCard
                recommendation={recommendation}
                missionProgress={missionProgress}
              />
            </div>
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard
        title="Bonus if you want more"
        description="Use this only after the main plan. The bonus lane is there for reinforcement, stabilization, or one extra mission while momentum is still good."
      >
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
          <ul className="simple-list">
            <li>
              No extra slot is needed right now. Clear the main plan, then come back later or
              browse the mission path manually.
            </li>
          </ul>
        )}
      </SurfaceCard>

      <SurfaceCard
        title="Where you are in the path"
        description="The full mission library now lives on the Missions screen as a progression path: ten core chapters plus one reading lane."
      >
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
      </SurfaceCard>

      <SurfaceCard
        title="How the loop works"
        description="The daily loop is now explicit instead of mixing the mission backlog into the same screen."
      >
        <ul className="simple-list">
          <li>
            Do the core plan first: urgent review when needed, then the cleanest next mission.
          </li>
          <li>
            Use the bonus lane only if you want more practice while momentum is still high.
          </li>
          <li>
            Browse the full path on the Missions screen, where the library is grouped into progression chapters instead of one long flat list.
          </li>
        </ul>
      </SurfaceCard>
    </PageShell>
  );
}

function getRecommendationMinuteTotal(recommendations: TodayRecommendation[]) {
  return recommendations.reduce((total, recommendation) => {
    if (recommendation.kind === 'review') {
      return total + Math.max(4, recommendation.batchSize * 2);
    }

    return total + recommendation.mission.estimatedMinutes;
  }, 0);
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
