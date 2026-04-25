import type { GrammarDrill, GrammarDrillType, GrammarLesson } from '../content/types';
import { normalizeJapaneseText } from '../normalizeJapaneseText';

export type MistakeExplanation = {
  title: string;
  correctPattern: string;
  likelyConfusion?: string;
  explanation: string;
  retryHint: string;
};

export type GrammarMistakeExplanationContext = {
  drill: GrammarDrill;
  lesson?: Pick<GrammarLesson, 'id' | 'title' | 'tags' | 'commonMistakes'>;
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
    getParticleMistakeExplanation(context) ??
    getDrillTypeMistakeExplanation(context.drill, context.lesson)
  );
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
