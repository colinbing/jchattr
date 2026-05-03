import type { ReactNode } from 'react';

export type MissionFeedbackTone = 'correct' | 'close' | 'supported' | 'incorrect';

type MissionFeedbackBlockProps = {
  tone: MissionFeedbackTone;
  title: ReactNode;
  body: ReactNode;
};

export function MissionFeedbackBlock({
  tone,
  title,
  body,
}: MissionFeedbackBlockProps) {
  return (
    <div
      className={`mission-feedback mission-feedback--${tone}`}
      role="status"
      aria-live="polite"
    >
      <p className="mission-feedback__title">{title}</p>
      <p className="mission-feedback__body">{body}</p>
    </div>
  );
}
