import { Link } from 'react-router-dom';
import {
  getCapstoneProgressEntry,
  useCapstoneProgress,
} from '../../../lib/progress/capstoneProgress';
import {
  buildContentNote,
  formatMissionType,
  formatTargetSkill,
  MissionLibraryCard,
  type MissionLibraryCardData,
} from './MissionLibraryCard';
import type { StarterContent } from '../../../lib/content/types';
import type { MissionLibraryChapter } from '../lib/missionLibraryStructure';

type MissionChapterCardProps = {
  chapter: MissionLibraryChapter;
  items: MissionLibraryCardData[];
  starterContent: StarterContent;
};

export function MissionChapterCard({
  chapter,
  items,
  starterContent,
}: MissionChapterCardProps) {
  const capstoneProgress = useCapstoneProgress();
  const completedCount = items.filter((item) => item.progress.isCompleted).length;
  const unlockedCount = items.filter((item) => item.isUnlocked).length;
  const recommendedCount = items.filter((item) => item.isRecommended).length;
  const weakPointCount = items.filter((item) => item.weakPointCount > 0).length;
  const readyCount = items.filter(
    (item) => item.isUnlocked && item.progress.completionCount === 0,
  ).length;
  const nextMission = items.find(
    (item) => item.isUnlocked && item.progress.completionCount === 0,
  );
  const isChapterCleared = completedCount === items.length;
  const capstoneStories =
    chapter.kind === 'core'
      ? starterContent.capstoneStories.filter((story) => story.chapterId === chapter.id)
      : [];

  return (
    <section className="mission-chapter" id={chapter.id}>
      <div className="mission-chapter__body">
        {nextMission ? (
          <div className="mission-focus-card mission-chapter__focus">
            <div className="mission-chapter__focus-copy">
              <p className="mission-focus-card__eyebrow">Next mission in this chapter</p>
              <h4 className="mission-chapter__focus-title">{nextMission.mission.title}</h4>
              <p className="mission-chapter__focus-body">
                {formatMissionType(nextMission.mission.type)} ·{' '}
                {formatTargetSkill(nextMission.mission.targetSkill)} ·{' '}
                {buildContentNote(nextMission.mission, starterContent)}
              </p>
            </div>
            <Link
              to={`/mission/${nextMission.mission.id}`}
              className="inline-link"
              aria-label={`Start ${nextMission.mission.title}`}
            >
              Start next
            </Link>
          </div>
        ) : null}

        <div className="mission-chapter__state-row" aria-label="Chapter state">
          {recommendedCount > 0 ? (
            <span className="mission-state-pill mission-state-pill--recommended">
              {recommendedCount} recommended today
            </span>
          ) : null}
          <span className="mission-state-pill mission-state-pill--ready">
            {readyCount} ready now
          </span>
          <span className="mission-state-pill mission-state-pill--ready">
            {unlockedCount}/{items.length} unlocked
          </span>
          <span className="mission-state-pill mission-state-pill--completed">
            {completedCount}/{items.length} cleared
          </span>
          {weakPointCount > 0 ? (
            <span className="mission-state-pill mission-state-pill--review">
              {weakPointCount} need review
            </span>
          ) : null}
          {!nextMission ? (
            <span
              className={
                isChapterCleared
                  ? 'mission-state-pill mission-state-pill--completed'
                  : 'mission-state-pill mission-state-pill--locked'
              }
            >
              {isChapterCleared ? 'Chapter cleared' : 'Locked for now'}
            </span>
          ) : null}
        </div>

        <details className="mission-session-details">
          <summary className="mission-session-details__summary">Chapter details</summary>
          <div className="mission-chapter__detail-stack">
            <p className="mission-session-details__body">{chapter.description}</p>
            {chapter.packTitles?.length ? (
              <p className="mission-session-details__body">
                {chapter.packTitles.join(' · ')}
              </p>
            ) : null}
          </div>
        </details>

        {capstoneStories.length > 0 ? (
          <div className="mission-chapter__capstone-list" role="list" aria-label="Chapter capstones">
            {capstoneStories.map((story) => {
              const progress = getCapstoneProgressEntry(capstoneProgress, story.id);

              return (
                <div key={story.id} className="mission-focus-card mission-chapter__capstone" role="listitem">
                  <div className="mission-chapter__focus-copy">
                    <p className="mission-focus-card__eyebrow">Chapter capstone</p>
                    <h4 className="mission-chapter__focus-title">{story.title}</h4>
                    <p className="mission-chapter__focus-body">
                      {story.summary}
                    </p>
                    <div className="mission-chapter__state-row" aria-label={`${story.title} state`}>
                      <span
                        className={
                          progress.isCompleted
                            ? 'mission-state-pill mission-state-pill--completed'
                            : 'mission-state-pill mission-state-pill--ready'
                        }
                      >
                        {progress.isCompleted ? 'Capstone cleared' : 'Ready'}
                      </span>
                      <span className="mission-state-pill mission-state-pill--ready">
                        {story.lineIds.length} lines
                      </span>
                      <span className="mission-state-pill mission-state-pill--ready">
                        {story.checkIds.length} checks
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/capstone/${story.id}`}
                    className="inline-link"
                    aria-label={`Open ${story.title}`}
                  >
                    {progress.isCompleted ? 'Open again' : 'Open capstone'}
                  </Link>
                </div>
              );
            })}
          </div>
        ) : null}

        <div className="mission-list" role="list" aria-label={chapter.title}>
          {items.map((item) => (
            <div key={item.mission.id} role="listitem">
              <MissionLibraryCard item={item} starterContent={starterContent} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
