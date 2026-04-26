import type {
  ExampleSentence,
  GrammarDrill,
  GrammarDrillType,
  GrammarLesson,
  ListeningItem,
  OutputTask,
  ReadingCheck,
} from '../content/types';
import type { OutputEvaluationResult } from '../outputEvaluation';
import { normalizeJapaneseText } from '../normalizeJapaneseText';

export type MistakeExplanation = {
  title: string;
  correctPattern: string;
  likelyConfusion?: string;
  explanation: string;
  retryHint: string;
  source?: 'deterministic' | 'ai-fallback';
  safetyNote?: string;
};

export type GrammarMistakeExplanationContext = {
  drill: GrammarDrill;
  lesson?: Pick<GrammarLesson, 'id' | 'title' | 'tags' | 'commonMistakes'>;
  learnerAnswer?: string | null;
};

export type ListeningMistakeExplanationContext = {
  item: Pick<ListeningItem, 'transcript' | 'reading' | 'translation' | 'focusPoint'>;
  learnerAnswer?: string | null;
};

export type ReadingMistakeExplanationContext = {
  check: Pick<ReadingCheck, 'prompt' | 'answer' | 'support'>;
  example: Pick<ExampleSentence, 'japanese' | 'reading' | 'english'>;
  learnerAnswer?: string | null;
};

export type OutputMistakeExplanationContext = {
  task: Pick<OutputTask, 'acceptableAnswers' | 'evaluation'>;
  feedback: Pick<OutputEvaluationResult, 'message' | 'expectedAnswer' | 'tone'>;
  learnerAnswer?: string | null;
};

export type ParticleMistakeExplanationRule = {
  particle: JapaneseParticle;
  role: string;
  correctPattern: string;
  explanation: string;
  retryHint: string;
  confusionHints: Partial<Record<JapaneseParticle, string>>;
};

export type JapaneseParticle =
  | 'は'
  | 'が'
  | 'を'
  | 'に'
  | 'で'
  | 'の'
  | 'と'
  | 'や'
  | 'から'
  | 'まで'
  | 'か';

