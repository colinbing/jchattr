import { Link } from 'react-router-dom';
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

  return (
    <section className="mission-chapter" id={chapter.id}>
      <div className="mission-chapter__summary">
        <div className="mission-chapter__copy">
          <p className="mission-chapter__eyebrow">
            {chapter.packRangeLabel ?? chapter.label}
          </p>
          <h3 className="mission-chapter__title">{chapter.title}</h3>
          <p className="mission-chapter__description">{chapter.description}</p>
          {chapter.packTitles?.length ? (
            <details className="mission-session-details">
              <summary className="mission-session-details__summary">Pack list</summary>
              <p className="mission-session-details__body">
                {chapter.packTitles.join(' · ')}
              </p>
            </details>
          ) : null}
        </div>

        <dl className="mission-chapter__stats">
          <div>
            <dt>Ready now</dt>
            <dd>{readyCount}</dd>
          </div>
          <div>
            <dt>Cleared</dt>
            <dd>{completedCount}</dd>
          </div>
          <div>
            <dt>Needs review</dt>
            <dd>{weakPointCount}</dd>
          </div>
        </dl>
      </div>

      <div className="mission-chapter__body">
        <div className="mission-chapter__state-row" aria-label="Chapter state">
          {recommendedCount > 0 ? (
            <span className="mission-state-pill mission-state-pill--recommended">
              {recommendedCount} recommended today
            </span>
          ) : null}
          <span className="mission-state-pill mission-state-pill--ready">
            {unlockedCount}/{items.length} unlocked
          </span>
          {!nextMission ? (
            <span className="mission-state-pill mission-state-pill--completed">
              Chapter cleared
            </span>
          ) : null}
        </div>

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
