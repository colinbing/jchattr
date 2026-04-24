import { MissionLibraryCard, type MissionLibraryCardData } from './MissionLibraryCard';
import type { StarterContent } from '../../../lib/content/types';
import type { MissionLibraryChapter } from '../lib/missionLibraryStructure';

type MissionChapterCardProps = {
  chapter: MissionLibraryChapter;
  items: MissionLibraryCardData[];
  starterContent: StarterContent;
  isOpenByDefault?: boolean;
};

export function MissionChapterCard({
  chapter,
  items,
  starterContent,
  isOpenByDefault = false,
}: MissionChapterCardProps) {
  const completedCount = items.filter((item) => item.progress.isCompleted).length;
  const unlockedCount = items.filter((item) => item.isUnlocked).length;
  const recommendedCount = items.filter((item) => item.isRecommended).length;
  const weakPointCount = items.filter((item) => item.weakPointCount > 0).length;
  const nextMission = items.find(
    (item) => item.isUnlocked && item.progress.completionCount === 0,
  );

  return (
    <details
      className="mission-chapter"
      open={isOpenByDefault}
      id={chapter.id}
    >
      <summary className="mission-chapter__summary">
        <div className="mission-chapter__copy">
          <p className="mission-chapter__eyebrow">
            {chapter.packRangeLabel ?? chapter.label}
          </p>
          <h3 className="mission-chapter__title">{chapter.title}</h3>
          <p className="mission-chapter__description">{chapter.description}</p>
          {chapter.packTitles?.length ? (
            <p className="mission-chapter__packs">
              {chapter.packTitles.join(' · ')}
            </p>
          ) : null}
        </div>

        <dl className="mission-chapter__stats">
          <div>
            <dt>Missions</dt>
            <dd>{items.length}</dd>
          </div>
          <div>
            <dt>Completed</dt>
            <dd>{completedCount}</dd>
          </div>
          <div>
            <dt>Unlocked</dt>
            <dd>{unlockedCount}</dd>
          </div>
          <div>
            <dt>Needs review</dt>
            <dd>{weakPointCount}</dd>
          </div>
        </dl>
      </summary>

      <div className="mission-chapter__body">
        <div className="mission-chapter__state-row" aria-label="Chapter state">
          {recommendedCount > 0 ? (
            <span className="mission-state-pill mission-state-pill--recommended">
              {recommendedCount} recommended today
            </span>
          ) : null}
          {nextMission ? (
            <span className="mission-state-pill mission-state-pill--ready">
              Next mission: {nextMission.mission.title}
            </span>
          ) : (
            <span className="mission-state-pill mission-state-pill--completed">
              Chapter cleared
            </span>
          )}
        </div>

        <div className="mission-list" role="list" aria-label={chapter.title}>
          {items.map((item) => (
            <div key={item.mission.id} role="listitem">
              <MissionLibraryCard item={item} starterContent={starterContent} />
            </div>
          ))}
        </div>
      </div>
    </details>
  );
}