export const PARTICLE_MISTAKE_EXPLANATION_RULES: ParticleMistakeExplanationRule[] = [
  {
    particle: 'は',
    role: 'topic marker',
    correctPattern: 'Topic は comment',
    explanation:
      'は marks what the sentence is about. In beginner lines, it often sets up the person, thing, place, or time before the comment.',
    retryHint: 'Find the main thing being talked about, then attach は to that chunk.',
    confusionHints: {
      が: 'が often highlights the subject or a focused answer. は sets the topic for the rest of the sentence.',
      を: 'を marks the direct object of an action. は marks the topic being commented on.',
    },
  },
  {
    particle: 'が',
    role: 'subject or focus marker',
    correctPattern: 'Subject が predicate',
    explanation:
      'が marks the subject or focused item. It is also the beginner-safe particle for patterns like すきです, きらいです, ほしいです, and condition lines.',
    retryHint: 'Ask which thing has the feeling, property, or condition, then attach が to that thing.',
    confusionHints: {
      は: 'は sets a broader topic. が points to the subject or focused item inside the target pattern.',
      を: 'を marks what someone acts on. が is expected with すき, きらい, ほしい, and many condition lines.',
    },
  },
  {
    particle: 'を',
    role: 'direct object marker',
    correctPattern: 'Object を action',
    explanation:
      'を marks the thing directly affected by an action: buy it, eat it, drink it, read it, or ask for it.',
    retryHint: 'Find the thing being acted on, then keep を attached to that noun before the verb.',
    confusionHints: {
      が: 'が marks the subject or focused item. を marks the object receiving the action.',
      は: 'は marks the sentence topic. を marks the item the action is done to.',
      に: 'に often marks a destination, time, or existence point. を marks the direct object.',
      で: 'で marks where or how an action happens. を marks what the action affects.',
    },
  },
  {
    particle: 'に',
    role: 'destination, time, or location point',
    correctPattern: 'Point に verb / existence',
    explanation:
      'に marks a target point: a destination, a scheduled time, a person receiving something, or the place where something exists.',
    retryHint: 'Look for a destination, time, recipient, or existence location, then attach に to that point.',
    confusionHints: {
      で: 'で marks where an action happens. に marks the point something goes to, happens at, or exists in.',
      を: 'を marks the direct object. に marks the target point or location point.',
      は: 'は marks the topic. に marks the destination, time, recipient, or existence location.',
    },
  },
  {
    particle: 'で',
    role: 'action place or method marker',
    correctPattern: 'Place/means で action',
    explanation:
      'で marks where an action happens or the method used to do it. It answers "where do you do it?" or "by what means?"',
    retryHint: 'Find the action, then ask where or how that action happens.',
    confusionHints: {
      に: 'に marks a destination, time, or existence point. で marks the place or method of an action.',
      を: 'を marks the object affected by the action. で marks where or how the action happens.',
      は: 'は marks the topic. で marks the action setting or method.',
    },
  },
  {
    particle: 'の',
    role: 'noun-linking marker',
    correctPattern: 'Noun の noun',
    explanation:
      'の links nouns. It can show possession, category, or position phrases like いすのうえ.',
    retryHint: 'Keep の between the two nouns it connects.',
    confusionHints: {
      は: 'は marks the topic of the whole sentence. の links one noun directly to another noun.',
      に: 'に marks a location point. の builds the noun phrase that names the position or owner.',
    },
  },
  {
    particle: 'と',
    role: 'companion or complete-list marker',
    correctPattern: 'A と B / person と action',
    explanation:
      'と can mark someone you do an action with or connect items in a complete list.',
    retryHint: 'Use と when the line means "with" someone or gives a closed A-and-B list.',
    confusionHints: {
      や: 'や gives an open list with examples. と gives a complete A-and-B list or means "with."',
      に: 'に marks a target point. と marks a companion or complete list item.',
    },
  },
  {
    particle: 'や',
    role: 'open-list marker',
    correctPattern: 'A や B',
    explanation:
      'や connects example items in an open list. It means there may be other items too.',
    retryHint: 'Use や when the list is "A, B, and things like that," not a complete list.',
    confusionHints: {
      と: 'と gives a complete list. や gives an example list that leaves room for other items.',
    },
  },
  {
    particle: 'から',
    role: 'reason or starting-point marker',
    correctPattern: 'Reason から result / start から end まで',
    explanation:
      'から can mark a reason or a starting point. In this beginner slice, reason lines stay short and practical.',
    retryHint: 'Check whether the line needs a reason/start point, then place から after that chunk.',
    confusionHints: {
      まで: 'まで marks the endpoint. から marks the reason or starting point.',
      で: 'で marks action place or method. から gives the reason or starting point.',
    },
  },
  {
    particle: 'まで',
    role: 'endpoint marker',
    correctPattern: 'Start から end まで',
    explanation:
      'まで marks the endpoint of a time, place, or range. It often pairs with から for "from X to Y."',
    retryHint: 'Find the endpoint of the range, then attach まで to that endpoint.',
    confusionHints: {
      から: 'から marks where the range starts. まで marks where the range ends.',
      に: 'に can mark a time point. まで marks the endpoint of a range.',
    },
  },
  {
    particle: 'か',
    role: 'question marker',
    correctPattern: 'Polite sentence か',
    explanation:
      'か marks a question at the end of a polite sentence. It turns the line into something being asked.',
    retryHint: 'If the prompt is asking, keep か at the end of the polite sentence.',
    confusionHints: {
      は: 'は marks a topic inside the sentence. か turns the sentence into a question.',
    },
  },
];

