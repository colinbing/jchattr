import type {
  GrammarLesson,
  Mission,
  StarterContent,
  VocabItem,
} from '../content/types';
import {
  getMissionProgressEntry,
  type MissionProgressRecord,
} from './missionProgress';

export type SeenVocabSourceKind =
  | 'mission-vocab-ref'
  | 'mission-example-ref'
  | 'mission-grammar-example-ref'
  | 'mission-reading-check'
  | 'mission-scenario-vocab-ref'
  | 'mission-scenario-example-ref';

export interface SeenVocabSource {
  missionId: string;
  kind: SeenVocabSourceKind;
  sourceId: string;
}

export interface SeenVocabLookup {
  seenVocabIds: string[];
  seenVocabIdSet: ReadonlySet<string>;
  sourcesByVocabId: Record<string, SeenVocabSource[]>;
  hasSeenVocab: (vocabId: string) => boolean;
}

type ExampleSource = {
  exampleId: string;
  kind: SeenVocabSourceKind;
};

export function deriveSeenVocabIds(
  starterContent: StarterContent,
  missionProgress: MissionProgressRecord,
) {
  return deriveSeenVocabLookup(starterContent, missionProgress).seenVocabIds;
}

export function deriveSeenVocabLookup(
  starterContent: StarterContent,
  missionProgress: MissionProgressRecord,
): SeenVocabLookup {
  const vocabIdsByExampleId = createVocabIdsByExampleId(starterContent.vocabItems);
  const seenVocabIdSet = new Set<string>();
  const sourcesByVocabId: Record<string, SeenVocabSource[]> = {};

  starterContent.missions.forEach((mission) => {
    if (!getMissionProgressEntry(missionProgress, mission.id).isCompleted) {
      return;
    }

    collectDirectVocabSources(mission).forEach((source) => {
      addSeenVocabSource(seenVocabIdSet, sourcesByVocabId, source.sourceId, source);
    });

    collectExampleSources(mission, starterContent.byId.grammarLessons).forEach((source) => {
      const vocabIds = vocabIdsByExampleId.get(source.exampleId) ?? [];

      vocabIds.forEach((vocabId) => {
        addSeenVocabSource(seenVocabIdSet, sourcesByVocabId, vocabId, {
          missionId: mission.id,
          kind: source.kind,
          sourceId: source.exampleId,
        });
      });
    });
  });

  const seenVocabIds = starterContent.vocabItems
    .map((item) => item.id)
    .filter((vocabId) => seenVocabIdSet.has(vocabId));

  return {
    seenVocabIds,
    seenVocabIdSet,
    sourcesByVocabId,
    hasSeenVocab: (vocabId) => seenVocabIdSet.has(vocabId),
  };
}

export function hasSeenVocab(lookup: SeenVocabLookup, vocabId: string) {
  return lookup.hasSeenVocab(vocabId);
}

function collectDirectVocabSources(mission: Mission): SeenVocabSource[] {
  const sources: SeenVocabSource[] = (mission.contentRefs.vocabIds ?? []).map((vocabId) => ({
    missionId: mission.id,
    kind: 'mission-vocab-ref',
    sourceId: vocabId,
  }));

  mission.scenario?.vocabIds.forEach((vocabId) => {
    sources.push({
      missionId: mission.id,
      kind: 'mission-scenario-vocab-ref',
      sourceId: vocabId,
    });
  });

  return sources;
}

function collectExampleSources(
  mission: Mission,
  grammarLessonsById: Record<string, GrammarLesson>,
): ExampleSource[] {
  const sources: ExampleSource[] = [];

  mission.contentRefs.exampleIds?.forEach((exampleId) => {
    sources.push({ exampleId, kind: 'mission-example-ref' });
  });

  mission.contentRefs.grammarLessonIds?.forEach((lessonId) => {
    grammarLessonsById[lessonId]?.exampleIds.forEach((exampleId) => {
      sources.push({ exampleId, kind: 'mission-grammar-example-ref' });
    });
  });

  mission.readingChecks?.forEach((check) => {
    sources.push({ exampleId: check.exampleId, kind: 'mission-reading-check' });
  });

  mission.scenario?.exampleIds.forEach((exampleId) => {
    sources.push({ exampleId, kind: 'mission-scenario-example-ref' });
  });

  return sources;
}

function createVocabIdsByExampleId(vocabItems: VocabItem[]) {
  const vocabIdsByExampleId = new Map<string, string[]>();

  vocabItems.forEach((item) => {
    item.exampleIds.forEach((exampleId) => {
      const vocabIds = vocabIdsByExampleId.get(exampleId) ?? [];
      vocabIds.push(item.id);
      vocabIdsByExampleId.set(exampleId, vocabIds);
    });
  });

  return vocabIdsByExampleId;
}

function addSeenVocabSource(
  seenVocabIdSet: Set<string>,
  sourcesByVocabId: Record<string, SeenVocabSource[]>,
  vocabId: string,
  source: SeenVocabSource,
) {
  seenVocabIdSet.add(vocabId);

  const existingSources = sourcesByVocabId[vocabId] ?? [];
  const alreadyTracked = existingSources.some((existingSource) => {
    return (
      existingSource.missionId === source.missionId &&
      existingSource.kind === source.kind &&
      existingSource.sourceId === source.sourceId
    );
  });

  if (!alreadyTracked) {
    sourcesByVocabId[vocabId] = [...existingSources, source];
  }
}
