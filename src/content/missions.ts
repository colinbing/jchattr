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
  {
    id: 'mission-grammar-existence-arimasu-imasu',
    type: 'grammar',
    title: 'Say where things and people are',
    targetSkill: 'particles',
    contentRefs: {
      grammarLessonIds: ['grammar-existence-arimasu-imasu'],
      vocabIds: [
        'vocab-heya',
        'vocab-neko',
        'vocab-inu',
        'vocab-arimasu',
        'vocab-imasu',
        'vocab-hon',
        'vocab-sensei',
        'vocab-toshokan',
        'vocab-kyoushitsu',
      ],
      exampleIds: [
        'ex-neko-heya-imasu',
        'ex-sensei-kyoushitsu-imasu',
        'ex-inu-uchi-imasu',
        'ex-hon-toshokan-arimasu',
      ],
    },
    estimatedMinutes: 7,
    unlockRules: {
      requiredMissionIds: ['mission-grammar-destination-ni'],
    },
  },
  {
    id: 'mission-listening-existence-position',
    type: 'listening',
    title: 'Hear where things are in a room',
    targetSkill: 'listening-comprehension',
    contentRefs: {
      grammarLessonIds: ['grammar-existence-arimasu-imasu', 'grammar-position-no'],
      listeningItemIds: [
        'listening-neko-heya',
        'listening-sensei-kyoushitsu',
        'listening-hon-tsukue-ue',
        'listening-kaban-isu-shita',
        'listening-hon-kaban-naka',
      ],
      exampleIds: [
        'ex-neko-heya-imasu',
        'ex-sensei-kyoushitsu-imasu',
        'ex-hon-tsukue-ue',
        'ex-kaban-isu-shita',
        'ex-hon-kaban-naka',
      ],
    },
    estimatedMinutes: 7,
    unlockRules: {
      requiredMissionIds: ['mission-grammar-existence-arimasu-imasu'],
    },
  },
  {
    id: 'mission-output-room-locations',
    type: 'output',
    title: 'Write two short location lines',
    targetSkill: 'output-confidence',
    contentRefs: {
      grammarLessonIds: ['grammar-existence-arimasu-imasu', 'grammar-position-no'],
      vocabIds: [
        'vocab-hon',
        'vocab-tsukue',
        'vocab-kaban',
        'vocab-neko',
        'vocab-heya',
        'vocab-ue',
        'vocab-shita',
        'vocab-arimasu',
        'vocab-imasu',
      ],
      exampleIds: ['ex-hon-tsukue-ue', 'ex-kaban-isu-shita', 'ex-neko-heya-imasu'],
    },
    estimatedMinutes: 8,
    unlockRules: {
      requiredMissionIds: ['mission-grammar-existence-arimasu-imasu'],
    },
    outputTasks: [
      {
        id: 'output-hon-tsukue-ue',
        prompt: 'Type a line that says: "The book is on the desk."',
        acceptableAnswers: ['ほんはつくえのうえにあります。', 'ほんはつくえのうえにあります'],
        hint: 'Use noun plus の plus うえ に before あります.',
      },
      {
        id: 'output-neko-heya-imasu',
        prompt: 'Type a line that says: "The cat is in the room."',
        acceptableAnswers: ['ねこはへやにいます。', 'ねこはへやにいます'],
        hint: 'Use に after へや, then finish with います for the cat.',
      },
    ],
  },
] satisfies Mission[];
