import { contentPacks } from '../../../content/contentPacks';
import { getStarterContent } from '../../../lib/content/loader';

type CoreChapterSeed = {
  id: string;
  label: string;
  title: string;
  description: string;
  packStart: number;
  packEnd: number;
};

export type MissionLibraryChapter = {
  id: string;
  label: string;
  title: string;
  description: string;
  missionIds: string[];
  packRangeLabel?: string;
  packTitles?: string[];
  kind: 'core' | 'reading';
};

const CORE_CHAPTER_SEEDS: CoreChapterSeed[] = [
  {
    id: 'chapter-core-01',
    label: 'Chapter 1',
    title: 'Introductions, questions, and place basics',
    description:
      'Build the sentence engine with identity, destinations, existence, preferences, and simple place answers.',
    packStart: 1,
    packEnd: 5,
  },
  {
    id: 'chapter-core-02',
    label: 'Chapter 2',
    title: 'Possession, routines, and requests',
    description:
      'Move into ownership, daily verbs, adjective basics, past actions, and practical permission language.',
    packStart: 6,
    packEnd: 10,
  },
  {
    id: 'chapter-core-03',
    label: 'Chapter 3',
    title: 'Shopping, time, and directions',
    description:
      'Cover requests, prices, schedules, transport, and simple navigation in a single daily-life lane.',
    packStart: 11,
    packEnd: 15,
  },
  {
    id: 'chapter-core-04',
    label: 'Chapter 4',
    title: 'Meetups, status, and suggestions',
    description:
      'Learn to invite, coordinate, wait, suggest, and shape plans without leaving beginner-safe Japanese.',
    packStart: 16,
    packEnd: 20,
  },
  {
    id: 'chapter-core-05',
    label: 'Chapter 5',
    title: 'Calendar, dates, and transactions',
    description:
      'Work through time ranges, calendar details, counters, prices, and practical store availability.',
    packStart: 21,
    packEnd: 25,
  },
  {
    id: 'chapter-core-06',
    label: 'Chapter 6',
    title: 'Store flow, te-form, and descriptions',
    description:
      'Deepen shopping language, start practical te-form use, and reinforce progressive and adjective negatives.',
    packStart: 26,
    packEnd: 30,
  },
  {
    id: 'chapter-core-07',
    label: 'Chapter 7',
    title: 'Comparisons, rankings, and reasons',
    description:
      'Expand description language with adjective past, comparison, superlatives, frequency, and short reasons.',
    packStart: 31,
    packEnd: 35,
  },
  {
    id: 'chapter-core-08',
    label: 'Chapter 8',
    title: 'Wants, ability, and experience',
    description:
      'Shift into desire, wanted objects, ability, past experience, and simple companion or method questions.',
    packStart: 36,
    packEnd: 40,
  },
  {
    id: 'chapter-core-09',
    label: 'Chapter 9',
    title: 'Choices, health, weather, and delays',
    description:
      'Handle practical friction with choices, health checks, weather responses, travel steps, and lateness language.',
    packStart: 41,
    packEnd: 45,
  },
  {
    id: 'chapter-core-10',
    label: 'Chapter 10',
    title: 'Plain recognition, flow, and flexible lists',
    description:
      'Finish the core path with plain-style recognition, sentence flow, contrast, and list-building language.',
    packStart: 46,
    packEnd: 50,
  },
];

function createCoreChapter(seed: CoreChapterSeed): MissionLibraryChapter {
  const packs = contentPacks.filter(
    (pack) => pack.packNumber >= seed.packStart && pack.packNumber <= seed.packEnd,
  );

  return {
    id: seed.id,
    label: seed.label,
    title: seed.title,
    description: seed.description,
    missionIds: packs.flatMap((pack) => pack.missionIds),
    packRangeLabel: `Packs ${seed.packStart}-${seed.packEnd}`,
    packTitles: packs.map((pack) => pack.title),
    kind: 'core',
  };
}

function createReadingChapter(): MissionLibraryChapter {
  const starterContent = getStarterContent();

  return {
    id: 'chapter-reading-path',
    label: 'Reading Path',
    title: 'Reading checkpoints and recombination',
    description:
      'Use the Japanese-first reading lane to recombine prior content and turn the pack path into mixed recognition practice.',
    missionIds: starterContent.missions
      .filter((mission) => mission.type === 'reading')
      .map((mission) => mission.id),
    kind: 'reading',
  };
}

export const missionLibraryChapters: MissionLibraryChapter[] = [
  ...CORE_CHAPTER_SEEDS.map(createCoreChapter),
  createReadingChapter(),
];
