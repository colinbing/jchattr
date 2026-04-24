import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { getReorderTokens } from '../../../lib/reorderDrill';
import {
  getMissionProgressEntry,
  useMissionProgress,
} from '../../../lib/progress/missionProgress';
import { recordWeakPoint } from '../../../lib/progress/weakPoints';
import { MissionCompletionCard } from './MissionCompletionCard';
import {
  buildMissionCompletionRouteState,
  selectMissionSessionItems,
  type MissionSessionMode,
} from '../lib/missionSession';
import { useMissionAutoComplete } from '../lib/useMissionAutoComplete';

type GrammarMissionPlayerProps = {
  mission: Mission;
  lesson: GrammarLesson;
  examples: ExampleSentence[];
  sessionMode: MissionSessionMode;
};

type MissionStep = {
  id: 'intro' | 'examples' | 'mistakes' | 'drills';
  label: string;
  title: string;
  description: string;
};
type MissionStepId = MissionStep['id'];
type DrillFeedback = 'correct' | 'incorrect' | null;

export function GrammarMissionPlayer({
  mission,
  lesson,
  examples,
  sessionMode,
}: GrammarMissionPlayerProps) {
  const navigate = useNavigate();
  const missionProgress = useMissionProgress();
  const [sessionRotation] = useState(() => {
    return getMissionProgressEntry(missionProgress, mission.id).completionCount;
  });
  const sessionExamples = useMemo(
    () => selectMissionSessionItems(examples, sessionMode, sessionRotation, 1),
    [examples, sessionMode, sessionRotation],
  );
  const sessionDrills = useMemo(
    () => selectMissionSessionItems(lesson.drills, sessionMode, sessionRotation, 2),
    [lesson.drills, sessionMode, sessionRotation],
  );
  const sessionSteps = useMemo(
    () => getMissionSteps(sessionMode, sessionExamples.length, sessionDrills.length),
    [sessionDrills.length, sessionExamples.length, sessionMode],
  );
  const [clearedDrillIds, setClearedDrillIds] = useState<string[]>([]);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [currentMistakeIndex, setCurrentMistakeIndex] = useState(0);
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(() => {
    return (
      resolveContinueStepIndex(
        readContinueState(),
        mission.id,
        mission.type,
        sessionSteps.length - 1,
      ) ?? 0
    );
  });
  const currentStep = sessionSteps[currentStepIndex] ?? sessionSteps[0];
  const progressValue = ((currentStepIndex + 1) / sessionSteps.length) * 100;
  const currentExample = sessionExamples[currentExampleIndex] ?? null;
  const currentMistake = lesson.commonMistakes[currentMistakeIndex] ?? null;
  const currentDrill = sessionDrills[currentDrillIndex] ?? null;

  useEffect(() => {
    updateContinueState({
      missionId: mission.id,
      missionType: mission.type,
      stepIndex: currentStepIndex,
    });
  }, [currentStepIndex, mission.id, mission.type]);

  useEffect(() => {
    setCurrentExampleIndex((index) => Math.min(index, Math.max(0, sessionExamples.length - 1)));
  }, [sessionExamples.length]);

  useEffect(() => {
    setCurrentMistakeIndex((index) =>
      Math.min(index, Math.max(0, lesson.commonMistakes.length - 1)),
    );
  }, [lesson.commonMistakes.length]);

  useEffect(() => {
    setCurrentDrillIndex((index) => Math.min(index, Math.max(0, sessionDrills.length - 1)));
  }, [sessionDrills.length]);

  useEffect(() => {
    setCurrentStepIndex((index) => Math.min(index, Math.max(0, sessionSteps.length - 1)));
  }, [sessionSteps.length]);

  useMissionAutoComplete({
    missionId: mission.id,
    clearedCount: clearedDrillIds.length,
    totalCount: sessionDrills.length,
  });

  function handleDrillCleared(drillId: string) {
    setClearedDrillIds((currentIds) =>
      currentIds.includes(drillId) ? currentIds : [...currentIds, drillId],
    );
  }

  function goToNextStep() {
    setCurrentStepIndex((index) => Math.min(sessionSteps.length - 1, index + 1));
  }

  function goToPreviousStep() {
    setCurrentStepIndex((index) => Math.max(0, index - 1));
  }

  function goToNextDrill() {
    if (currentDrillIndex < sessionDrills.length - 1) {
      setCurrentDrillIndex((index) => Math.min(sessionDrills.length - 1, index + 1));
      return;
    }

    navigate('/', {
      state: buildMissionCompletionRouteState(
        mission,
        sessionMode,
        Math.min(clearedDrillIds.length, sessionDrills.length),
        sessionDrills.length,
      ),
    });
  }

  return (
    <div className="mission-player-shell">
      <SurfaceCard
        className="mission-session-card"
        title={lesson.title}
        description={
          sessionMode === 'reinforce'
            ? `Short reinforce pass · ${formatTargetSkill(mission.targetSkill)}`
            : `${currentStep.title} · ${formatTargetSkill(mission.targetSkill)}`
        }
      >
        <div className="mission-session-card__meta-row">
          <p className="mission-session-card__meta">
            Step {currentStepIndex + 1} of {sessionSteps.length}
          </p>
          <p className="mission-session-card__meta">
            {sessionMode === 'reinforce'
              ? `${Math.max(2, Math.ceil(mission.estimatedMinutes / 2))} min`
              : `${mission.estimatedMinutes} min`}
          </p>
        </div>

        <div className="mission-progress">
          <div className="mission-progress__meta">
            <p className="mission-progress__label">Current focus</p>
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

        <div className="mission-step-tabs mission-step-tabs--compact" aria-label="Mission sections">
          {sessionSteps.map((step, index) => {
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

        <details className="mission-session-details">
          <summary className="mission-session-details__summary">Mission details</summary>
          <dl className="mission-overview__stats mission-overview__stats--compact">
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
              <dd>{sessionExamples.length}</dd>
            </div>
            <div className="mission-overview__stat">
              <dt>Drills</dt>
              <dd>{sessionDrills.length}</dd>
            </div>
          </dl>
          <p className="mission-session-details__body">
            {sessionMode === 'reinforce'
              ? 'This short pass skips the full lesson setup and rotates a smaller set of examples and drills.'
              : lesson.objective}
          </p>
        </details>
      </SurfaceCard>

      <SurfaceCard
        title={currentStep.title}
        description={getStepDescription(currentStep.id, {
          exampleCount: sessionExamples.length,
          currentExampleIndex,
          mistakeCount: lesson.commonMistakes.length,
          currentMistakeIndex,
          drillCount: sessionDrills.length,
          currentDrillIndex,
        })}
      >
        <div className="mission-step-panel">
          {currentStep.id === 'intro' ? (
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
          ) : null}

          {currentStep.id === 'examples' ? (
            currentExample ? (
              <div className="mission-focus-card">
                <p className="mission-focus-card__eyebrow">
                  Example {currentExampleIndex + 1} of {sessionExamples.length}
                </p>
                <article className="mission-example-card">
                  <JapaneseTextPair
                    japanese={currentExample.japanese}
                    reading={currentExample.reading}
                  />
                  <p className="mission-example-card__english">{currentExample.english}</p>
                </article>
                {sessionExamples.length > 1 ? (
                  <div className="mission-inline-actions">
                    <button
                      type="button"
                      className="mission-button mission-button--secondary"
                      onClick={() =>
                        setCurrentExampleIndex((index) => Math.max(0, index - 1))
                      }
                      disabled={currentExampleIndex === 0}
                    >
                      Previous example
                    </button>
                    <button
                      type="button"
                      className="mission-button"
                      onClick={() =>
                        setCurrentExampleIndex((index) =>
                          Math.min(sessionExamples.length - 1, index + 1),
                        )
                      }
                      disabled={currentExampleIndex >= sessionExamples.length - 1}
                    >
                      Next example
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="mission-session-details__body">No examples are linked to this lesson yet.</p>
            )
          ) : null}

          {currentStep.id === 'mistakes' ? (
            currentMistake ? (
              <div className="mission-focus-card">
                <p className="mission-focus-card__eyebrow">
                  Guardrail {currentMistakeIndex + 1} of {lesson.commonMistakes.length}
                </p>
                <article className="mission-mistake-card mission-mistake-card--focus">
                  {currentMistake}
                </article>
                {lesson.commonMistakes.length > 1 ? (
                  <div className="mission-inline-actions">
                    <button
                      type="button"
                      className="mission-button mission-button--secondary"
                      onClick={() =>
                        setCurrentMistakeIndex((index) => Math.max(0, index - 1))
                      }
                      disabled={currentMistakeIndex === 0}
                    >
                      Previous note
                    </button>
                    <button
                      type="button"
                      className="mission-button"
                      onClick={() =>
                        setCurrentMistakeIndex((index) =>
                          Math.min(lesson.commonMistakes.length - 1, index + 1),
                        )
                      }
                      disabled={currentMistakeIndex >= lesson.commonMistakes.length - 1}
                    >
                      Next note
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="mission-session-details__body">No common mistakes are listed for this lesson yet.</p>
            )
          ) : null}

          {currentStep.id === 'drills' ? (
            currentDrill ? (
              <>
                <DrillCard
                  key={currentDrill.id}
                  missionId={mission.id}
                  lessonId={lesson.id}
                  drill={currentDrill}
                  index={currentDrillIndex}
                  totalCount={sessionDrills.length}
                  hasNextDrill={currentDrillIndex < sessionDrills.length - 1}
                  onAdvance={goToNextDrill}
                  onCleared={handleDrillCleared}
                />
                <p className="list-meta">
                  {clearedDrillIds.length}/{sessionDrills.length} drills done.
                </p>
              </>
            ) : (
              <p className="mission-session-details__body">No drills are linked to this lesson yet.</p>
            )
          ) : null}

          <div className="mission-step-actions">
            <button
              type="button"
              className="mission-button mission-button--secondary"
              onClick={goToPreviousStep}
              disabled={currentStepIndex === 0}
            >
              Previous
            </button>
            {currentStepIndex < sessionSteps.length - 1 ? (
              <button
                type="button"
                className="mission-button"
                onClick={goToNextStep}
              >
                Next section
              </button>
            ) : (
              <button
                type="button"
                className="mission-button mission-button--link"
                onClick={() =>
                  navigate('/', {
                    state: buildMissionCompletionRouteState(
                      mission,
                      sessionMode,
                      Math.min(clearedDrillIds.length, sessionDrills.length),
                      sessionDrills.length,
                    ),
                  })
                }
              >
                Finish to Today
              </button>
            )}
          </div>
        </div>
      </SurfaceCard>

      <MissionCompletionCard
        missionId={mission.id}
        clearedCount={clearedDrillIds.length}
        totalCount={sessionDrills.length}
        unitLabel="drill"
        sessionMode={sessionMode}
        returnState={buildMissionCompletionRouteState(
          mission,
          sessionMode,
          Math.min(clearedDrillIds.length, sessionDrills.length),
          sessionDrills.length,
        )}
      />
    </div>
  );
}

type DrillCardProps = {
  missionId: string;
  lessonId: string;
  drill: GrammarDrill;
  index: number;
  totalCount: number;
  hasNextDrill: boolean;
  onAdvance: () => void;
  onCleared: (drillId: string) => void;
};

function DrillCard({
  missionId,
  lessonId,
  drill,
  index,
  totalCount,
  hasNextDrill,
  onAdvance,
  onCleared,
}: DrillCardProps) {
  const reorderTokens = getReorderTokens(drill.prompt, drill.id);
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
          Drill {index + 1} of {totalCount} · {formatDrillType(drill.type)}
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
          {feedback ? (
            <>
              <button
                type="button"
                className="mission-button"
                onClick={onAdvance}
              >
                {hasNextDrill ? 'Next drill' : 'Back to today'}
              </button>
              <button
                type="button"
                className="mission-button mission-button--secondary"
                onClick={() => setFeedback(null)}
              >
                Edit answer
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
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

function getMissionSteps(
  sessionMode: MissionSessionMode,
  exampleCount: number,
  drillCount: number,
): MissionStep[] {
  if (sessionMode === 'reinforce') {
    const steps: MissionStep[] = [];

    if (exampleCount > 0) {
      steps.push({
        id: 'examples',
        label: 'Example',
        title: 'Quick example',
        description: 'See one short line before the follow-up checks.',
      });
    }

    if (drillCount > 0) {
      steps.push({
        id: 'drills',
        label: 'Drills',
        title: 'Follow-up drills',
        description: 'Use a shorter alternate drill pass instead of replaying the full lesson.',
      });
    }

    return steps.length > 0
      ? steps
      : [
          {
            id: 'intro',
            label: 'Intro',
            title: 'Lesson intro',
            description: 'Get the pattern clear before you start answering.',
          },
        ];
  }

  return [
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
}

function getStepDescription(
  stepId: MissionStepId,
  {
    exampleCount,
    currentExampleIndex,
    mistakeCount,
    currentMistakeIndex,
    drillCount,
    currentDrillIndex,
  }: {
    exampleCount: number;
    currentExampleIndex: number;
    mistakeCount: number;
    currentMistakeIndex: number;
    drillCount: number;
    currentDrillIndex: number;
  },
) {
  switch (stepId) {
    case 'intro':
      return 'Get the pattern clear before you start answering.';
    case 'examples':
      return exampleCount > 0
        ? `Example ${currentExampleIndex + 1} of ${exampleCount}`
        : 'No examples linked yet.';
    case 'mistakes':
      return mistakeCount > 0
        ? `Guardrail ${currentMistakeIndex + 1} of ${mistakeCount}`
        : 'No common mistakes listed yet.';
    case 'drills':
      return drillCount > 0
        ? `One active drill at a time · ${currentDrillIndex + 1} of ${drillCount}`
        : 'No drills linked yet.';
  }
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
