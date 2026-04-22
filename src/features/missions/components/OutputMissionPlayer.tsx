import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  const [currentTaskIndex, setCurrentTaskIndex] = useState(() => {
    return (
      resolveContinueStepIndex(readContinueState(), mission.id, mission.type, tasks.length - 1) ??
      0
    );
  });
  const currentTask = tasks[currentTaskIndex];
  const progressValue = ((currentTaskIndex + 1) / tasks.length) * 100;

  useEffect(() => {
    updateContinueState({
      missionId: mission.id,
      missionType: mission.type,
      stepIndex: currentTaskIndex,
    });
  }, [currentTaskIndex, mission.id, mission.type]);

  return (
    <div className="mission-player-shell">
      <SurfaceCard
        title="Mission overview"
        description="Write short lines with linked grammar support nearby. Progress stays local to this page for now."
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
        description="Keep the answer short and clean. Evaluation stays local and rule-based, with light pattern feedback when you are close."
      >
        <div className="mission-step-panel">
          <OutputTaskCard missionId={mission.id} task={currentTask} />

          <div className="mission-step-actions">
            <button
              type="button"
              className="mission-button mission-button--secondary"
              onClick={() => setCurrentTaskIndex((index) => Math.max(0, index - 1))}
              disabled={currentTaskIndex === 0}
            >
              Previous task
            </button>
            {currentTaskIndex < tasks.length - 1 ? (
              <button
                type="button"
                className="mission-button"
                onClick={() => setCurrentTaskIndex((index) => Math.min(tasks.length - 1, index + 1))}
              >
                Next task
              </button>
            ) : (
              <Link to="/" className="mission-button mission-button--link">
                Back to today
              </Link>
            )}
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
                  <p className="mission-example-card__japanese">{example.japanese}</p>
                  <p className="mission-example-card__reading">{example.reading}</p>
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

      <MissionCompletionCard missionId={mission.id} />
    </div>
  );
}

type OutputTaskCardProps = {
  missionId: string;
  task: OutputTask;
};

function OutputTaskCard({ missionId, task }: OutputTaskCardProps) {
  const [response, setResponse] = useState('');
  const [feedback, setFeedback] = useState<OutputEvaluationResult | null>(null);

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

    setFeedback(nextFeedback);
  }

  function resetAnswer() {
    setResponse('');
    setFeedback(null);
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

      <label className="mission-input-group">
        <span className="mission-input-group__label">Your Japanese line</span>
        <textarea
          className="mission-textarea"
          value={response}
          onChange={(event) => {
            setResponse(event.target.value);
            setFeedback(null);
          }}
          rows={3}
          placeholder="Type your line in Japanese"
        />
      </label>

      <div className="mission-drill-card__actions">
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
          onClick={resetAnswer}
        >
          Reset
        </button>
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
              ? feedback.message
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
