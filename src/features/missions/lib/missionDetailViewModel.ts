import type {
  ExampleSentence,
  GrammarLesson,
  ListeningItem,
  Mission,
  OutputTask,
  ReadingCheck,
  StarterContent,
  VocabItem,
} from '../../../lib/content/types';

export type MissionDetailFallbackReason =
  | 'missing-route-id'
  | 'missing-mission'
  | 'missing-grammar-lesson'
  | 'missing-listening-items'
  | 'missing-output-tasks'
  | 'missing-reading-checks'
  | 'unsupported-mission-type';

export type MissionDetailFallbackViewModel = {
  kind: 'fallback';
  reason: MissionDetailFallbackReason;
  title: string;
  description: string;
};

export type GrammarMissionDetailViewModel = {
  kind: 'grammar';
  mission: Mission;
  shellDescription: string;
  statusLabel: 'Grammar';
  lesson: GrammarLesson;
  examples: ExampleSentence[];
};

export type ListeningMissionDetailViewModel = {
  kind: 'listening';
  mission: Mission;
  shellDescription: string;
  statusLabel: 'Listening';
  listeningItems: ListeningItem[];
  relatedLessons: GrammarLesson[];
  relatedExamples: ExampleSentence[];
  choicePool: ListeningItem[];
};

export type OutputMissionDetailViewModel = {
  kind: 'output';
  mission: Mission;
  shellDescription: string;
  statusLabel: 'Output';
  tasks: OutputTask[];
  relatedLessons: GrammarLesson[];
  relatedExamples: ExampleSentence[];
  relatedVocab: VocabItem[];
};

export type ReadingMissionDetailViewModel = {
  kind: 'reading';
  mission: Mission;
  shellDescription: string;
  statusLabel: 'Reading';
  checks: ReadingCheck[];
  examplesById: Record<string, ExampleSentence>;
  vocabItems: VocabItem[];
};

export type PlayableMissionDetailViewModel =
  | GrammarMissionDetailViewModel
  | ListeningMissionDetailViewModel
  | OutputMissionDetailViewModel
  | ReadingMissionDetailViewModel;

export type MissionDetailViewModel =
  | MissionDetailFallbackViewModel
  | PlayableMissionDetailViewModel;

export function resolveMissionDetailViewModel(
  missionId: string | undefined,
  starterContent: StarterContent,
): MissionDetailViewModel {
  if (!missionId) {
    return {
      kind: 'fallback',
      reason: 'missing-route-id',
      title: 'Mission unavailable',
      description: 'This route needs a mission id before it can load starter content.',
    };
  }

  const mission = starterContent.byId.missions[missionId];

  if (!mission) {
    return {
      kind: 'fallback',
      reason: 'missing-mission',
      title: 'Mission not found',
      description: 'The requested mission id does not exist in starter content.',
    };
  }

  switch (mission.type) {
    case 'grammar':
      return resolveGrammarMission(mission, starterContent);
    case 'listening':
      return resolveListeningMission(mission, starterContent);
    case 'output':
      return resolveOutputMission(mission, starterContent);
    case 'reading':
      return resolveReadingMission(mission, starterContent);
    default:
      return {
        kind: 'fallback',
        reason: 'unsupported-mission-type',
        title: 'Mission type not supported yet',
        description: 'This route currently supports grammar, listening, output, and reading starter missions.',
      };
  }
}

function resolveGrammarMission(
  mission: Mission,
  starterContent: StarterContent,
): MissionDetailViewModel {
  const lessonId = mission.contentRefs.grammarLessonIds?.[0];
  const lesson = lessonId ? starterContent.byId.grammarLessons[lessonId] : undefined;

  if (!lesson) {
    return {
      kind: 'fallback',
      reason: 'missing-grammar-lesson',
      title: 'Lesson link missing',
      description: 'This grammar mission does not have a valid linked grammar lesson yet.',
    };
  }

  return {
    kind: 'grammar',
    mission,
    shellDescription: 'Focus on one grammar pass without the full mobile nav in the way.',
    statusLabel: 'Grammar',
    lesson,
    examples: resolveExamples(
      starterContent.byId.exampleSentences,
      lesson.exampleIds,
      mission.contentRefs.exampleIds,
    ),
  };
}

