import { contentPacks } from '../../src/content/contentPacks';
import { getStarterContent } from '../../src/lib/content/loader';
import { getListeningAudioStatus } from '../../src/lib/audio/listeningAudioAssets';

function countBy<T extends string>(values: T[]) {
  return values.reduce<Record<string, number>>((record, value) => {
    record[value] = (record[value] ?? 0) + 1;
    return record;
  }, {});
}

export function sortCountEntries(record: Record<string, number>) {
  return Object.entries(record).sort((left, right) => {
    if (right[1] !== left[1]) {
      return right[1] - left[1];
    }

    return left[0].localeCompare(right[0]);
  });
}

export function createRecordById<T extends { id: string }>(items: T[]) {
  return items.reduce<Record<string, T>>((record, item) => {
    record[item.id] = item;
    return record;
  }, {});
}

export function createPackNumberByContentIdMap() {
  const packNumberByContentId: Record<string, number> = {};

  contentPacks.forEach((pack) => {
    [
      ...pack.grammarLessonIds,
      ...pack.vocabIds,
      ...pack.exampleIds,
      ...pack.listeningItemIds,
      ...pack.missionIds,
    ].forEach((contentId) => {
      packNumberByContentId[contentId] = pack.packNumber;
    });
  });

  return packNumberByContentId;
}

export function getContentQaSnapshot() {
  const content = getStarterContent();
  const packNumberByContentId = createPackNumberByContentIdMap();
  const missionTypeCounts = countBy(content.missions.map((mission) => mission.type));
  const readingMissions = content.missions.filter((mission) => mission.type === 'reading');
  const readingCheckCount = readingMissions.reduce(
    (total, mission) => total + (mission.readingChecks?.length ?? 0),
    0,
  );
  const readingExampleIds = Array.from(
    new Set(
      readingMissions.flatMap((mission) =>
        mission.readingChecks?.map((check) => check.exampleId) ?? [],
      ),
    ),
  );
  const readingExampleIdSet = new Set(readingExampleIds);
  const packSummaries = contentPacks.map((pack) => {
    const reusedExampleIds = pack.exampleIds.filter((exampleId) => readingExampleIdSet.has(exampleId));

    return {
      ...pack,
      linkedGrammarLessonCount: pack.grammarLessonIds.length,
      linkedVocabCount: pack.vocabIds.length,
      linkedExampleCount: pack.exampleIds.length,
      linkedListeningCount: pack.listeningItemIds.length,
      linkedMissionCount: pack.missionIds.length,
      readingReuseCount: reusedExampleIds.length,
      readingReuseRatio: pack.exampleIds.length
        ? reusedExampleIds.length / pack.exampleIds.length
        : 0,
      unreusedExampleIds: pack.exampleIds.filter((exampleId) => !readingExampleIdSet.has(exampleId)),
    };
  });

  return {
    content,
    contentPacks,
    packNumberByContentId,
    missionTypeCounts,
    readingMissions,
    readingCheckCount,
    readingExampleIds,
    readingExampleIdSet,
    packSummaries,
    introducedGrammarTagCounts: countBy(contentPacks.flatMap((pack) => pack.introducedGrammarTags)),
    reinforcedGrammarTagCounts: countBy(contentPacks.flatMap((pack) => pack.reinforcedGrammarTags)),
    scenarioTagCounts: countBy(contentPacks.flatMap((pack) => pack.scenarioTags)),
    vocabPartOfSpeechCounts: countBy(content.vocabItems.map((item) => item.partOfSpeech)),
    audioStatus: getListeningAudioStatus(),
  };
}
