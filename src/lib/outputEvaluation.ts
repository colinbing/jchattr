import type { OutputTask } from './content/types';
import { normalizeJapaneseText } from './normalizeJapaneseText';

const PARTICLE_TOKENS = new Set(['は', 'が', 'を', 'に', 'で', 'の', 'か']);
const ENDING_TOKENS = new Set(['です', 'ます', 'います', 'あります', 'すき', 'きらい']);

export type OutputEvaluationResult = {
  isAccepted: boolean;
  tone: 'correct' | 'close' | 'incorrect';
  title: string;
  message: string;
  expectedAnswer: string;
};

export function evaluateOutputResponse(
  task: OutputTask,
  response: string,
): OutputEvaluationResult {
  const normalizedResponse = normalizeOutputAnswer(response);
  const normalizedAcceptedAnswers = task.acceptableAnswers.map(normalizeOutputAnswer);

  if (
    normalizedAcceptedAnswers.some((acceptedAnswer) => acceptedAnswer === normalizedResponse)
  ) {
    return {
      isAccepted: true,
      tone: 'correct',
      title: 'Correct.',
      message: 'Your line matches one of the accepted answer patterns.',
      expectedAnswer: task.acceptableAnswers[0],
    };
  }

  const tokenPatterns = task.evaluation?.tokenPatterns?.map((pattern) =>
    pattern.map(normalizeOutputAnswer),
  );

  if (!tokenPatterns?.length) {
    return {
      isAccepted: false,
      tone: 'incorrect',
      title: 'Not quite.',
      message: 'Expected one of the accepted answer patterns.',
      expectedAnswer: task.acceptableAnswers[0],
    };
  }

  const vocabulary = Array.from(new Set(tokenPatterns.flat())).sort(
    (left, right) => right.length - left.length,
  );
  const responseTokens = tokenizeOutputResponse(normalizedResponse, vocabulary);
  const exactTokenPattern = tokenPatterns.find((pattern) => arraysEqual(pattern, responseTokens));

  if (exactTokenPattern) {
    return {
      isAccepted: true,
      tone: 'correct',
      title: 'Correct.',
      message: 'Your line matches one of the accepted answer patterns.',
      expectedAnswer: task.acceptableAnswers[0],
    };
  }

  const closestPattern = selectClosestPattern(tokenPatterns, responseTokens);

  if (!closestPattern) {
    return {
      isAccepted: false,
      tone: 'incorrect',
      title: 'Not quite.',
      message: 'Expected one of the accepted answer patterns.',
      expectedAnswer: task.acceptableAnswers[0],
    };
  }

  const missingTokens = getMissingTokens(closestPattern, responseTokens);
  const unexpectedTokens = getMissingTokens(responseTokens, closestPattern);
  const sameTokensDifferentOrder =
    missingTokens.length === 0 &&
    unexpectedTokens.length === 0 &&
    !arraysEqual(closestPattern, responseTokens);

  if (sameTokensDifferentOrder) {
    return {
      isAccepted: false,
      tone: 'close',
      title: 'Close.',
      message: 'Word order looks off. Try the same pieces in the expected order.',
      expectedAnswer: task.acceptableAnswers[0],
    };
  }

  if (
    missingTokens.length > 0 &&
    missingTokens.every((token) => PARTICLE_TOKENS.has(token)) &&
    unexpectedTokens.length === 0
  ) {
    return {
      isAccepted: false,
      tone: 'close',
      title: 'Close.',
      message: buildMissingParticleMessage(missingTokens),
      expectedAnswer: task.acceptableAnswers[0],
    };
  }

  if (
    missingTokens.length === 1 &&
    unexpectedTokens.length === 1 &&
    PARTICLE_TOKENS.has(missingTokens[0]) &&
    PARTICLE_TOKENS.has(unexpectedTokens[0])
  ) {
    return {
      isAccepted: false,
      tone: 'close',
      title: 'Close.',
      message: `Particle looks off. Try 「${missingTokens[0]}」 instead of 「${unexpectedTokens[0]}」.`,
      expectedAnswer: task.acceptableAnswers[0],
    };
  }

  if (
    missingTokens.length === 1 &&
    unexpectedTokens.length === 0 &&
    ENDING_TOKENS.has(missingTokens[0])
  ) {
    return {
      isAccepted: false,
      tone: 'close',
      title: 'Close.',
      message: `You are close, but missing 「${missingTokens[0]}」.`,
      expectedAnswer: task.acceptableAnswers[0],
    };
  }

  return {
    isAccepted: false,
    tone: 'incorrect',
    title: 'Not quite.',
    message: 'Expected one of the accepted answer patterns.',
    expectedAnswer: task.acceptableAnswers[0],
  };
}

