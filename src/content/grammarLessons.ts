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
  {
    id: 'grammar-where-doko-desu',
    title: 'Ask where something is with どこですか',
    objective:
      'Ask where a place, person, or thing is in short polite Japanese questions.',
    explanation:
      'Put the topic first with は, then ask どこですか. This gives you a direct beginner pattern for questions like トイレはどこですか and せんせいはどこですか.',
    prerequisites: ['grammar-preference-questions'],
    tags: ['question', 'location', 'daily-conversation', 'n5'],
    exampleIds: ['ex-toire-doko', 'ex-kagi-doko', 'ex-sensei-doko-desu'],
    commonMistakes: [
      'Dropping は before どこですか when the sentence needs a topic.',
      'Using どこにですか instead of the simpler beginner pattern どこですか.',
      'Putting どこ at the start and leaving the topic to the end.',
    ],
    drills: [
      {
        id: 'drill-where-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "Where is the bathroom?"',
        answer: 'トイレはどこですか。',
        choices: ['どこトイレですか。', 'トイレはどこですか。', 'トイレはどこにですか。'],
      },
      {
        id: 'drill-where-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: かぎは___ですか。',
        answer: 'どこ',
        support: 'Use どこ before ですか to ask where something is.',
      },
    ],
  },
  {
    id: 'grammar-location-answer-places',
    title: 'Answer where questions with ここ, そこ, あそこ and simple location lines',
    objective:
      'Give short location answers after a where-question using simple place or existence patterns.',
    explanation:
      'For very short answers, use ここです, そこです, or あそこです. When you need a fuller answer about a person or thing, use the location pattern already established in the app, such as つくえのうえにあります or じむしょにいます.',
    prerequisites: ['grammar-where-doko-desu'],
    tags: ['location', 'answer-patterns', 'daily-conversation', 'n5'],
    exampleIds: ['ex-toire-asoko', 'ex-jimusho-koko', 'ex-genkan-soko'],
    commonMistakes: [
      'Mixing up ここ, そこ, and あそこ without keeping the answer simple and direct.',
      'Answering only with a place noun when the lesson is teaching ここです / そこです / あそこです.',
      'Forgetting that fuller location answers can still use にあります or にいます.',
    ],
    drills: [
      {
        id: 'drill-location-answer-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural answer for "The bathroom is over there."',
        answer: 'トイレはあそこです。',
        choices: ['トイレはあそこです。', 'トイレはどこです。', 'あそこはトイレどこです。'],
      },
      {
        id: 'drill-location-answer-2',
        type: 'reorder',
        prompt: 'Reorder: じむしょは / ここです',
        answer: 'じむしょはここです。',
        support: 'Keep the topic first, then the short location answer.',
      },
    ],
  },
  {
    id: 'grammar-possession-no',
    title: 'Belonging with の: わたしのほん, あねのかばん',
    objective:
      'Show who something belongs to with noun plus の plus noun in short practical lines.',
    explanation:
      'Use の between two nouns to show belonging or relationship, as in わたしのほん or あねのかばん. You can place that noun phrase inside a simple これは〜です or それは〜です sentence to identify whose item something is.',
    prerequisites: ['grammar-question-nan'],
    tags: ['particles', 'possession', 'daily-conversation', 'n5'],
    exampleIds: [
      'ex-kore-watashi-no-hon',
      'ex-sore-ane-no-kaban',
      'ex-kore-chichi-no-kamera',
      'ex-kore-kazoku-no-shashin',
    ],
    commonMistakes: [
      'Dropping の and placing the two nouns next to each other with no link.',
      'Using は or に instead of の between the owner and the item.',
      'Breaking the noun phrase apart before finishing with です.',
    ],
    drills: [
      {
        id: 'drill-possession-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "This is my book."',
        answer: 'これはわたしのほんです。',
        choices: [
          'これはわたしはほんです。',
          'これはわたしのほんです。',
          'わたしのこれはほんです。',
        ],
      },
      {
        id: 'drill-possession-2',
        type: 'reorder',
        prompt: 'Reorder: それは / あねの / かばんです',
        answer: 'それはあねのかばんです。',
        support: 'Keep the owner plus の attached to the item before です.',
      },
    ],
  },
  {
    id: 'grammar-family-possession-lines',
    title: 'Family ownership lines with これは / それは',
    objective:
      'Identify whose everyday item something is using family words and short polite statements.',
    explanation:
      'After you build the noun phrase with の, place it inside a short statement like これはちちのカメラです or それはははのかさです. This gives you a practical beginner pattern for family, objects, and personal belongings.',
    prerequisites: ['grammar-possession-no'],
    tags: ['particles', 'family', 'daily-conversation', 'n5'],
    exampleIds: [
      'ex-sore-haha-no-kasa',
      'ex-kore-otouto-no-hon',
      'ex-sore-imouto-no-keitai',
      'ex-ane-no-shashin',
    ],
    commonMistakes: [
      'Using a family noun alone without linking it to the item with の.',
      'Dropping the demonstrative when the sentence is meant to identify a visible item.',
      'Ending the sentence before the item noun appears.',
    ],
    drills: [
      {
        id: 'drill-family-possession-1',
        type: 'fill-in',
        prompt: 'Complete the sentence: これはちち___カメラです。',
        answer: 'の',
        support: 'Use の between the family word and the object.',
      },
      {
        id: 'drill-family-possession-2',
        type: 'multiple-choice',
        prompt: "Choose the natural sentence for \"That is my mother's umbrella.\"",
        answer: 'それはははのかさです。',
        choices: [
          'それはははのかさです。',
          'それはははかさです。',
          'はははそれのかさです。',
        ],
      },
    ],
  },
  {
    id: 'grammar-verb-forms-masu-routine',
    title: 'Daily routine lines with ます',
    objective:
      'Use polite present and habitual verb forms in short daily-life statements.',
    explanation:
      'Use the polite ます form for simple present and routine statements like あさパンをたべます or うちでテレビをみます. This keeps beginner daily-life lines clean and practical while reinforcing already familiar place, time, and object patterns.',
    prerequisites: ['grammar-place-de', 'grammar-destination-ni'],
    tags: ['verb-forms', 'daily-routine', 'polite', 'n5'],
    exampleIds: [
      'ex-asa-pan-tabemasu',
      'ex-yoru-hon-yomimasu',
      'ex-uchi-terebi-mimasu',
      'ex-kouen-ongaku-kikimasu',
      'ex-yoru-nihongo-benkyoushimasu',
    ],
    commonMistakes: [
      'Dropping ます and leaving only the verb stem in a polite beginner sentence.',
      'Using the wrong particle before the verb, such as に instead of で for the place of action.',
      'Treating the ます line as past tense when it is a present or habitual statement.',
    ],
    drills: [
      {
        id: 'drill-verb-masu-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "I watch TV at home."',
        answer: 'うちでテレビをみます。',
        choices: [
          'うちにテレビをみます。',
          'うちでテレビをみます。',
          'テレビはうちでみです。',
        ],
      },
      {
        id: 'drill-verb-masu-2',
        type: 'reorder',
        prompt: 'Reorder: よる / ほんを / よみます',
        answer: 'よるほんをよみます。',
        support: 'Put the time expression first, then the object, then the polite verb.',
      },
    ],
  },
  {
    id: 'grammar-verb-forms-masen',
    title: 'Simple negative present with ません',
    objective:
      'Say clear beginner negative daily-life lines with polite verbs ending in ません.',
    explanation:
      'Change the polite ます ending to ません to say that someone does not do something, as in きょうコーヒーをのみません or あしたとしょかんにいきません. This is a small but useful beginner contrast that stays close to the patterns already used in the app.',
    prerequisites: ['grammar-verb-forms-masu-routine'],
    tags: ['verb-forms', 'negative', 'daily-routine', 'n5'],
    exampleIds: [
      'ex-kyou-koohii-nomimasen',
      'ex-ashita-toshokan-ikimasen',
      'ex-uchi-terebi-mimasen',
      'ex-asa-pan-tabemasen',
    ],
    commonMistakes: [
      'Leaving the verb in ます form when the sentence is supposed to be negative.',
      'Putting ません on a noun instead of on the polite verb.',
      'Switching the sentence to an unrelated plain-form negative when the lesson is teaching polite beginner Japanese.',
    ],
    drills: [
      {
        id: 'drill-verb-masen-1',
        type: 'fill-in',
        prompt: 'Complete the sentence: きょうコーヒーをのみ___。',
        answer: 'ません',
        support: 'Use ません to make the polite verb negative.',
      },
      {
        id: 'drill-verb-masen-2',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "I am not going to the library tomorrow."',
        answer: 'あしたとしょかんにいきません。',
        choices: [
          'あしたとしょかんでいきません。',
          'あしたとしょかんにいきません。',
          'あしたはいきませんとしょかんに。',
        ],
      },
    ],
  },
  {
    id: 'grammar-adjectives-predicates',
    title: 'Describe things with simple adjective predicates',
    objective:
      'Use short beginner adjective statements to describe everyday objects, places, and people.',
    explanation:
      'In polite beginner Japanese, you can describe something by putting the topic first and ending with an adjective plus です, as in ほんはおもしろいです or へやはしずかです. This gives you practical daily lines for books, bags, rooms, cameras, and people.',
    prerequisites: ['grammar-topic-desu'],
    tags: ['adjectives', 'description', 'daily-conversation', 'n5'],
    exampleIds: [
      'ex-hon-omoshiroi',
      'ex-kaban-ookii',
      'ex-heya-shizuka',
      'ex-kamera-atarashii',
      'ex-hon-furui',
    ],
    commonMistakes: [
      'Dropping です when the lesson is teaching a polite beginner statement.',
      'Using a noun where the sentence needs an adjective description.',
      'Forgetting the topic marker は in a basic adjective predicate line.',
    ],
    drills: [
      {
        id: 'drill-adjective-predicate-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "The room is quiet."',
        answer: 'へやはしずかです。',
        choices: [
          'へやはしずかです。',
          'へやはしずかなです。',
          'しずかへやはです。',
        ],
      },
      {
        id: 'drill-adjective-predicate-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: ほんはおもしろい___。',
        answer: 'です',
        support: 'Use です to finish the polite beginner description.',
      },
    ],
  },
  {
    id: 'grammar-adjectives-noun-description',
    title: 'Use adjectives before nouns',
    objective:
      'Build simple adjective plus noun phrases for everyday beginner descriptions.',
    explanation:
      'You can place an adjective directly before a noun, as in あたらしいカメラ or ひろいへや. Some common adjectives need な before the noun, as in しずかなへや or きれいなみせ. This helps you make short, practical description phrases.',
    prerequisites: ['grammar-adjectives-predicates'],
    tags: ['adjectives', 'noun-phrases', 'daily-conversation', 'n5'],
    exampleIds: [
      'ex-atarashii-kamera-desu',
      'ex-shizuka-heya-desu',
      'ex-kirei-mise-desu',
      'ex-yasashii-sensei-desu',
      'ex-hiroi-heya-desu',
    ],
    commonMistakes: [
      'Adding な after an い-adjective like あたらしい.',
      'Forgetting な before a noun with adjectives like しずか or きれい.',
      'Breaking the adjective and noun apart before the description is complete.',
    ],
    drills: [
      {
        id: 'drill-adjective-noun-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "It is a quiet room."',
        answer: 'しずかなへやです。',
        choices: [
          'しずかへやです。',
          'しずかなへやです。',
          'しずかですへや。',
        ],
      },
      {
        id: 'drill-adjective-noun-2',
        type: 'reorder',
        prompt: 'Reorder: あたらしい / カメラです',
        answer: 'あたらしいカメラです。',
        support: 'Keep the adjective directly before the noun.',
      },
    ],
  },
  {
    id: 'grammar-verb-forms-mashita-routine',
    title: 'Recent-action lines with ました',
    objective:
      'Use polite past-tense verbs for short recent-action and yesterday lines.',
    explanation:
      'Change the polite present ます ending to ました to say what someone did, as in きのうほんをよみました or カフェでコーヒーをのみました. This keeps the same familiar beginner word order while adding a clear past-time meaning.',
    prerequisites: ['grammar-verb-forms-masu-routine'],
    tags: ['verb-forms', 'past-tense', 'daily-routine', 'n5'],
    exampleIds: [
      'ex-kinou-hon-yomimashita',
      'ex-asa-pan-tabemashita',
      'ex-kafe-koohii-nomimashita',
      'ex-kyou-toshokan-ikimashita',
      'ex-kinou-uchi-nihongo-benkyoushimashita',
    ],
    commonMistakes: [
      'Leaving the verb in ます form when the sentence is supposed to describe a completed action.',
      'Changing the familiar particle pattern instead of only changing the verb ending to ました.',
      'Treating ました as plain past when the lesson is teaching polite beginner Japanese.',
    ],
    drills: [
      {
        id: 'drill-verb-mashita-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "Yesterday I read a book."',
        answer: 'きのうほんをよみました。',
        choices: [
          'きのうほんをよみます。',
          'きのうほんをよみました。',
          'きのうはよみましたほんを。',
        ],
      },
      {
        id: 'drill-verb-mashita-2',
        type: 'reorder',
        prompt: 'Reorder: カフェで / コーヒーを / のみました',
        answer: 'カフェでコーヒーをのみました。',
        support: 'Keep the familiar place plus object order, then finish with the polite past verb.',
      },
    ],
  },
  {
    id: 'grammar-verb-forms-masendeshita',
    title: 'Simple negative past with ませんでした',
    objective:
      'Say clear beginner negative-past lines about what someone did not do.',
    explanation:
      'Use ませんでした to say that an action did not happen, as in きのうコーヒーをのみませんでした or きのうがっこうにいきませんでした. This keeps the same beginner daily-life patterns while adding a practical recent-action contrast.',
    prerequisites: ['grammar-verb-forms-mashita-routine'],
    tags: ['verb-forms', 'negative', 'past-tense', 'n5'],
    exampleIds: [
      'ex-kinou-koohii-nomimasendeshita',
      'ex-kinou-gakkou-ikimasendeshita',
      'ex-kinou-eiga-mimasendeshita',
    ],
    commonMistakes: [
      'Stopping at ません when the sentence needs a past negative rather than a present negative.',
      'Changing the sentence into a different tense instead of only changing the verb ending.',
      'Dropping familiar particles like を or に while focusing on the longer verb ending.',
    ],
    drills: [
      {
        id: 'drill-verb-masendeshita-1',
        type: 'fill-in',
        prompt: 'Complete the sentence: きのうコーヒーをのみ___。',
        answer: 'ませんでした',
        support: 'Use ませんでした for a polite negative past action.',
      },
      {
        id: 'drill-verb-masendeshita-2',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "Yesterday I did not go to school."',
        answer: 'きのうがっこうにいきませんでした。',
        choices: [
          'きのうがっこうでいきませんでした。',
          'きのうがっこうにいきませんでした。',
          'きのうはいきませんでしたがっこうに。',
        ],
      },
    ],
  },
] satisfies GrammarLesson[];