const PARTICLE_INFERENCE_RULES: Array<{ particle: JapaneseParticle; patterns: RegExp[] }> = [
  {
    particle: 'から',
    patterns: [/kara/, /reason/, /time-ranges/],
  },
  {
    particle: 'まで',
    patterns: [/made/, /time-ranges/, /destination-made/],
  },
  {
    particle: 'で',
    patterns: [/place-de/, /transport-de/, /meeting-place-de/, /methods-douyatte/],
  },
  {
    particle: 'に',
    patterns: [
      /destination-ni/,
      /weekday.*ni/,
      /time-ni/,
      /calendar/,
      /existence/,
      /arrival/,
      /appointment/,
      /before-after/,
    ],
  },
  {
    particle: 'の',
    patterns: [/position-no/, /possession/, /noun-linking/, /family-possession/, /before-after/],
  },
  {
    particle: 'が',
    patterns: [/preference/, /suki/, /kirai/, /hoshii/, /health-condition/, /object-desire/],
  },
  {
    particle: 'を',
    patterns: [/shopping-o/, /kaimasu/, /object/, /request/, /getting-on-off/],
  },
  {
    particle: 'と',
    patterns: [/companions/, /dare-to/, /listing-to/],
  },
  {
    particle: 'や',
    patterns: [/listing-ya/],
  },
  {
    particle: 'か',
    patterns: [/question/, /masenka/, /mashou/, /arimasu-ka/],
  },
  {
    particle: 'は',
    patterns: [/topic/, /where/, /adjective/, /weather/, /plain-style-recognition/],
  },
];

const PARTICLE_RULES_BY_PARTICLE = new Map(
  PARTICLE_MISTAKE_EXPLANATION_RULES.map((rule) => [rule.particle, rule] as const),
);

const PARTICLES_BY_LENGTH = [...PARTICLE_MISTAKE_EXPLANATION_RULES.map((rule) => rule.particle)].sort(
  (left, right) => right.length - left.length,
);

export function getGrammarMistakeExplanation(
  context: GrammarMistakeExplanationContext,
): MistakeExplanation {
  return (
    getSpecificGrammarDistractorExplanation(context) ??
    getParticleMistakeExplanation(context) ??
    getDrillTypeMistakeExplanation(context.drill, context.lesson)
  );
}

function getSpecificGrammarDistractorExplanation({
  drill,
  learnerAnswer,
}: GrammarMistakeExplanationContext): MistakeExplanation | null {
  if (!learnerAnswer) {
    return null;
  }

  const normalizedAnswer = normalizeJapaneseText(drill.answer);
  const normalizedLearnerAnswer = normalizeJapaneseText(learnerAnswer);
  const answerHasQuestionMarker = normalizedAnswer.endsWith('か');
  const learnerHasQuestionMarker = normalizedLearnerAnswer.includes('か');

  if (!answerHasQuestionMarker && learnerHasQuestionMarker) {
    return {
      title: 'Do not add か unless the line is a question.',
      correctPattern: drill.answer,
      likelyConfusion: 'The selected answer turns the statement into a question-like line.',
      explanation:
        'か belongs at the end of a polite question. If the prompt wants a statement, keep the sentence ending as です or the target verb form without か.',
      retryHint: 'First decide whether the English prompt is asking or stating, then check the final ending.',
    };
  }

  if (answerHasQuestionMarker && !learnerHasQuestionMarker) {
    return {
      title: 'Add か when the prompt is asking.',
      correctPattern: drill.answer,
      likelyConfusion: 'The selected answer is a statement, but the prompt needs a question.',
      explanation:
        'In this beginner polite style, か at the end turns the sentence into a question.',
      retryHint: 'Keep the statement structure, then add か at the end if the prompt asks something.',
    };
  }

  if (
    normalizedAnswer.includes('は') &&
    normalizedLearnerAnswer.includes('は') &&
    normalizedAnswer !== normalizedLearnerAnswer
  ) {
    return {
      title: 'Keep the topic and comment in the practiced order.',
      correctPattern: drill.answer,
      likelyConfusion:
        'The selected answer has は, but the topic/comment relationship does not match the target sentence.',
      explanation:
        'は marks the topic, and the rest of the sentence comments on that topic. In these early drills, changing which chunk comes before は changes what the sentence is about.',
      retryHint: 'Match the topic from the English prompt first, then put は after that topic.',
    };
  }

  return null;
}

