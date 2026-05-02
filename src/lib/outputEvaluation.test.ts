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

  it('accepts an exact token pattern', () => {
    expect(evaluateOutputResponse(baseTask, 'わたしはたなかです！')).toMatchObject({
      isAccepted: true,
      tone: 'correct',
    });
  });

  it('returns close for a missing particle', () => {
    expect(evaluateOutputResponse(baseTask, 'わたしたなかです')).toMatchObject({
      isAccepted: false,
      tone: 'close',
    });
  });

  it('returns close for a particle swap', () => {
    expect(evaluateOutputResponse(baseTask, 'わたしがたなかです')).toMatchObject({
      isAccepted: false,
      tone: 'close',
    });
  });

  it('returns close for the right pieces in the wrong order', () => {
    expect(evaluateOutputResponse(baseTask, 'たなかはわたしです')).toMatchObject({
      isAccepted: false,
      tone: 'close',
    });
  });

  it('returns incorrect for unrelated text', () => {
    expect(evaluateOutputResponse(baseTask, 'すしをください')).toMatchObject({
      isAccepted: false,
      tone: 'incorrect',
    });
  });
});
