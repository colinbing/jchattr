import { getContentQaSnapshot } from './lib/contentQa';

const snapshot = getContentQaSnapshot();

const GRAMMAR_MARKERS = [
  'ませんでした',
  'ですか',
  'でした',
  'ました',
  'ません',
  'ください',
  'あります',
  'います',
  'です',
  'ます',
  'から',
  'まで',
  'より',
  'では',
  'には',
  'は',
  'が',
  'を',
  'に',
  'で',
  'の',
  'と',
  'や',
  'も',
  'か',
];

function normalizeText(value: string) {
  return value.replace(/[。！？、\s]/g, '').trim();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function createJapaneseSkeleton(value: string) {
  let nextValue = normalizeText(value);
  const placeholders = GRAMMAR_MARKERS.map((_, index) => String.fromCharCode(0xe000 + index));

  GRAMMAR_MARKERS.forEach((marker, index) => {
    nextValue = nextValue.replaceAll(marker, placeholders[index]);
  });

  nextValue = nextValue
    .replace(/[A-Za-z0-9０-９]+/g, 'X')
    .replace(/[ぁ-んァ-ヶ一-龯ー]+/g, 'X');

  GRAMMAR_MARKERS.forEach((marker, index) => {
    nextValue = nextValue.replace(new RegExp(escapeRegExp(placeholders[index]), 'g'), marker);
  });

  return nextValue.replace(/X+/g, 'X');
}

function groupIdsByKey<T extends { id: string }>(items: T[], getKey: (item: T) => string) {
  return items.reduce<Record<string, string[]>>((record, item) => {
    const key = getKey(item);
    record[key] = [...(record[key] ?? []), item.id];
    return record;
  }, {});
}

function filterDuplicateGroups(groups: Record<string, string[]>, minCount = 2) {
  return Object.entries(groups)
    .filter(([, ids]) => ids.length >= minCount)
    .sort((left, right) => right[1].length - left[1].length || left[0].localeCompare(right[0]));
}

const duplicateExampleJapanese = filterDuplicateGroups(
  groupIdsByKey(snapshot.content.exampleSentences, (item) => normalizeText(item.japanese)),
);
const duplicateExampleEnglish = filterDuplicateGroups(
  groupIdsByKey(snapshot.content.exampleSentences, (item) => item.english.trim().toLowerCase()),
);
const exampleSkeletonGroups = filterDuplicateGroups(
  groupIdsByKey(snapshot.content.exampleSentences, (item) => createJapaneseSkeleton(item.japanese)),
  3,
);
const listeningSkeletonGroups = filterDuplicateGroups(
  groupIdsByKey(snapshot.content.listeningItems, (item) => createJapaneseSkeleton(item.transcript)),
  3,
);
const outputPatternSkeletonGroups = filterDuplicateGroups(
  snapshot.content.missions
    .flatMap((mission) =>
      mission.outputTasks?.map((task) => ({
        id: task.id,
        skeleton: task.evaluation?.tokenPatterns
          ?.map((pattern) =>
            pattern
              .map((token) => (GRAMMAR_MARKERS.includes(token) ? token : 'X'))
              .join(' '),
          )
          .join(' | ') ?? 'no-token-patterns',
      })) ?? [],
    )
    .reduce<Record<string, string[]>>((record, task) => {
      record[task.skeleton] = [...(record[task.skeleton] ?? []), task.id];
      return record;
    }, {}),
  2,
);

console.log('Japanese OS Content Overlap Report');
console.log('');
console.log(`Example sentences inspected: ${snapshot.content.exampleSentences.length}`);
console.log(`Listening items inspected: ${snapshot.content.listeningItems.length}`);
console.log(
  `Output tasks inspected: ${snapshot.content.missions.reduce((total, mission) => total + (mission.outputTasks?.length ?? 0), 0)}`,
);

console.log('');
console.log('Exact duplicate example Japanese lines:');
if (duplicateExampleJapanese.length === 0) {
  console.log('- none');
} else {
  duplicateExampleJapanese.forEach(([text, ids]) => {
    console.log(`- ${text}: ${ids.join(', ')}`);
  });
}

console.log('');
console.log('Exact duplicate example English glosses:');
if (duplicateExampleEnglish.length === 0) {
  console.log('- none');
} else {
  duplicateExampleEnglish.forEach(([text, ids]) => {
    console.log(`- ${text}: ${ids.join(', ')}`);
  });
}

console.log('');
console.log('Repeated example Japanese skeletons (3+ lines):');
if (exampleSkeletonGroups.length === 0) {
  console.log('- none');
} else {
  exampleSkeletonGroups.slice(0, 15).forEach(([skeleton, ids]) => {
    console.log(`- ${skeleton}: ${ids.join(', ')}`);
  });
}

console.log('');
console.log('Repeated listening transcript skeletons (3+ lines):');
if (listeningSkeletonGroups.length === 0) {
  console.log('- none');
} else {
  listeningSkeletonGroups.slice(0, 15).forEach(([skeleton, ids]) => {
    console.log(`- ${skeleton}: ${ids.join(', ')}`);
  });
}

console.log('');
console.log('Repeated output token-pattern skeletons (2+ tasks):');
if (outputPatternSkeletonGroups.length === 0) {
  console.log('- none');
} else {
  outputPatternSkeletonGroups.forEach(([skeleton, ids]) => {
    console.log(`- ${skeleton}: ${ids.join(', ')}`);
  });
}
