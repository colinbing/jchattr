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
    outputTasks: [
      {
        id: 'output-self-intro',
        prompt: 'Type a polite self-introduction line: "I am Colin."',
        acceptableAnswers: ['わたしはコリンです。', 'わたしはコリンです'],
        hint: 'Use は after the topic and finish with です.',
      },
      {
        id: 'output-home-study',
        prompt: 'Type a line that says: "I study Japanese at home."',
        acceptableAnswers: [
          'うちでにほんごをべんきょうします。',
          'うちでにほんごをべんきょうします',
        ],
        hint: 'Put the place with で before the object and verb.',
      },
    ],
  },
  {
    id: 'mission-grammar-destination-ni',
    type: 'grammar',
    title: 'Say where someone goes with に',
    targetSkill: 'particles',
    contentRefs: {
      grammarLessonIds: ['grammar-destination-ni'],
      vocabIds: [
        'vocab-doko',
        'vocab-gakkou',
        'vocab-ikimasu',
        'vocab-mainichi',
        'vocab-kyou',
        'vocab-ima',
        'vocab-kyoushitsu',
        'vocab-toshokan',
      ],
      exampleIds: [
        'ex-doko-ikimasu',
        'ex-mainichi-gakkou',
        'ex-kyou-toshokan',
        'ex-ima-kyoushitsu',
      ],
    },
    estimatedMinutes: 7,
  },
  {
    id: 'mission-listening-question-nan',
    type: 'listening',
    title: 'Hear simple classroom questions',
    targetSkill: 'listening-comprehension',
    contentRefs: {
      grammarLessonIds: ['grammar-question-nan'],
      listeningItemIds: [
        'listening-kore-nan',
        'listening-kore-hon',
        'listening-sore-shukudai',
        'listening-kore-eigo-hon',
        'listening-sore-nan',
      ],
      exampleIds: [
        'ex-kore-hon',
        'ex-kore-nan',
        'ex-sore-shukudai',
        'ex-kore-eigo-hon',
      ],
    },
    estimatedMinutes: 7,
  },
  {
    id: 'mission-output-classroom-destination',
    type: 'output',
    title: 'Ask one question and write one destination line',
    targetSkill: 'output-confidence',
    contentRefs: {
      grammarLessonIds: ['grammar-question-nan', 'grammar-destination-ni'],
      vocabIds: [
        'vocab-kore',
        'vocab-nan',
        'vocab-gakkou',
        'vocab-ikimasu',
        'vocab-mainichi',
      ],
      exampleIds: [
        'ex-kore-nan',
        'ex-kore-hon',
        'ex-mainichi-gakkou',
        'ex-doko-ikimasu',
      ],
    },
    estimatedMinutes: 8,
    outputTasks: [
      {
        id: 'output-kore-nan',
        prompt: 'Type a polite classroom question: "What is this?"',
        acceptableAnswers: ['これはなんですか。', 'これはなんですか'],
        hint: 'Use これは first, then なんですか.',
      },
      {
        id: 'output-mainichi-gakkou',
        prompt: 'Type a line that says: "I go to school every day."',
        acceptableAnswers: [
          'まいにちがっこうにいきます。',
          'まいにちがっこうにいきます',
        ],
        hint: 'Put the destination with に before いきます.',
      },
    ],
  },
] satisfies Mission[];
