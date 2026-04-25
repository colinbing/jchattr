import type { ListeningItem } from './content/types';

type ListeningChoiceOptions = {
  avoidTranslations?: string[];
  distractorCount?: number;
  shuffleSeed?: string;
};

type ListeningCandidate = {
  item: ListeningItem;
  score: number;
};

export function getListeningTranslationChoices(
  item: ListeningItem,
  choicePool: ListeningItem[],
  options: ListeningChoiceOptions = {},
) {
  const distractorCount = options.distractorCount ?? 2;
  const avoidTranslations = new Set(
    (options.avoidTranslations ?? []).filter(
      (translation) => translation !== item.translation,
    ),
  );
  const candidates = choicePool
    .filter((candidate) => {
      return candidate.id !== item.id && candidate.translation !== item.translation;
    })
    .reduce<ListeningCandidate[]>((result, candidate) => {
      if (result.some((entry) => entry.item.translation === candidate.translation)) {
        return result;
      }

      result.push({
        item: candidate,
        score: scoreDistractorCandidate(item, candidate, avoidTranslations),
      });
      return result;
    }, [])
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return hashString(`${item.id}:${left.item.id}`) - hashString(`${item.id}:${right.item.id}`);
    });

  const preferredDistractors = pickDistractors(
    candidates.filter((candidate) => !avoidTranslations.has(candidate.item.translation)),
    distractorCount,
  );
  const distractors =
    preferredDistractors.length >= distractorCount
      ? preferredDistractors
      : pickDistractors(candidates, distractorCount);

  return shuffleWithSeed(
    [item.translation, ...distractors.map((candidate) => candidate.item.translation)],
    `${item.id}:${options.shuffleSeed ?? 'default'}`,
    item.translation,
  );
}

function pickDistractors(candidates: ListeningCandidate[], count: number) {
  const results: ListeningCandidate[] = [];

  for (const candidate of candidates) {
    if (results.some((entry) => entry.item.translation === candidate.item.translation)) {
      continue;
    }

    results.push(candidate);

    if (results.length >= count) {
      break;
    }
  }

  return results;
}

function scoreDistractorCandidate(
  item: ListeningItem,
  candidate: ListeningItem,
  avoidTranslations: Set<string>,
) {
  const itemIsQuestion = item.translation.trim().endsWith('?');
  const candidateIsQuestion = candidate.translation.trim().endsWith('?');
  const itemWordCount = countWords(item.translation);
  const candidateWordCount = countWords(candidate.translation);
  const sharedTranslationWords = countSharedValues(
    getMeaningfulTranslationWords(item.translation),
    getMeaningfulTranslationWords(candidate.translation),
  );
  const sharedJapaneseSignals = countSharedValues(
    getJapaneseSignals(item.reading || item.transcript),
    getJapaneseSignals(candidate.reading || candidate.transcript),
  );

  let score = 0;

  if (candidate.difficulty === item.difficulty) {
    score += 4;
  }

  if (candidateIsQuestion === itemIsQuestion) {
    score += 3;
  }

  score -= Math.abs(candidateWordCount - itemWordCount);
  score += Math.min(sharedTranslationWords, 3) * 5;
  score += Math.min(sharedJapaneseSignals, 4) * 2;

  if (avoidTranslations.has(candidate.translation)) {
    score -= 20;
  }

  return score;
}

function countWords(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function shuffleWithSeed(values: string[], seed: string, correctAnswer: string) {
  const random = createSeededRandom(seed);
  const shuffled = [...values];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const currentValue = shuffled[index];
    shuffled[index] = shuffled[swapIndex];
    shuffled[swapIndex] = currentValue;
  }

  const currentCorrectIndex = shuffled.indexOf(correctAnswer);
  const targetCorrectIndex = hashString(`${seed}:answer-position`) % shuffled.length;

  if (currentCorrectIndex >= 0 && currentCorrectIndex !== targetCorrectIndex) {
    const targetValue = shuffled[targetCorrectIndex];
    shuffled[targetCorrectIndex] = correctAnswer;
    shuffled[currentCorrectIndex] = targetValue;
  }

  return shuffled;
}

function getMeaningfulTranslationWords(value: string) {
  const stopWords = new Set([
    'a',
    'an',
    'am',
    'are',
    'at',
    'be',
    'do',
    'does',
    'i',
    'in',
    'is',
    'it',
    'my',
    'of',
    'the',
    'this',
    'to',
    'we',
    'will',
    'you',
  ]);

  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));
}

function getJapaneseSignals(value: string) {
  return Array.from(new Set(value.replace(/[、。？！\s]/g, '').split(''))).filter((char) => {
    return !['は', 'が', 'を', 'に', 'で', 'の', 'か', '。'].includes(char);
  });
}

function countSharedValues(leftValues: string[], rightValues: string[]) {
  const rightSet = new Set(rightValues);

  return Array.from(new Set(leftValues)).filter((value) => rightSet.has(value)).length;
}

function createSeededRandom(seed: string) {
  let state = hashString(seed) || 1;

  return function nextRandom() {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function hashString(value: string) {
  let hash = 0;

  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }

  return hash;
}
