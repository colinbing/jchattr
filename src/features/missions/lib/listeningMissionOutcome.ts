import type { MissionItemOutcome } from './missionCompletion';

export type ListeningRevealState = {
  transcript: boolean;
  reading: boolean;
  translation: boolean;
  focus: boolean;
};

export function getListeningMissionOutcome({
  isCorrect,
  revealed,
  readingMatchesTranscript,
}: {
  isCorrect: boolean;
  revealed: ListeningRevealState;
  readingMatchesTranscript: boolean;
}): MissionItemOutcome {
  if (!isCorrect) {
    return 'incorrect';
  }

  return hasPreAnswerListeningSupport(revealed, readingMatchesTranscript)
    ? 'supported'
    : 'correct';
}

export function hasPreAnswerListeningSupport(
  revealed: ListeningRevealState,
  readingMatchesTranscript: boolean,
) {
  return (
    revealed.transcript ||
    revealed.focus ||
    (!readingMatchesTranscript && revealed.reading)
  );
}