function resolveListeningMission(
  mission: Mission,
  starterContent: StarterContent,
): MissionDetailViewModel {
  const listeningItems = resolveListeningItems(
    starterContent.byId.listeningItems,
    mission.contentRefs.listeningItemIds,
  );

  if (listeningItems.length === 0) {
    return {
      kind: 'fallback',
      reason: 'missing-listening-items',
      title: 'Listening content missing',
      description: 'This listening mission does not have starter listening items linked yet.',
    };
  }

  return {
    kind: 'listening',
    mission,
    shellDescription: 'Stay with one listening line at a time and keep the space for the task.',
    statusLabel: 'Listening',
    listeningItems,
    relatedLessons: resolveGrammarLessons(
      starterContent.byId.grammarLessons,
      mission.contentRefs.grammarLessonIds,
    ),
    relatedExamples: resolveExamples(
      starterContent.byId.exampleSentences,
      [],
      mission.contentRefs.exampleIds,
    ),
    choicePool: starterContent.listeningItems,
  };
}

function resolveOutputMission(
  mission: Mission,
  starterContent: StarterContent,
): MissionDetailViewModel {
  const outputTasks = resolveOutputTasks(mission.outputTasks);

  if (outputTasks.length === 0) {
    return {
      kind: 'fallback',
      reason: 'missing-output-tasks',
      title: 'Output content missing',
      description: 'This output mission does not have starter prompts and accepted answers linked yet.',
    };
  }

  return {
    kind: 'output',
    mission,
    shellDescription: 'Keep the mission route focused on the current prompt and answer.',
    statusLabel: 'Output',
    tasks: outputTasks,
    relatedLessons: resolveGrammarLessons(
      starterContent.byId.grammarLessons,
      mission.contentRefs.grammarLessonIds,
    ),
    relatedExamples: resolveExamples(
      starterContent.byId.exampleSentences,
      [],
      mission.contentRefs.exampleIds,
    ),
    relatedVocab: resolveVocabItems(
      starterContent.byId.vocabItems,
      mission.contentRefs.vocabIds,
    ),
  };
}

function resolveReadingMission(
  mission: Mission,
  starterContent: StarterContent,
): MissionDetailViewModel {
  const readingChecks = resolveReadingChecks(mission.readingChecks);
  const examplesById = readingChecks.reduce<Record<string, ExampleSentence>>((record, check) => {
    const example = starterContent.byId.exampleSentences[check.exampleId];

    if (example) {
      record[check.exampleId] = example;
    }

    return record;
  }, {});

  if (readingChecks.length === 0 || Object.keys(examplesById).length === 0) {
    return {
      kind: 'fallback',
      reason: 'missing-reading-checks',
      title: 'Reading content missing',
      description: 'This reading mission does not have starter reading checks linked yet.',
    };
  }

  return {
    kind: 'reading',
    mission,
    shellDescription: 'Read first, answer, then reveal support without extra chrome.',
    statusLabel: 'Reading',
    checks: readingChecks,
    examplesById,
    vocabItems: starterContent.vocabItems,
  };
}

function resolveExamples(
  exampleRecord: Record<string, ExampleSentence>,
  primaryIds: string[],
  secondaryIds?: string[],
) {
  return Array.from(new Set([...primaryIds, ...(secondaryIds ?? [])]))
    .map((exampleId) => exampleRecord[exampleId])
    .filter((example): example is ExampleSentence => Boolean(example));
}

function resolveGrammarLessons(
  lessonRecord: Record<string, GrammarLesson>,
  lessonIds?: string[],
) {
  return (lessonIds ?? [])
    .map((lessonId) => lessonRecord[lessonId])
    .filter((lesson): lesson is GrammarLesson => Boolean(lesson));
}

function resolveListeningItems(
  listeningRecord: Record<string, ListeningItem>,
  listeningItemIds?: string[],
) {
  return (listeningItemIds ?? [])
    .map((itemId) => listeningRecord[itemId])
    .filter((item): item is ListeningItem => Boolean(item));
}

function resolveVocabItems(
  vocabRecord: Record<string, VocabItem>,
  vocabIds?: string[],
) {
  return (vocabIds ?? [])
    .map((vocabId) => vocabRecord[vocabId])
    .filter((item): item is VocabItem => Boolean(item));
}

function resolveOutputTasks(outputTasks?: OutputTask[]) {
  return (outputTasks ?? []).filter((task): task is OutputTask => Boolean(task));
}

function resolveReadingChecks(readingChecks?: ReadingCheck[]) {
  return (readingChecks ?? []).filter((check): check is ReadingCheck => Boolean(check));
}
