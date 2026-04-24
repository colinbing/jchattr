import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JapaneseTextPair } from '../../../components/JapaneseTextPair';
import { KanaAssistTextarea } from '../../../components/KanaAssistTextarea';
import { SurfaceCard } from '../../../components/layout/PageShell';
import type {
  ExampleSentence,
  GrammarLesson,
  Mission,
  OutputTask,
  VocabItem,
} from '../../../lib/content/types';
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
import { MissionCompletionCard } from './MissionCompletionCard';
import {
  buildMissionCompletionRouteState,
  selectMissionSessionItems,
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
  const sessionTasks = useMemo(
    () => selectMissionSessionItems(tasks, sessionMode, sessionRotation, 2),
    [sessionMode, sessionRotation, tasks],
  );
  const sessionExamples = useMemo(
    () => selectMissionSessionItems(relatedExamples, sessionMode, sessionRotation, 2),
    [relatedExamples, sessionMode, sessionRotation],
  );
  const sessionVocab = useMemo(
    () => selectMissionSessionItems(relatedVocab, sessionMode, sessionRotation, 4),
    [relatedVocab, sessionMode, sessionRotation],
  );
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
  const currentResponse = responsesByTaskId[currentTask.id] ?? '';
  const currentFeedback = feedbackByTaskId[currentTask.id] ?? null;
  const progressValue = ((currentTaskIndex + 1) / sessionTasks.length) * 100;

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

  function resetTask(taskId: string) {
    updateTaskResponse(taskId, '');
    updateTaskFeedback(taskId, null);
  }

  function goToNextTask() {
    if (currentTaskIndex < sessionTasks.length - 1) {
      setCurrentTaskIndex((index) => Math.min(sessionTasks.length - 1, index + 1));
      return;
    }

    navigate('/', {
      state: buildMissionCompletionRouteState(
        mission,
        sessionMode,
        Math.min(clearedTaskIds.length, sessionTasks.length),
        sessionTasks.length,
      ),
    });
  }

  return (
    <div className="mission-player-shell">
      <SurfaceCard
        title={sessionMode === 'reinforce' ? 'Short reinforce pass' : 'Mission overview'}
        description={
          sessionMode === 'reinforce'
            ? 'Take a shorter output follow-up pass with a small rotated set of prompts.'
            : 'Write short lines with linked grammar support nearby. Drafts stay task-local, and Enter can submit the current answer.'
        }
      >
        <div className="mission-overview">
          <div className="mission-overview__lesson">
            <p className="mission-overview__eyebrow">Output mission</p>
            <h2 className="mission-overview__lesson-title">{mission.title}</h2>
            <p className="mission-overview__objective">
              Use the prompt, check the support patterns, then type one clean beginner line.
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
              <dt>Output tasks</dt>
              <dd>{sessionTasks.length}</dd>
            </div>
            <div className="mission-overview__stat">
              <dt>Support examples</dt>
              <dd>{sessionExamples.length}</dd>
            </div>
          </dl>

          <div className="mission-progress">
            <div className="mission-progress__meta">
              <p className="mission-progress__label">
                Task {currentTaskIndex + 1} of {sessionTasks.length}
              </p>
              <p className="mission-progress__step">
                {sessionMode === 'reinforce' ? 'Short follow-up prompts' : 'Compose one short line'}
              </p>
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
        title={`Output task ${currentTaskIndex + 1}`}
        description={
          sessionMode === 'reinforce'
            ? 'Keep the answer short and clean. This pass uses a smaller rotated prompt set.'
            : 'Keep the answer short and clean. Evaluation stays local and rule-based, with task-local drafts and a direct check-to-next flow.'
        }
      >
        <div className="mission-step-panel">
          <OutputTaskCard
            missionId={mission.id}
            task={currentTask}
            response={currentResponse}
            feedback={currentFeedback}
            onResponseChange={updateTaskResponse}
            onFeedbackChange={updateTaskFeedback}
            onCleared={handleTaskCleared}
            onReset={resetTask}
            onAdvance={goToNextTask}
            hasNextTask={currentTaskIndex < sessionTasks.length - 1}
          />
          <p className="list-meta">
            Cleared {clearedTaskIds.length} of {sessionTasks.length} output tasks in this pass.
          </p>

          <div className="mission-step-actions">
            <button
              type="button"
              className="mission-button mission-button--secondary"
              onClick={() => setCurrentTaskIndex((index) => Math.max(0, index - 1))}
              disabled={currentTaskIndex === 0}
            >
              Previous task
            </button>
            {!currentFeedback ? (
              currentTaskIndex < sessionTasks.length - 1 ? (
                <button
                  type="button"
                  className="mission-button"
                  onClick={() =>
                    setCurrentTaskIndex((index) => Math.min(sessionTasks.length - 1, index + 1))
                  }
                >
                  Skip for now
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
                        Math.min(clearedTaskIds.length, sessionTasks.length),
                        sessionTasks.length,
                      ),
                    })
                  }
                >
                  Finish to Today
                </button>
              )
            ) : null}
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard
        title="Pattern support"
        description="Use the linked lessons and examples as a compact guide before or after you type."
      >
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
      </SurfaceCard>

      <MissionCompletionCard
        missionId={mission.id}
        clearedCount={clearedTaskIds.length}
        totalCount={sessionTasks.length}
        unitLabel="output task"
        sessionMode={sessionMode}
        returnState={buildMissionCompletionRouteState(
          mission,
          sessionMode,
          Math.min(clearedTaskIds.length, sessionTasks.length),
          sessionTasks.length,
        )}
      />
    </div>
  );
}

type OutputTaskCardProps = {
  missionId: string;
  task: OutputTask;
  response: string;
  feedback: OutputEvaluationResult | null;
  onResponseChange: (taskId: string, response: string) => void;
  onFeedbackChange: (taskId: string, feedback: OutputEvaluationResult | null) => void;
  onCleared: (taskId: string) => void;
  onReset: (taskId: string) => void;
  onAdvance: () => void;
  hasNextTask: boolean;
};

function OutputTaskCard({
  missionId,
  task,
  response,
  feedback,
  onResponseChange,
  onFeedbackChange,
  onCleared,
  onReset,
  onAdvance,
  hasNextTask,
}: OutputTaskCardProps) {
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
    <div className="output-task-card">
      <div className="mission-copy-block">
        <p className="mission-copy-block__eyebrow">Prompt</p>
        <p className="output-task-card__prompt">{task.prompt}</p>
      </div>

      {task.hint ? (
        <div className="output-task-card__hint">
          <p className="mission-copy-block__eyebrow">Hint</p>
          <p className="mission-copy-block__body">{task.hint}</p>
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

      <div className="mission-drill-card__actions">
        {feedback ? (
          <>
            <button
              type="button"
              className="mission-button"
              onClick={onAdvance}
            >
              {hasNextTask ? 'Next task' : 'Back to today'}
            </button>
            <button
              type="button"
              className="mission-button mission-button--secondary"
              onClick={() => onFeedbackChange(task.id, null)}
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
              disabled={!response.trim()}
            >
              Check answer
            </button>
            <button
              type="button"
              className="mission-button mission-button--secondary"
              onClick={() => onReset(task.id)}
            >
              Reset
            </button>
          </>
        )}
      </div>

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
              : `${feedback.message} Expected pattern: ${feedback.expectedAnswer}`}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function formatTargetSkill(targetSkill: Mission['targetSkill']) {
  return targetSkill.replace(/-/g, ' ');
}
