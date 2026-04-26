import { starterContentModules } from '../../content';
import { contentCollectionSchema } from './schemas';
import type {
  ContentCollection,
  CapstoneCheck,
  CapstoneLine,
  CapstoneStory,
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
  const capstoneLineRecord = createRecordById(content.capstoneLines);
  const capstoneCheckRecord = createRecordById(content.capstoneChecks);
  const capstoneStoryRecord = createRecordById(content.capstoneStories);

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

    if (mission.scenario) {
      assertIdsExist(
        `Mission ${mission.id} scenario`,
        'grammar lesson',
        mission.scenario.grammarLessonIds,
        grammarRecord,
      );
      assertIdsExist(
        `Mission ${mission.id} scenario`,
        'vocab item',
        mission.scenario.vocabIds,
        vocabRecord,
      );
      assertIdsExist(
        `Mission ${mission.id} scenario`,
        'example sentence',
        mission.scenario.exampleIds,
        exampleRecord,
      );

      const outputTaskRecord = createRecordById(mission.outputTasks ?? []);

      mission.scenario.steps.forEach((step) => {
        assertIdsExist(
          `Mission ${mission.id} scenario step ${step.id}`,
          'output task',
          [step.id],
          outputTaskRecord,
        );
        assertIdsExist(
          `Mission ${mission.id} scenario step ${step.id}`,
          'support example',
          step.supportExampleIds,
          exampleRecord,
        );

        if (step.weakPointItemId) {
          assertIdsExist(
            `Mission ${mission.id} scenario step ${step.id}`,
            'output task',
            [step.weakPointItemId],
            outputTaskRecord,
          );
        }
      });
    }
  });

  content.capstoneLines.forEach((line) => {
    assertIdsExist(
      `Capstone line ${line.id}`,
      'source example',
      line.sourceExampleIds,
      exampleRecord,
    );

    if (line.sourceLineIds) {
      assertIdsExist(
        `Capstone line ${line.id}`,
        'source capstone line',
        line.sourceLineIds,
        capstoneLineRecord,
      );

      if (line.sourceLineIds.includes(line.id)) {
        throw new Error(`Capstone line ${line.id} cannot reference itself as a source line.`);
      }
    }
  });

  content.capstoneChecks.forEach((check) => {
    assertIdsExist(
      `Capstone check ${check.id}`,
      'capstone line',
      [check.lineId],
      capstoneLineRecord,
    );
  });

  content.capstoneStories.forEach((story) => {
    if (story.baseStoryId) {
      assertIdsExist(
        `Capstone story ${story.id}`,
        'base capstone story',
        [story.baseStoryId],
        capstoneStoryRecord,
      );

      if (story.baseStoryId === story.id) {
        throw new Error(`Capstone story ${story.id} cannot use itself as a base story.`);
      }
    }

    if (story.unlockAfterStoryId) {
      assertIdsExist(
        `Capstone story ${story.id}`,
        'unlock capstone story',
        [story.unlockAfterStoryId],
        capstoneStoryRecord,
      );

      if (story.unlockAfterStoryId === story.id) {
        throw new Error(`Capstone story ${story.id} cannot unlock after itself.`);
      }
    }

    assertIdsExist(
      `Capstone story ${story.id}`,
      'capstone line',
      story.lineIds,
      capstoneLineRecord,
    );
    assertIdsExist(
      `Capstone story ${story.id}`,
      'capstone check',
      story.checkIds,
      capstoneCheckRecord,
    );

    story.checkIds.forEach((checkId) => {
      const check = capstoneCheckRecord[checkId];

      if (check && !story.lineIds.includes(check.lineId)) {
        throw new Error(
          `Capstone story ${story.id} references capstone check "${checkId}" for line "${check.lineId}" outside its lineIds.`,
        );
      }
    });
  });
}

function createStarterContent(content: ContentCollection): StarterContent {
  const byId = {
    grammarLessons: createRecordById<GrammarLesson>(content.grammarLessons),
    vocabItems: createRecordById<VocabItem>(content.vocabItems),
    exampleSentences: createRecordById<ExampleSentence>(content.exampleSentences),
    listeningItems: createRecordById<ListeningItem>(content.listeningItems),
    missions: createRecordById<Mission>(content.missions),
    capstoneLines: createRecordById<CapstoneLine>(content.capstoneLines),
    capstoneChecks: createRecordById<CapstoneCheck>(content.capstoneChecks),
    capstoneStories: createRecordById<CapstoneStory>(content.capstoneStories),
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
      capstoneStoryCount: content.capstoneStories.length,
      capstoneLineCount: content.capstoneLines.length,
      capstoneCheckCount: content.capstoneChecks.length,
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
