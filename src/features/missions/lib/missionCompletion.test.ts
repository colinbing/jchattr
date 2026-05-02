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
        ['first', 'second'],
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
      ['first', 'second'],
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
      ['first', 'second'],
    );

    expect(summary.isExposureComplete).toBe(true);
    expect(summary.isMasteryComplete).toBe(false);
    expect(summary.supportedCount).toBe(1);
  });

  it('keeps an empty result set incomplete', () => {
    expect(summarizeMissionItemOutcomes({}, ['first', 'second'])).toMatchObject({
      attemptedCount: 0,
      totalCount: 2,
      isExposureComplete: false,
      isMasteryComplete: false,
    });
  });

  it('ignores extra result keys outside the expected active item ids', () => {
    const summary = summarizeMissionItemOutcomes(
      {
        stale: 'incorrect',
        first: 'correct',
        second: 'correct',
      },
      ['first', 'second'],
    );

    expect(summary).toMatchObject({
      attemptedCount: 2,
      correctCount: 2,
      incorrectCount: 0,
      totalCount: 2,
      isMasteryComplete: true,
    });
  });

  it('counts by expected ids instead of stale key insertion order', () => {
    const summary = summarizeMissionItemOutcomes(
      {
        stale: 'correct',
        first: 'incorrect',
        second: 'supported',
      },
      ['first', 'second'],
    );

    expect(summary).toMatchObject({
      attemptedCount: 2,
      correctCount: 0,
      incorrectCount: 1,
      supportedCount: 1,
      totalCount: 2,
      isExposureComplete: true,
      isMasteryComplete: false,
    });
  });

  it('keeps missing expected outcomes incomplete even when stale keys are present', () => {
    const summary = summarizeMissionItemOutcomes(
      {
        first: 'correct',
        stale: 'correct',
      },
      ['first', 'second'],
    );

    expect(summary).toMatchObject({
      attemptedCount: 1,
      correctCount: 1,
      totalCount: 2,
      isExposureComplete: false,
      isMasteryComplete: false,
    });
  });

  it('keeps a prior miss from becoming clean mastery after edit', () => {
    expect(mergeMissionItemOutcome('incorrect', 'correct')).toBe('incorrect');
  });

  it('keeps a prior supported reveal from becoming clean mastery after edit', () => {
    expect(mergeMissionItemOutcome('supported', 'correct')).toBe('supported');
  });
});