export function getParticleMistakeExplanation(
  context: GrammarMistakeExplanationContext,
): MistakeExplanation | null {
  const particle = inferCorrectParticle(context);
  const rule = particle ? PARTICLE_RULES_BY_PARTICLE.get(particle) : undefined;

  if (!rule) {
    return null;
  }

  const learnerParticle = inferLearnerParticle(context.learnerAnswer, rule);
  const likelyConfusion =
    learnerParticle && learnerParticle !== rule.particle
      ? rule.confusionHints[learnerParticle]
      : getLessonConfusion(context.lesson);

  return {
    title: `Use ${rule.particle} for the ${rule.role}.`,
    correctPattern: rule.correctPattern,
    likelyConfusion,
    explanation: rule.explanation,
    retryHint: rule.retryHint,
  };
}

export function getDrillTypeMistakeExplanation(
  drill: Pick<GrammarDrill, 'type' | 'answer' | 'support'>,
  lesson?: Pick<GrammarLesson, 'commonMistakes'>,
): MistakeExplanation {
  const likelyConfusion = drill.support ?? getLessonConfusion(lesson);
  const explanation = DRILL_TYPE_EXPLANATIONS[drill.type];

  return {
    title: explanation.title,
    correctPattern: drill.answer,
    likelyConfusion,
    explanation: explanation.explanation,
    retryHint: explanation.retryHint,
  };
}

export function getListeningMistakeExplanation({
  item,
  learnerAnswer,
}: ListeningMistakeExplanationContext): MistakeExplanation {
  return {
    title: 'Match the heard line to its gist.',
    correctPattern: item.translation,
    likelyConfusion: learnerAnswer ? `You chose: ${learnerAnswer}` : undefined,
    explanation: `This listening item is asking for the overall meaning of 「${item.transcript}」. The focus point is: ${item.focusPoint}`,
    retryHint:
      'Replay the audio once, then reveal the transcript or pattern hint only if you still cannot anchor the meaning.',
  };
}

export function getReadingMistakeExplanation({
  check,
  example,
  learnerAnswer,
}: ReadingMistakeExplanationContext): MistakeExplanation {
  return {
    title: 'Connect the check to the source line.',
    correctPattern: check.answer,
    likelyConfusion: learnerAnswer ? `You chose: ${learnerAnswer}` : check.support,
    explanation: `The check asks: ${check.prompt} The source line means: ${example.english}`,
    retryHint:
      check.support ??
      'Read the Japanese line first, identify the asked detail, then compare only that detail against the choices.',
  };
}

export function getOutputMistakeExplanation({
  task,
  feedback,
  learnerAnswer,
}: OutputMistakeExplanationContext): MistakeExplanation {
  const patternAnalysis = analyzeOutputTokenPattern(task, learnerAnswer);
  const variantSummary = formatAcceptableVariants(task.acceptableAnswers);
  const targetPattern = patternAnalysis?.targetPattern.length
    ? patternAnalysis.targetPattern.join(' + ')
    : task.acceptableAnswers[0];

  return {
    title:
      feedback.tone === 'close'
        ? 'Close, but one output piece is off.'
        : 'Use the target output pattern.',
    correctPattern: variantSummary,
    likelyConfusion: patternAnalysis?.likelyConfusion ?? feedback.message,
    explanation: `This prompt accepts short beginner-safe variants. The main target pieces are: ${targetPattern}`,
    retryHint: patternAnalysis?.retryHint ?? 'Retry with the shortest acceptable line first.',
  };
}

export function inferCorrectParticle({
  drill,
  lesson,
}: GrammarMistakeExplanationContext): JapaneseParticle | null {
  const answerParticle = getStandaloneParticleAnswer(drill.answer);

  if (answerParticle) {
    return answerParticle;
  }

  const searchableText = normalizeSearchText(
    [lesson?.id, lesson?.title, lesson?.tags.join(' '), drill.id, drill.prompt, drill.support]
      .filter(Boolean)
      .join(' '),
  );

  const inferredRule = PARTICLE_INFERENCE_RULES.find((rule) =>
    rule.patterns.some((pattern) => pattern.test(searchableText)),
  );

  if (inferredRule) {
    return inferredRule.particle;
  }

  const normalizedAnswer = normalizeJapaneseText(drill.answer);
  const answerParticleFromPhrase = PARTICLES_BY_LENGTH.find((particle) =>
    normalizedAnswer.includes(particle),
  );

  return answerParticleFromPhrase ?? null;
}

