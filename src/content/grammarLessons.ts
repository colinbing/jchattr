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
  {
    id: 'grammar-existence-arimasu-imasu',
    title: 'Existence with あります and います',
    objective:
      'Say where things and living beings are in short, practical beginner sentences.',
    explanation:
      'Use に after the place, then use あります for things and います for people and animals. This gives you a useful beginner pattern for rooms, classrooms, books, bags, pets, and people.',
    prerequisites: ['grammar-destination-ni'],
    tags: ['particles', 'existence', 'location', 'n5'],
    exampleIds: [
      'ex-neko-heya-imasu',
      'ex-sensei-kyoushitsu-imasu',
      'ex-hon-toshokan-arimasu',
    ],
    commonMistakes: [
      'Using います for things like books or bags.',
      'Using あります for people or animals.',
      'Dropping に after the place and leaving only the location noun.',
    ],
    drills: [
      {
        id: 'drill-existence-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "The cat is in the room."',
        answer: 'ねこはへやにいます。',
        choices: [
          'ねこはへやにあります。',
          'ねこはへやにいます。',
          'へやはねこにいます。',
        ],
      },
      {
        id: 'drill-existence-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: ほんはとしょかんに___。',
        answer: 'あります',
        support: 'Use あります for things.',
      },
    ],
  },
  {
    id: 'grammar-position-no',
    title: 'Position words with の: うえ, した, なか',
    objective:
      'Say more precisely where something is using on top of, under, and inside.',
    explanation:
      'Use noun plus の plus a position word before に: for example, つくえのうえに or かばんのなかに. Then finish with あります or います. This extends the existence pattern into more useful room and classroom descriptions.',
    prerequisites: ['grammar-existence-arimasu-imasu'],
    tags: ['particles', 'position', 'location', 'n5'],
    exampleIds: ['ex-hon-tsukue-ue', 'ex-kaban-isu-shita', 'ex-hon-kaban-naka'],
    commonMistakes: [
      'Skipping の between the main noun and the position word.',
      'Putting に before the position word instead of after it.',
      'Using the wrong existence verb after building the location phrase.',
    ],
    drills: [
      {
        id: 'drill-position-1',
        type: 'reorder',
        prompt: 'Reorder: つくえのうえに / ほんは / あります',
        answer: 'ほんはつくえのうえにあります。',
        support: 'Start with the topic, then the full location phrase, then the existence verb.',
      },
      {
        id: 'drill-position-2',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "The bag is under the chair."',
        answer: 'かばんはいすのしたにあります。',
        choices: [
          'かばんはいすしたにあります。',
          'かばんはいすのしたにあります。',
          'かばんはしたのいすにあります。',
        ],
      },
    ],
  },
  {
    id: 'grammar-preference-suki-kirai',
    title: 'Likes and dislikes with が すきです / きらいです',
    objective:
      'Say simple likes and dislikes about food, drinks, and hobbies in polite Japanese.',
    explanation:
      'Put the thing you like or dislike before が, then finish with すきです or きらいです. You can add a topic like わたしは at the start, but the key beginner pattern is X が すきです or X が きらいです.',
    prerequisites: ['grammar-existence-arimasu-imasu'],
    tags: ['particles', 'preference', 'daily-conversation', 'n5'],
    exampleIds: ['ex-watashi-sushi-suki', 'ex-watashi-koohii-kirai', 'ex-ongaku-suki'],
    commonMistakes: [
      'Using を instead of が before すきです or きらいです.',
      'Dropping です when the lesson is teaching the polite basic pattern.',
      'Putting すき or きらい before the thing instead of after it.',
    ],
    drills: [
      {
        id: 'drill-preference-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "I like sushi."',
        answer: 'わたしはすしがすきです。',
        choices: [
          'わたしはすしをすきです。',
          'わたしはすしがすきです。',
          'すきですわたしはすしが。',
        ],
      },
      {
        id: 'drill-preference-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: サッカー___きらいです。',
        answer: 'が',
        support: 'Use が before すきです and きらいです in this beginner pattern.',
      },
    ],
  },
  {
    id: 'grammar-preference-questions',
    title: 'Ask simple preference questions with なにがすきですか',
    objective:
      'Ask what someone likes and narrow the question by category such as food or drinks.',
    explanation:
      'Use なにがすきですか to ask what someone likes. You can add a topic first, like たべものは or のみものは, to ask about one category. A simple answer uses noun plus が plus すきです or きらいです.',
    prerequisites: ['grammar-preference-suki-kirai'],
    tags: ['question', 'preference', 'daily-conversation', 'n5'],
    exampleIds: ['ex-nani-suki', 'ex-tabemono-nani-suki', 'ex-nomimono-nani-suki'],
    commonMistakes: [
      'Using なにを instead of なにが in this beginner preference question.',
      'Answering with only a noun when the lesson is teaching noun plus が plus すきです.',
      'Forgetting は after the category word in questions like たべものはなにがすきですか.',
    ],
    drills: [
      {
        id: 'drill-preference-question-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "What do you like?"',
        answer: 'なにがすきですか。',
        choices: ['なにをすきですか。', 'なにがすきですか。', 'すきですかなにが。'],
      },
      {
        id: 'drill-preference-question-2',
        type: 'reorder',
        prompt: 'Reorder: のみものは / なにが / すきですか',
        answer: 'のみものはなにがすきですか。',
        support: 'Put the category topic first, then the question phrase.',
      },
    ],
  },
] satisfies GrammarLesson[];
