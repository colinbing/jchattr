import type {
  GrammarDrill,
  GrammarLesson,
  ListeningItem,
  Mission,
  OutputTask,
  ReadingCheck,
  ExampleSentence,
  StarterContent,
} from '../../../lib/content/types';
import type { WeakPoint, WeakPointStore } from '../../../lib/progress/weakPoints';
import { getWeakPointList } from '../../../lib/progress/weakPoints';

export const REVIEW_BATCH_SIZE = 3;

export type ReviewBatchItem =
  | {
      type: 'grammar-drill';
      weakPoint: WeakPoint;
      mission: Mission;
      lesson: GrammarLesson;
      drill: GrammarDrill;
    }
  | {
      type: 'listening-check';
      weakPoint: WeakPoint;
      mission: Mission;
      listeningItem: ListeningItem;
      choicePool: ListeningItem[];
    }
  | {
      type: 'output-task';
      weakPoint: WeakPoint;
      mission: Mission;
      task: OutputTask;
    }
  | {
      type: 'reading-check';
      weakPoint: WeakPoint;
      mission: Mission;
      check: ReadingCheck;
      example: ExampleSentence;
    };

export function selectReviewBatch(
  weakPoints: WeakPointStore,
  starterContent: StarterContent,
  batchSize = REVIEW_BATCH_SIZE,
) {
  return getWeakPointList(weakPoints)
    .sort((left, right) => {
      if (right.missCount !== left.missCount) {
        return right.missCount - left.missCount;
      }

      return Date.parse(right.lastMissedAt) - Date.parse(left.lastMissedAt);
    })
    .map((weakPoint) => resolveReviewBatchItem(weakPoint, starterContent))
    .filter((item): item is ReviewBatchItem => Boolean(item))
    .slice(0, batchSize);
}

export function resolveReviewBatchItem(
  weakPoint: WeakPoint,
  starterContent: StarterContent,
): ReviewBatchItem | null {
  return resolveBatchItem(weakPoint, starterContent);
}

export function getReviewBatchSummary(item: ReviewBatchItem) {
  switch (item.type) {
    case 'grammar-drill':
      return {
        eyebrow: item.lesson.title,
        title: item.drill.prompt,
        body: item.drill.support ?? 'Retry the grammar pattern and submit one answer.',
        missionTitle: item.mission.title,
      };
    case 'listening-check':
      return {
        eyebrow: 'Listening check',
        title: item.listeningItem.transcript,
        body: item.listeningItem.focusPoint,
        missionTitle: item.mission.title,
      };
    case 'output-task':
      return {
        eyebrow: 'Output task',
        title: item.task.prompt,
        body: item.task.hint ?? 'Retry the prompt with one short supported line.',
        missionTitle: item.mission.title,
      };
    case 'reading-check':
      return {
        eyebrow: 'Reading check',
        title: item.example.japanese,
        body: item.check.prompt,
        missionTitle: item.mission.title,
      };
  }
}

export function getListeningReviewChoices(item: ListeningItem, choicePool: ListeningItem[]) {
  const distractors = choicePool
    .filter((candidate) => candidate.id !== item.id && candidate.translation !== item.translation)
    .map((candidate) => candidate.translation)
    .filter((translation, index, array) => array.indexOf(translation) === index)
    .slice(0, 2);

  const options = [...distractors];
  const insertIndex = getChoiceInsertIndex(item.id, options.length + 1);
  options.splice(insertIndex, 0, item.translation);
  return options;
}

export function normalizeReviewAnswer(value: string) {
  return value.normalize('NFKC').replace(/\s+/g, '').replace(/[。.!?！？]/g, '');
}

function resolveBatchItem(
  weakPoint: WeakPoint,
  starterContent: StarterContent,
): ReviewBatchItem | null {
  const mission = starterContent.byId.missions[weakPoint.missionId];

  if (!mission) {
    return null;
  }

  if (weakPoint.itemType === 'grammar-drill') {
    const lesson =
      (weakPoint.contentId
        ? starterContent.byId.grammarLessons[weakPoint.contentId]
        : undefined) ??
      starterContent.grammarLessons.find((candidate) =>
        candidate.drills.some((drill) => drill.id === weakPoint.itemId),
      );
    const drill = lesson?.drills.find((candidate) => candidate.id === weakPoint.itemId);

    if (!lesson || !drill) {
      return null;
    }

    return {
      type: 'grammar-drill',
      weakPoint,
      mission,
      lesson,
      drill,
    };
  }

  if (weakPoint.itemType === 'listening-check') {
    const listeningItem = starterContent.byId.listeningItems[weakPoint.itemId];

    if (!listeningItem) {
      return null;
    }

    return {
      type: 'listening-check',
      weakPoint,
      mission,
      listeningItem,
      choicePool: starterContent.listeningItems,
    };
  }

  if (weakPoint.itemType === 'reading-check') {
    const check = mission.readingChecks?.find((candidate) => candidate.id === weakPoint.itemId);
    const example = check ? starterContent.byId.exampleSentences[check.exampleId] : null;

    if (!check || !example) {
      return null;
    }

    return {
      type: 'reading-check',
      weakPoint,
      mission,
      check,
      example,
    };
  }

  const task = mission.outputTasks?.find((candidate) => candidate.id === weakPoint.itemId);

  if (!task) {
    return null;
  }

  return {
    type: 'output-task',
    weakPoint,
    mission,
    task,
  };
}

function getChoiceInsertIndex(seed: string, optionCount: number) {
  const total = Array.from(seed).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return total % optionCount;
}
