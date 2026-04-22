import type { GrammarLesson } from '../lib/content/types';

export const grammarLessons = [
  {
    id: 'grammar-topic-desu',
    title: 'Topic statements with は and です',
    objective:
      'Make simple identity statements and yes-no questions about who someone is.',
    explanation:
      'Use は after the topic and end with です for a polite basic statement. Add か to turn the sentence into a simple question. In early beginner Japanese, this creates useful lines like self-introductions and role descriptions.',
    prerequisites: [],
    tags: ['particles', 'copula', 'self-introduction', 'n5'],
    exampleIds: ['ex-colin-desu', 'ex-student-desu', 'ex-teacher-question'],
    commonMistakes: [
      'Dropping は when the sentence needs a clear topic.',
      'Using English-style word order like です わたし.',
      'Treating か as optional in polite yes-no questions.',
    ],
    drills: [
      {
        id: 'drill-topic-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "I am Colin."',
        answer: 'わたしはコリンです。',
        choices: ['わたしをコリンです。', 'わたしはコリンです。', 'コリンはわたしか。'],
      },
      {
        id: 'drill-topic-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: せんせい___か。',
        answer: 'です',
        support: 'Use the polite copula before か.',
      },
    ],
  },
  {
    id: 'grammar-place-de',
    title: 'Place of action with で',
    objective:
      'Say where an action happens in short, practical daily sentences.',
    explanation:
      'Use で after a place when an action happens there. This is different from marking a topic or a direct object. It is a high-value beginner pattern because it connects vocabulary into real study, cafe, and home routines.',
    prerequisites: ['grammar-topic-desu'],
    tags: ['particles', 'location', 'daily-routine', 'n5'],
    exampleIds: ['ex-study-home', 'ex-coffee-cafe', 'ex-read-library'],
    commonMistakes: [
      'Using に instead of で when describing an action taking place somewhere.',
      'Omitting the place particle and leaving only the location noun.',
      'Putting で after the verb instead of after the place.',
    ],
    drills: [
      {
        id: 'drill-place-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "I study Japanese at home."',
        answer: 'うちでにほんごをべんきょうします。',
        choices: [
          'うちをにほんごでべんきょうします。',
          'うちでにほんごをべんきょうします。',
          'にほんごはうちでです。',
        ],
      },
      {
        id: 'drill-place-2',
        type: 'reorder',
        prompt: 'Reorder: カフェで / コーヒーを / のみます',
        answer: 'カフェでコーヒーをのみます。',
        support: 'Place comes before the object and verb.',
      },
    ],
  },
  {
    id: 'grammar-question-nan',
    title: 'Ask what something is with なんですか',
    objective:
      'Ask and answer simple classroom and study-object questions in polite Japanese.',
    explanation:
      'Use これは or それは to point to something, and use なんですか to ask what it is. Answer with a noun plus です. This creates short, high-value beginner lines for class, books, homework, and basic study talk.',
    prerequisites: ['grammar-topic-desu'],
    tags: ['question', 'classroom', 'copula', 'n5'],
    exampleIds: [
      'ex-kore-hon',
      'ex-kore-nan',
      'ex-sore-shukudai',
      'ex-kore-eigo-hon',
    ],
    commonMistakes: [
      'Using English-style word order like なん これは ですか.',
      'Dropping です in a polite answer when the lesson is teaching the basic pattern.',
      'Forgetting that これは and それは should stay together before the noun or question.',
    ],
    drills: [
      {
        id: 'drill-question-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "What is this?"',
        answer: 'これはなんですか。',
        choices: ['これはなんです。', 'これはなんですか。', 'なんこれはですか。'],
      },
      {
        id: 'drill-question-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: それはしゅくだい___。',
        answer: 'です',
        support: 'Use the polite copula to finish the answer cleanly.',
      },
    ],
  },
  {
    id: 'grammar-destination-ni',
    title: 'Destination with に and いきます',
    objective:
      'Say where someone goes in short daily and classroom routine lines.',
    explanation:
      'Use に after the destination before verbs like いきます. This is different from で, which marks where an action happens. Destination with に is a core beginner pattern for school, library, and classroom routines.',
    prerequisites: ['grammar-place-de'],
    tags: ['particles', 'movement', 'daily-routine', 'n5'],
    exampleIds: [
      'ex-doko-ikimasu',
      'ex-mainichi-gakkou',
      'ex-kyou-toshokan',
      'ex-ima-kyoushitsu',
    ],
    commonMistakes: [
      'Using で instead of に when the sentence is about going to a destination.',
      'Dropping に and leaving the destination noun alone.',
      'Putting に after the verb instead of after the destination.',
    ],
    drills: [
      {
        id: 'drill-destination-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "I go to school every day."',
        answer: 'まいにちがっこうにいきます。',
        choices: [
          'まいにちがっこうでいきます。',
          'まいにちがっこうにいきます。',
          'がっこうにまいにちです。',
        ],
      },
      {
        id: 'drill-destination-2',
        type: 'reorder',
        prompt: 'Reorder: きょう / としょかんに / いきます',
        answer: 'きょうとしょかんにいきます。',
        support: 'Time can come first, then the destination with に, then the verb.',
      },
    ],
  },
] satisfies GrammarLesson[];
