import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { JapaneseTextPair } from '../../../components/JapaneseTextPair';
import { KanaAssistInput } from '../../../components/KanaAssistInput';
import { SurfaceCard } from '../../../components/layout/PageShell';
import type {
  ExampleSentence,
  GrammarDrill,
  GrammarLesson,
  Mission,
} from '../../../lib/content/types';
import {
  readContinueState,
  resolveContinueStepIndex,
  updateContinueState,
} from '../../../lib/progress/continueState';
import { normalizeJapaneseText } from '../../../lib/normalizeJapaneseText';
import { recordWeakPoint } from '../../../lib/progress/weakPoints';
import { MissionCompletionCard } from './MissionCompletionCard';
import { useMissionAutoComplete } from '../lib/useMissionAutoComplete';

const missionSteps = [
  {
    id: 'intro',
    label: 'Intro',
    title: 'Lesson intro',
    description: 'Get the pattern clear before you start answering.',
  },
  {
    id: 'examples',
    label: 'Examples',
    title: 'Examples',
    description: 'See the pattern in short, useful beginner lines.',
  },
  {
    id: 'mistakes',
    label: 'Mistakes',
    title: 'Common mistakes',
    description: 'Use the confusion points as quick guardrails.',
  },
  {
    id: 'drills',
    label: 'Drills',
    title: 'Drills',
    description: 'Do a first active pass with simple local feedback.',
  },
] as const;

type GrammarMissionPlayerProps = {
  mission: Mission;
  lesson: GrammarLesson;
  examples: ExampleSentence[];
};

type MissionStepId = (typeof missionSteps)[number]['id'];
type DrillFeedback = 'correct' | 'incorrect' | null;

