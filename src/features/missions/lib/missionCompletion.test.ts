import { describe, expect, it } from 'vitest';
import { mergeMissionItemOutcome, summarizeMissionItemOutcomes } from './missionCompletion';

describe('summarizeMissionItemOutcomes', () => {
  it('treats all correct items as exposure complete and mastery complete', () => {
    expect(
      summarizeMissionItemOutcomes(
        {
          first: 'correct',
          second: 'correct',
        },
        2,
      ),
    ).toEqual({
      attemptedCount: 2,
      correctCount: 2,
      incorrectCount: 0,
      supportedCount: 0,
      totalCount: 2,
      isExposureComplete: true,
      isMasteryComplete: true,
    });
  });

  it('treats an incorrect item as exposure complete but not mastery complete', () => {
    const summary = summarizeMissionItemOutcomes(
      {
        first: 'correct',
        second: 'incorrect',
      },
      2,
    );

    expect(summary.isExposureComplete).toBe(true);
    expect(summary.isMasteryComplete).toBe(false);
    expect(summary.incorrectCount).toBe(1);
  });

  it('treats a supported item as exposure complete but not mastery complete', () => {
    const summary = summarizeMissionItemOutcomes(
      {
        first: 'correct',
        second: 'supported',
      },
      2,
    );

    expect(summary.isExposureComplete).toBe(true);
    expect(summary.isMasteryComplete).toBe(false);
    expect(summary.supportedCount).toBe(1);
  });

  it('keeps an empty result set incomplete', () => {
    expect(summarizeMissionItemOutcomes({}, 2)).toMatchObject({
      attemptedCount: 0,
      isExposureComplete: false,
      isMasteryComplete: false,
    });
  });

  it('does not let extra result keys inflate the summary beyond total count', () => {
    const summary = summarizeMissionItemOutcomes(
      {
        first: 'correct',
        second: 'correct',
        stale: 'correct',
      },
      2,
    );

    expect(summary).toMatchObject({
      attemptedCount: 2,
      correctCount: 2,
      totalCount: 2,
      isMasteryComplete: true,
    });
  });

  it('keeps a prior miss from becoming clean mastery after edit', () => {
    expect(mergeMissionItemOutcome('incorrect', 'correct')).toBe('incorrect');
  });

  it('keeps a prior supported reveal from becoming clean mastery after edit', () => {
    expect(mergeMissionItemOutcome('supported', 'correct')).toBe('supported');
  });
});
