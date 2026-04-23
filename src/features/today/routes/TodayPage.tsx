import { PageShell, SurfaceCard } from '../../../components/layout/PageShell';
import type { Mission, StarterContent } from '../../../lib/content/types';
import { MissionCard } from '../components/MissionCard';
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
import { deriveTodayRecommendations } from '../lib/todayRecommendations';

export function TodayPage() {
  const starterContent = getStarterContent();
  const missions = starterContent.missions;
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

  return (
    <PageShell
      eyebrow="Daily Entry"
      title="Today"
      description="Start from a small local-first daily plan, then browse the full mission stack below. Recommendations stay deterministic and easy to inspect."
      aside={<span className="status-chip">Starter session</span>}
    >
      <SessionSummary
        missionCount={starterContent.summary.missionCount}
        recommendedCount={recommendations.length}
        totalMinutes={starterContent.summary.totalMissionMinutes}
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
        title="Recommended today"
        description="This daily plan uses only local mission progress, weak points, recent review activity, and unlock rules. It stays small on purpose: review, next step, then one support slot."
      >
        <div className="mission-list" role="list" aria-label="Recommended today">
          {recommendations.map((recommendation) => (
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
        title="All missions"
        description="Browse the full starter set below. Grammar, listening, output, and reading missions all stay available as the secondary view."
      >
        <div className="mission-list" role="list" aria-label="All missions">
          {missions.map((mission) => (
            <div key={mission.id} role="listitem">
              <MissionCard
                mission={mission}
                progress={getMissionProgressEntry(missionProgress, mission.id)}
              />
            </div>
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard
        title="Session shape"
        description="Recommendations stay explicit: one review pass when needed, one unlocked next step, and one support slot that becomes more review-aware when weak points are fresh or repeated."
      >
        <ul className="simple-list">
          <li>
            Up to {recommendations.length} recommended items built from local
            progress, weak points, recent review history, and unlock rules
          </li>
          <li>
            {starterContent.summary.missionCount} total missions remain visible
            below as the full starter set
          </li>
          <li>
            Starter content and Today heuristics both remain local, typed, and
            hand-editable
          </li>
        </ul>
      </SurfaceCard>
    </PageShell>
  );
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