function inferLearnerParticle(
  learnerAnswer: string | null | undefined,
  rule: ParticleMistakeExplanationRule,
): JapaneseParticle | null {
  if (!learnerAnswer) {
    return null;
  }

  const standaloneParticle = getStandaloneParticleAnswer(learnerAnswer);

  if (standaloneParticle) {
    return standaloneParticle;
  }

  const normalizedAnswer = normalizeJapaneseText(learnerAnswer);
  const likelyParticle = Object.keys(rule.confusionHints).find((particle) =>
    normalizedAnswer.includes(particle),
  ) as JapaneseParticle | undefined;

  return likelyParticle ?? null;
}

function getStandaloneParticleAnswer(value: string): JapaneseParticle | null {
  const normalizedValue = normalizeJapaneseText(value);
  const matchedParticle = PARTICLES_BY_LENGTH.find((particle) => normalizedValue === particle);

  return matchedParticle ?? null;
}

function getLessonConfusion(lesson?: Pick<GrammarLesson, 'commonMistakes'>) {
  return lesson?.commonMistakes[0];
}

function normalizeSearchText(value: string) {
  return value.normalize('NFKC').toLowerCase();
}

const DRILL_TYPE_EXPLANATIONS: Record<
  GrammarDrillType,
  Pick<MistakeExplanation, 'title' | 'explanation' | 'retryHint'>
> = {
  'multiple-choice': {
    title: 'Choose the option that keeps the target pattern.',
    explanation:
      'Multiple-choice grammar checks usually contrast one small grammar decision. The right answer keeps the lesson pattern while the distractors change a particle, ending, or sentence role.',
    retryHint: 'Compare the chunk around the target grammar before rereading the full sentence.',
  },
  'fill-in': {
    title: 'Fill the exact missing grammar chunk.',
    explanation:
      'Fill-in checks expect the missing particle, ending, or short grammar chunk from the lesson. Extra words can make the line grammatically different.',
    retryHint: 'Read the words before and after the blank, then insert only the missing chunk.',
  },
  reorder: {
    title: 'Keep each Japanese chunk attached in order.',
    explanation:
      'Reorder checks test whether the sentence pieces stay attached to their particles and endings. Japanese order is flexible in some places, but these beginner drills expect the practiced pattern.',
    retryHint: 'Keep particle chunks with their nouns, then place the ending or main verb at the end.',
  },
};

function formatAcceptableVariants(acceptableAnswers: string[]) {
  const visibleAnswers = acceptableAnswers.slice(0, 3);
  const suffix = acceptableAnswers.length > visibleAnswers.length ? ' ...' : '';

  return `${visibleAnswers.join(' / ')}${suffix}`;
}

