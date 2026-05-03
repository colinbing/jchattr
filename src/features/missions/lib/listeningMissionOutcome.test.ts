import { describe, expect, it } from 'vitest';
import {
  getListeningMissionOutcome,
  hasPreAnswerListeningSupport,
  type ListeningRevealState,
} from './listeningMissionOutcome';

const hidden: ListeningRevealState = {
  transcript: false,
  reading: false,
  translation: false,
  focus: false,
};

describe('getListeningMissionOutcome', () => {
  it('records no-hint correct answers as clean correct', () => {
    expect(
      getListeningMissionOutcome({
        isCorrect: true,
        revealed: hidden,
        readingMatchesTranscript: false,
      }),
    ).toBe('correct');
  });

  it('records transcript-assisted correct answers as supported', () => {
    expect(
      getListeningMissionOutcome({
        isCorrect: true,
        revealed: { ...hidden, transcript: true },
        readingMatchesTranscript: false,
      }),
    ).toBe('supported');
  });

  it('records reading-assisted correct answers as supported only when reading is distinct', () => {
    expect(
      getListeningMissionOutcome({
        isCorrect: true,
        revealed: { ...hidden, reading: true },
        readingMatchesTranscript: false,
      }),
    ).toBe('supported');

    expect(
      getListeningMissionOutcome({
        isCorrect: true,
        revealed: { ...hidden, reading: true },
        readingMatchesTranscript: true,
      }),
    ).toBe('correct');
  });

  it('records focus-assisted correct answers as supported', () => {
    expect(
      getListeningMissionOutcome({
        isCorrect: true,
        revealed: { ...hidden, focus: true },
        readingMatchesTranscript: false,
      }),
    ).toBe('supported');
  });

  it('keeps incorrect answers incorrect even after support', () => {
    expect(
      getListeningMissionOutcome({
        isCorrect: false,
        revealed: { ...hidden, transcript: true, focus: true },
        readingMatchesTranscript: false,
      }),
    ).toBe('incorrect');
  });
});

describe('hasPreAnswerListeningSupport', () => {
  it('does not treat auto-visible matching reading as support', () => {
    expect(
      hasPreAnswerListeningSupport(
        { ...hidden, reading: true },
        true,
      ),
    ).toBe(false);
  });
});
