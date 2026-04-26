import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JapaneseTextPair } from '../../../components/JapaneseTextPair';
import { KanaAssistTextarea } from '../../../components/KanaAssistTextarea';
import { MistakeExplanationDrawer } from '../../../components/MistakeExplanationDrawer';
import type {
  ExampleSentence,
  GrammarLesson,
  Mission,
  OutputTask,
  VocabItem,
} from '../../../lib/content/types';
import { getOutputMistakeExplanation } from '../../../lib/feedback/mistakeExplanations';
import {
  readContinueState,
  resolveContinueStepIndex,
  updateContinueState,
} from '../../../lib/progress/continueState';
import {
  getMissionProgressEntry,
  useMissionProgress,
} from '../../../lib/progress/missionProgress';
import { recordWeakPoint } from '../../../lib/progress/weakPoints';
import { evaluateOutputResponse, type OutputEvaluationResult } from '../../../lib/outputEvaluation';
import {
  buildMissionCompletionRouteState,
  formatMissionReplayVariant,
  selectMissionReplayVariant,
  type MissionSessionMode,
} from '../lib/missionSession';
import { useMissionAutoComplete } from '../lib/useMissionAutoComplete';

type OutputMissionPlayerProps = {
  mission: Mission;
  tasks: OutputTask[];
  relatedLessons: GrammarLesson[];
  relatedExamples: ExampleSentence[];
  relatedVocab: VocabItem[];
  sessionMode: MissionSessionMode;
};

