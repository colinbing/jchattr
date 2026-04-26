import type { MistakeExplanation } from '../lib/feedback/mistakeExplanations';

type MistakeExplanationDrawerProps = {
  explanation: MistakeExplanation;
};

export function MistakeExplanationDrawer({ explanation }: MistakeExplanationDrawerProps) {
  return (
    <details className="mission-explainer-drawer">
      <summary className="mission-explainer-drawer__summary">Explain mistake</summary>
      <div className="mission-explainer">
        <p className="mission-explainer__title">{explanation.title}</p>
        <dl className="mission-explainer__list">
          <div>
            <dt>Pattern</dt>
            <dd>{explanation.correctPattern}</dd>
          </div>
          {explanation.likelyConfusion ? (
            <div>
              <dt>Likely confusion</dt>
              <dd>{explanation.likelyConfusion}</dd>
            </div>
          ) : null}
          <div>
            <dt>Why</dt>
            <dd>{explanation.explanation}</dd>
          </div>
          <div>
            <dt>Retry</dt>
            <dd>{explanation.retryHint}</dd>
          </div>
        </dl>
      </div>
    </details>
  );
}
