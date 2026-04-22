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
        evaluation: {
          tokenPatterns: [['わたし', 'は', 'コリン', 'です']],
        },
      },
      {
        id: 'output-home-study',
        prompt: 'Type a line that says: "I study Japanese at home."',
        acceptableAnswers: [
          'うちでにほんごをべんきょうします。',
          'うちでにほんごをべんきょうします',
        ],
        hint: 'Put the place with で before the object and verb.',
        evaluation: {
          tokenPatterns: [['うち', 'で', 'にほんご', 'を', 'べんきょうします']],
        },
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
        evaluation: {
          tokenPatterns: [['これ', 'は', 'なん', 'です', 'か']],
        },
      },
      {
        id: 'output-mainichi-gakkou',
        prompt: 'Type a line that says: "I go to school every day."',
        acceptableAnswers: [
          'まいにちがっこうにいきます。',
          'まいにちがっこうにいきます',
        ],
        hint: 'Put the destination with に before いきます.',
        evaluation: {
          tokenPatterns: [['まいにち', 'がっこう', 'に', 'いきます']],
        },
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
        evaluation: {
          tokenPatterns: [['ほん', 'は', 'つくえ', 'の', 'うえ', 'に', 'あります']],
        },
      },
      {
        id: 'output-neko-heya-imasu',
        prompt: 'Type a line that says: "The cat is in the room."',
        acceptableAnswers: ['ねこはへやにいます。', 'ねこはへやにいます'],
        hint: 'Use に after へや, then finish with います for the cat.',
        evaluation: {
          tokenPatterns: [['ねこ', 'は', 'へや', 'に', 'います']],
        },
      },
    ],
  },
  {
    id: 'mission-grammar-preference-suki-kirai',
    type: 'grammar',
    title: 'Say what you like and dislike',
    targetSkill: 'particles',
    contentRefs: {
      grammarLessonIds: ['grammar-preference-suki-kirai'],
      vocabIds: [
        'vocab-suki',
        'vocab-kirai',
        'vocab-sushi',
        'vocab-raamen',
        'vocab-ongaku',
        'vocab-anime',
        'vocab-sakkaa',
        'vocab-eiga',
      ],
      exampleIds: [
        'ex-watashi-sushi-suki',
        'ex-tomodachi-raamen-suki',
        'ex-watashi-koohii-kirai',
        'ex-ongaku-suki',
        'ex-anime-suki',
        'ex-sakkaa-kirai',
      ],
    },
    estimatedMinutes: 7,
    unlockRules: {
      requiredMissionIds: ['mission-grammar-existence-arimasu-imasu'],
    },
  },
  {
    id: 'mission-listening-preferences',
    type: 'listening',
    title: 'Hear simple likes and dislikes',
    targetSkill: 'listening-comprehension',
    contentRefs: {
      grammarLessonIds: ['grammar-preference-suki-kirai', 'grammar-preference-questions'],
      listeningItemIds: [
        'listening-watashi-sushi-suki',
        'listening-koohii-kirai',
        'listening-ongaku-suki',
        'listening-nani-suki',
        'listening-tabemono-nani-suki',
      ],
      exampleIds: [
        'ex-watashi-sushi-suki',
        'ex-watashi-koohii-kirai',
        'ex-ongaku-suki',
        'ex-nani-suki',
        'ex-tabemono-nani-suki',
      ],
    },
    estimatedMinutes: 7,
    unlockRules: {
      requiredMissionIds: ['mission-grammar-preference-suki-kirai'],
    },
  },
  {
    id: 'mission-output-preference-questions',
    type: 'output',
    title: 'Ask and answer one simple preference',
    targetSkill: 'output-confidence',
    contentRefs: {
      grammarLessonIds: ['grammar-preference-suki-kirai', 'grammar-preference-questions'],
      vocabIds: [
        'vocab-suki',
        'vocab-anime',
        'vocab-nomimono',
        'vocab-cha',
        'vocab-tabemono',
      ],
      exampleIds: [
        'ex-anime-suki',
        'ex-cha-suki',
        'ex-nomimono-nani-suki',
        'ex-tabemono-nani-suki',
      ],
    },
    estimatedMinutes: 8,
    unlockRules: {
      requiredMissionIds: ['mission-grammar-preference-suki-kirai'],
    },
    outputTasks: [
      {
        id: 'output-anime-suki',
        prompt: 'Type a line that says: "I like anime."',
        acceptableAnswers: [
          'アニメがすきです。',
          'アニメがすきです',
          'わたしはアニメがすきです。',
          'わたしはアニメがすきです',
        ],
        hint: 'Use the thing plus が plus すきです. Adding わたしは is also acceptable.',
        evaluation: {
          tokenPatterns: [
            ['アニメ', 'が', 'すき', 'です'],
            ['わたし', 'は', 'アニメ', 'が', 'すき', 'です'],
          ],
        },
      },
      {
        id: 'output-nomimono-nani-suki',
        prompt: 'Type a polite question that says: "What drink do you like?"',
        acceptableAnswers: ['のみものはなにがすきですか。', 'のみものはなにがすきですか'],
        hint: 'Start with the category topic のみものは, then ask なにがすきですか.',
        evaluation: {
          tokenPatterns: [['のみもの', 'は', 'なに', 'が', 'すき', 'です', 'か']],
        },
      },
    ],
  },
  {
    id: 'mission-grammar-where-doko-desu',
    type: 'grammar',
    title: 'Ask where something is with どこですか',
    targetSkill: 'sentence-structure',
    contentRefs: {
      grammarLessonIds: ['grammar-where-doko-desu'],
      vocabIds: [
        'vocab-toire',
        'vocab-kagi',
        'vocab-jitensha',
        'vocab-doko-desu',
        'vocab-sensei',
      ],
      exampleIds: [
        'ex-toire-doko',
        'ex-kagi-doko',
        'ex-sensei-doko-desu',
        'ex-jitensha-doko',
      ],
    },
    estimatedMinutes: 7,
    unlockRules: {
      requiredMissionIds: ['mission-grammar-preference-suki-kirai'],
    },
  },
  {
    id: 'mission-listening-where-things-are',
    type: 'listening',
    title: 'Hear where things and places are',
    targetSkill: 'listening-comprehension',
    contentRefs: {
      grammarLessonIds: ['grammar-where-doko-desu', 'grammar-location-answer-places'],
      listeningItemIds: [
        'listening-toire-doko',
        'listening-toire-asoko',
        'listening-kagi-doko',
        'listening-kagi-tsukue-ue',
        'listening-sensei-jimusho',
      ],
      exampleIds: [
        'ex-toire-doko',
        'ex-toire-asoko',
        'ex-kagi-doko',
        'ex-kagi-tsukue-ue-arimasu',
        'ex-sensei-jimusho-imasu',
      ],
    },
    estimatedMinutes: 7,
    unlockRules: {
      requiredMissionIds: ['mission-grammar-where-doko-desu'],
    },
  },
  {
    id: 'mission-output-where-answers',
    type: 'output',
    title: 'Ask one where-question and answer one location',
    targetSkill: 'output-confidence',
    contentRefs: {
      grammarLessonIds: ['grammar-where-doko-desu', 'grammar-location-answer-places'],
      vocabIds: [
        'vocab-toire',
        'vocab-kagi',
        'vocab-tsukue',
        'vocab-ue',
        'vocab-doko-desu',
      ],
      exampleIds: ['ex-toire-doko', 'ex-kagi-tsukue-ue-arimasu', 'ex-toire-asoko'],
    },
    estimatedMinutes: 8,
    unlockRules: {
      requiredMissionIds: ['mission-grammar-where-doko-desu'],
    },
    outputTasks: [
      {
        id: 'output-toire-doko',
        prompt: 'Type a polite question that says: "Where is the bathroom?"',
        acceptableAnswers: ['トイレはどこですか。', 'トイレはどこですか'],
        hint: 'Use the topic first, then どこですか.',
        evaluation: {
          tokenPatterns: [['トイレ', 'は', 'どこ', 'です', 'か']],
        },
      },
      {
        id: 'output-kagi-tsukue-ue',
        prompt: 'Type a line that says: "The key is on the desk."',
        acceptableAnswers: ['かぎはつくえのうえにあります。', 'かぎはつくえのうえにあります'],
        hint: 'Use the topic first, then the location phrase つくえのうえに, then あります.',
        evaluation: {
          tokenPatterns: [['かぎ', 'は', 'つくえ', 'の', 'うえ', 'に', 'あります']],
        },
      },
    ],
  },
  {
    id: 'mission-reading-starter-recognition',
    type: 'reading',
    title: 'Read short beginner lines before the reveal',
    targetSkill: 'reading-recognition',
    contentRefs: {
      exampleIds: [
        'ex-kore-eigo-hon',
        'ex-neko-heya-imasu',
        'ex-watashi-sushi-suki',
        'ex-toire-doko',
        'ex-kagi-tsukue-ue-arimasu',
      ],
    },
    estimatedMinutes: 6,
    unlockRules: {
      requiredMissionIds: ['mission-grammar-topic-desu'],
    },
    readingChecks: [
      {
        id: 'reading-check-kore-eigo-hon-meaning',
        exampleId: 'ex-kore-eigo-hon',
        prompt: 'Which meaning matches this line?',
        choices: [
          'This is an English book.',
          'This book is in English class.',
          'That is an English teacher.',
        ],
        answer: 'This is an English book.',
        support: 'Read これ as "this" and notice how えいごのほん links two nouns before です.',
      },
      {
        id: 'reading-check-neko-heya-location',
        exampleId: 'ex-neko-heya-imasu',
        prompt: 'What location does this sentence describe?',
        choices: [
          'The cat is in the room.',
          'The cat goes to the room.',
          'The room likes the cat.',
        ],
        answer: 'The cat is in the room.',
        support: 'にいます marks where an animate thing is, not where it goes.',
      },
      {
        id: 'reading-check-watashi-sushi-suki-preference',
        exampleId: 'ex-watashi-sushi-suki',
        prompt: 'What is the speaker saying here?',
        choices: [
          'I like sushi.',
          'I am sushi.',
          'I eat sushi at home.',
        ],
        answer: 'I like sushi.',
        support: 'すしがすきです is the beginner preference pattern: the thing you like comes before が.',
      },
      {
        id: 'reading-check-toire-doko-question',
        exampleId: 'ex-toire-doko',
        prompt: 'What kind of sentence is this?',
        choices: [
          'A where-question asking for a location.',
          'A statement that says the bathroom is over there.',
          'A sentence about going to the bathroom.',
        ],
        answer: 'A where-question asking for a location.',
        support: 'どこですか signals a polite where-question, so read it as asking for location information.',
      },
      {
        id: 'reading-check-kagi-tsukue-ue-location',
        exampleId: 'ex-kagi-tsukue-ue-arimasu',
        prompt: 'Which English meaning is the best match?',
        choices: [
          'The key is on the desk.',
          'The desk is under the key.',
          'The key goes to the desk.',
        ],
        answer: 'The key is on the desk.',
        support: 'つくえのうえにあります gives a full location phrase: "on the desk" before the existence verb.',
      },
    ],
  },
] satisfies Mission[];