export function OutputMissionPlayer({
  mission,
  tasks,
  relatedLessons,
  relatedExamples,
  relatedVocab,
  sessionMode,
}: OutputMissionPlayerProps) {
  const navigate = useNavigate();
  const missionProgress = useMissionProgress();
  const [sessionRotation] = useState(() => {
    return getMissionProgressEntry(missionProgress, mission.id).completionCount;
  });
  const sessionTaskVariant = useMemo(
    () => selectMissionReplayVariant(tasks, sessionMode, sessionRotation, 2),
    [sessionMode, sessionRotation, tasks],
  );
  const sessionExampleVariant = useMemo(
    () => selectMissionReplayVariant(relatedExamples, sessionMode, sessionRotation, 2),
    [relatedExamples, sessionMode, sessionRotation],
  );
  const sessionVocabVariant = useMemo(
    () => selectMissionReplayVariant(relatedVocab, sessionMode, sessionRotation, 4),
    [relatedVocab, sessionMode, sessionRotation],
  );
  const sessionTasks = sessionTaskVariant.items;
  const sessionExamples = sessionExampleVariant.items;
  const sessionVocab = sessionVocabVariant.items;
  const [clearedTaskIds, setClearedTaskIds] = useState<string[]>([]);
  const [responsesByTaskId, setResponsesByTaskId] = useState<Record<string, string>>({});
  const [feedbackByTaskId, setFeedbackByTaskId] = useState<
    Record<string, OutputEvaluationResult | null>
  >({});
  const [currentTaskIndex, setCurrentTaskIndex] = useState(() => {
    return (
      resolveContinueStepIndex(readContinueState(), mission.id, mission.type, sessionTasks.length - 1) ??
      0
    );
  });
  const currentTask = sessionTasks[currentTaskIndex];
  const currentScenarioStep = mission.scenario?.steps.find((step) => step.id === currentTask.id);
  const currentResponse = responsesByTaskId[currentTask.id] ?? '';
  const currentFeedback = feedbackByTaskId[currentTask.id] ?? null;
  const progressValue = ((currentTaskIndex + 1) / sessionTasks.length) * 100;
  const completionState = buildMissionCompletionRouteState(
    mission,
    sessionMode,
    Math.min(clearedTaskIds.length, sessionTasks.length),
    sessionTasks.length,
  );

  useEffect(() => {
    updateContinueState({
      missionId: mission.id,
      missionType: mission.type,
      stepIndex: currentTaskIndex,
    });
  }, [currentTaskIndex, mission.id, mission.type]);

  useEffect(() => {
    setCurrentTaskIndex((index) => Math.min(index, Math.max(0, sessionTasks.length - 1)));
  }, [sessionTasks.length]);

  useMissionAutoComplete({
    missionId: mission.id,
    clearedCount: clearedTaskIds.length,
    totalCount: sessionTasks.length,
  });

  function handleTaskCleared(taskId: string) {
    setClearedTaskIds((currentIds) =>
      currentIds.includes(taskId) ? currentIds : [...currentIds, taskId],
    );
  }

  function updateTaskResponse(taskId: string, response: string) {
    setResponsesByTaskId((current) => ({
      ...current,
      [taskId]: response,
    }));
  }

  function updateTaskFeedback(taskId: string, feedback: OutputEvaluationResult | null) {
    setFeedbackByTaskId((current) => ({
      ...current,
      [taskId]: feedback,
    }));
  }

  function goToNextTask() {
    if (currentTaskIndex < sessionTasks.length - 1) {
      setCurrentTaskIndex((index) => Math.min(sessionTasks.length - 1, index + 1));
      return;
    }

    navigate('/', { state: completionState });
  }

  return (
    <div className="mission-player-shell mission-player-shell--output">
      <div className="output-workspace">
        <div className="output-session-bar" aria-label="Output mission progress">
          <div className="output-session-bar__copy">
            <p className="mission-copy-block__eyebrow">
              {mission.scenario
                ? sessionMode === 'reinforce'
                  ? 'Short scenario pass'
                  : 'Scenario sim'
                : sessionMode === 'reinforce'
                  ? 'Short output pass'
                  : 'Output mission'}
            </p>
            <h2 className="output-session-bar__title">{mission.title}</h2>
          </div>
          <div className="output-session-bar__progress">
            <span>
              {currentTaskIndex + 1}/{sessionTasks.length}
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

        <details className="output-session-details">
          <summary className="mission-session-details__summary">Mission details</summary>
          <dl className="output-session-details__grid">
            <div>
              <dt>Skill</dt>
              <dd>{formatTargetSkill(mission.targetSkill)}</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>{mission.estimatedMinutes} min</dd>
            </div>
            <div>
              <dt>Prompts</dt>
              <dd>{sessionTasks.length}</dd>
            </div>
            <div>
              <dt>Support</dt>
              <dd>{sessionExamples.length + sessionVocab.length}</dd>
            </div>
            {sessionMode === 'reinforce' ? (
              <div>
                <dt>Replay</dt>
                <dd>{formatMissionReplayVariant(sessionTaskVariant.meta, 'prompt')}</dd>
              </div>
            ) : null}
          </dl>
        </details>

        {mission.scenario ? (
          <section className="scenario-brief" aria-label="Scenario brief">
            <div className="scenario-brief__copy">
              <p className="mission-copy-block__eyebrow">
                {formatScenarioSetting(mission.scenario.setting)}
              </p>
              <h3 className="scenario-brief__title">{mission.scenario.communicativeGoal}</h3>
              {currentScenarioStep ? (
                <p className="scenario-brief__body">{currentScenarioStep.prompt}</p>
              ) : null}
            </div>
            <div className="scenario-brief__meta" aria-label="Scenario source scope">
              <span className="mission-state-pill mission-state-pill--ready">
                {mission.scenario.steps.length} moves
              </span>
              <span className="mission-state-pill mission-state-pill--ready">
                Packs {formatScenarioPackRange(mission.scenario.sourcePackIds)}
              </span>
            </div>
          </section>
        ) : null}

        <OutputTaskCard
          missionId={mission.id}
          task={currentTask}
          relatedVocab={relatedVocab}
          response={currentResponse}
          feedback={currentFeedback}
          currentTaskIndex={currentTaskIndex}
          totalTasks={sessionTasks.length}
          clearedCount={clearedTaskIds.length}
          canGoPrevious={currentTaskIndex > 0}
          hasNextTask={currentTaskIndex < sessionTasks.length - 1}
          onPrevious={() => setCurrentTaskIndex((index) => Math.max(0, index - 1))}
          onResponseChange={updateTaskResponse}
          onFeedbackChange={updateTaskFeedback}
          onCleared={handleTaskCleared}
          onAdvance={goToNextTask}
        />
      </div>

      {(relatedLessons.length > 0 || sessionExamples.length > 0 || sessionVocab.length > 0) ? (
        <details className="output-support-drawer">
          <summary className="output-support-drawer__summary">Pattern support</summary>
          <div className="output-support-grid">
            {relatedLessons.length > 0 ? (
              <div className="output-support-grid__column">
                {relatedLessons.map((lesson) => (
                  <section key={lesson.id} className="mission-copy-block">
                    <p className="mission-copy-block__eyebrow">Linked grammar lesson</p>
                    <h3 className="listening-support__title">{lesson.title}</h3>
                    <p className="mission-copy-block__body">{lesson.explanation}</p>
                  </section>
                ))}
              </div>
            ) : null}

            {sessionExamples.length > 0 ? (
              <div className="mission-example-list">
                {sessionExamples.map((example) => (
                  <article key={example.id} className="mission-example-card">
                    <JapaneseTextPair japanese={example.japanese} reading={example.reading} />
                    <p className="mission-example-card__english">{example.english}</p>
                  </article>
                ))}
              </div>
            ) : null}
          </div>

          {sessionVocab.length > 0 ? (
            <div className="output-vocab-strip">
              {sessionVocab.map((item) => (
                <article key={item.id} className="output-vocab-chip">
                  <p className="output-vocab-chip__kana">{item.kana}</p>
                  <p className="output-vocab-chip__meaning">{item.meaning}</p>
                </article>
              ))}
            </div>
          ) : null}
        </details>
      ) : null}
    </div>
  );
}