export function normalizeOutputAnswer(value: string) {
  return normalizeJapaneseText(value);
}

function tokenizeOutputResponse(response: string, vocabulary: string[]) {
  if (!response) {
    return [];
  }

  const tokens: string[] = [];
  let index = 0;

  while (index < response.length) {
    const matchedToken = vocabulary.find((token) => response.startsWith(token, index));

    if (matchedToken) {
      tokens.push(matchedToken);
      index += matchedToken.length;
      continue;
    }

    const nextMatchIndex = findNextMatchIndex(response, index + 1, vocabulary);
    const fallbackChunk =
      nextMatchIndex === -1 ? response.slice(index) : response.slice(index, nextMatchIndex);

    tokens.push(fallbackChunk);
    index += fallbackChunk.length;
  }

  return tokens;
}

function findNextMatchIndex(response: string, startIndex: number, vocabulary: string[]) {
  for (let index = startIndex; index < response.length; index += 1) {
    if (vocabulary.some((token) => response.startsWith(token, index))) {
      return index;
    }
  }

  return -1;
}

function selectClosestPattern(patterns: string[][], responseTokens: string[]) {
  return patterns
    .map((pattern) => ({
      pattern,
      commonCount: getCommonTokenCount(pattern, responseTokens),
      orderedCount: getOrderedCommonCount(pattern, responseTokens),
      lengthDelta: Math.abs(pattern.length - responseTokens.length),
    }))
    .sort((left, right) => {
      if (right.commonCount !== left.commonCount) {
        return right.commonCount - left.commonCount;
      }

      if (right.orderedCount !== left.orderedCount) {
        return right.orderedCount - left.orderedCount;
      }

      return left.lengthDelta - right.lengthDelta;
    })[0]?.pattern;
}

function getCommonTokenCount(expected: string[], actual: string[]) {
  const expectedCounts = buildTokenCounts(expected);
  const actualCounts = buildTokenCounts(actual);

  return Object.keys(expectedCounts).reduce((sum, token) => {
    return sum + Math.min(expectedCounts[token] ?? 0, actualCounts[token] ?? 0);
  }, 0);
}

function getOrderedCommonCount(expected: string[], actual: string[]) {
  let actualIndex = 0;
  let count = 0;

  expected.forEach((token) => {
    const nextIndex = actual.indexOf(token, actualIndex);

    if (nextIndex >= 0) {
      count += 1;
      actualIndex = nextIndex + 1;
    }
  });

  return count;
}

function getMissingTokens(expected: string[], actual: string[]) {
  const expectedCounts = buildTokenCounts(expected);
  const actualCounts = buildTokenCounts(actual);

  return Object.entries(expectedCounts).flatMap(([token, expectedCount]) => {
    const missingCount = expectedCount - (actualCounts[token] ?? 0);

    if (missingCount <= 0) {
      return [];
    }

    return Array.from({ length: missingCount }, () => token);
  });
}

function buildTokenCounts(tokens: string[]) {
  return tokens.reduce<Record<string, number>>((counts, token) => {
    counts[token] = (counts[token] ?? 0) + 1;
    return counts;
  }, {});
}

function arraysEqual(left: string[], right: string[]) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function buildMissingParticleMessage(missingTokens: string[]) {
  if (missingTokens.length === 1) {
    return `Close, but you are missing the particle 「${missingTokens[0]}」.`;
  }

  return `Close, but you are missing these particles: ${missingTokens
    .map((token) => `「${token}」`)
    .join('、')}.`;
}
