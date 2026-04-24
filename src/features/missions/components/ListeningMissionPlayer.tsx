import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SurfaceCard } from '../../../components/layout/PageShell';
import type {
  ExampleSentence,
  GrammarLesson,
  ListeningItem,
  Mission,
} from '../../../lib/content/types';
import {
  readContinueState,
  resolveContinueStepIndex,
  updateContinueState,
} from '../../../lib/progress/continueState';
import { recordWeakPoint } from '../../../lib/progress/weakPoints';
import { MissionCompletionCard } from './MissionCompletionCard';
import { useMissionAutoComplete } from '../lib/useMissionAutoComplete';

type ListeningMissionPlayerProps = {
  mission: Mission;
  listeningItems: ListeningItem[];
  relatedLessons: GrammarLesson[];
  relatedExamples: ExampleSentence[];
  choicePool: ListeningItem[];
};

export function ListeningMissionPlayer({
  mission,
  listeningItems,
  relatedLessons,
  relatedExamples,
  choicePool,
}: ListeningMissionPlayerProps) {
  const [clearedItemIds, setClearedItemIds] = useState<string[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(() => {
    return (
      resolveContinueStepIndex(
        readContinueState(),
        mission.id,
        mission.type,
        listeningItems.length - 1,
      ) ?? 0
    );
  });
  const currentItem = listeningItems[currentItemIndex];
  const progressValue = ((currentItemIndex + 1) / listeningItems.length) * 100;
  const primaryLesson = relatedLessons[0];

  useEffect(() => {
    updateContinueState({
      missionId: mission.id,
      missionType: mission.type,
      stepIndex: currentItemIndex,
    });
  }, [currentItemIndex, mission.id, mission.type]);

  useMissionAutoComplete({
    missionId: mission.id,
    clearedCount: clearedItemIds.length,
    totalCount: listeningItems.length,
  });

  function handleItemCleared(itemId: string) {
    setClearedItemIds((currentIds) =>
      currentIds.includes(itemId) ? currentIds : [...currentIds, itemId],
    );
  }

  return (
    <div className="mission-player-shell">
      <SurfaceCard
        title="Mission overview"
        description="Work through one listening item at a time with a guess-first flow and progressive hints. Progress stays local to this page for now."
      >
        <div className="mission-overview">
          <div className="mission-overview__lesson">
            <p className="mission-overview__eyebrow">Listening mission</p>
            <h2 className="mission-overview__lesson-title">
              {primaryLesson ? primaryLesson.title : 'Starter listening set'}
            </h2>
            <p className="mission-overview__objective">
              {primaryLesson
                ? primaryLesson.objective
                : 'Use staged reveal to connect meaning, structure, and focus points one line at a time.'}
            </p>
          </div>

          <dl className="mission-overview__stats">
            <div className="mission-overview__stat">
              <dt>Target skill</dt>
              <dd>{formatTargetSkill(mission.targetSkill)}</dd>
            </div>
            <div className="mission-overview__stat">
              <dt>Estimated time</dt>
              <dd>{mission.estimatedMinutes} min</dd>
            </div>
            <div className="mission-overview__stat">
              <dt>Listening items</dt>
              <dd>{listeningItems.length}</dd>
            </div>
            <div className="mission-overview__stat">
              <dt>Support examples</dt>
              <dd>{relatedExamples.length}</dd>
            </div>
          </dl>

          <div className="mission-progress">
            <div className="mission-progress__meta">
              <p className="mission-progress__label">
                Item {currentItemIndex + 1} of {listeningItems.length}
              </p>
              <p className="mission-progress__step">One line at a time</p>
            </div>
            <div
              className="mission-progress__track"
              role="progressbar"
              aria-label="Mission progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressValue}
            >
              <span
                className="mission-progress__fill"
                style={{ width: `${progressValue}%` }}
              />
            </div>
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard
        title={`Listening item ${currentItemIndex + 1}`}
        description={`Difficulty: ${currentItem.difficulty}`}
      >
        <div className="mission-step-panel">
          <ListeningItemPanel
            key={currentItem.id}
            missionId={mission.id}
            item={currentItem}
            choicePool={choicePool}
            onCleared={handleItemCleared}
          />
          <p className="list-meta">
            Cleared {clearedItemIds.length} of {listeningItems.length} listening checks in this pass.
          </p>

          <div className="mission-step-actions">
            <button
              type="button"
              className="mission-button mission-button--secondary"
              onClick={() => setCurrentItemIndex((index) => Math.max(0, index - 1))}
              disabled={currentItemIndex === 0}
            >
              Previous line
            </button>
            {currentItemIndex < listeningItems.length - 1 ? (
              <button
                type="button"
                className="mission-button"
                onClick={() =>
                  setCurrentItemIndex((index) =>
                    Math.min(listeningItems.length - 1, index + 1),
                  )
                }
              >
                Next line
              </button>
            ) : (
              <Link to="/" className="mission-button mission-button--link">
                Back to today
              </Link>
            )}
          </div>
        </div>
      </SurfaceCard>

      {(primaryLesson || relatedExamples.length > 0) ? (
        <SurfaceCard
          title="Pattern support"
          description="Use the linked grammar and examples as a compact reference after you have already taken your first guess."
        >
          <div className="listening-support">
            {primaryLesson ? (
              <section className="mission-copy-block">
                <p className="mission-copy-block__eyebrow">Linked grammar lesson</p>
                <h3 className="listening-support__title">{primaryLesson.title}</h3>
                <p className="mission-copy-block__body">{primaryLesson.explanation}</p>
              </section>
            ) : null}

            {relatedExamples.length > 0 ? (
              <div className="mission-example-list">
                {relatedExamples.map((example) => (
                  <article key={example.id} className="mission-example-card">
                    <p className="mission-example-card__japanese">{example.japanese}</p>
                    <p className="mission-example-card__reading">{example.reading}</p>
                    <p className="mission-example-card__english">{example.english}</p>
                  </article>
                ))}
              </div>
            ) : null}
          </div>
        </SurfaceCard>
      ) : null}

      <MissionCompletionCard
        missionId={mission.id}
        clearedCount={clearedItemIds.length}
        totalCount={listeningItems.length}
        unitLabel="listening check"
      />
    </div>
  );
}

type ListeningItemPanelProps = {
  missionId: string;
  item: ListeningItem;
  choicePool: ListeningItem[];
  onCleared: (itemId: string) => void;
};

type ListeningFeedback = 'correct' | 'incorrect' | null;
type RevealKey = 'transcript' | 'reading' | 'translation' | 'focus';

function ListeningItemPanel({
  missionId,
  item,
  choicePool,
  onCleared,
}: ListeningItemPanelProps) {
  const readingMatchesTranscript = item.reading.trim() === item.transcript.trim();
  const [revealed, setRevealed] = useState<Record<RevealKey, boolean>>({
    transcript: false,
    reading: readingMatchesTranscript,
    translation: false,
    focus: false,
  });
  const [selectedChoice, setSelectedChoice] = useState('');
  const [feedback, setFeedback] = useState<ListeningFeedback>(null);
  const translationChoices = getTranslationChoices(item, choicePool);

  function reveal(step: RevealKey) {
    setRevealed((current) => ({ ...current, [step]: true }));
  }

  function submitCheck() {
    if (!selectedChoice) {
      return;
    }

    const nextFeedback = selectedChoice === item.translation ? 'correct' : 'incorrect';

    if (nextFeedback === 'incorrect') {
      recordWeakPoint({
        itemId: item.id,
        itemType: 'listening-check',
        missionId,
        contentId: item.id,
      });
    }

    setFeedback(nextFeedback);
    onCleared(item.id);
  }

  return (
    <div className="listening-item-panel">
      <ListeningAudioCard item={item} />

      <div className="listening-prompt-card">
        <p className="mission-copy-block__eyebrow">Answer first</p>
        <p className="mission-copy-block__body">
          Try the quick check before you reveal the meaning. If you need help, open hints one layer
          at a time instead of exposing everything at once.
        </p>
      </div>

      <div className="mission-drill-card">
        <div className="mission-drill-card__header">
          <p className="mission-drill-card__eyebrow">Quick check</p>
          <h3 className="mission-drill-card__prompt">
            Which English meaning matches this line?
          </h3>
          <p className="mission-drill-card__support">
            Audio first if you want it, then guess. Use the hint controls below only when you need
            them.
          </p>
        </div>

        <div className="mission-drill-card__body">
          <div className="mission-choice-grid">
            {translationChoices.map((choice) => {
              const isSelected = selectedChoice === choice;

              return (
                <button
                  key={choice}
                  type="button"
                  className={`mission-choice${
                    isSelected ? ' mission-choice--selected' : ''
                  }`}
                  onClick={() => {
                    setSelectedChoice(choice);
                    setFeedback(null);
                  }}
                >
                  {choice}
                </button>
              );
            })}
          </div>

          <div className="mission-drill-card__actions">
            <button
              type="button"
              className="mission-button"
              onClick={submitCheck}
              disabled={!selectedChoice}
            >
              Check answer
            </button>
            <button
              type="button"
              className="mission-button mission-button--secondary"
              onClick={() => {
                setSelectedChoice('');
                setFeedback(null);
              }}
            >
              Reset
            </button>
          </div>

          {feedback ? (
            <div
              className={`mission-feedback mission-feedback--${feedback}`}
              role="status"
              aria-live="polite"
            >
              <p className="mission-feedback__title">
                {feedback === 'correct' ? 'Correct.' : 'Not quite.'}
              </p>
              <p className="mission-feedback__body">
                {feedback === 'correct'
                  ? revealed.translation || revealed.focus || revealed.transcript
                    ? 'The meaning matches the line. You got there after using hints.'
                    : 'The meaning matches the line. Nice first-pass recognition.'
                  : `Correct answer: ${item.translation}`}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="listening-hint-panel">
        <div className="listening-hint-panel__copy">
          <p className="mission-copy-block__eyebrow">Need a hint?</p>
          <p className="mission-copy-block__body">
            Reveal only the next layer you need. Meaning and focus stay last so the answer does not
            sit in front of the check by default.
          </p>
        </div>

        <div className="listening-reveal-controls">
          <button
            type="button"
            className={`listening-reveal-button${
              revealed.transcript ? ' listening-reveal-button--complete' : ''
            }`}
            onClick={() => reveal('transcript')}
          >
            Reveal transcript hint
          </button>
          {!readingMatchesTranscript ? (
            <button
              type="button"
              className={`listening-reveal-button${
                revealed.reading ? ' listening-reveal-button--complete' : ''
              }`}
              onClick={() => reveal('reading')}
              disabled={!revealed.transcript}
            >
              Reveal reading hint
            </button>
          ) : null}
          <button
            type="button"
            className={`listening-reveal-button${
              revealed.translation ? ' listening-reveal-button--complete' : ''
            }`}
            onClick={() => reveal('translation')}
            disabled={!revealed.transcript}
          >
            Reveal meaning hint
          </button>
          <button
            type="button"
            className={`listening-reveal-button${
              revealed.focus ? ' listening-reveal-button--complete' : ''
            }`}
            onClick={() => reveal('focus')}
            disabled={!revealed.translation}
          >
            Reveal pattern hint
          </button>
        </div>
      </div>

      <div className="listening-reveal-stack">
        <RevealBlock
          label="Transcript"
          isVisible={revealed.transcript}
          value={item.transcript}
        />
        {!readingMatchesTranscript ? (
          <RevealBlock
            label="Reading"
            isVisible={revealed.reading}
            value={item.reading}
          />
        ) : null}
        <RevealBlock
          label="Meaning hint"
          isVisible={revealed.translation}
          value={item.translation}
        />
        <RevealBlock
          label="Pattern hint"
          isVisible={revealed.focus}
          value={item.focusPoint}
        />
      </div>
    </div>
  );
}

function ListeningAudioCard({ item }: { item: ListeningItem }) {
  const [audioFailed, setAudioFailed] = useState(false);

  if (!item.audioRef) {
    return null;
  }

  return (
    <section className="listening-audio-card">
      <div className="listening-audio-card__copy">
        <p className="mission-copy-block__eyebrow">Audio</p>
        <p className="mission-copy-block__body">
          Play the line first if you want an audio pass before revealing anything. Audio is
          optional and AI-generated.
        </p>
      </div>

      {!audioFailed ? (
        <audio
          key={item.audioRef}
          className="listening-audio-card__player"
          controls
          preload="none"
          onError={() => setAudioFailed(true)}
        >
          <source src={item.audioRef} type={getAudioMimeType(item.audioRef)} />
          Your browser does not support audio playback for this item.
        </audio>
      ) : (
        <div className="listening-audio-card__fallback" role="status" aria-live="polite">
          <p className="listening-audio-card__fallback-title">Audio unavailable.</p>
          <p className="listening-audio-card__fallback-body">
            This listening item still works with the transcript-first reveal flow below.
          </p>
        </div>
      )}
    </section>
  );
}

type RevealBlockProps = {
  label: string;
  isVisible: boolean;
  value: string;
};

function RevealBlock({ label, isVisible, value }: RevealBlockProps) {
  return (
    <section className={`listening-reveal-card${isVisible ? ' listening-reveal-card--visible' : ''}`}>
      <p className="mission-copy-block__eyebrow">{label}</p>
      {isVisible ? (
        <p className="listening-reveal-card__value">{value}</p>
      ) : (
        <p className="listening-reveal-card__hidden">Hidden until you reveal this step.</p>
      )}
    </section>
  );
}

function getTranslationChoices(item: ListeningItem, choicePool: ListeningItem[]) {
  const distractors = choicePool
    .filter((candidate) => candidate.id !== item.id && candidate.translation !== item.translation)
    .map((candidate) => candidate.translation)
    .filter((translation, index, array) => array.indexOf(translation) === index)
    .slice(0, 2);

  const options = [...distractors];
  const insertIndex = getChoiceInsertIndex(item.id, options.length + 1);
  options.splice(insertIndex, 0, item.translation);
  return options;
}

function getAudioMimeType(audioRef: string) {
  if (audioRef.endsWith('.wav')) {
    return 'audio/wav';
  }

  if (audioRef.endsWith('.opus')) {
    return 'audio/ogg; codecs=opus';
  }

  if (audioRef.endsWith('.aac')) {
    return 'audio/aac';
  }

  if (audioRef.endsWith('.flac')) {
    return 'audio/flac';
  }

  return 'audio/mpeg';
}

function getChoiceInsertIndex(seed: string, optionCount: number) {
  const total = Array.from(seed).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return total % optionCount;
}

function formatTargetSkill(targetSkill: Mission['targetSkill']) {
  return targetSkill.replace(/-/g, ' ');
}
