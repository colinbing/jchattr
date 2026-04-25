export type GrammarDrillType = 'multiple-choice' | 'reorder' | 'fill-in';

export type MissionType = 'grammar' | 'listening' | 'output' | 'reading';

export type TargetSkill =
  | 'particles'
  | 'verb-forms'
  | 'sentence-structure'
  | 'listening-comprehension'
  | 'reading-recognition'
  | 'output-confidence';

export type ListeningDifficulty = 'easy' | 'medium';

export type VocabPartOfSpeech =
  | 'pronoun'
  | 'noun'
  | 'question'
  | 'particle'
  | 'verb'
  | 'expression';

export interface GrammarDrill {
  id: string;
  type: GrammarDrillType;
  prompt: string;
  answer: string;
  choices?: string[];
  support?: string;
}

export interface GrammarLesson {
  id: string;
  title: string;
  objective: string;
  explanation: string;
  prerequisites: string[];
  tags: string[];
  exampleIds: string[];
  commonMistakes: string[];
  drills: GrammarDrill[];
}

export interface VocabItem {
  id: string;
  kana: string;
  kanji: string | null;
  meaning: string;
  partOfSpeech: VocabPartOfSpeech;
  tags: string[];
  exampleIds: string[];
}

export interface ExampleSentence {
  id: string;
  japanese: string;
  reading: string;
  english: string;
  grammarTags: string[];
  vocabTags: string[];
}

export interface ListeningItem {
  id: string;
  audioRef?: string;
  transcript: string;
  reading: string;
  translation: string;
  focusPoint: string;
  difficulty: ListeningDifficulty;
}

export interface MissionUnlockRules {
  requiredMissionIds?: string[];
}

export interface OutputTask {
  id: string;
  prompt: string;
  acceptableAnswers: string[];
  hint?: string;
  evaluation?: {
    tokenPatterns?: string[][];
  };
}

export interface ReadingCheck {
  id: string;
  exampleId: string;
  prompt: string;
  choices: string[];
  answer: string;
  support?: string;
}

export interface CapstoneLine {
  id: string;
  japanese: string;
  reading: string;
  english: string;
  grammarTags: string[];
  vocabTags: string[];
  sourceExampleIds: string[];
  audioRef?: string;
}

export interface CapstoneCheck {
  id: string;
  lineId: string;
  prompt: string;
  choices: string[];
  answer: string;
  support?: string;
}

export interface CapstoneStory {
  id: string;
  chapterId: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  sourcePackIds: number[];
  lineIds: string[];
  checkIds: string[];
}

export interface MissionContentRefs {
  grammarLessonIds?: string[];
  vocabIds?: string[];
  exampleIds?: string[];
  listeningItemIds?: string[];
}

export interface Mission {
  id: string;
  type: MissionType;
  title: string;
  targetSkill: TargetSkill;
  contentRefs: MissionContentRefs;
  estimatedMinutes: number;
  unlockRules?: MissionUnlockRules;
  outputTasks?: OutputTask[];
  readingChecks?: ReadingCheck[];
}

export interface ContentCollection {
  grammarLessons: GrammarLesson[];
  vocabItems: VocabItem[];
  exampleSentences: ExampleSentence[];
  listeningItems: ListeningItem[];
  missions: Mission[];
  capstoneLines: CapstoneLine[];
  capstoneChecks: CapstoneCheck[];
  capstoneStories: CapstoneStory[];
}

export interface StarterContent extends ContentCollection {
  byId: {
    grammarLessons: Record<string, GrammarLesson>;
    vocabItems: Record<string, VocabItem>;
    exampleSentences: Record<string, ExampleSentence>;
    listeningItems: Record<string, ListeningItem>;
    missions: Record<string, Mission>;
    capstoneLines: Record<string, CapstoneLine>;
    capstoneChecks: Record<string, CapstoneCheck>;
    capstoneStories: Record<string, CapstoneStory>;
  };
  summary: {
    missionCount: number;
    totalMissionMinutes: number;
    grammarLessonCount: number;
    vocabCount: number;
    exampleCount: number;
    listeningCount: number;
    capstoneStoryCount: number;
    capstoneLineCount: number;
    capstoneCheckCount: number;
  };
}
