import { PageShell, SurfaceCard } from '../../../components/layout/PageShell';
import { getStarterContent } from '../../../lib/content/loader';
import {
  getMissionProgressEntry,
  useMissionProgress,
} from '../../../lib/progress/missionProgress';
import { useReviewLoopProgress } from '../../../lib/progress/reviewLoop';
import { getWeakPointList, useWeakPoints } from '../../../lib/progress/weakPoints';
import { MissionLibraryCard, type MissionLibraryCardData } from '../components/MissionLibraryCard';
import { TodayRecommendationCard } from '../../today/components/TodayRecommendationCard';
import {
  deriveTodayRecommendations,
  isMissionUnlocked,
} from '../../today/lib/todayRecommendations';

export function MissionsPage() {
  const starterContent = getStarterContent();
  const missionProgress = useMissionProgress();
  const weakPoints = useWeakPoints();
  const reviewLoopProgress = useReviewLoopProgress();
  const recommendations = deriveTodayRecommendations(
    starterContent,
    missionProgress,
    weakPoints,
    reviewLoopProgress,
  );
  const reviewRecommendation =
    recommendations.find((recommendation) => recommendation.kind === 'review') ?? null;
  const recommendedMissions = recommendations.filter(
    (recommendation) => recommendation.kind === 'mission',
  );
  const recommendedByMissionId = new Map(
    recommendedMissions.map((recommendation) => [recommendation.mission.id, recommendation]),
  );
  const weakPointList = getWeakPointList(weakPoints);
  const weakPointPressureByMissionId = weakPointList.reduce<
    Record<string, { weakPointCount: number; totalMisses: number }>
  >((record, weakPoint) => {
    const currentEntry = record[weakPoint.missionId] ?? {
      weakPointCount: 0,
      totalMisses: 0,
    };

    record[weakPoint.missionId] = {
      weakPointCount: currentEntry.weakPointCount + 1,
      totalMisses: currentEntry.totalMisses + weakPoint.missCount,
    };

    return record;
  }, {});
  const missionLibrary = starterContent.missions.map<MissionLibraryCardData>((mission) => {
    const recommendation = recommendedByMissionId.get(mission.id);
    const weakPointPressure = weakPointPressureByMissionId[mission.id] ?? {
      weakPointCount: 0,
      totalMisses: 0,
    };

    return {
      mission,
      progress: getMissionProgressEntry(missionProgress, mission.id),
      isUnlocked: isMissionUnlocked(mission, missionProgress),
      isRecommended: Boolean(recommendation),
      recommendedSlotLabel: recommendation?.slotLabel,
      recommendedReason: recommendation?.reason,
      weakPointCount: weakPointPressure.weakPointCount,
      totalMisses: weakPointPressure.totalMisses,
      unlockRequirement: buildUnlockRequirement(mission, starterContent),
    };
  });
  const recommendedSection = missionLibrary.filter((item) => item.isRecommended);
  const unlockedSection = missionLibrary.filter(
    (item) => item.isUnlocked && !item.isRecommended,
  );
  const lockedSection = missionLibrary.filter((item) => !item.isUnlocked);
  const completedCount = missionLibrary.filter((item) => item.progress.isCompleted).length;
  const unlockedCount = missionLibrary.filter((item) => item.isUnlocked).length;
  const weakPointMissionCount = missionLibrary.filter((item) => item.weakPointCount > 0).length;

  return (
    <PageShell
      eyebrow="Mission Library"
      title="Missions"
      description="Browse the full mission stack with the same local recommendation, unlock, completion, and weak-point signals used elsewhere in the app."
      aside={<span className="status-chip">Local mission library</span>}
    >
      <SurfaceCard
        title="Library at a glance"
        description="All mission state comes from current starter content plus local progress, unlock rules, and weak-point data."
      >
        <dl className="mission-library-summary">
          <div className="mission-library-summary__stat">
            <dt>Total missions</dt>
            <dd>{starterContent.summary.missionCount}</dd>
          </div>
          <div className="mission-library-summary__stat">
            <dt>Unlocked now</dt>
            <dd>{unlockedCount}</dd>
          </div>
          <div className="mission-library-summary__stat">
            <dt>Completed</dt>
            <dd>{completedCount}</dd>
          </div>
          <div className="mission-library-summary__stat">
            <dt>With weak points</dt>
            <dd>{weakPointMissionCount}</dd>
          </div>
        </dl>
      </SurfaceCard>

      {reviewRecommendation ? (
        <SurfaceCard
          title="Review first"
          description="Today recommends the review loop before more mission work because unresolved misses are still open."
        >
          <div className="mission-list" role="list" aria-label="Review recommendation">
            <div role="listitem">
              <TodayRecommendationCard
                recommendation={reviewRecommendation}
                missionProgress={missionProgress}
              />
            </div>
          </div>
        </SurfaceCard>
      ) : null}

      {recommendedSection.length > 0 ? (
        <SurfaceCard
          title="Recommended today"
          description="These missions come directly from the same Today recommendation helper used on the daily entry screen."
        >
          <MissionSection
            ariaLabel="Recommended missions"
            items={recommendedSection}
            starterContent={starterContent}
          />
        </SurfaceCard>
      ) : null}

      <SurfaceCard
        title="Ready to open"
        description="Unlocked missions stay available even after completion, so you can revisit them for a light pass or reinforcement."
      >
        <MissionSection
          ariaLabel="Unlocked missions"
          items={unlockedSection}
          starterContent={starterContent}
          emptyState="No additional unlocked missions right now."
        />
      </SurfaceCard>

      <SurfaceCard
        title="Locked next"
        description="Locked missions stay visible so the path is easy to inspect. Unlock text comes from current required-mission rules only."
      >
        <MissionSection
          ariaLabel="Locked missions"
          items={lockedSection}
          starterContent={starterContent}
          emptyState="All current starter missions are unlocked."
        />
      </SurfaceCard>

      <SurfaceCard
        title="How states work"
        description="The mission library stays deliberately small and explicit."
      >
        <ul className="simple-list">
          <li>Recommended missions come from the same deterministic Today recommendation helper used on the home screen.</li>
          <li>Unlocked or locked state comes only from each mission&apos;s `requiredMissionIds` and local completion data.</li>
          <li>Completed state comes from manual mission completion on this device.</li>
          <li>Needs review appears only when the weak-point store has recorded misses for that mission.</li>
        </ul>
      </SurfaceCard>
    </PageShell>
  );
}

