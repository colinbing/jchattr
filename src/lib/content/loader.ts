import { starterContentModules } from '../../content';
import { contentCollectionSchema } from './schemas';
import type {
  ContentCollection,
  GrammarLesson,
  ListeningItem,
  Mission,
  StarterContent,
  VocabItem,
  ExampleSentence,
} from './types';

function createRecordById<T extends { id: string }>(items: T[]): Record<string, T> {
  return items.reduce<Record<string, T>>((record, item) => {
    if (record[item.id]) {
      throw new Error(`Duplicate content id detected: ${item.id}`);
    }

    record[item.id] = item;
    return record;
  }, {});
}

function assertIdsExist(
  sourceLabel: string,
  targetLabel: string,
  ids: string[],
  record: Record<string, unknown>,
) {
  ids.forEach((id) => {
    if (!record[id]) {
      throw new Error(`${sourceLabel} references missing ${targetLabel} "${id}".`);
    }
  });
}

function validateRelations(content: ContentCollection) {
  const exampleRecord = createRecordById(content.exampleSentences);
  const grammarRecord = createRecordById(content.grammarLessons);
  const vocabRecord = createRecordById(content.vocabItems);
  const listeningRecord = createRecordById(content.listeningItems);
  const missionRecord = createRecordById(content.missions);

  content.grammarLessons.forEach((lesson) => {
    assertIdsExist(`Grammar lesson ${lesson.id}`, 'example', lesson.exampleIds, exampleRecord);
  });

  content.vocabItems.forEach((item) => {
    assertIdsExist(`Vocab item ${item.id}`, 'example', item.exampleIds, exampleRecord);
  });

  content.missions.forEach((mission) => {
    if (mission.contentRefs.grammarLessonIds) {
      assertIdsExist(
        `Mission ${mission.id}`,
        'grammar lesson',
        mission.contentRefs.grammarLessonIds,
        grammarRecord,
      );
    }

    if (mission.contentRefs.vocabIds) {
      assertIdsExist(`Mission ${mission.id}`, 'vocab item', mission.contentRefs.vocabIds, vocabRecord);
    }

    if (mission.contentRefs.exampleIds) {
      assertIdsExist(
        `Mission ${mission.id}`,
        'example sentence',
        mission.contentRefs.exampleIds,
        exampleRecord,
      );
    }

    if (mission.readingChecks) {
      assertIdsExist(
        `Mission ${mission.id}`,
        'example sentence',
        mission.readingChecks.map((check) => check.exampleId),
        exampleRecord,
      );
    }

    if (mission.contentRefs.listeningItemIds) {
      assertIdsExist(
        `Mission ${mission.id}`,
        'listening item',
        mission.contentRefs.listeningItemIds,
        listeningRecord,
      );
    }

    if (mission.unlockRules?.requiredMissionIds) {
      assertIdsExist(
        `Mission ${mission.id}`,
        'mission',
        mission.unlockRules.requiredMissionIds,
        missionRecord,
      );
    }
  });
}

function createStarterContent(content: ContentCollection): StarterContent {
  const byId = {
    grammarLessons: createRecordById<GrammarLesson>(content.grammarLessons),
    vocabItems: createRecordById<VocabItem>(content.vocabItems),
    exampleSentences: createRecordById<ExampleSentence>(content.exampleSentences),
    listeningItems: createRecordById<ListeningItem>(content.listeningItems),
    missions: createRecordById<Mission>(content.missions),
  };

  return {
    ...content,
    byId,
    summary: {
      missionCount: content.missions.length,
      totalMissionMinutes: content.missions.reduce(
        (total, mission) => total + mission.estimatedMinutes,
        0,
      ),
      grammarLessonCount: content.grammarLessons.length,
      vocabCount: content.vocabItems.length,
      exampleCount: content.exampleSentences.length,
      listeningCount: content.listeningItems.length,
    },
  };
}

function loadStarterContent(): StarterContent {
  const parsedContent = contentCollectionSchema.parse(starterContentModules);

  validateRelations(parsedContent);

  return createStarterContent(parsedContent);
}

export const starterContent = loadStarterContent();

export function getStarterContent() {
  return starterContent;
}
