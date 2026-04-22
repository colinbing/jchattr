import type { Mission } from '../lib/content/types';

export const missions = [
  {
    id: 'mission-grammar-topic-desu',
    type: 'grammar',
    title: 'Introduce yourself with は and です',
    targetSkill: 'sentence-structure',
    contentRefs: {
      grammarLessonIds: ['grammar-topic-desu'],
      vocabIds: ['vocab-watashi', 'vocab-gakusei', 'vocab-sensei'],
      exampleIds: ['ex-colin-desu', 'ex-student-desu', 'ex-teacher-question'],
    },
    estimatedMinutes: 7,
  },
  {
    id: 'mission-listening-place-de',
    type: 'listening',
    title: 'Hear where the action happens',
    targetSkill: 'listening-comprehension',
    contentRefs: {
      grammarLessonIds: ['grammar-place-de'],
      listeningItemIds: [
        'listening-home-study',
        'listening-cafe-coffee',
        'listening-teacher-question',
      ],
      exampleIds: ['ex-study-home', 'ex-coffee-cafe'],
    },
    estimatedMinutes: 6,
  },
  {
    id: 'mission-output-daily-lines',
    type: 'output',
    title: 'Write two short daily-life lines',
    targetSkill: 'output-confidence',
    contentRefs: {
      grammarLessonIds: ['grammar-topic-desu', 'grammar-place-de'],
      vocabIds: ['vocab-watashi', 'vocab-uchi', 'vocab-benkyoushimasu', 'vocab-kafe'],
      exampleIds: ['ex-colin-desu', 'ex-study-home', 'ex-coffee-cafe'],
    },
    estimatedMinutes: 8,
    unlockRules: {
      requiredMissionIds: ['mission-grammar-topic-desu'],
    },
  },
] satisfies Mission[];
