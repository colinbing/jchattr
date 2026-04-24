import { useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
    const nextMission = items.find(
      (item) => item.isUnlocked && item.progress.completionCount === 0,
    );

    return {
      chapter,
      items,
      nextMission,
      completedCount: items.filter((item) => item.progress.isCompleted).length,
      unlockedCount: items.filter((item) => item.isUnlocked).length,
      recommendedCount: items.filter((item) => item.isRecommended).length,
      weakPointCount: items.filter((item) => item.weakPointCount > 0).length,
    };
  });
  const hashId = location.hash.replace(/^#/, '');
  const defaultSectionId =
    chapterSections.find((section) => section.chapter.id === hashId)?.chapter.id ??
    chapterSections.find((section) => section.recommendedCount > 0)?.chapter.id ??
    chapterSections.find((section) => Boolean(section.nextMission))?.chapter.id ??
    chapterSections[0]?.chapter.id ??
    '';
  const activeSection =
    chapterSections.find((section) => section.chapter.id === defaultSectionId) ?? null;
  const activeSectionIndex = activeSection
    ? chapterSections.findIndex((section) => section.chapter.id === activeSection.chapter.id)
    : -1;
  const previousSection =
    activeSectionIndex > 0 ? chapterSections[activeSectionIndex - 1] : null;
  const nextSection =
    activeSectionIndex >= 0 && activeSectionIndex < chapterSections.length - 1
      ? chapterSections[activeSectionIndex + 1]
      : null;
  const recommendedSection = missionLibrary.filter((item) => item.isRecommended);
  const completedCount = missionLibrary.filter((item) => item.progress.isCompleted).length;
  const unlockedCount = missionLibrary.filter((item) => item.isUnlocked).length;
  const weakPointMissionCount = missionLibrary.filter((item) => item.weakPointCount > 0).length;
  const coreChapterCount = chapterSections.filter(
    (section) => section.chapter.kind === 'core',
  ).length;
  const readingMissionCount =
    chapterSections.find((section) => section.chapter.kind === 'reading')?.items.length ?? 0;

  function openChapter(chapterId: string) {
    navigate(`/missions#${chapterId}`, { replace: true });
  }

  return (
    <PageShell
      eyebrow="Mission Library"
      title="Missions"
      description="Browse the mission path as one active chapter at a time instead of a long stacked backlog. Core packs and reading checkpoints stay inside the same local-first library, but the page now reads like progression instead of archive management."
      aside={<span className="status-chip">Progression path</span>}
    >
      <SurfaceCard
        className="mission-library-page__section"
        title="Library at a glance"
        description="All mission state still comes from local progress, unlock rules, and weak-point data, but the library now uses a single-active-chapter format so desktop and mobile both stay readable."
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
          className="mission-library-page__section"
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
          className="mission-library-page__section"
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
        className="mission-library-page__section"
        title="Mission path"
        description="This page now uses a single-column, single-active-chapter format. Pick a chapter from the switcher, work inside that chapter, then move forward without scanning the whole library at once."
      >
        <div className="mission-library-switcher">
          <div className="mission-library-switcher__track" role="tablist" aria-label="Mission chapters">
            {chapterSections.map((section) => {
              const isActive = activeSection?.chapter.id === section.chapter.id;
              const completionLabel = `${section.completedCount}/${section.items.length} cleared`;
              return (
                <button
                  key={section.chapter.id}
                  type="button"
                  id={`mission-library-tab-${section.chapter.id}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="mission-library-active-panel"
                  className={
                    isActive
                      ? 'mission-library-switcher__tab mission-library-switcher__tab--active'
                      : 'mission-library-switcher__tab'
                  }
                  onClick={() => openChapter(section.chapter.id)}
                >
                  <span className="mission-library-switcher__tab-label">
                    {section.chapter.label}
                  </span>
                  <span className="mission-library-switcher__tab-title">
                    {section.chapter.title}
                  </span>
                  <span className="mission-library-switcher__tab-meta">{completionLabel}</span>
                </button>
              );
            })}
          </div>

          {activeSection ? (
            <div
              className="mission-library-switcher__active"
              id="mission-library-active-panel"
              role="tabpanel"
              aria-labelledby={`mission-library-tab-${activeSection.chapter.id}`}
            >
              <div className="mission-library-switcher__toolbar">
                <div className="mission-library-switcher__toolbar-copy">
                  <p className="mission-library-switcher__eyebrow">Active chapter</p>
                  <h3 className="mission-library-switcher__title">
                    {activeSection.chapter.title}
                  </h3>
                  <p className="mission-library-switcher__body">
                    {activeSection.chapter.kind === 'reading'
                      ? 'Use the reading lane as deliberate recombination once the core path is moving.'
                      : 'Use the chapter switcher to stay inside one five-pack block at a time instead of scanning a full page of chapters.'}
                  </p>
                </div>

                <div className="mission-library-switcher__actions">
                  <button
                    type="button"
                    className="mission-button mission-button--secondary"
                    onClick={() => previousSection && openChapter(previousSection.chapter.id)}
                    disabled={!previousSection}
                  >
                    Previous chapter
                  </button>
                  <button
                    type="button"
                    className="mission-button"
                    onClick={() => nextSection && openChapter(nextSection.chapter.id)}
                    disabled={!nextSection}
                  >
                    Next chapter
                  </button>
                </div>
              </div>

              <MissionChapterCard
                chapter={activeSection.chapter}
                items={activeSection.items}
                starterContent={starterContent}
              />
            </div>
          ) : null}
        </div>
      </SurfaceCard>

      <SurfaceCard
        className="mission-library-page__section"
        title="How the path works"
        description="The library still uses the same deterministic rules, but it now shows them as one chosen chapter at a time instead of an all-open stack."
      >
        <ul className="simple-list">
          <li>Core chapters follow the shipped five-pack curriculum path so the mission stack feels like progression, not a dump.</li>
          <li>Reading checkpoints stay in their own lane because they are reinforcement and recombination, not the main unlock spine.</li>
          <li>The current format choice is explicit: a single-active-chapter sequence instead of the earlier two-column grouped stack.</li>
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
