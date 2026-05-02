import { describe, expect, it } from 'vitest';
import type { OutputTask } from './content/types';
import { evaluateOutputResponse } from './outputEvaluation';

const baseTask = {
  id: 'output-test',
  prompt: 'Introduce yourself.',
  acceptableAnswers: ['わたしはたなかです。', 'わたしはたなかです'],
  evaluation: {
    tokenPatterns: [['わたし', 'は', 'たなか', 'です']],
  },
} satisfies OutputTask;

describe('evaluateOutputResponse', () => {
  it('accepts an exact accepted answer', () => {
    expect(evaluateOutputResponse(baseTask, 'わたしはたなかです。')).toMatchObject({
      isAccepted: true,
      tone: 'correct',
    });
  });

  it('accepts an accepted answer without punctuation when content includes it', () => {
    expect(evaluateOutputResponse(baseTask, 'わたしはたなかです')).toMatchObject({
      isAccepted: true,
      tone: 'correct',
    });
  });

  it('accepts an accepted answer with punctuation even when content omits it', () => {
    const punctuationTask = {
      ...baseTask,
      acceptableAnswers: ['わたしはたなかです'],
    } satisfies OutputTask;

    expect(evaluateOutputResponse(punctuationTask, 'わたしはたなかです。')).toMatchObject({
      isAccepted: true,
      tone: 'correct',
    });
  });

  it('accepts an exact configured token pattern', () => {
    const patternOnlyTask = {
      ...baseTask,
      acceptableAnswers: ['Use the configured token pattern.'],
    } satisfies OutputTask;

    expect(evaluateOutputResponse(patternOnlyTask, 'わたしはたなかです')).toMatchObject({
      isAccepted: true,
      tone: 'correct',
    });
  });

  it('accepts katakana after normalization when the configured pattern is hiragana', () => {
    expect(evaluateOutputResponse(baseTask, 'わたしはたなかです！')).toMatchObject({
      isAccepted: true,
      tone: 'correct',
    });
  });

  it('returns close for a missing particle', () => {
    expect(evaluateOutputResponse(baseTask, 'わたしたなかです')).toMatchObject({
      isAccepted: false,
      tone: 'close',
      message: 'Close, but you are missing the particle 「は」.',
    });
  });

  it('returns close for a particle swap', () => {
    expect(evaluateOutputResponse(baseTask, 'わたしがたなかです')).toMatchObject({
      isAccepted: false,
      tone: 'close',
      message: 'Particle looks off. Try 「は」 instead of 「が」.',
    });
  });

  it('returns close for the right pieces in the wrong order', () => {
    expect(evaluateOutputResponse(baseTask, 'たなかはわたしです')).toMatchObject({
      isAccepted: false,
      tone: 'close',
      message: 'Word order looks off. Try the same pieces in the expected order.',
    });
  });

  it('returns incorrect for unknown extra text even when target pieces are present', () => {
    expect(evaluateOutputResponse(baseTask, 'わたしはたなかですすし')).toMatchObject({
      isAccepted: false,
      tone: 'incorrect',
    });
  });

  it('returns incorrect for unrelated text', () => {
    expect(evaluateOutputResponse(baseTask, 'すしをください')).toMatchObject({
      isAccepted: false,
      tone: 'incorrect',
    });
  });

  it('does not accept kanji unless content provides that exact answer or pattern', () => {
    expect(evaluateOutputResponse(baseTask, '私はたなかです')).toMatchObject({
      isAccepted: false,
      tone: 'incorrect',
    });

    const kanjiTask = {
      ...baseTask,
      acceptableAnswers: ['私は田中です。'],
      evaluation: {
        tokenPatterns: [['私', 'は', '田中', 'です']],
      },
    } satisfies OutputTask;

    expect(evaluateOutputResponse(kanjiTask, '私は田中です')).toMatchObject({
      isAccepted: true,
      tone: 'correct',
    });
  });
});
