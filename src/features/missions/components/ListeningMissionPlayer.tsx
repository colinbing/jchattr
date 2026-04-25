import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JapaneseTextPair } from '../../../components/JapaneseTextPair';
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
import { hasDistinctReading } from '../../../lib/japaneseText';
import { getListeningTranslationChoices } from '../../../lib/listeningChoices';
import {
  getMissionProgressEntry,
  useMissionProgress,
} from '../../../lib/progress/missionProgress';
import { recordWeakPoint } from '../../../lib/progress/weakPoints';
import {
  buildMissionCompletionRouteState,
  selectMissionSessionItems,
  type MissionSessionMode,
} from '../lib/missionSession';
import { useMissionAutoComplete } from '../lib/useMissionAutoComplete';

type ListeningMissionPlayerProps = {
  mission: Mission;
  listeningItems: ListeningItem[];
  relatedLessons: GrammarLesson[];
  relatedExamples: ExampleSentence[];
  choicePool: ListeningItem[];
  sessionMode: MissionSessionMode;
};

export function ListeningMissionPlayer({
  mission,
  listeningItems,
  relatedLessons,
  relatedExamples,
  choicePool,
  sessionMode,
}: ListeningMissionPlayerProps) {
  const navigate = useNavigate();
  const missionProgress = useMissionProgress();
  const [sessionRotation] = useState(() => {
    return getMissionProgressEntry(missionProgress, mission.id).completionCount;
  });
  const sessionItems = useMemo(
    () => selectMissionSessionItems(listeningItems, sessionMode, sessionRotation, 2),
    [listeningItems, sessionMode, sessionRotation],
  );
  const sessionExamples = useMemo(
    () => selectMissionSessionItems(relatedExamples, sessionMode, sessionRotation, 2),
    [relatedExamples, sessionMode, sessionRotation],
  );
  const supportExamples = useMemo(
    () =>
      sessionExamples.map((example) => ({
        example,
        audioRef: findSupportExampleAudioRef(example, choicePool),
      })),
    [choicePool, sessionExamples],
  );
  const initialContinueStepIndex = useMemo(
    () =>
      resolveContinueStepIndex(
        readContinueState(),
        mission.id,
        mission.type,
        sessionItems.length - 1,
      ),
    [mission.id, mission.type, sessionItems.length],
  );
  const [clearedItemIds, setClearedItemIds] = useState<string[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(() => initialContinueStepIndex ?? 0);
  const [hasCompletedPrep, setHasCompletedPrep] = useState(() => initialContinueStepIndex !== null);
  const currentItem = sessionItems[currentItemIndex];
  const showPrep = !hasCompletedPrep && supportExamples.length > 0;
  const progressValue = showPrep ? 0 : ((currentItemIndex + 1) / sessionItems.length) * 100;
  const completionState = buildMissionCompletionRouteState(
    mission,
    sessionMode,
    Math.min(clearedItemIds.length, sessionItems.length),
    sessionItems.length,
  );
  const primaryLesson = relatedLessons[0];

  useEffect(() => {
    updateContinueState({
      missionId: mission.id,
      missionType: mission.type,
      stepIndex: currentItemIndex,
    });
  }, [currentItemIndex, mission.id, mission.type]);

  useEffect(() => {
    setCurrentItemIndex((index) => Math.min(index, Math.max(0, sessionItems.length - 1)));
  }, [sessionItems.length]);

  useMissionAutoComplete({
    missionId: mission.id,
    clearedCount: clearedItemIds.length,
    totalCount: sessionItems.length,
  });

  function handleItemCleared(itemId: string) {
    setClearedItemIds((currentIds) =>
      currentIds.includes(itemId) ? currentIds : [...currentIds, itemId],
    );
  }

  return (
    <div className="mission-player-shell mission-player-shell--listening">
      <div className="listening-workspace">
        <div className="listening-session-bar" aria-label="Listening mission progress">
          <div className="listening-session-bar__copy">
            <p className="mission-copy-block__eyebrow">
              {sessionMode === 'reinforce' ? 'Short listening pass' : 'Listening mission'}
            </p>
            <h2 className="listening-session-bar__title">
              {primaryLesson ? primaryLesson.title : mission.title}
            </h2>
          </div>
          <div className="listening-session-bar__progress">
            <span>
              {showPrep ? 'Prep' : `${currentItemIndex + 1}/${sessionItems.length}`}
            </span>
            <div
              className="mission-progress__track"
              role="progressbar"
              aria-label="Mission progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressValue}
            >
            <span className="mission-progress__fill" style={{ width: `${progressValue}%` }} />
            </div>
          </div>
        </div>

        <details className="listening-session-details">
          <summary className="mission-session-details__summary">Mission details</summary>
          <dl className="listening-session-details__grid">
            <div>
              <dt>Skill</dt>
              <dd>{formatTargetSkill(mission.targetSkill)}</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>{mission.estimatedMinutes} min</dd>
            </div>
            <div>
              <dt>Lines</dt>
              <dd>{sessionItems.length}</dd>
            </div>
            <div>
              <dt>Support</dt>
              <dd>{supportExamples.length}</dd>
            </div>
          </dl>
        </details>

        {showPrep ? (
          <ListeningPrepPanel
            missionTitle={mission.title}
            primaryLesson={primaryLesson}
            supportExamples={supportExamples}
            onStart={() => setHasCompletedPrep(true)}
          />
        ) : (
          <ListeningItemPanel
            key={currentItem.id}
            missionId={mission.id}
            item={currentItem}
            choicePool={choicePool}
            avoidTranslations={sessionItems
              .slice(Math.max(0, currentItemIndex - 2), currentItemIndex)
              .map((listeningItem) => listeningItem.translation)}
            currentItemIndex={currentItemIndex}
            totalItems={sessionItems.length}
            clearedCount={clearedItemIds.length}
            canGoPrevious={currentItemIndex > 0}
            isLastItem={currentItemIndex === sessionItems.length - 1}
            onCleared={handleItemCleared}
            onPrevious={() => setCurrentItemIndex((index) => Math.max(0, index - 1))}
            onNext={() =>
              setCurrentItemIndex((index) => Math.min(sessionItems.length - 1, index + 1))
            }
            onFinish={() => navigate('/', { state: completionState })}
          />
        )}
      </div>

      {(primaryLesson || supportExamples.length > 0) ? (
        <details className="listening-support-drawer">
          <summary className="listening-support-drawer__summary">Practice the pattern first</summary>
          <div className="listening-support">
            {primaryLesson ? (
              <section className="mission-copy-block">
                <p className="mission-copy-block__eyebrow">Pattern</p>
                <h3 className="listening-support__title">{primaryLesson.title}</h3>
                <p className="mission-copy-block__body">{primaryLesson.explanation}</p>
              </section>
            ) : null}

            {supportExamples.length > 0 ? (
              <div className="listening-support-example-list">
                {supportExamples.map(({ example, audioRef }) => (
                  <article key={example.id} className="listening-support-example">
                    <div className="listening-support-example__text">
                      <JapaneseTextPair japanese={example.japanese} reading={example.reading} />
                      <p className="mission-example-card__english">{example.english}</p>
                    </div>
                    {audioRef ? (
                      <button
                        type="button"
                        className="listening-support-example__play"
                        onClick={() => playAudioRef(audioRef)}
                      >
                        Listen
                      </button>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : null}
          </div>
        </details>
      ) : null}
    </div>
  );
}

type ListeningSupportExample = {
  example: ExampleSentence;
  audioRef: string | undefined;
};

type ListeningPrepPanelProps = {
  missionTitle: string;
  primaryLesson: GrammarLesson | undefined;
  supportExamples: ListeningSupportExample[];
  onStart: () => void;
};

function ListeningPrepPanel({
  missionTitle,
  primaryLesson,
  supportExamples,
  onStart,
}: ListeningPrepPanelProps) {
  return (
    <section className="listening-prep-card" aria-labelledby="listening-prep-title">
      <div className="listening-prep-card__header">
        <p className="mission-copy-block__eyebrow">Hear the pattern first</p>
        <h3 id="listening-prep-title" className="listening-prep-card__title">
          {primaryLesson ? primaryLesson.title : missionTitle}
        </h3>
        <p className="listening-prep-card__body">
          Play each model line once. Notice the pattern, then try the listening checks.
        </p>
      </div>

      <div className="listening-prep-lines">
        {supportExamples.map(({ example, audioRef }, index) => (
          <article key={example.id} className="listening-prep-line">
            <div className="listening-prep-line__copy">
              <p className="mission-copy-block__eyebrow">Model {index + 1}</p>
              <JapaneseTextPair japanese={example.japanese} reading={example.reading} />
              <p className="mission-example-card__english">{example.english}</p>
            </div>
            {audioRef ? (
              <button
                type="button"
                className="listening-prep-line__play"
                onClick={() => playAudioRef(audioRef)}
              >
                Listen
              </button>
            ) : null}
          </article>
        ))}
      </div>

      <button type="button" className="mission-button" onClick={onStart}>
        Start listening checks
      </button>
    </section>
  );
}

type ListeningItemPanelProps = {
  missionId: string;
  item: ListeningItem;
  choicePool: ListeningItem[];
  avoidTranslations: string[];
  currentItemIndex: number;
  totalItems: number;
  clearedCount: number;
  canGoPrevious: boolean;
  isLastItem: boolean;
  onCleared: (itemId: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onFinish: () => void;
};

type ListeningFeedback = 'correct' | 'incorrect' | 'supported' | null;
type RevealKey = 'transcript' | 'reading' | 'translation' | 'focus';

function ListeningItemPanel({
  missionId,
  item,
  choicePool,
  avoidTranslations,
  currentItemIndex,
  totalItems,
  clearedCount,
  canGoPrevious,
  isLastItem,
  onCleared,
  onPrevious,
  onNext,
  onFinish,
}: ListeningItemPanelProps) {
  const readingMatchesTranscript = !hasDistinctReading(item.transcript, item.reading);
  const [revealed, setRevealed] = useState<Record<RevealKey, boolean>>({
    transcript: false,
    reading: readingMatchesTranscript,
    translation: false,
    focus: false,
  });
  const [selectedChoice, setSelectedChoice] = useState('');
  const [feedback, setFeedback] = useState<ListeningFeedback>(null);
  const translationChoices = getListeningTranslationChoices(item, choicePool, {
    avoidTranslations,
  });
  const latestVisibleHint = getLatestVisibleHint(item, revealed, readingMatchesTranscript);
  const isAnswerRevealed = revealed.translation;

  function reveal(step: RevealKey) {
    if (step === 'translation' && !revealed.translation && !feedback) {
      recordWeakPoint({
        itemId: item.id,
        itemType: 'listening-check',
        missionId,
        contentId: item.id,
      });
      setSelectedChoice('');
      setFeedback('supported');
      onCleared(item.id);
    }

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
    <div className="listening-item-panel listening-focus-card">
      <div className="listening-focus-card__header">
        <div>
          <p className="mission-copy-block__eyebrow">
            Line {currentItemIndex + 1} of {totalItems}
          </p>
          <h3 className="listening-focus-card__prompt">Choose the meaning you heard.</h3>
        </div>
        <p className="listening-focus-card__count">
          {clearedCount}/{totalItems}
        </p>
      </div>

      <ListeningAudioCard item={item} />

      <div className="mission-choice-grid listening-choice-grid">
        {translationChoices.map((choice) => {
          const isSelected = selectedChoice === choice;

          return (
            <button
              key={choice}
              type="button"
              className={`mission-choice${isSelected ? ' mission-choice--selected' : ''}`}
              disabled={isAnswerRevealed}
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

      <div className="listening-hint-panel">
        <div className="listening-reveal-controls" aria-label="Listening hints">
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
              revealed.focus ? ' listening-reveal-button--complete' : ''
            }`}
            onClick={() => reveal('focus')}
            disabled={!revealed.transcript}
          >
            Reveal pattern hint
          </button>
          <button
            type="button"
            className={`listening-reveal-button${
              revealed.translation ? ' listening-reveal-button--complete' : ''
            }`}
            onClick={() => reveal('translation')}
            disabled={!revealed.focus || revealed.translation || Boolean(feedback)}
          >
            Reveal answer
          </button>
        </div>
      </div>

      <div className="listening-reveal-slot" aria-live="polite">
        {latestVisibleHint ? (
          <RevealBlock label={latestVisibleHint.label} value={latestVisibleHint.value} />
        ) : (
          <p className="listening-reveal-slot__empty">
            Try the audio first. Reveal only the next hint you need.
          </p>
        )}
      </div>

      {feedback ? (
        <div
          className={`mission-feedback mission-feedback--${feedback}`}
          role="status"
          aria-live="polite"
        >
          <p className="mission-feedback__title">
            {getListeningFeedbackTitle(feedback)}
          </p>
          <p className="mission-feedback__body">
            {getListeningFeedbackBody(feedback, item, revealed)}
          </p>
        </div>
      ) : null}

      <div className="listening-focus-card__actions">
        <button
          type="button"
          className="mission-button mission-button--secondary"
          onClick={onPrevious}
          disabled={!canGoPrevious}
        >
          Previous
        </button>
        {feedback ? (
          isLastItem ? (
            <button type="button" className="mission-button mission-button--link" onClick={onFinish}>
              Finish to Today
            </button>
          ) : (
            <button type="button" className="mission-button" onClick={onNext}>
              Next line
            </button>
          )
        ) : (
          <button
            type="button"
            className="mission-button"
            onClick={submitCheck}
            disabled={!selectedChoice}
          >
            Check answer
          </button>
        )}
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
        <p className="mission-copy-block__eyebrow">Audio first</p>
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
  value: string;
};

function RevealBlock({ label, value }: RevealBlockProps) {
  return (
    <section className="listening-reveal-card listening-reveal-card--visible">
      <p className="mission-copy-block__eyebrow">{label}</p>
      <p className="listening-reveal-card__value">{value}</p>
    </section>
  );
}

function getListeningFeedbackTitle(feedback: Exclude<ListeningFeedback, null>) {
  switch (feedback) {
    case 'correct':
      return 'Correct.';
    case 'supported':
      return 'Supported exposure.';
    case 'incorrect':
      return 'Not quite.';
  }
}

function getListeningFeedbackBody(
  feedback: Exclude<ListeningFeedback, null>,
  item: ListeningItem,
  revealed: Record<RevealKey, boolean>,
) {
  switch (feedback) {
    case 'correct':
      return revealed.focus || revealed.transcript
        ? 'Support helped. This moves the line forward, but it is a lighter listening signal.'
        : 'Clean first-pass recognition.';
    case 'supported':
      return 'You saw the meaning, so this moves the pass forward but keeps the item in Review.';
    case 'incorrect':
      return `Correct answer: ${item.translation}`;
  }
}

function getLatestVisibleHint(
  item: ListeningItem,
  revealed: Record<RevealKey, boolean>,
  readingMatchesTranscript: boolean,
) {
  if (revealed.translation) {
    return { label: 'Meaning', value: item.translation };
  }

  if (revealed.focus) {
    return { label: 'Pattern', value: item.focusPoint };
  }

  if (!readingMatchesTranscript && revealed.reading) {
    return { label: 'Reading', value: item.reading };
  }

  if (revealed.transcript) {
    return { label: 'Transcript', value: item.transcript };
  }

  return null;
}

function findSupportExampleAudioRef(example: ExampleSentence, choicePool: ListeningItem[]) {
  const normalizedJapanese = normalizeSupportMatch(example.japanese);
  const normalizedReading = normalizeSupportMatch(example.reading);
  const normalizedEnglish = normalizeSupportMatch(example.english);
  const match = choicePool.find((item) => {
    return (
      normalizeSupportMatch(item.transcript) === normalizedJapanese ||
      normalizeSupportMatch(item.reading) === normalizedReading ||
      normalizeSupportMatch(item.translation) === normalizedEnglish
    );
  });

  return match?.audioRef;
}

function normalizeSupportMatch(value: string) {
  return value.replace(/\s+/g, '').replace(/[。、,.!?？！「」]/g, '').toLowerCase();
}

function playAudioRef(audioRef: string) {
  const audio = new Audio(audioRef);
  void audio.play().catch(() => undefined);
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
function formatTargetSkill(targetSkill: Mission['targetSkill']) {
  return targetSkill.replace(/-/g, ' ');
}
