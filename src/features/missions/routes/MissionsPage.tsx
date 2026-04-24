import { useLocation } from 'react-router-dom';
import { PageShell, SurfaceCard } from '../../../components/layout/PageShell';
import { getStarterContent } from '../../../lib/content/loader';
import {
  getMissionProgressEntry,
  useMissionProgress,
} from '../../../lib/progress/missionProgress';
import { useReviewLoopProgress } from '../../../lib/progress/reviewLoop';
import { getWeakPointList, useWeakPoints } from '../../../lib/progress/weakPoints';
import { MissionLibraryCard, type MissionLibraryCardData } from '../components/MissionLibraryCard';
import { MissionChapterCard } from '../components/MissionChapterCard';
import { TodayRecommendationCard } from '../../today/components/TodayRecommendationCard';
import {
  deriveTodayRecommendations,
  isMissionUnlocked,
} from '../../today/lib/todayRecommendations';
import { missionLibraryChapters } from '../lib/missionLibraryStructure';

export function MissionsPage() {
  const location = useLocation();
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
  const missionLibraryById = new Map(
    missionLibrary.map((item) => [item.mission.id, item]),
  );
  const chapterSections = missionLibraryChapters.map((chapter) => {
    const items = chapter.missionIds
      .map((missionId) => missionLibraryById.get(missionId))
      .filter((item): item is MissionLibraryCardData => Boolean(item));
    const hashId = location.hash.replace(/^#/, '');
    const nextMission = items.find(
      (item) => item.isUnlocked && item.progress.completionCount === 0,
    );

    return {
      chapter,
      items,
      isOpenByDefault:
        hashId === chapter.id ||
        items.some((item) => item.isRecommended) ||
        Boolean(nextMission),
    };
  });
  const recommendedSection = missionLibrary.filter((item) => item.isRecommended);
  const completedCount = missionLibrary.filter((item) => item.progress.isCompleted).length;
  const unlockedCount = missionLibrary.filter((item) => item.isUnlocked).length;
  const weakPointMissionCount = missionLibrary.filter((item) => item.weakPointCount > 0).length;
  const coreChapterCount = chapterSections.filter(
    (section) => section.chapter.kind === 'core',
  ).length;
  const readingMissionCount =
    chapterSections.find((section) => section.chapter.kind === 'reading')?.items.length ?? 0;

  return (
    <PageShell
      eyebrow="Mission Library"
      title="Missions"
      description="Browse the mission path as progression chapters instead of one flat backlog. Core packs and reading checkpoints stay visible in the same local-first library."
      aside={<span className="status-chip">Progression path</span>}
    >
      <SurfaceCard
        title="Library at a glance"
        description="All mission state still comes from local progress, unlock rules, and weak-point data, but the library is grouped into chapters so the path is easier to read."
      >
        <dl className="mission-library-summary">
          <div className="mission-library-summary__stat">
            <dt>Total missions</dt>
            <dd>{starterContent.summary.missionCount}</dd>
          </div>
          <div className="mission-library-summary__stat">
            <dt>Core chapters</dt>
            <dd>{coreChapterCount}</dd>
          </div>
          <div className="mission-library-summary__stat">
            <dt>Reading missions</dt>
            <dd>{readingMissionCount}</dd>
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
          <div className="mission-list" role="list" aria-label="Recommended missions">
            {recommendedSection.map((item) => (
              <div key={item.mission.id} role="listitem">
                <MissionLibraryCard item={item} starterContent={starterContent} />
              </div>
            ))}
          </div>
        </SurfaceCard>
      ) : null}

      <SurfaceCard
        title="Mission path"
        description="Open the current chapter, keep the main path moving, and use the reading lane as a recombination track rather than a second backlog."
      >
        <div className="mission-chapter-list">
          {chapterSections.map((section) => (
            <MissionChapterCard
              key={section.chapter.id}
              chapter={section.chapter}
              items={section.items}
              starterContent={starterContent}
              isOpenByDefault={section.isOpenByDefault}
            />
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard
        title="How the path works"
        description="The library still uses the same deterministic rules, but it now shows them as a sequence instead of three disconnected buckets."
      >
        <ul className="simple-list">
          <li>Core chapters follow the shipped five-pack curriculum path so the mission stack feels like progression, not a dump.</li>
          <li>Reading checkpoints stay in their own lane because they are reinforcement and recombination, not the main unlock spine.</li>
          <li>Unlocked or locked state still comes only from `requiredMissionIds` and local completion data.</li>
          <li>Recommended today and needs-review states still come from the same deterministic local helpers used elsewhere in the app.</li>
        </ul>
      </SurfaceCard>
    </PageShell>
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
