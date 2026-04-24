import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { recordWeakPoint } from '../../../lib/progress/weakPoints';
import { evaluateOutputResponse, type OutputEvaluationResult } from '../../../lib/outputEvaluation';
import { MissionCompletionCard } from './MissionCompletionCard';
import { useMissionAutoComplete } from '../lib/useMissionAutoComplete';

type OutputMissionPlayerProps = {
  mission: Mission;
  tasks: OutputTask[];
  relatedLessons: GrammarLesson[];
  relatedExamples: ExampleSentence[];
  relatedVocab: VocabItem[];
};

export function OutputMissionPlayer({
  mission,
  tasks,
  relatedLessons,
  relatedExamples,
  relatedVocab,
}: OutputMissionPlayerProps) {
  const navigate = useNavigate();
  const [clearedTaskIds, setClearedTaskIds] = useState<string[]>([]);
  const [responsesByTaskId, setResponsesByTaskId] = useState<Record<string, string>>({});
  const [feedbackByTaskId, setFeedbackByTaskId] = useState<
    Record<string, OutputEvaluationResult | null>
  >({});
  const [currentTaskIndex, setCurrentTaskIndex] = useState(() => {
    return (
      resolveContinueStepIndex(readContinueState(), mission.id, mission.type, tasks.length - 1) ??
      0
    );
  });
  const currentTask = tasks[currentTaskIndex];
  const currentResponse = responsesByTaskId[currentTask.id] ?? '';
  const currentFeedback = feedbackByTaskId[currentTask.id] ?? null;
  const progressValue = ((currentTaskIndex + 1) / tasks.length) * 100;

  useEffect(() => {
    updateContinueState({
      missionId: mission.id,
      missionType: mission.type,
      stepIndex: currentTaskIndex,
    });
  }, [currentTaskIndex, mission.id, mission.type]);

  useMissionAutoComplete({
    missionId: mission.id,
    clearedCount: clearedTaskIds.length,
    totalCount: tasks.length,
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
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex((index) => Math.min(tasks.length - 1, index + 1));
      return;
    }

    navigate('/');
  }

  return (
    <div className="mission-player-shell">
      <SurfaceCard
        title="Mission overview"
        description="Write short lines with linked grammar support nearby. Drafts now stay task-local, and Enter can submit the current answer. Progress stays local to this page for now."
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
              <dd>{tasks.length}</dd>
            </div>
            <div className="mission-overview__stat">
              <dt>Support examples</dt>
              <dd>{relatedExamples.length}</dd>
            </div>
          </dl>

          <div className="mission-progress">
            <div className="mission-progress__meta">
              <p className="mission-progress__label">
                Task {currentTaskIndex + 1} of {tasks.length}
              </p>
              <p className="mission-progress__step">Compose one short line</p>
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
        description="Keep the answer short and clean. Evaluation stays local and rule-based, with task-local drafts and a direct check-to-next flow."
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
            hasNextTask={currentTaskIndex < tasks.length - 1}
          />
          <p className="list-meta">
            Cleared {clearedTaskIds.length} of {tasks.length} output tasks in this pass.
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
              currentTaskIndex < tasks.length - 1 ? (
                <button
                  type="button"
                  className="mission-button"
                  onClick={() => setCurrentTaskIndex((index) => Math.min(tasks.length - 1, index + 1))}
                >
                  Skip for now
                </button>
              ) : (
                <Link to="/" className="mission-button mission-button--link">
                  Back to today
                </Link>
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

          {relatedExamples.length > 0 ? (
            <div className="mission-example-list">
              {relatedExamples.map((example) => (
                <article key={example.id} className="mission-example-card">
                  <JapaneseTextPair japanese={example.japanese} reading={example.reading} />
                  <p className="mission-example-card__english">{example.english}</p>
                </article>
              ))}
            </div>
          ) : null}
        </div>

        {relatedVocab.length > 0 ? (
          <div className="output-vocab-strip">
            {relatedVocab.map((item) => (
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
        totalCount={tasks.length}
        unitLabel="output task"
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