type MissionSectionProps = {
  ariaLabel: string;
  items: MissionLibraryCardData[];
  starterContent: ReturnType<typeof getStarterContent>;
  emptyState?: string;
};

function MissionSection({
  ariaLabel,
  items,
  starterContent,
  emptyState = 'No missions in this section.',
}: MissionSectionProps) {
  if (items.length === 0) {
    return (
      <ul className="simple-list">
        <li>{emptyState}</li>
      </ul>
    );
  }

  return (
    <div className="mission-list" role="list" aria-label={ariaLabel}>
      {items.map((item) => (
        <div key={item.mission.id} role="listitem">
          <MissionLibraryCard item={item} starterContent={starterContent} />
        </div>
      ))}
    </div>
  );
}

function buildUnlockRequirement(
  mission: ReturnType<typeof getStarterContent>['missions'][number],
  starterContent: ReturnType<typeof getStarterContent>,
) {
  const requiredMissionIds = mission.unlockRules?.requiredMissionIds;

  if (!requiredMissionIds?.length) {
    return null;
  }

  const titles = requiredMissionIds.map((requiredMissionId) => {
    return starterContent.byId.missions[requiredMissionId]?.title ?? requiredMissionId;
  });

  if (titles.length === 1) {
    return `Complete "${titles[0]}" first.`;
  }

  return `Complete ${titles.slice(0, -1).map((title) => `"${title}"`).join(', ')} and "${
    titles[titles.length - 1]
  }" first.`;
}
