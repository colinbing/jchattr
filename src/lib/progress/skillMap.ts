import type { StarterContent, TargetSkill } from '../content/types';
import type { MissionProgressRecord } from './missionProgress';
import { getMissionProgressEntry } from './missionProgress';
import type { WeakPoint, WeakPointStore } from './weakPoints';
import { getWeakPointList } from './weakPoints';

export type SkillTier = 'not-enough-data' | 'shaky' | 'okay' | 'solid';

export type SkillAreaId =
  | 'particles'
  | 'verb-forms'
  | 'sentence-structure'
  | 'listening-comprehension'
  | 'reading-recognition'
  | 'output-confidence';

export interface SkillAreaProgress {
  id: SkillAreaId;
  label: string;
  tier: SkillTier;
  completionCount: number;
  weakPointCount: number;
  totalMisses: number;
  relatedMissionCount: number;
  note: string;
}

export interface ProgressOverview {
  completedMissionCount: number;
  totalCompletionCount: number;
  lastCompletedAt: string | null;
  trackedWeakPointCount: number;
  totalMissCount: number;
  lastMissedAt: string | null;
  skillAreas: SkillAreaProgress[];
}

type SkillSignalDefinition = {
  id: SkillAreaId;
  label: string;
  noteIfUnavailable?: string;
  missionTargetSkills?: TargetSkill[];
  grammarLessonIds?: string[];
  missionIds?: string[];
  itemTypes?: WeakPoint['itemType'][];
  available: boolean;
};

const SKILL_SIGNAL_DEFINITIONS: SkillSignalDefinition[] = [
  {
    id: 'particles',
    label: 'Particles',
    grammarLessonIds: [
      'grammar-topic-desu',
      'grammar-place-de',
      'grammar-destination-ni',
      'grammar-existence-arimasu-imasu',
      'grammar-position-no',
      'grammar-preference-suki-kirai',
      'grammar-preference-questions',
    ],
    itemTypes: ['grammar-drill', 'listening-check', 'output-task'],
    available: true,
  },
  {
    id: 'verb-forms',
    label: 'Verb forms',
    available: false,
    noteIfUnavailable: 'Not enough data yet. Current starter content does not isolate verb-form practice.',
  },
  {
    id: 'sentence-structure',
    label: 'Sentence structure',
    missionTargetSkills: ['sentence-structure'],
    missionIds: ['mission-output-daily-lines'],
    itemTypes: ['grammar-drill', 'output-task'],
    available: true,
  },
  {
    id: 'listening-comprehension',
    label: 'Listening comprehension',
    missionTargetSkills: ['listening-comprehension'],
    itemTypes: ['listening-check'],
    available: true,
  },
  {
    id: 'reading-recognition',
    label: 'Reading recognition',
    missionTargetSkills: ['reading-recognition'],
    itemTypes: ['reading-check'],
    available: true,
  },
  {
    id: 'output-confidence',
    label: 'Output confidence',
    missionTargetSkills: ['output-confidence'],
    itemTypes: ['output-task'],
    available: true,
  },
];

// Heuristics stay intentionally small:
// - not-enough-data: no related completions and no related misses, or the area is not instrumented yet
// - shaky: misses outweigh completions, or there are at least 2 recorded misses
// - solid: at least 3 related completions and no more than 1 total miss
// - okay: everything in between
export function deriveProgressOverview(
  starterContent: StarterContent,
  missionProgress: MissionProgressRecord,
  weakPoints: WeakPointStore,
): ProgressOverview {
  const weakPointList = getWeakPointList(weakPoints);
  const completionEntries = starterContent.missions.map((mission) =>
    getMissionProgressEntry(missionProgress, mission.id),
  );

  return {
    completedMissionCount: missionProgress.completedMissionIds.length,
    totalCompletionCount: completionEntries.reduce(
      (sum, entry) => sum + entry.completionCount,
      0,
    ),
    lastCompletedAt: getLatestTimestamp(
      Object.values(missionProgress.lastCompletedAtByMissionId),
    ),
    trackedWeakPointCount: weakPointList.length,
    totalMissCount: weakPointList.reduce((sum, weakPoint) => sum + weakPoint.missCount, 0),
    lastMissedAt: getLatestTimestamp(weakPointList.map((weakPoint) => weakPoint.lastMissedAt)),
    skillAreas: SKILL_SIGNAL_DEFINITIONS.map((definition) =>
      deriveSkillAreaProgress(definition, starterContent, missionProgress, weakPointList),
    ),
  };
}

