import type { Mission, StarterContent } from '../../../lib/content/types';
import type { ContinueStateRecord } from '../../../lib/progress/continueState';

type FormatContinueDetailParams = {
  starterContent: StarterContent;
  mission: Mission;
  continueState: ContinueStateRecord;
};

export function formatContinueDetailFromPosition({
  starterContent,
  mission,
  continueState,
}: FormatContinueDetailParams) {
  const detailFromPosition = continueState.position
    ? formatPositionDetail(starterContent, mission, continueState.position)
    : null;

  if (detailFromPosition) {
    return detailFromPosition;
  }

  return formatLegacyStepDetail(starterContent, mission, continueState.stepIndex);
}

function formatPositionDetail(
  starterContent: StarterContent,
  mission: Mission,
  position: NonNullable<ContinueStateRecord['position']>,
) {
  const itemIndex = position.itemIndex ?? null;

  if (mission.type === 'grammar') {
    if (position.sectionId === 'intro') {
      return 'Resume lesson intro.';
    }

    if (position.sectionId === 'examples') {
      return `Resume example ${formatOneBasedIndex(itemIndex, getGrammarExampleCount(mission))}.`;
    }

    if (position.sectionId === 'drills') {
      return `Resume drill ${formatOneBasedIndex(
        itemIndex,
        getGrammarDrillCount(starterContent, mission),
      )}.`;
    }

    return null;
  }

  if (mission.type === 'listening') {
    if (position.sectionId === 'prep') {
      return 'Resume listening prep.';
    }

    if (position.sectionId === 'checks') {
      return `Resume listening check ${formatOneBasedIndex(
        itemIndex,
        mission.contentRefs.listeningItemIds?.length ?? 0,
      )}.`;
    }

    return null;
  }

  if (mission.type === 'reading') {
    if (position.sectionId === 'checks') {
      return `Resume reading check ${formatOneBasedIndex(
        itemIndex,
        mission.readingChecks?.length ?? 0,
      )}.`;
    }

    return null;
  }

  if (position.sectionId === 'tasks') {
    return `Resume output task ${formatOneBasedIndex(
      itemIndex,
      mission.outputTasks?.length ?? 0,
    )}.`;
  }

  return null;
}

function formatLegacyStepDetail(
  starterContent: StarterContent,
  mission: Mission,
  stepIndex: number | null,
) {
  if (mission.type === 'grammar') {
    if (stepIndex === 1) {
      return 'Resume example 1.';
    }

    if (stepIndex === 2 || stepIndex === 3) {
      return 'Resume drill 1.';
    }

    return 'Resume lesson intro.';
  }

  if (mission.type === 'listening') {
    return `Resume listening check ${formatOneBasedIndex(
      stepIndex,
      mission.contentRefs.listeningItemIds?.length ?? 0,
    )}.`;
  }

  if (mission.type === 'reading') {
    const readingMission = starterContent.byId.missions[mission.id] ?? mission;

    return `Resume reading check ${formatOneBasedIndex(
      stepIndex,
      readingMission.readingChecks?.length ?? 0,
    )}.`;
  }

  const outputMission = starterContent.byId.missions[mission.id] ?? mission;

  return `Resume output task ${formatOneBasedIndex(
    stepIndex,
    outputMission.outputTasks?.length ?? 0,
  )}.`;
}

function formatOneBasedIndex(index: number | null, itemCount: number) {
  if (typeof index !== 'number' || !Number.isInteger(index) || index < 0) {
    return 1;
  }

  if (itemCount <= 0) {
    return index + 1;
  }

  return Math.min(index, itemCount - 1) + 1;
}

function getGrammarExampleCount(mission: Mission) {
  return mission.contentRefs.exampleIds?.length ?? 0;
}

function getGrammarDrillCount(starterContent: StarterContent, mission: Mission) {
  return (mission.contentRefs.grammarLessonIds ?? []).reduce((total, lessonId) => {
    return total + (starterContent.byId.grammarLessons[lessonId]?.drills.length ?? 0);
  }, 0);
}