type OutputTaskCardProps = {
  missionId: string;
  task: OutputTask;
  relatedVocab: VocabItem[];
  response: string;
  feedback: OutputEvaluationResult | null;
  currentTaskIndex: number;
  totalTasks: number;
  clearedCount: number;
  canGoPrevious: boolean;
  hasNextTask: boolean;
  onPrevious: () => void;
  onResponseChange: (taskId: string, response: string) => void;
  onFeedbackChange: (taskId: string, feedback: OutputEvaluationResult | null) => void;
  onCleared: (taskId: string) => void;
  onAdvance: () => void;
};

function OutputTaskCard({
  missionId,
  task,
  relatedVocab,
  response,
  feedback,
  currentTaskIndex,
  totalTasks,
  clearedCount,
  canGoPrevious,
  hasNextTask,
  onPrevious,
  onResponseChange,
  onFeedbackChange,
  onCleared,
  onAdvance,
}: OutputTaskCardProps) {
  const answerPieces = useMemo(
    () => getOutputAnswerPieces(task, relatedVocab),
    [relatedVocab, task],
  );
  const mistakeExplanation =
    feedback && !feedback.isAccepted
      ? getOutputMistakeExplanation({
          task,
          feedback,
          learnerAnswer: response,
        })
      : null;

  function submitAnswer() {
    if (!response.trim()) {
      return;
    }

    const nextFeedback = evaluateOutputResponse(task, response);

    if (!nextFeedback.isAccepted) {
      recordWeakPoint({
        itemId: task.id,
        itemType: 'output-task',
        missionId,
        contentId: task.id,
      });
    }

    onFeedbackChange(task.id, nextFeedback);
    onCleared(task.id);
  }

  return (
    <div className="output-task-card output-focus-card">
      <div className="output-focus-card__header">
        <div>
          <p className="mission-copy-block__eyebrow">
            Prompt {currentTaskIndex + 1} of {totalTasks}
          </p>
          <p className="output-task-card__prompt">{task.prompt}</p>
        </div>
        <p className="output-focus-card__count">
          {clearedCount}/{totalTasks}
        </p>
      </div>

      {task.hint ? (
        <details className="output-task-card__hint">
          <summary className="review-support-details__summary">Hint</summary>
          <p className="mission-copy-block__body">{task.hint}</p>
        </details>
      ) : null}

      {answerPieces.length > 0 ? (
        <div className="output-piece-strip" aria-label="Answer pieces">
          <p className="mission-copy-block__eyebrow">Pieces</p>
          <div className="output-piece-strip__items">
            {answerPieces.map((piece, pieceIndex) => (
              <article
                key={`${task.id}-${piece.text}-${pieceIndex}`}
                className="output-piece-chip"
              >
                <p className="output-piece-chip__text">{piece.text}</p>
                {piece.meaning ? (
                  <p className="output-piece-chip__meaning">{piece.meaning}</p>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      ) : null}

      <KanaAssistTextarea
        label="Your Japanese line"
        value={response}
        onChange={(value) => onResponseChange(task.id, value)}
        onInteraction={() => onFeedbackChange(task.id, null)}
        onSubmitShortcut={feedback ? onAdvance : submitAnswer}
        rows={3}
        placeholder="Type your line in Japanese. Press Enter to check, Shift+Enter for a new line."
      />

      {feedback ? (
        <div
          className={`mission-feedback mission-feedback--${feedback.tone}`}
          role="status"
          aria-live="polite"
        >
          <p className="mission-feedback__title">{feedback.title}</p>
          <p className="mission-feedback__body">
            {feedback.isAccepted
              ? `${feedback.message} ${hasNextTask ? 'Use the main button to move straight to the next task.' : 'Use the main button to finish the mission.'}`
              : `${feedback.message} Try: ${formatExpectedOutputAnswer(feedback.expectedAnswer)} This stays open for later review while you keep the pass moving.`}
          </p>
        </div>
      ) : null}

      {mistakeExplanation ? (
        <MistakeExplanationDrawer explanation={mistakeExplanation} />
      ) : null}

      <div className="output-focus-card__actions">
        <button
          type="button"
          className="mission-button mission-button--secondary"
          onClick={feedback ? () => onFeedbackChange(task.id, null) : onPrevious}
          disabled={!feedback && !canGoPrevious}
        >
          {feedback ? 'Edit answer' : 'Previous'}
        </button>
        {feedback ? (
          <button type="button" className="mission-button" onClick={onAdvance}>
            {feedback.isAccepted
              ? hasNextTask
                ? 'Next task'
                : 'Finish to Today'
              : hasNextTask
                ? 'Keep moving'
                : 'Finish for now'}
          </button>
        ) : (
          <button
            type="button"
            className="mission-button"
            onClick={submitAnswer}
            disabled={!response.trim()}
          >
            Check answer
          </button>
        )}
      </div>
    </div>
  );
}

function formatExpectedOutputAnswer(answer: string) {
  return /[。.!?！？]$/u.test(answer) ? answer : `${answer}.`;
}

function formatTargetSkill(targetSkill: Mission['targetSkill']) {
  return targetSkill.replace(/-/g, ' ');
}

function formatScenarioSetting(setting: NonNullable<Mission['scenario']>['setting']) {
  return `${setting.replace(/-/g, ' ')} scenario`;
}

function formatScenarioPackRange(sourcePackIds: number[]) {
  const sortedPackIds = [...sourcePackIds].sort((left, right) => left - right);

  if (sortedPackIds.length === 0) {
    return 'n/a';
  }

  if (sortedPackIds.length === 1) {
    return String(sortedPackIds[0]);
  }

  return `${sortedPackIds[0]}-${sortedPackIds[sortedPackIds.length - 1]}`;
}

type OutputAnswerPiece = {
  text: string;
  meaning?: string;
};

const OUTPUT_TOKEN_MEANINGS = new Map<string, string>([
  ['は', 'topic'],
  ['が', 'subject'],
  ['を', 'object'],
  ['に', 'destination/time'],
  ['で', 'action place'],
  ['の', 'linker'],
  ['か', 'question'],
  ['です', 'polite ending'],
  ['ます', 'polite verb ending'],
  ['たなか', 'name'],
]);

function getOutputAnswerPieces(task: OutputTask, relatedVocab: VocabItem[]) {
  const tokenPattern = task.evaluation?.tokenPatterns?.[0] ?? [];

  return tokenPattern.map<OutputAnswerPiece>((token) => {
    const vocabMatch = relatedVocab.find((item) => item.kana === token || item.kanji === token);

    return {
      text: token,
      meaning: vocabMatch?.meaning ?? OUTPUT_TOKEN_MEANINGS.get(token),
    };
  });
}