export function GrammarMissionPlayer({
  mission,
  lesson,
  examples,
}: GrammarMissionPlayerProps) {
  const [clearedDrillIds, setClearedDrillIds] = useState<string[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(() => {
    return (
      resolveContinueStepIndex(
        readContinueState(),
        mission.id,
        mission.type,
        missionSteps.length - 1,
      ) ?? 0
    );
  });
  const currentStep = missionSteps[currentStepIndex];
  const progressValue = ((currentStepIndex + 1) / missionSteps.length) * 100;

  useEffect(() => {
    updateContinueState({
      missionId: mission.id,
      missionType: mission.type,
      stepIndex: currentStepIndex,
    });
  }, [currentStepIndex, mission.id, mission.type]);

  useMissionAutoComplete({
    missionId: mission.id,
    clearedCount: clearedDrillIds.length,
    totalCount: lesson.drills.length,
  });

  function handleDrillCleared(drillId: string) {
    setClearedDrillIds((currentIds) =>
      currentIds.includes(drillId) ? currentIds : [...currentIds, drillId],
    );
  }

  return (
    <div className="mission-player-shell">
      <SurfaceCard
        title="Mission overview"
        description="Move through the lesson in one focused pass. Progress stays local to this page for now."
      >
        <div className="mission-overview">
          <div className="mission-overview__lesson">
            <p className="mission-overview__eyebrow">Linked grammar lesson</p>
            <h2 className="mission-overview__lesson-title">{lesson.title}</h2>
            <p className="mission-overview__objective">{lesson.objective}</p>
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
              <dt>Examples</dt>
              <dd>{examples.length}</dd>
            </div>
            <div className="mission-overview__stat">
              <dt>Drills</dt>
              <dd>{lesson.drills.length}</dd>
            </div>
          </dl>

          <div className="mission-progress">
            <div className="mission-progress__meta">
              <p className="mission-progress__label">
                Step {currentStepIndex + 1} of {missionSteps.length}
              </p>
              <p className="mission-progress__step">{currentStep.title}</p>
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

          <div className="mission-step-tabs" aria-label="Mission sections">
            {missionSteps.map((step, index) => {
              const isActive = index === currentStepIndex;

              return (
                <button
                  key={step.id}
                  type="button"
                  className={`mission-step-tab${isActive ? ' mission-step-tab--active' : ''}`}
                  aria-pressed={isActive}
                  onClick={() => setCurrentStepIndex(index)}
                >
                  <span className="mission-step-tab__index">0{index + 1}</span>
                  <span className="mission-step-tab__label">{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard title={currentStep.title} description={currentStep.description}>
        <div className="mission-step-panel">
          {renderStepContent(
            currentStep.id,
            mission,
            lesson,
            examples,
            handleDrillCleared,
          )}
          {currentStep.id === 'drills' ? (
            <p className="list-meta">
              Cleared {clearedDrillIds.length} of {lesson.drills.length} drills in this pass.
            </p>
          ) : null}
          <div className="mission-step-actions">
            <button
              type="button"
              className="mission-button mission-button--secondary"
              onClick={() => setCurrentStepIndex((index) => Math.max(0, index - 1))}
              disabled={currentStepIndex === 0}
            >
              Previous
            </button>
            {currentStepIndex < missionSteps.length - 1 ? (
              <button
                type="button"
                className="mission-button"
                onClick={() =>
                  setCurrentStepIndex((index) =>
                    Math.min(missionSteps.length - 1, index + 1),
                  )
                }
              >
                Next section
              </button>
            ) : (
              <Link to="/" className="mission-button mission-button--link">
                Back to today
              </Link>
            )}
          </div>
        </div>
      </SurfaceCard>

      <MissionCompletionCard
        missionId={mission.id}
        clearedCount={clearedDrillIds.length}
        totalCount={lesson.drills.length}
        unitLabel="drill"
      />
    </div>
  );
}

function renderStepContent(
  stepId: MissionStepId,
  mission: Mission,
  lesson: GrammarLesson,
  examples: ExampleSentence[],
  onDrillCleared: (drillId: string) => void,
) {
  switch (stepId) {
    case 'intro':
      return (
        <div className="mission-copy-stack">
          <section className="mission-copy-block">
            <p className="mission-copy-block__eyebrow">Objective</p>
            <p className="mission-copy-block__body">{lesson.objective}</p>
          </section>
          <section className="mission-copy-block">
            <p className="mission-copy-block__eyebrow">Explanation</p>
            <p className="mission-copy-block__body">{lesson.explanation}</p>
          </section>
        </div>
      );
    case 'examples':
      return (
        <div className="mission-example-list">
          {examples.map((example) => (
            <article key={example.id} className="mission-example-card">
              <JapaneseTextPair japanese={example.japanese} reading={example.reading} />
              <p className="mission-example-card__english">{example.english}</p>
            </article>
          ))}
        </div>
      );
    case 'mistakes':
      return (
        <ul className="mission-mistakes-list">
          {lesson.commonMistakes.map((mistake) => (
            <li key={mistake} className="mission-mistake-card">
              {mistake}
            </li>
          ))}
        </ul>
      );
    case 'drills':
      return (
        <div className="mission-drill-list">
          {lesson.drills.map((drill, index) => (
            <DrillCard
              key={drill.id}
              missionId={mission.id}
              lessonId={lesson.id}
              drill={drill}
              index={index}
              onCleared={onDrillCleared}
            />
          ))}
        </div>
      );
  }
}

type DrillCardProps = {
  missionId: string;
  lessonId: string;
  drill: GrammarDrill;
  index: number;
  onCleared: (drillId: string) => void;
};

function DrillCard({ missionId, lessonId, drill, index, onCleared }: DrillCardProps) {
  const reorderTokens = getReorderTokens(drill);
  const [selectedChoice, setSelectedChoice] = useState('');
  const [typedAnswer, setTypedAnswer] = useState('');
  const [assembledTokenIndexes, setAssembledTokenIndexes] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<DrillFeedback>(null);

  const currentResponse = getCurrentResponse({
    drill,
    selectedChoice,
    typedAnswer,
    assembledTokenIndexes,
    reorderTokens,
  });
  const hasResponse = currentResponse.trim().length > 0;

  function submitAnswer() {
    if (!hasResponse) {
      return;
    }

    const nextFeedback =
      normalizeAnswer(currentResponse) === normalizeAnswer(drill.answer)
        ? 'correct'
        : 'incorrect';

    if (nextFeedback === 'incorrect') {
      recordWeakPoint({
        itemId: drill.id,
        itemType: 'grammar-drill',
        missionId,
        contentId: lessonId,
      });
    }

    setFeedback(nextFeedback);
    onCleared(drill.id);
  }

  function resetAnswer() {
    setSelectedChoice('');
    setTypedAnswer('');
    setAssembledTokenIndexes([]);
    setFeedback(null);
  }

  return (
    <article className="mission-drill-card">
      <div className="mission-drill-card__header">
        <p className="mission-drill-card__eyebrow">
          Drill {index + 1} · {formatDrillType(drill.type)}
        </p>
        <h3 className="mission-drill-card__prompt">{drill.prompt}</h3>
      </div>

      <div className="mission-drill-card__body">
        {drill.type === 'multiple-choice' && drill.choices ? (
          <div className="mission-choice-grid">
            {drill.choices.map((choice) => {
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
        ) : null}

        {drill.type === 'fill-in' ? (
          <KanaAssistInput
            label="Your answer"
            value={typedAnswer}
            onChange={setTypedAnswer}
            onInteraction={() => setFeedback(null)}
            placeholder="Type the missing Japanese"
          />
        ) : null}

        {drill.type === 'reorder' ? (
          reorderTokens.length > 0 ? (
            <div className="mission-reorder">
              <div className="mission-reorder__answer" aria-live="polite">
                {assembledTokenIndexes.length > 0
                  ? assembledTokenIndexes.map((tokenIndex) => (
                      <span
                        key={`${drill.id}-${tokenIndex}`}
                        className="mission-token mission-token--answer"
                      >
                        {reorderTokens[tokenIndex]}
                      </span>
                    ))
                  : (
                    <span className="mission-reorder__placeholder">
                      Tap the chunks in order.
                    </span>
                  )}
              </div>

              <div className="mission-choice-grid mission-choice-grid--tokens">
                {reorderTokens.map((token, tokenIndex) => {
                  const isUsed = assembledTokenIndexes.includes(tokenIndex);

                  return (
                    <button
                      key={`${drill.id}-${token}-${tokenIndex}`}
                      type="button"
                      className="mission-token"
                      disabled={isUsed}
                      onClick={() => {
                        setAssembledTokenIndexes((indexes) => [...indexes, tokenIndex]);
                        setFeedback(null);
                      }}
                    >
                      {token}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <KanaAssistInput
              label="Ordered sentence"
              value={typedAnswer}
              onChange={setTypedAnswer}
              onInteraction={() => setFeedback(null)}
              placeholder="Type the sentence in order"
            />
          )
        ) : null}

        {drill.support ? <p className="mission-drill-card__support">{drill.support}</p> : null}

        <div className="mission-drill-card__actions">
          <button
            type="button"
            className="mission-button"
            onClick={submitAnswer}
            disabled={!hasResponse}
          >
            Check answer
          </button>
          <button
            type="button"
            className="mission-button mission-button--secondary"
            onClick={resetAnswer}
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
                ? 'The pattern matches the lesson target.'
                : `Expected answer: ${drill.answer}`}
            </p>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function getCurrentResponse({
  drill,
  selectedChoice,
  typedAnswer,
  assembledTokenIndexes,
  reorderTokens,
}: {
  drill: GrammarDrill;
  selectedChoice: string;
  typedAnswer: string;
  assembledTokenIndexes: number[];
  reorderTokens: string[];
}) {
  if (drill.type === 'multiple-choice') {
    return selectedChoice;
  }

  if (drill.type === 'reorder' && reorderTokens.length > 0) {
    return assembledTokenIndexes.map((tokenIndex) => reorderTokens[tokenIndex]).join('');
  }

  return typedAnswer;
}

function getReorderTokens(drill: GrammarDrill) {
  if (drill.type !== 'reorder') {
    return [];
  }

  const promptParts = drill.prompt.split(/[:：]/);
  const chunkSource = promptParts.length > 1 ? promptParts.slice(1).join(':') : drill.prompt;

  return chunkSource
    .split('/')
    .map((token) => token.trim())
    .filter(Boolean);
}

function normalizeAnswer(value: string) {
  return normalizeJapaneseText(value);
}

function formatTargetSkill(targetSkill: Mission['targetSkill']) {
  return targetSkill.replace(/-/g, ' ');
}

function formatDrillType(type: GrammarDrill['type']) {
  switch (type) {
    case 'multiple-choice':
      return 'Multiple choice';
    case 'reorder':
      return 'Reorder';
    case 'fill-in':
      return 'Fill in';
  }
}