function deriveSkillAreaProgress(
  definition: SkillSignalDefinition,
  starterContent: StarterContent,
  missionProgress: MissionProgressRecord,
  weakPoints: WeakPoint[],
): SkillAreaProgress {
  if (!definition.available) {
    return {
      id: definition.id,
      label: definition.label,
      tier: 'not-enough-data',
      completionCount: 0,
      weakPointCount: 0,
      totalMisses: 0,
      relatedMissionCount: 0,
      note: definition.noteIfUnavailable ?? 'Not enough data yet.',
    };
  }

  const relatedMissions = starterContent.missions.filter((mission) =>
    missionMatchesSkill(definition, mission),
  );
  const relatedMissionIds = relatedMissions.map((mission) => mission.id);
  const completionCount = relatedMissions.reduce((sum, mission) => {
    return sum + (missionProgress.completionCountsByMissionId[mission.id] ?? 0);
  }, 0);
  const relatedWeakPoints = weakPoints.filter((weakPoint) =>
    weakPointMatchesSkill(definition, weakPoint, relatedMissionIds),
  );
  const weakPointCount = relatedWeakPoints.length;
  const totalMisses = relatedWeakPoints.reduce(
    (sum, weakPoint) => sum + weakPoint.missCount,
    0,
  );
  const tier = deriveSkillTier({
    available: definition.available,
    completionCount,
    totalMisses,
    weakPointCount,
  });

  return {
    id: definition.id,
    label: definition.label,
    tier,
    completionCount,
    weakPointCount,
    totalMisses,
    relatedMissionCount: relatedMissions.length,
    note: buildSkillNote(tier, completionCount, totalMisses, relatedMissions.length),
  };
}

function missionMatchesSkill(
  definition: SkillSignalDefinition,
  mission: StarterContent['missions'][number],
) {
  if (definition.missionIds?.includes(mission.id)) {
    return true;
  }

  if (definition.missionTargetSkills?.includes(mission.targetSkill)) {
    return true;
  }

  if (definition.grammarLessonIds?.length) {
    return (mission.contentRefs.grammarLessonIds ?? []).some((lessonId) =>
      definition.grammarLessonIds?.includes(lessonId),
    );
  }

  return false;
}

function weakPointMatchesSkill(
  definition: SkillSignalDefinition,
  weakPoint: WeakPoint,
  relatedMissionIds: string[],
) {
  if (definition.itemTypes && !definition.itemTypes.includes(weakPoint.itemType)) {
    return false;
  }

  if (relatedMissionIds.includes(weakPoint.missionId)) {
    return true;
  }

  if (definition.grammarLessonIds?.length && weakPoint.contentId) {
    return definition.grammarLessonIds.includes(weakPoint.contentId);
  }

  return false;
}

function deriveSkillTier({
  available,
  completionCount,
  totalMisses,
  weakPointCount,
}: {
  available: boolean;
  completionCount: number;
  totalMisses: number;
  weakPointCount: number;
}) {
  if (!available || (completionCount === 0 && totalMisses === 0)) {
    return 'not-enough-data';
  }

  if (totalMisses >= 2 || totalMisses > completionCount || weakPointCount >= 2) {
    return 'shaky';
  }

  if (completionCount >= 3 && totalMisses <= 1) {
    return 'solid';
  }

  return 'okay';
}

function buildSkillNote(
  tier: SkillTier,
  completionCount: number,
  totalMisses: number,
  relatedMissionCount: number,
) {
  if (tier === 'not-enough-data') {
    return 'Not enough local signal yet.';
  }

  if (tier === 'shaky') {
    return `${totalMisses} recorded miss${totalMisses === 1 ? '' : 'es'} across ${relatedMissionCount} related mission${relatedMissionCount === 1 ? '' : 's'}.`;
  }

  if (tier === 'solid') {
    return `${completionCount} related completions with only light recent friction.`;
  }

  return `${completionCount} related completion${completionCount === 1 ? '' : 's'} with manageable miss pressure.`;
}

function getLatestTimestamp(timestamps: string[]) {
  if (timestamps.length === 0) {
    return null;
  }

  return timestamps.reduce<string | null>((latest, timestamp) => {
    if (!latest) {
      return timestamp;
    }

    return Date.parse(timestamp) > Date.parse(latest) ? timestamp : latest;
  }, null);
}

export function formatSkillTierLabel(tier: SkillTier) {
  switch (tier) {
    case 'not-enough-data':
      return 'Not enough data';
    case 'shaky':
      return 'Shaky';
    case 'okay':
      return 'Okay';
    case 'solid':
      return 'Solid';
  }
}