function analyzeOutputTokenPattern(
  task: Pick<OutputTask, 'evaluation'>,
  learnerAnswer: string | null | undefined,
):
  | {
      targetPattern: string[];
      likelyConfusion?: string;
      retryHint: string;
    }
  | null {
  const tokenPatterns = task.evaluation?.tokenPatterns?.map((pattern) =>
    pattern.map(normalizeJapaneseText),
  );

  if (!tokenPatterns?.length) {
    return null;
  }

  const normalizedLearnerAnswer = normalizeJapaneseText(learnerAnswer ?? '');
  const vocabulary = Array.from(new Set(tokenPatterns.flat())).sort(
    (left, right) => right.length - left.length,
  );
  const responseTokens = tokenizeOutputResponseForExplanation(normalizedLearnerAnswer, vocabulary);
  const closestPattern = selectClosestOutputPattern(tokenPatterns, responseTokens);

  if (!closestPattern) {
    return {
      targetPattern: tokenPatterns[0],
      retryHint: 'Use the visible pieces or hint, then rebuild one accepted line from left to right.',
    };
  }

  const missingTokens = getMissingOutputTokens(closestPattern, responseTokens);
  const unexpectedTokens = getMissingOutputTokens(responseTokens, closestPattern);
  const sameTokensDifferentOrder =
    missingTokens.length === 0 &&
    unexpectedTokens.length === 0 &&
    !arraysEqual(closestPattern, responseTokens);

  if (sameTokensDifferentOrder) {
    return {
      targetPattern: closestPattern,
      likelyConfusion: 'The expected pieces are present, but their order does not match this drill.',
      retryHint: 'Keep particles attached to their nouns, then put the polite ending or main verb last.',
    };
  }

  if (missingTokens.length > 0 && unexpectedTokens.length > 0) {
    return {
      targetPattern: closestPattern,
      likelyConfusion: `Missing ${formatJapaneseTokenList(
        missingTokens,
      )}; extra or different piece ${formatJapaneseTokenList(unexpectedTokens)}.`,
      retryHint: 'Swap the off-pattern piece first, then check whether the rest of the line still matches.',
    };
  }

  if (missingTokens.length > 0) {
    return {
      targetPattern: closestPattern,
      likelyConfusion: `Missing ${formatJapaneseTokenList(missingTokens)}.`,
      retryHint: 'Add the missing target piece without adding extra words.',
    };
  }

  if (unexpectedTokens.length > 0) {
    return {
      targetPattern: closestPattern,
      likelyConfusion: `Extra or different piece ${formatJapaneseTokenList(unexpectedTokens)}.`,
      retryHint: 'Remove the extra piece and keep the shortest accepted version.',
    };
  }

  return {
    targetPattern: closestPattern,
    retryHint: 'Compare your line against one acceptable variant and retry the shortest version.',
  };
}

function tokenizeOutputResponseForExplanation(response: string, vocabulary: string[]) {
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

    const nextMatchIndex = findNextOutputTokenIndex(response, index + 1, vocabulary);
    const fallbackChunk =
      nextMatchIndex === -1 ? response.slice(index) : response.slice(index, nextMatchIndex);

    tokens.push(fallbackChunk);
    index += fallbackChunk.length;
  }

  return tokens;
}

function findNextOutputTokenIndex(response: string, startIndex: number, vocabulary: string[]) {
  for (let index = startIndex; index < response.length; index += 1) {
    if (vocabulary.some((token) => response.startsWith(token, index))) {
      return index;
    }
  }

  return -1;
}

function selectClosestOutputPattern(patterns: string[][], responseTokens: string[]) {
  return patterns
    .map((pattern) => ({
      pattern,
      commonCount: getCommonOutputTokenCount(pattern, responseTokens),
      orderedCount: getOrderedCommonOutputCount(pattern, responseTokens),
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

function getCommonOutputTokenCount(expected: string[], actual: string[]) {
  const expectedCounts = buildOutputTokenCounts(expected);
  const actualCounts = buildOutputTokenCounts(actual);

  return Object.keys(expectedCounts).reduce((sum, token) => {
    return sum + Math.min(expectedCounts[token] ?? 0, actualCounts[token] ?? 0);
  }, 0);
}

function getOrderedCommonOutputCount(expected: string[], actual: string[]) {
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

function getMissingOutputTokens(expected: string[], actual: string[]) {
  const expectedCounts = buildOutputTokenCounts(expected);
  const actualCounts = buildOutputTokenCounts(actual);

  return Object.entries(expectedCounts).flatMap(([token, expectedCount]) => {
    const missingCount = expectedCount - (actualCounts[token] ?? 0);

    if (missingCount <= 0) {
      return [];
    }

    return Array.from({ length: missingCount }, () => token);
  });
}

function buildOutputTokenCounts(tokens: string[]) {
  return tokens.reduce<Record<string, number>>((counts, token) => {
    counts[token] = (counts[token] ?? 0) + 1;
    return counts;
  }, {});
}

function arraysEqual(left: string[], right: string[]) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function formatJapaneseTokenList(tokens: string[]) {
  return tokens.map((token) => `「${token}」`).join(', ');
}
