import { z } from 'zod';

const grammarDrillTypeSchema = z.enum(['multiple-choice', 'reorder', 'fill-in']);
const missionTypeSchema = z.enum(['grammar', 'listening', 'output', 'reading']);
const targetSkillSchema = z.enum([
  'particles',
  'verb-forms',
  'sentence-structure',
  'listening-comprehension',
  'reading-recognition',
  'output-confidence',
]);
const listeningDifficultySchema = z.enum(['easy', 'medium']);
const vocabPartOfSpeechSchema = z.enum([
  'pronoun',
  'noun',
  'question',
  'particle',
  'verb',
  'expression',
]);

const nonEmptyStringSchema = z.string().trim().min(1);
const idSchema = z.string().trim().min(1);

export const grammarDrillSchema = z.object({
  id: idSchema,
  type: grammarDrillTypeSchema,
  prompt: nonEmptyStringSchema,
  answer: nonEmptyStringSchema,
  choices: z.array(nonEmptyStringSchema).optional(),
  support: nonEmptyStringSchema.optional(),
});

export const grammarLessonSchema = z.object({
  id: idSchema,
  title: nonEmptyStringSchema,
  objective: nonEmptyStringSchema,
  explanation: nonEmptyStringSchema,
  prerequisites: z.array(nonEmptyStringSchema),
  tags: z.array(nonEmptyStringSchema),
  exampleIds: z.array(idSchema).min(1),
  commonMistakes: z.array(nonEmptyStringSchema).min(1),
  drills: z.array(grammarDrillSchema).min(1),
});

export const vocabItemSchema = z.object({
  id: idSchema,
  kana: nonEmptyStringSchema,
  kanji: z.string().trim().min(1).nullable(),
  meaning: nonEmptyStringSchema,
  partOfSpeech: vocabPartOfSpeechSchema,
  tags: z.array(nonEmptyStringSchema),
  exampleIds: z.array(idSchema).min(1),
});

export const exampleSentenceSchema = z.object({
  id: idSchema,
  japanese: nonEmptyStringSchema,
  reading: nonEmptyStringSchema,
  english: nonEmptyStringSchema,
  grammarTags: z.array(nonEmptyStringSchema),
  vocabTags: z.array(nonEmptyStringSchema),
});

export const listeningItemSchema = z.object({
  id: idSchema,
  audioRef: nonEmptyStringSchema.optional(),
  transcript: nonEmptyStringSchema,
  reading: nonEmptyStringSchema,
  translation: nonEmptyStringSchema,
  focusPoint: nonEmptyStringSchema,
  difficulty: listeningDifficultySchema,
});

export const missionUnlockRulesSchema = z.object({
  requiredMissionIds: z.array(idSchema).min(1).optional(),
});

export const outputTaskSchema = z.object({
  id: idSchema,
  prompt: nonEmptyStringSchema,
  acceptableAnswers: z.array(nonEmptyStringSchema).min(1),
  hint: nonEmptyStringSchema.optional(),
  evaluation: z
    .object({
      tokenPatterns: z.array(z.array(nonEmptyStringSchema).min(1)).min(1).optional(),
    })
    .optional(),
});

export const readingCheckSchema = z
  .object({
    id: idSchema,
    exampleId: idSchema,
    prompt: nonEmptyStringSchema,
    choices: z.array(nonEmptyStringSchema).min(2),
    answer: nonEmptyStringSchema,
    support: nonEmptyStringSchema.optional(),
  })
  .refine(
    (value) => value.choices.includes(value.answer),
    'Reading check answer must match one of the provided choices.',
  );

export const missionContentRefsSchema = z
  .object({
    grammarLessonIds: z.array(idSchema).min(1).optional(),
    vocabIds: z.array(idSchema).min(1).optional(),
    exampleIds: z.array(idSchema).min(1).optional(),
    listeningItemIds: z.array(idSchema).min(1).optional(),
  })
  .refine(
    (value) =>
      Boolean(
        value.grammarLessonIds ||
          value.vocabIds ||
          value.exampleIds ||
          value.listeningItemIds,
      ),
    'Mission contentRefs must include at least one referenced content group.',
  );

export const missionSchema = z.object({
  id: idSchema,
  type: missionTypeSchema,
  title: nonEmptyStringSchema,
  targetSkill: targetSkillSchema,
  contentRefs: missionContentRefsSchema,
  estimatedMinutes: z.number().int().positive(),
  unlockRules: missionUnlockRulesSchema.optional(),
  outputTasks: z.array(outputTaskSchema).min(1).optional(),
  readingChecks: z.array(readingCheckSchema).min(1).optional(),
}).superRefine((mission, context) => {
  if (mission.type === 'output' && !mission.outputTasks?.length) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['outputTasks'],
      message: 'Output missions must include at least one output task.',
    });
  }

  if (mission.type === 'reading' && !mission.readingChecks?.length) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['readingChecks'],
      message: 'Reading missions must include at least one reading check.',
    });
  }
});

export const contentCollectionSchema = z.object({
  grammarLessons: z.array(grammarLessonSchema).min(1),
  vocabItems: z.array(vocabItemSchema).min(1),
  exampleSentences: z.array(exampleSentenceSchema).min(1),
  listeningItems: z.array(listeningItemSchema).min(1),
  missions: z.array(missionSchema).min(1),
});
