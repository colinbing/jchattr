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
    exampleIds: [
      'ex-colin-desu',
      'ex-student-desu',
      'ex-teacher-question',
      'ex-daigakusei-desu',
    ],
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
    exampleIds: [
      'ex-study-home',
      'ex-coffee-cafe',
      'ex-read-library',
      'ex-kyoushitsu-de-pasokon-o-tsukaimasu',
      'ex-shokudou-de-koohii-o-nomimasu',
    ],
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
      'ex-kore-jisho-desu',
      'ex-sore-nooto-desu',
      'ex-kore-kyoukasho-desu',
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
      'ex-ashita-daigaku-ni-ikimasu',
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
      'ex-tori-wa-heya-ni-imasu',
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
    exampleIds: [
      'ex-hon-tsukue-ue',
      'ex-kaban-isu-shita',
      'ex-hon-kaban-naka',
      'ex-tokei-wa-doa-no-ue-ni-arimasu',
      'ex-kaban-wa-tana-no-shita-ni-arimasu',
    ],
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
    exampleIds: [
      'ex-watashi-sushi-suki',
      'ex-watashi-koohii-kirai',
      'ex-ongaku-suki',
      'ex-geemu-ga-suki-desu',
      'ex-uta-ga-suki-desu',
      'ex-piza-ga-suki-desu',
    ],
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
    exampleIds: [
      'ex-nani-suki',
      'ex-tabemono-nani-suki',
      'ex-nomimono-nani-suki',
      'ex-yakyuu-ga-suki-desu-ka',
    ],
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
    exampleIds: [
      'ex-toire-doko',
      'ex-kagi-doko',
      'ex-sensei-doko-desu',
      'ex-kaidan-wa-doko-desu-ka',
      'ex-uketsuke-wa-doko-desu-ka',
    ],
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
    exampleIds: [
      'ex-toire-asoko',
      'ex-jimusho-koko',
      'ex-genkan-soko',
      'ex-erebeetaa-wa-soko-desu',
      'ex-robii-wa-asoko-desu',
    ],
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
      'ex-kore-sofu-no-tokei-desu',
      'ex-kore-chichi-no-saifu-desu',
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
      'ex-sore-sobo-no-shashin-desu',
      'ex-sore-ane-no-enpitsu-desu',
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
      'ex-asagohan-o-tabemasu',
      'ex-asa-shinbun-o-yomimasu',
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
      'ex-bangohan-o-tabemasen',
      'ex-yoru-meeru-o-yomimasen',
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
      'ex-kouen-wa-tanoshii-desu',
      'ex-kono-jisho-wa-benri-desu',
      'ex-heya-wa-semai-desu',
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
      'ex-nigiyaka-na-kafe-desu',
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
      'ex-kinou-zasshi-o-yomimashita',
      'ex-kinou-depaato-ni-ikimashita',
      'ex-asa-sarada-o-tabemashita',
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
      'ex-senshuu-dorama-o-mimasendeshita',
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
  {
    id: 'grammar-permission-temo-ii-desu-ka',
    title: 'Ask permission with てもいいですか',
    objective:
      'Ask short polite permission questions for everyday classroom and daily-life actions.',
    explanation:
      'Use the て-form plus もいいですか to ask if something is okay, as in みずをのんでもいいですか or トイレにいってもいいですか. This gives you a practical beginner pattern for asking permission without changing the rest of the sentence structure too much.',
    prerequisites: ['grammar-verb-forms-masu-routine'],
    tags: ['verb-forms', 'permission', 'daily-conversation', 'n5'],
    exampleIds: [
      'ex-mizu-nonde-mo-ii',
      'ex-toire-itte-mo-ii',
      'ex-koko-suwatte-mo-ii',
      'ex-hon-yonde-mo-ii',
      'ex-mado-akete-mo-ii',
      'ex-mado-o-shimete-mo-ii-desu-ka',
      'ex-terebi-o-keshite-mo-ii-desu-ka',
    ],
    commonMistakes: [
      'Leaving the verb in ます form instead of changing it into the て-form before もいいですか.',
      'Dropping か and turning the permission question into a plain statement.',
      'Changing the familiar particles instead of only changing the verb phrase.',
    ],
    drills: [
      {
        id: 'drill-permission-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "May I drink water?"',
        answer: 'みずをのんでもいいですか。',
        choices: [
          'みずをのみますか。',
          'みずをのんでもいいですか。',
          'みずはのんでいいです。',
        ],
      },
      {
        id: 'drill-permission-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: トイレにいっ___いいですか。',
        answer: 'ても',
        support: 'Use the て-form plus も before いいですか.',
      },
    ],
  },
  {
    id: 'grammar-request-te-kudasai',
    title: 'Make simple requests with てください',
    objective:
      'Use short polite request lines for practical classroom and daily-life actions.',
    explanation:
      'Use the て-form plus ください to ask someone to do something politely, as in ちょっとまってください or これをみてください. This is a compact beginner pattern that fits well with classroom and daily-life needs.',
    prerequisites: ['grammar-permission-temo-ii-desu-ka'],
    tags: ['verb-forms', 'request', 'daily-conversation', 'n5'],
    exampleIds: [
      'ex-chotto-matte-kudasai',
      'ex-kore-mite-kudasai',
      'ex-koko-suwatte-kudasai',
      'ex-yukkuri-yonde-kudasai',
      'ex-mou-ichido-yonde-kudasai',
      'ex-hon-o-totte-kudasai',
      'ex-jisho-o-tsukatte-kudasai',
    ],
    commonMistakes: [
      'Using the ます form before ください instead of the て-form.',
      'Dropping ください and leaving only the bare て-form when the lesson is teaching the polite request pattern.',
      'Moving adverbs like ちょっと or ゆっくり into awkward positions after the request verb.',
    ],
    drills: [
      {
        id: 'drill-request-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "Please wait a moment."',
        answer: 'ちょっとまってください。',
        choices: [
          'ちょっとまってください。',
          'ちょっとまちますください。',
          'まってちょっとです。',
        ],
      },
      {
        id: 'drill-request-2',
        type: 'reorder',
        prompt: 'Reorder: これを / みてください',
        answer: 'これをみてください。',
        support: 'Keep the object phrase first, then finish with the て-form plus ください request.',
      },
    ],
  },
  {
    id: 'grammar-shopping-o-kudasai',
    title: 'Ask for an item with をください',
    objective:
      'Use short, practical shopping lines to ask for an item politely.',
    explanation:
      'Put the item before を, then finish with ください: for example, これをください or このほんをください. This gives you a very compact beginner pattern for selecting and requesting something in a shop.',
    prerequisites: ['grammar-request-te-kudasai'],
    tags: ['shopping', 'request', 'object', 'n5'],
    exampleIds: [
      'ex-kore-o-kudasai',
      'ex-kono-hon-o-kudasai',
      'ex-pan-o-kudasai',
      'ex-onigiri-o-kudasai',
    ],
    commonMistakes: [
      'Dropping を before ください when the lesson is teaching a clear item-request pattern.',
      'Using English-style order like くださいこれを.',
      'Mixing これ and このほん in the same line when only one item phrase is needed.',
    ],
    drills: [
      {
        id: 'drill-shopping-kudasai-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "Please give me this."',
        answer: 'これをください。',
        choices: ['これください。', 'これをください。', 'くださいこれを。'],
      },
      {
        id: 'drill-shopping-kudasai-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: このほん___ください。',
        answer: 'を',
        support: 'Use を before ください when asking for the item directly.',
      },
    ],
  },
  {
    id: 'grammar-shopping-kaimasu',
    title: 'Say what you buy with をかいます',
    objective:
      'Say what you buy and ask simple shopping questions with かいます.',
    explanation:
      'Put the item before を, then finish with かいます: for example, みずをかいます or りんごをかいます. You can also ask simple questions like なにをかいますか or どれをかいますか.',
    prerequisites: ['grammar-shopping-o-kudasai'],
    tags: ['shopping', 'verb-forms', 'object', 'n5'],
    exampleIds: [
      'ex-mizu-o-kaimasu',
      'ex-nani-o-kaimasu',
      'ex-dore-o-kaimasu',
      'ex-konbini-de-okashi-o-kaimasu',
      'ex-bentou-o-kaimasu',
      'ex-gyuunyuu-o-kaimasu',
      'ex-tamago-o-kaimasu',
    ],
    commonMistakes: [
      'Dropping を before かいます when the lesson is teaching a direct object pattern.',
      'Using です instead of the verb かいます.',
      'Changing the question word order instead of keeping なにを or どれを before かいますか.',
    ],
    drills: [
      {
        id: 'drill-shopping-kaimasu-1',
        type: 'reorder',
        prompt: 'Reorder: りんごを / かいます',
        answer: 'りんごをかいます。',
        support: 'Keep the item phrase first, then finish with かいます.',
      },
      {
        id: 'drill-shopping-kaimasu-2',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "What do you buy?"',
        answer: 'なにをかいますか。',
        choices: ['なにかいますをか。', 'なにをかいますか。', 'なにはかいますか。'],
      },
    ],
  },
  {
    id: 'grammar-time-nanji-desu',
    title: 'Ask and tell time with なんじですか',
    objective:
      'Ask and answer simple clock-time questions in short, practical beginner lines.',
    explanation:
      'Use なんじですか to ask the time, and answer with a time expression plus です, like しちじです or ごぜんはちじです. This gives you a compact beginner pattern for daily routines, class times, and schedule talk.',
    prerequisites: ['grammar-shopping-kaimasu'],
    tags: ['time', 'schedule', 'copula', 'n5'],
    exampleIds: [
      'ex-nanji-desu-ka',
      'ex-shichiji-desu',
      'ex-gozen-hachiji-desu',
      'ex-gogo-kuji-desu',
      'ex-sanji-ni-kafe-de-koohii-o-nomimasu',
    ],
    commonMistakes: [
      'Dropping です in a polite time answer when the lesson is teaching the basic pattern.',
      'Using a schedule sentence with に when the line is only asking or telling the current time.',
      'Treating なんじ as a noun and moving it into unnatural English-style order.',
    ],
    drills: [
      {
        id: 'drill-time-nanji-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "What time is it?"',
        answer: 'なんじですか。',
        choices: ['なんじにですか。', 'なんじですか。', 'ですかなんじ。'],
      },
      {
        id: 'drill-time-nanji-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: しちじ___。',
        answer: 'です',
        support: 'Use the polite copula to finish a simple time answer.',
      },
    ],
  },
  {
    id: 'grammar-time-ni-schedule',
    title: 'Use time with に in simple schedule lines',
    objective:
      'Say what time you do something in short daily routine and schedule lines.',
    explanation:
      'Put the time before に, then finish with the action, as in はちじにがっこうにいきます or くじににほんごをべんきょうします. This is a high-value beginner pattern for routines, plans, and class schedules.',
    prerequisites: ['grammar-time-nanji-desu'],
    tags: ['time', 'particles', 'schedule', 'n5'],
    exampleIds: [
      'ex-hachiji-ni-gakkou-ikimasu',
      'ex-kuji-ni-nihongo-benkyoushimasu',
      'ex-asa-shichiji-ni-okimasu',
      'ex-yoru-juuji-ni-nemasu',
      'ex-yoji-ni-toshokan-ni-ikimasu',
      'ex-juuichiji-ni-nemasu',
      'ex-juuniji-ni-hiru-o-tabemasu',
    ],
    commonMistakes: [
      'Leaving out に after the time expression in a schedule sentence.',
      'Using で after the time instead of に.',
      'Putting the action before the time phrase instead of keeping the time phrase earlier in the line.',
    ],
    drills: [
      {
        id: 'drill-time-schedule-1',
        type: 'reorder',
        prompt: 'Reorder: はちじに / がっこうに / いきます',
        answer: 'はちじにがっこうにいきます。',
        support: 'Put the time phrase first, then the destination phrase, then the verb.',
      },
      {
        id: 'drill-time-schedule-2',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "I study Japanese at nine o’clock."',
        answer: 'くじににほんごをべんきょうします。',
        choices: [
          'くじでにほんごをべんきょうします。',
          'くじににほんごをべんきょうします。',
          'にほんごをくじべんきょうします。',
        ],
      },
    ],
  },
  {
    id: 'grammar-weekdays-ni',
    title: 'Use weekdays with に in schedule lines',
    objective:
      'Say what you do on different days of the week in short beginner schedule lines.',
    explanation:
      'Put the weekday before に, then add the action, as in げつようびにがっこうにいきます or きんようびににほんごをべんきょうします. This extends the existing time-with-に pattern into simple weekly plans.',
    prerequisites: ['grammar-time-ni-schedule'],
    tags: ['time', 'particles', 'schedule', 'n5'],
    exampleIds: [
      'ex-getsuyoubi-ni-gakkou-ikimasu',
      'ex-kayoubi-ni-hon-o-yomimasu',
      'ex-mokuyoubi-ni-nihongo-o-benkyoushimasu',
      'ex-kinyoubi-ni-ongaku-o-kikimasu',
      'ex-kayoubi-ni-kaimono-o-shimasu',
      'ex-suiyoubi-ni-souji-o-shimasu',
    ],
    commonMistakes: [
      'Leaving out に after the weekday in a schedule sentence.',
      'Using で after the weekday instead of に.',
      'Moving the weekday after the verb instead of keeping it earlier in the line.',
    ],
    drills: [
      {
        id: 'drill-weekdays-ni-1',
        type: 'reorder',
        prompt: 'Reorder: げつようびに / がっこうに / いきます',
        answer: 'げつようびにがっこうにいきます。',
        support: 'Put the weekday first, then the destination phrase, then the verb.',
      },
      {
        id: 'drill-weekdays-ni-2',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "I study Japanese on Friday."',
        answer: 'きんようびににほんごをべんきょうします。',
        choices: [
          'きんようびでにほんごをべんきょうします。',
          'きんようびににほんごをべんきょうします。',
          'にほんごをきんようびべんきょうします。',
        ],
      },
    ],
  },
  {
    id: 'grammar-weekday-plan-questions',
    title: 'Ask simple plan questions with weekdays',
    objective:
      'Ask and answer very simple weekday plan questions in polite beginner Japanese.',
    explanation:
      'Use a weekday with に, then ask なにをしますか, as in どようびになにをしますか. You can answer with a short routine line or use は to set a day as the topic, like にちようびはうちでやすみます.',
    prerequisites: ['grammar-weekdays-ni'],
    tags: ['time', 'question', 'schedule', 'n5'],
    exampleIds: [
      'ex-doyoubi-ni-nani-o-shimasu-ka',
      'ex-getsuyoubi-ni-nani-o-shimasu-ka',
      'ex-nichiyoubi-wa-uchi-de-yasumimasu',
      'ex-raishuu-doyoubi-ni-toshokan-ni-ikimasu',
      'ex-nichiyoubi-ni-sentaku-o-shimasu',
      'ex-doyoubi-ni-sanpo-o-shimasu',
    ],
    commonMistakes: [
      'Dropping を before しますか when asking what someone does.',
      'Using に after the whole sentence instead of attaching it to the weekday.',
      'Forgetting は in a topic-style answer like にちようびはうちでやすみます.',
    ],
    drills: [
      {
        id: 'drill-weekday-plan-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "What do you do on Saturday?"',
        answer: 'どようびになにをしますか。',
        choices: [
          'どようびなにをしますか。',
          'どようびになにをしますか。',
          'なにをどようびにしますかです。',
        ],
      },
      {
        id: 'drill-weekday-plan-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: にちようび___うちでやすみます。',
        answer: 'は',
        support: 'Use は when the day is the topic of the sentence.',
      },
    ],
  },
  {
    id: 'grammar-transport-de',
    title: 'Use で for transport and travel method',
    objective:
      'Say how you go somewhere with short beginner lines like バスでいきます and でんしゃでかいしゃにいきます.',
    explanation:
      'Use a transport word plus で before the movement verb to show your method, as in バスでいきます or でんしゃでかいしゃにいきます. This extends the existing place-of-action で pattern into a new practical use for movement and travel.',
    prerequisites: ['grammar-weekday-plan-questions'],
    tags: ['transport', 'particles', 'movement', 'n5'],
    exampleIds: [
      'ex-basu-de-ikimasu',
      'ex-densha-de-kaisha-ni-ikimasu',
      'ex-takushii-de-kuukou-ni-ikimasu',
      'ex-toshokan-made-jitensha-de-ikimasu',
      'ex-chikatetsu-de-hoteru-ni-ikimasu',
      'ex-basu-de-yuubinkyoku-ni-ikimasu',
    ],
    commonMistakes: [
      'Using に after the transport word instead of で when the line is showing how you travel.',
      'Dropping で and listing the transport noun directly before the verb.',
      'Mixing up the transport method phrase and the destination phrase order in a way that makes the sentence hard to follow.',
    ],
    drills: [
      {
        id: 'drill-transport-de-1',
        type: 'reorder',
        prompt: 'Reorder: バスで / いきます',
        answer: 'バスでいきます。',
        support: 'Put the transport method first, then finish with the movement verb.',
      },
      {
        id: 'drill-transport-de-2',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "I go to the office by train."',
        answer: 'でんしゃでかいしゃにいきます。',
        choices: [
          'でんしゃにかいしゃでいきます。',
          'でんしゃでかいしゃにいきます。',
          'かいしゃにでんしゃいきます。',
        ],
      },
    ],
  },
  {
    id: 'grammar-destination-made-questions',
    title: 'Use まで for simple destination questions',
    objective:
      'Ask and answer how far or up to where someone goes with short movement lines.',
    explanation:
      'Use a destination plus まで to mark the end point, as in えきまであるきます or くうこうまでいきます. To ask about that end point, use どこまでいきますか. This gives you a compact beginner pattern for transport and movement talk.',
    prerequisites: ['grammar-transport-de'],
    tags: ['transport', 'particles', 'question', 'n5'],
    exampleIds: [
      'ex-doko-made-ikimasu-ka',
      'ex-eki-made-arukimasu',
      'ex-machi-made-basu-de-ikimasu',
      'ex-kuukou-made-ikimasu',
      'ex-supaa-made-arukimasu',
      'ex-hoteru-made-takushii-de-ikimasu',
    ],
    commonMistakes: [
      'Replacing まで with に when the lesson is teaching the end point of a route.',
      'Dropping まで in a question like どこまでいきますか.',
      'Using を after the destination instead of attaching まで directly to it.',
    ],
    drills: [
      {
        id: 'drill-destination-made-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "How far are you going?"',
        answer: 'どこまでいきますか。',
        choices: ['どこにまでいきますか。', 'どこまでいきますか。', 'どこまでですかいきます。'],
      },
      {
        id: 'drill-destination-made-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: えき___あるきます。',
        answer: 'まで',
        support: 'Use まで to mark the end point of the walk.',
      },
    ],
  },
  {
    id: 'grammar-navigation-migi-hidari',
    title: 'Use simple direction lines with みぎ, ひだり, and まっすぐ',
    objective:
      'Give very short beginner navigation lines like みぎにまがります, ひだりにまがります, and まっすぐいきます.',
    explanation:
      'Use a direction phrase before the movement verb, as in みぎにまがります or ひだりにまがります. For a straight route, use まっすぐいきます. This gives you a compact beginner pattern for basic directions and movement guidance.',
    prerequisites: ['grammar-destination-made-questions'],
    tags: ['navigation', 'direction', 'movement', 'n5'],
    exampleIds: [
      'ex-migi-ni-magarimasu',
      'ex-hidari-ni-magarimasu',
      'ex-massugu-ikimasu',
      'ex-kado-o-migi-ni-magarimasu',
      'ex-hashi-o-migi-ni-magarimasu',
    ],
    commonMistakes: [
      'Leaving out に after みぎ or ひだり before まがります.',
      'Using で after the direction word instead of に.',
      'Mixing up まがります and いきます when the line is meant to say go straight.',
    ],
    drills: [
      {
        id: 'drill-navigation-migi-hidari-1',
        type: 'reorder',
        prompt: 'Reorder: みぎに / まがります',
        answer: 'みぎにまがります。',
        support: 'Put the direction phrase first, then finish with まがります.',
      },
      {
        id: 'drill-navigation-migi-hidari-2',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "Go straight."',
        answer: 'まっすぐいきます。',
        choices: ['まっすぐにまがります。', 'まっすぐいきます。', 'いきますまっすぐ。'],
      },
    ],
  },
  {
    id: 'grammar-navigation-place-answers',
    title: 'Ask where a place is and give a short answer',
    objective:
      'Ask where a place is and answer with simple navigation-friendly lines like えきはどこですか and えきはあそこです.',
    explanation:
      'Use a place as the topic, then ask どこですか or answer with ここ, そこ, or あそこ. You can also give a tiny landmark relation like えきのとなりです. This keeps navigation talk short, practical, and beginner-safe.',
    prerequisites: ['grammar-navigation-migi-hidari'],
    tags: ['navigation', 'question', 'location', 'n5'],
    exampleIds: [
      'ex-eki-wa-doko-desu-ka',
      'ex-eki-wa-asoko-desu',
      'ex-konbini-wa-eki-no-tonari-desu',
      'ex-kouen-wa-koko-no-chikaku-desu',
      'ex-kitaguchi-wa-asoko-desu',
      'ex-minamiguchi-wa-koko-desu',
      'ex-kouen-wa-kawa-no-chikaku-desu',
    ],
    commonMistakes: [
      'Dropping は after the place when the lesson is teaching the topic pattern.',
      'Using にあります when the lesson target is the shorter location-answer pattern.',
      'Mixing up ここ, そこ, and あそこ without matching the intended answer.',
    ],
    drills: [
      {
        id: 'drill-navigation-place-answers-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "Where is the station?"',
        answer: 'えきはどこですか。',
        choices: ['えきどこですか。', 'えきはどこですか。', 'どこはえきですか。'],
      },
      {
        id: 'drill-navigation-place-answers-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: えきは___です。',
        answer: 'あそこ',
        support: 'Use a short place-answer word like あそこ before です.',
      },
    ],
  },
  {
    id: 'grammar-invitation-plan-questions',
    title: 'Ask simple invitation and plan questions',
    objective:
      'Invite someone and ask simple day and time plan questions in short polite Japanese.',
    explanation:
      'Use いっしょにいきますか for a simple invitation, どようびにいきますか to check the day, and なんじにあいますか to ask what time to meet. Keep the question short, practical, and polite.',
    prerequisites: ['grammar-navigation-place-answers'],
    tags: ['invitation', 'question', 'schedule', 'n5'],
    exampleIds: [
      'ex-issho-ni-ikimasu-ka',
      'ex-doyoubi-ni-ikimasu-ka',
      'ex-nanji-ni-aimasu-ka',
      'ex-issho-ni-eigakan-ni-ikimasu-ka',
      'ex-shuumatsu-ni-resutoran-ni-ikimasu-ka',
      'ex-issho-ni-suizokukan-ni-ikimasu-ka',
      'ex-shuumatsu-ni-hakubutsukan-ni-ikimasu-ka',
    ],
    commonMistakes: [
      'Dropping に from いっしょに and turning the invitation into an unnatural fragment.',
      'Leaving out に after the time in なんじにあいますか.',
      'Adding です before か after a verb instead of ending the question with いきますか or あいますか.',
    ],
    drills: [
      {
        id: 'drill-invitation-plan-questions-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "Will you go together?"',
        answer: 'いっしょにいきますか。',
        choices: ['いっしょいきますか。', 'いっしょにいきますか。', 'いきますかいっしょに。'],
      },
      {
        id: 'drill-invitation-plan-questions-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: なんじ___あいますか。',
        answer: 'に',
        support: 'Use に after the time expression before あいますか.',
      },
    ],
  },
  {
    id: 'grammar-plan-responses-yes-no',
    title: 'Give short yes/no plan responses',
    objective:
      'Answer a simple invitation and confirm plan details with short polite response lines.',
    explanation:
      'Reply to a simple plan question with はい、いきます or いいえ、いきません. After that, confirm the plan with a short day or time line like どようびにいきます or ろくじはんにえきまえであいます.',
    prerequisites: ['grammar-invitation-plan-questions'],
    tags: ['invitation', 'response', 'schedule', 'n5'],
    exampleIds: [
      'ex-hai-ikimasu',
      'ex-iie-ikimasen',
      'ex-hai-doyoubi-ni-ikimasu',
      'ex-rokujihan-ni-ekimae-de-aimasu',
      'ex-shuumatsu-ni-eigakan-ni-ikimasu',
      'ex-hai-nichiyoubi-ni-doubutsuen-ni-ikimasu',
      'ex-hai-raishuu-matsuri-ni-ikimasu',
    ],
    commonMistakes: [
      'Keeping the question ending か in a response instead of switching to a plain polite answer.',
      'Mixing up いきます and いきません when giving a short yes or no reply.',
      'Dropping に after the time or で after the meeting place in a confirmation line.',
    ],
    drills: [
      {
        id: 'drill-plan-responses-yes-no-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural reply for "Yes, I will go."',
        answer: 'はい、いきます。',
        choices: ['はい、いきます。', 'はい、いきますか。', 'はい、いきません。'],
      },
      {
        id: 'drill-plan-responses-yes-no-2',
        type: 'reorder',
        prompt: 'Reorder: ろくじはんに / えきまえで / あいます',
        answer: 'ろくじはんにえきまえであいます。',
        support: 'Put the time phrase first, then the meeting place, then the verb.',
      },
    ],
  },
  {
    id: 'grammar-meeting-place-de-questions',
    title: 'Ask and answer where to meet with で',
    objective:
      'Ask where to meet and answer with a simple place + で + あいます pattern.',
    explanation:
      'Use どこであいますか to ask where to meet, and answer with a place plus で and あいます, like えきであいます or ひろばであいます. This keeps meeting-place coordination short, practical, and beginner-safe.',
    prerequisites: ['grammar-plan-responses-yes-no'],
    tags: ['meeting', 'particles', 'question', 'n5'],
    exampleIds: [
      'ex-doko-de-aimasu-ka',
      'ex-eki-de-aimasu',
      'ex-basutei-de-aimasu',
      'ex-hiroba-de-aimasu',
      'ex-kissaten-de-aimasu',
    ],
    commonMistakes: [
      'Using に instead of で after the meeting place when the line is showing where you meet.',
      'Dropping で completely and leaving only the place noun before あいます.',
      'Keeping the question word order but forgetting to end the sentence with あいますか.',
    ],
    drills: [
      {
        id: 'drill-meeting-place-de-questions-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "Where shall we meet?"',
        answer: 'どこであいますか。',
        choices: ['どこにあいますか。', 'どこであいますか。', 'あいますかどこで。'],
      },
      {
        id: 'drill-meeting-place-de-questions-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: えき___あいます。',
        answer: 'で',
        support: 'Use で after the meeting place before あいます.',
      },
    ],
  },
  {
    id: 'grammar-meeting-place-landmark-lines',
    title: 'Give more precise meeting-place lines',
    objective:
      'Confirm a meeting place with short landmark lines like えきまえであいます and としょかんのまえであいます.',
    explanation:
      'Once the basic place + で pattern is clear, make the place more precise with short landmarks like えきまえ, のまえ, のそば, いりぐち, and でぐち. This helps you coordinate exactly where to meet without broadening into advanced planning grammar.',
    prerequisites: ['grammar-meeting-place-de-questions'],
    tags: ['meeting', 'particles', 'location', 'n5'],
    exampleIds: [
      'ex-ekimae-de-aimasu',
      'ex-toshokan-no-mae-de-aimasu',
      'ex-kouen-no-iriguchi-de-aimasu',
      'ex-konbini-no-soba-de-aimasu',
      'ex-biru-no-deguchi-de-aimasu',
      'ex-kippu-uriba-no-mae-de-aimasu',
      'ex-annaijo-no-soba-de-aimasu',
      'ex-chuushajou-no-iriguchi-de-aimasu',
    ],
    commonMistakes: [
      'Dropping で after the final meeting-place phrase like えきまえ or いりぐち.',
      'Using の in the wrong place and breaking the short landmark phrase order.',
      'Switching back to a bare place noun when the goal is to give a more precise landmark answer.',
    ],
    drills: [
      {
        id: 'drill-meeting-place-landmark-lines-1',
        type: 'reorder',
        prompt: 'Reorder: えきまえで / あいます',
        answer: 'えきまえであいます。',
        support: 'Keep the precise meeting-place phrase together before あいます.',
      },
      {
        id: 'drill-meeting-place-landmark-lines-2',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "We will meet in front of the library."',
        answer: 'としょかんのまえであいます。',
        choices: [
          'としょかんでまえあいます。',
          'としょかんのまえであいます。',
          'まえとしょかんであいます。',
        ],
      },
    ],
  },
  {
    id: 'grammar-arrival-status-updates',
    title: 'Give short arrival and location updates',
    objective:
      'Send simple meetup status updates like つきました and いまえきです in short polite Japanese.',
    explanation:
      'When coordinating a meetup, short status lines are often enough. Use つきました to say you arrived, and use いま plus a place plus です to say where you are right now. Keep the update practical and compact.',
    prerequisites: ['grammar-meeting-place-landmark-lines'],
    tags: ['meeting', 'location', 'daily-conversation', 'n5'],
    exampleIds: [
      'ex-tsukimashita',
      'ex-mou-tsukimashita',
      'ex-ima-eki-desu',
      'ex-ima-kaisatsu-no-mae-desu',
      'ex-ima-chuouguchi-desu',
      'ex-ima-homu-desu',
      'ex-ima-machiaishitsu-desu',
    ],
    commonMistakes: [
      'Using いきます even though the speaker already arrived and should say つきました.',
      'Adding に inside a short current-location status like いまえきにです.',
      'Turning a status update into a question when the goal is simply to report where you are.',
    ],
    drills: [
      {
        id: 'drill-arrival-status-updates-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural short update for "I arrived."',
        answer: 'つきました。',
        choices: ['つきました。', 'つきます。', 'いきました。'],
      },
      {
        id: 'drill-arrival-status-updates-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: いま___です。',
        answer: 'えき',
        support: 'Use a short place noun before です to say where you are now.',
      },
    ],
  },
  {
    id: 'grammar-waiting-status-lines',
    title: 'Say you are waiting in short status lines',
    objective:
      'Use まっています in practical meetup status lines like えきでまっています and すぐいきます.',
    explanation:
      'A common beginner-safe status line is place plus で plus まっています, like えきでまっています. In the same narrow meetup context, すぐいきます is a practical follow-up when you are about to move. Treat these as compact status updates, not as a full te-form grammar expansion yet.',
    prerequisites: ['grammar-arrival-status-updates'],
    tags: ['meeting', 'verb-forms', 'location', 'n5'],
    exampleIds: [
      'ex-eki-de-matteimasu',
      'ex-higashiguchi-de-matteimasu',
      'ex-nishiguchi-de-matteimasu',
      'ex-kaisatsu-no-mae-de-matteimasu',
      'ex-sugu-ikimasu',
      'ex-noriba-de-matteimasu',
      'ex-madoguchi-no-mae-de-matteimasu',
    ],
    commonMistakes: [
      'Dropping で after the waiting place and leaving only a place noun before まっています.',
      'Using あいます instead of まっています when the speaker is describing waiting, not the actual meetup.',
      'Forgetting that すぐいきます is a short movement update, not a question.',
    ],
    drills: [
      {
        id: 'drill-waiting-status-lines-1',
        type: 'reorder',
        prompt: 'Reorder: えきで / まっています',
        answer: 'えきでまっています。',
        support: 'Keep the place phrase together before the waiting verb.',
      },
      {
        id: 'drill-waiting-status-lines-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: かいさつのまえ___まっています。',
        answer: 'で',
        support: 'Use で after the place where you are waiting.',
      },
    ],
  },
  {
    id: 'grammar-suggestion-masenka-basics',
    title: 'Invite politely with ませんか',
    objective:
      'Make polite beginner suggestions like いっしょにえいがをみませんか and ろくじにあいませんか.',
    explanation:
      'Use ませんか to invite someone politely to do something together. It is a high-value beginner pattern for suggesting a plan without sounding abrupt. Keep the lines practical: suggest a place, activity, or meeting time.',
    prerequisites: ['grammar-waiting-status-lines'],
    tags: ['invitation', 'verb-forms', 'question', 'n5'],
    exampleIds: [
      'ex-issho-ni-eiga-o-mimasen-ka',
      'ex-doyoubi-ni-kafe-ni-ikimasen-ka',
      'ex-rokuji-ni-aimasen-ka',
      'ex-konya-resutoran-ni-ikimasen-ka',
      'ex-kondo-toshokan-ni-ikimasen-ka',
      'ex-issho-ni-kouen-o-arukimasen-ka',
      'ex-kono-hon-o-yomimasen-ka',
    ],
    commonMistakes: [
      'Replacing ませんか with a plain negative line and losing the invitation meaning.',
      'Dropping に from a time or destination phrase inside the suggestion.',
      'Adding です before か after a verb instead of using the fixed polite suggestion form.',
    ],
    drills: [
      {
        id: 'drill-suggestion-masenka-basics-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "Won’t you meet at six?"',
        answer: 'ろくじにあいませんか。',
        choices: ['ろくじにあいませんか。', 'ろくじにあいますか。', 'ろくじあいませんか。'],
      },
      {
        id: 'drill-suggestion-masenka-basics-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: こんやレストランにいき___か。',
        answer: 'ません',
        support: 'Use the polite suggestion ending ませんか after the verb stem.',
      },
    ],
  },
  {
    id: 'grammar-suggestion-masenka-activities',
    title: 'Make activity suggestions with ませんか',
    objective:
      'Use ませんか with simple activities like eating, drinking, and studying together.',
    explanation:
      'Once the basic suggestion shape is clear, reuse it with practical everyday activities: コーヒーをのみませんか, ひるごはんをたべませんか, and いっしょにべんきょうしませんか. This keeps suggestion practice broad enough to feel useful without widening into advanced invitation language.',
    prerequisites: ['grammar-suggestion-masenka-basics'],
    tags: ['invitation', 'verb-forms', 'daily-conversation', 'n5'],
    exampleIds: [
      'ex-koohii-o-nomimasen-ka',
      'ex-hiru-o-tabemasen-ka',
      'ex-issho-ni-benkyoushimasen-ka',
      'ex-shuumatsu-ni-kouen-ni-ikimasen-ka',
      'ex-ashita-eigakan-ni-ikimasen-ka',
      'ex-issho-ni-ongaku-o-kikimasen-ka',
      'ex-kafe-de-hanashimasen-ka',
    ],
    commonMistakes: [
      'Changing the suggestion into a plain statement and losing the invite meaning.',
      'Dropping を before the activity noun in a verb phrase like コーヒーをのみませんか.',
      'Using broad casual suggestion forms when the lesson is staying in polite beginner Japanese.',
    ],
    drills: [
      {
        id: 'drill-suggestion-masenka-activities-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "Won’t you drink coffee?"',
        answer: 'コーヒーをのみませんか。',
        choices: [
          'コーヒーのみませんか。',
          'コーヒーをのみませんか。',
          'コーヒーをのみますかません。',
        ],
      },
      {
        id: 'drill-suggestion-masenka-activities-2',
        type: 'reorder',
        prompt: 'Reorder: いっしょに / べんきょうしませんか',
        answer: 'いっしょにべんきょうしませんか。',
        support: 'Keep いっしょに together before the polite suggestion verb.',
      },
    ],
  },
  {
    id: 'grammar-mashou-plan-proposals',
    title: 'Propose a plan with ましょう',
    objective:
      'Make short beginner plan proposals like ろくじにあいましょう and えきであいましょう.',
    explanation:
      'Use ましょう when you want to propose a plan directly and politely. It works well for meeting times, places, and simple activities. Keep the proposal short and practical so it feels like a real plan-making line, not a grammar display sentence.',
    prerequisites: ['grammar-suggestion-masenka-activities'],
    tags: ['invitation', 'verb-forms', 'schedule', 'n5'],
    exampleIds: [
      'ex-rokuji-ni-aimashou',
      'ex-doyoubi-ni-eigakan-ni-ikimashou',
      'ex-kafe-de-koohii-o-nomimashou',
      'ex-eki-de-aimashou',
      'ex-kondo-eiga-o-mimashou',
      'ex-issho-ni-kouen-o-arukimashou',
      'ex-kono-hon-o-yomimashou',
    ],
    commonMistakes: [
      'Keeping the softer ませんか pattern when the lesson target is a direct proposal with ましょう.',
      'Dropping に from the time phrase in a proposal like ろくじにあいましょう.',
      'Breaking the place phrase order before ましょう.',
    ],
    drills: [
      {
        id: 'drill-mashou-plan-proposals-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "Let’s meet at the station."',
        answer: 'えきであいましょう。',
        choices: ['えきにあいましょう。', 'えきであいましょう。', 'えきであいます。'],
      },
      {
        id: 'drill-mashou-plan-proposals-2',
        type: 'reorder',
        prompt: 'Reorder: ろくじに / あいましょう',
        answer: 'ろくじにあいましょう。',
        support: 'Keep the time phrase together before the proposal verb.',
      },
    ],
  },
  {
    id: 'grammar-mashou-plan-questions',
    title: 'Ask simple plan-shaping questions with ましょうか',
    objective:
      'Use ましょうか in short beginner planning questions like なにをしましょうか and どこであいましょうか.',
    explanation:
      'Use ましょうか when shaping the next step of a plan together. It is useful for deciding what to do, where to meet, or whether a plan sounds good. Keep it narrow and practical so it stays distinct from broader invitation grammar.',
    prerequisites: ['grammar-mashou-plan-proposals'],
    tags: ['invitation', 'verb-forms', 'question', 'n5'],
    exampleIds: [
      'ex-nani-o-shimashou-ka',
      'ex-doko-de-aimashou-ka',
      'ex-ashita-toshokan-ni-ikimashou-ka',
      'ex-konya-uchi-de-benkyoushimashou',
      'ex-shuumatsu-ni-kouen-ni-ikimashou',
      'ex-issho-ni-ongaku-o-kikimashou-ka',
      'ex-kafe-de-hanashimashou-ka',
    ],
    commonMistakes: [
      'Mixing up ましょう and ましょうか when the line is asking for a decision rather than stating one.',
      'Dropping を in なにをしましょうか and leaving the question too incomplete.',
      'Using a broad casual planning form instead of the polite beginner pattern.',
    ],
    drills: [
      {
        id: 'drill-mashou-plan-questions-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "What shall we do?"',
        answer: 'なにをしましょうか。',
        choices: ['なにしましょうか。', 'なにをしましょうか。', 'なにをしますかしょう。'],
      },
      {
        id: 'drill-mashou-plan-questions-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: どこであいましょう___。',
        answer: 'か',
        support: 'Add か at the end when the line is asking for a decision together.',
      },
    ],
  },
  {
    id: 'grammar-time-ranges-kara-made',
    title: 'Use から and まで for simple time ranges',
    objective:
      'Use から and まで in practical schedule lines like じゅぎょうはくじからです and くじからごじまでです.',
    explanation:
      'Use から to mark a starting time and まで to mark an ending time. In short planning talk, these patterns help you say when class, work, study, or a plan starts and ends. Keep the lines compact and practical so the learner hears time windows as real schedule language.',
    prerequisites: ['grammar-mashou-plan-questions'],
    tags: ['schedule', 'time', 'particles', 'n5'],
    exampleIds: [
      'ex-jugyou-wa-kuji-kara-desu',
      'ex-shigoto-wa-goji-made-desu',
      'ex-jugyou-wa-kuji-kara-juuji-made-desu',
      'ex-gogo-rokuji-kara-eiga-o-mimasu',
      'ex-kyou-wa-shichiji-made-benkyoushimasu',
      'ex-kaigi-wa-kujihan-kara-desu',
      'ex-arubaito-wa-yojihan-made-desu',
      'ex-hiruyasumi-wa-juuniji-kara-ichiji-made-desu',
      'ex-kaigi-wa-gogo-yojihan-made-desu',
      'ex-kujihan-kara-benkyoushimasu',
    ],
    commonMistakes: [
      'Mixing up から and まで so the start and end times are reversed.',
      'Dropping one side of the range in a sentence that is meant to say both the start and end.',
      'Using に instead of から when the point is the start of a time window.',
    ],
    drills: [
      {
        id: 'drill-time-ranges-kara-made-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "Class is from nine."',
        answer: 'じゅぎょうはくじからです。',
        choices: ['じゅぎょうはくじからです。', 'じゅぎょうはくじにからです。', 'じゅぎょうはくじまでからです。'],
      },
      {
        id: 'drill-time-ranges-kara-made-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: じゅぎょうはくじ___じゅうじまでです。',
        answer: 'から',
        support: 'Use から to mark the start time before the full range.',
      },
    ],
  },
  {
    id: 'grammar-time-range-questions',
    title: 'Ask simple start and end time questions',
    objective:
      'Ask practical schedule questions like なんじからですか and なんじからなんじまでですか.',
    explanation:
      'Once the basic time-range pattern is clear, use it in short questions. These lines are high-value for checking start time, end time, or the full time window of a class, plan, or appointment. Keep the questions narrow and context-friendly.',
    prerequisites: ['grammar-time-ranges-kara-made'],
    tags: ['schedule', 'question', 'time', 'n5'],
    exampleIds: [
      'ex-nanji-kara-desu-ka',
      'ex-nanji-made-desu-ka',
      'ex-nanji-kara-nanji-made-desu-ka',
      'ex-kuji-kara-desu',
      'ex-kuji-kara-goji-made-desu',
    ],
    commonMistakes: [
      'Dropping the second なんじ in なんじからなんじまでですか.',
      'Turning the time-range question into a plain statement by forgetting か.',
      'Using only まで when asking for the full start-to-end window.',
    ],
    drills: [
      {
        id: 'drill-time-range-questions-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural question for "From what time until what time is it?"',
        answer: 'なんじからなんじまでですか。',
        choices: ['なんじからなんじまでですか。', 'なんじからまでですか。', 'なんじまでなんじからですか。'],
      },
      {
        id: 'drill-time-range-questions-2',
        type: 'reorder',
        prompt: 'Reorder: なんじから / ですか',
        answer: 'なんじからですか。',
        support: 'Keep the question word with から before the short ですか ending.',
      },
    ],
  },
  {
    id: 'grammar-calendar-when-questions',
    title: 'Ask when something happens',
    objective:
      'Use practical date-planning questions like いつあいますか and なんがつにいきますか.',
    explanation:
      'Use いつ for a broad "when?" question and なんがつに for a month-based question. These patterns are useful when moving from loose plan talk into actual calendar planning. Keep the topic practical: meetings, outings, and simple schedule decisions.',
    prerequisites: ['grammar-time-range-questions'],
    tags: ['calendar', 'question', 'schedule', 'n5'],
    exampleIds: [
      'ex-itsu-aimasu-ka',
      'ex-nangatsu-ni-ikimasu-ka',
      'ex-shigatsu-ni-aimasu',
      'ex-gogatsu-ni-toshokan-ni-ikimasu',
      'ex-raigetsu-ni-yasumimasu',
      'ex-shichigatsu-ni-eiga-o-mimasu',
      'ex-hachigatsu-ni-toshokan-ni-ikimasu',
    ],
    commonMistakes: [
      'Using なんじ when the question is about the day or month, not the clock time.',
      'Dropping に after the month phrase in a line like なんがつにいきますか.',
      'Answering a broad いつ question with a mismatched time-only answer when the context is date planning.',
    ],
    drills: [
      {
        id: 'drill-calendar-when-questions-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural question for "When shall we meet?"',
        answer: 'いつあいますか。',
        choices: ['いつあいますか。', 'なんじあいますか。', 'いつにあいますか。'],
      },
      {
        id: 'drill-calendar-when-questions-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: なんがつ___いきますか。',
        answer: 'に',
        support: 'Use に after the month question when asking when someone will go.',
      },
    ],
  },
  {
    id: 'grammar-calendar-date-lines',
    title: 'Use simple month and day-of-month lines',
    objective:
      'Use month and date lines like しがつみっかにあいます and ごがつようかにとしょかんにいきます.',
    explanation:
      'After asking when something happens, answer with a month or a specific day of the month. Keep the date lines practical and tied to simple plans. This pack does not try to teach every calendar edge case at once; it builds a small, usable date set.',
    prerequisites: ['grammar-calendar-when-questions'],
    tags: ['calendar', 'schedule', 'time', 'n5'],
    exampleIds: [
      'ex-nannichi-ni-aimasu-ka',
      'ex-shigatsu-mikka-ni-aimasu',
      'ex-gogatsu-youka-ni-toshokan-ni-ikimasu',
      'ex-rokugatsu-tooka-ni-eiga-o-mimasu',
      'ex-raigetsu-futsuka-ni-kafe-ni-ikimasu',
      'ex-shichigatsu-kokonoka-ni-aimasu',
      'ex-hachigatsu-hatsuka-ni-kafe-ni-ikimasu',
    ],
    commonMistakes: [
      'Dropping に after the date phrase when the date is marking when the action happens.',
      'Confusing the month reading with the day-of-month reading in longer date lines.',
      'Using a weekday answer when the question is specifically asking for the day of the month.',
    ],
    drills: [
      {
        id: 'drill-calendar-date-lines-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "We will meet on April third."',
        answer: 'しがつみっかにあいます。',
        choices: ['しがつみっかにあいます。', 'しがつにみっかあいます。', 'しがつみっかあいますに。'],
      },
      {
        id: 'drill-calendar-date-lines-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: なんにち___あいますか。',
        answer: 'に',
        support: 'Use に after the date question when you are asking on which day something happens.',
      },
    ],
  },
  {
    id: 'grammar-calendar-appointment-lines',
    title: 'Combine dates and times in appointment lines',
    objective:
      'Build fuller plan lines like しがつみっかのろくじにあいます and ごがつようかのくじからべんきょうします.',
    explanation:
      'Use date plus の plus time to build a fuller calendar line. This lets the learner move from simple date answers into real appointment details. Keep the combination narrow: one date phrase, one time phrase, then one familiar action.',
    prerequisites: ['grammar-calendar-date-lines'],
    tags: ['calendar', 'schedule', 'meeting', 'n5'],
    exampleIds: [
      'ex-shigatsu-mikka-no-rokuji-ni-aimasu',
      'ex-raigetsu-futsuka-no-gogo-shichiji-ni-eki-de-aimasu',
      'ex-gogatsu-youka-no-kuji-kara-benkyoushimasu',
      'ex-shigatsu-mikka-no-rokuji-kara-eiga-o-mimasu',
      'ex-rokugatsu-tooka-no-gogo-rokuji-made-eki-de-matteimasu',
      'ex-shichigatsu-kokonoka-no-gogo-rokuji-ni-konsaato-o-mimasu',
      'ex-hachigatsu-hatsuka-no-gogo-shichiji-ni-paatii-ni-ikimasu',
      'ex-yakusoku-wa-shichigatsu-kokonoka-no-gozen-kuji-desu',
      'ex-raigetsu-futsuka-no-gozen-kuji-ni-shiyakusho-ni-ikimasu',
    ],
    commonMistakes: [
      'Dropping の between the date phrase and the time phrase.',
      'Putting に directly after the date even though the sentence is using date plus の plus time.',
      'Trying to add too many details beyond one date and one time phrase in this beginner pattern.',
    ],
    drills: [
      {
        id: 'drill-calendar-appointment-lines-1',
        type: 'reorder',
        prompt: 'Reorder: しがつみっかの / ろくじに / あいます',
        answer: 'しがつみっかのろくじにあいます。',
        support: 'Keep the date phrase and time phrase together before the meeting verb.',
      },
      {
        id: 'drill-calendar-appointment-lines-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: しがつみっか___ろくじにあいます。',
        answer: 'の',
        support: 'Use の between the date and time phrases in this appointment pattern.',
      },
    ],
  },
  {
    id: 'grammar-calendar-plan-combination',
    title: 'Use full calendar details in invitations and proposals',
    objective:
      'Recombine dates, times, and simple plan language in lines like しがつみっかのろくじにあいましょう and いつあいましょうか.',
    explanation:
      'This lesson recombines the recent planning lane instead of adding a broad new grammar family. Use dates, times, and familiar invitation shapes to make fuller plans that still feel beginner-safe. The goal is not more grammar sprawl. The goal is better control over plans.',
    prerequisites: ['grammar-calendar-appointment-lines'],
    tags: ['calendar', 'invitation', 'proposal', 'n5'],
    exampleIds: [
      'ex-itsu-aimashou-ka',
      'ex-shigatsu-mikka-no-rokuji-ni-aimashou',
      'ex-gogatsu-youka-ni-toshokan-ni-ikimashou-ka',
      'ex-raigetsu-futsuka-no-gogo-shichiji-ni-eiga-o-mimasen-ka',
      'ex-rokugatsu-tooka-no-kuji-kara-benkyoushimashou',
      'ex-shichigatsu-kokonoka-no-gogo-rokuji-ni-konsaato-o-mimasu',
      'ex-raigetsu-futsuka-no-gozen-kuji-ni-shiyakusho-ni-ikimasu',
    ],
    commonMistakes: [
      'Forgetting the invitation or proposal ending after building a longer date-and-time phrase.',
      'Mixing ませんか and ましょう randomly instead of choosing the intended plan tone.',
      'Dropping a key particle like に after the time phrase once the sentence gets longer.',
    ],
    drills: [
      {
        id: 'drill-calendar-plan-combination-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "Shall we meet on April third at six?"',
        answer: 'しがつみっかのろくじにあいましょうか。',
        choices: [
          'しがつみっかのろくじにあいましょうか。',
          'しがつみっかにろくじのあいましょうか。',
          'しがつみっかのろくじあいましょうかに。',
        ],
      },
      {
        id: 'drill-calendar-plan-combination-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: いつあいましょう___。',
        answer: 'か',
        support: 'Add か at the end when the line is asking for the plan detail together.',
      },
    ],
  },
  {
    id: 'grammar-quantity-ikutsu-questions',
    title: 'Ask how many with いくつ',
    objective:
      'Use いくつ in simple shopping questions like いくつかいますか and りんごをいくつかいますか.',
    explanation:
      'Use いくつ to ask how many items someone will buy or wants. Keep the pattern practical and shopping-focused so it stays connected to real beginner transactions. This pack introduces a small set of general counters without widening into a full counter system.',
    prerequisites: ['grammar-calendar-plan-combination'],
    tags: ['shopping', 'question', 'quantity', 'n5'],
    exampleIds: [
      'ex-ikutsu-kaimasu-ka',
      'ex-ringo-o-ikutsu-kaimasu-ka',
      'ex-ringo-o-hitotsu-kaimasu',
      'ex-ringo-o-futatsu-kaimasu',
      'ex-ringo-o-itsutsu-kaimasu',
      'ex-banana-o-hitotsu-kaimasu',
      'ex-mikan-o-futatsu-kaimasu',
      'ex-tomato-o-mittsu-kaimasu',
    ],
    commonMistakes: [
      'Dropping いくつ and turning the line into a plain buying statement instead of a quantity question.',
      'Forgetting を before the item in a sentence like りんごをいくつかいますか.',
      'Mixing the question line and the answer line so the sentence contains both いくつ and a counter answer at once.',
    ],
    drills: [
      {
        id: 'drill-quantity-ikutsu-questions-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural question for "How many apples will you buy?"',
        answer: 'りんごをいくつかいますか。',
        choices: [
          'りんごをいくつかいますか。',
          'りんごいくつをかいますか。',
          'りんごをいくつですか。',
        ],
      },
      {
        id: 'drill-quantity-ikutsu-questions-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: りんごを___かいますか。',
        answer: 'いくつ',
        support: 'Use いくつ right before かいますか when asking the quantity.',
      },
    ],
  },
  {
    id: 'grammar-quantity-request-lines',
    title: 'Use simple counters in request lines',
    objective:
      'Use short request lines like ひとつください and パンをみっつください.',
    explanation:
      'After asking how many, answer with a small set of general counters like ひとつ, ふたつ, and みっつ. In a shop, these counters work well in compact request lines with ください. Keep the requests practical and short.',
    prerequisites: ['grammar-quantity-ikutsu-questions'],
    tags: ['shopping', 'request', 'quantity', 'n5'],
    exampleIds: [
      'ex-hitotsu-kudasai',
      'ex-futatsu-kudasai',
      'ex-mittsu-kudasai',
      'ex-pan-o-mittsu-kudasai',
      'ex-okashi-o-yottsu-kudasai',
      'ex-sandoicchi-o-hitotsu-kudasai',
      'ex-suupu-o-futatsu-kudasai',
    ],
    commonMistakes: [
      'Leaving out ください when the lesson target is a request line rather than a plain statement.',
      'Placing the counter after ください instead of before it.',
      'Dropping を in a full item-request line like パンをみっつください.',
    ],
    drills: [
      {
        id: 'drill-quantity-request-lines-1',
        type: 'reorder',
        prompt: 'Reorder: パンを / みっつください',
        answer: 'パンをみっつください。',
        support: 'Keep the item first, then the counter, then ください.',
      },
      {
        id: 'drill-quantity-request-lines-2',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "Two, please."',
        answer: 'ふたつください。',
        choices: ['ふたつください。', 'くださいふたつ。', 'ふたつをくださいです。'],
      },
    ],
  },
  {
    id: 'grammar-price-ikura-questions',
    title: 'Ask the price with いくらですか',
    objective:
      'Use simple price questions like これはいくらですか and パンはいくらですか.',
    explanation:
      'Use いくらですか to ask how much something costs. Keep the question compact and tied to familiar shop items so the learner can hear and use price questions without extra transaction grammar.',
    prerequisites: ['grammar-quantity-request-lines'],
    tags: ['shopping', 'question', 'price', 'n5'],
    exampleIds: [
      'ex-kore-wa-ikura-desu-ka',
      'ex-pan-wa-ikura-desu-ka',
      'ex-kono-hon-wa-ikura-desu-ka',
      'ex-kore-wa-hyaku-en-desu',
      'ex-pan-wa-nihyaku-en-desu',
      'ex-boushi-wa-ikura-desu-ka',
      'ex-boushi-wa-sanbyaku-en-desu',
    ],
    commonMistakes: [
      'Dropping は in a line like これはいくらですか when the item is the topic of the price question.',
      'Using なに instead of いくら when the question is about price rather than identity.',
      'Turning the question into a statement by forgetting か.',
    ],
    drills: [
      {
        id: 'drill-price-ikura-questions-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural question for "How much is this?"',
        answer: 'これはいくらですか。',
        choices: ['これはいくらですか。', 'これをいくらですか。', 'これはいくらかいますか。'],
      },
      {
        id: 'drill-price-ikura-questions-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: パンは___ですか。',
        answer: 'いくら',
        support: 'Use いくら before ですか when asking the price.',
      },
    ],
  },
  {
    id: 'grammar-price-yen-lines',
    title: 'Answer with simple 円 price lines',
    objective:
      'Use short price answers like これはひゃくえんです and このほんはごひゃくえんです.',
    explanation:
      'After asking the price, answer with a fixed price expression plus です. Keep the number set small and practical so the pack stays usable without turning into a full number system lesson.',
    prerequisites: ['grammar-price-ikura-questions'],
    tags: ['shopping', 'price', 'copula', 'n5'],
    exampleIds: [
      'ex-kore-wa-hyaku-en-desu',
      'ex-pan-wa-nihyaku-en-desu',
      'ex-ringo-wa-sanbyaku-en-desu',
      'ex-kono-hon-wa-gohyaku-en-desu',
      'ex-kono-kaban-wa-sen-en-desu',
      'ex-boushi-wa-sanbyaku-en-desu',
      'ex-seetaa-wa-sen-en-desu',
      'ex-shatsu-wa-gohyaku-en-desu',
      'ex-taoru-wa-nihyaku-en-desu',
    ],
    commonMistakes: [
      'Dropping えん from a price answer and leaving only the number.',
      'Using the question line いくらですか instead of answering with a fixed price.',
      'Forgetting です at the end of the polite price answer.',
    ],
    drills: [
      {
        id: 'drill-price-yen-lines-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "This is one hundred yen."',
        answer: 'これはひゃくえんです。',
        choices: ['これはひゃくえんです。', 'これはひゃくですえん。', 'これをひゃくえんです。'],
      },
      {
        id: 'drill-price-yen-lines-2',
        type: 'reorder',
        prompt: 'Reorder: このほんは / ごひゃくえんです',
        answer: 'このほんはごひゃくえんです。',
        support: 'Keep the item topic first, then the price answer.',
      },
    ],
  },
  {
    id: 'grammar-shopping-availability-arimasu-ka',
    title: 'Ask if an item is available with ありますか',
    objective:
      'Use practical store questions like みずはありますか and このほんはありますか.',
    explanation:
      'Use item plus は plus ありますか to ask whether something is available. This is a high-value beginner shop pattern because it extends the earlier existence grammar into a practical buying context.',
    prerequisites: ['grammar-price-yen-lines'],
    tags: ['shopping', 'question', 'availability', 'n5'],
    exampleIds: [
      'ex-mizu-wa-arimasu-ka',
      'ex-pan-wa-arimasu-ka',
      'ex-kono-hon-wa-arimasu-ka',
      'ex-ringo-wa-arimasu-ka',
      'ex-hai-arimasu',
      'ex-yoguruto-wa-arimasu-ka',
      'ex-chiizu-wa-arimasu-ka',
      'ex-shanpuu-wa-arimasu-ka',
    ],
    commonMistakes: [
      'Using を instead of は when the item is the topic of the availability question.',
      'Treating ありますか like a movement verb instead of an existence/availability pattern.',
      'Dropping か and turning the line into a plain statement.',
    ],
    drills: [
      {
        id: 'drill-shopping-availability-arimasu-ka-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "Do you have water?"',
        answer: 'みずはありますか。',
        choices: ['みずはありますか。', 'みずをありますか。', 'みずはあります。か'],
      },
      {
        id: 'drill-shopping-availability-arimasu-ka-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: このほん___ありますか。',
        answer: 'は',
        support: 'Use は after the item when asking if it is available.',
      },
    ],
  },
  {
    id: 'grammar-shopping-selection-korede-ii-desu',
    title: 'Choose and confirm with short shop lines',
    objective:
      'Use short selection lines like それをください, これでいいです, and もうひとつください.',
    explanation:
      'Once the learner can ask for quantity and price, add short shop-decision lines. These compact expressions let the learner choose an item, confirm it is fine, or ask for one more without widening into broader service talk.',
    prerequisites: ['grammar-shopping-availability-arimasu-ka'],
    tags: ['shopping', 'request', 'decision', 'n5'],
    exampleIds: [
      'ex-sore-o-kudasai',
      'ex-korede-ii-desu',
      'ex-mou-hitotsu-kudasai',
      'ex-ringo-o-hitotsu-kudasai',
      'ex-pan-o-futatsu-kudasai',
      'ex-koppu-o-hitotsu-kudasai',
    ],
    commonMistakes: [
      'Using これをいいです instead of the fixed expression これでいいです.',
      'Dropping を in それをください when directly requesting the chosen item.',
      'Forgetting that もうひとつください is a request for one more item, not a quantity answer by itself.',
    ],
    drills: [
      {
        id: 'drill-shopping-selection-korede-ii-desu-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "This is fine."',
        answer: 'これでいいです。',
        choices: ['これでいいです。', 'これをいいです。', 'これでいいかいます。'],
      },
      {
        id: 'drill-shopping-selection-korede-ii-desu-2',
        type: 'reorder',
        prompt: 'Reorder: もうひとつ / ください',
        answer: 'もうひとつください。',
        support: 'Keep the fixed expression together before ください.',
      },
    ],
  },
  {
    id: 'grammar-te-form-core-familiar-verbs',
    title: 'Use て-form on a tiny familiar verb set',
    objective:
      'Use a small beginner-safe set of て-form verbs inside familiar request and permission lines.',
    explanation:
      'This pack keeps て-form intentionally narrow. Start with easy familiar verbs like たべて, みて, and べんきょうして, then use them in patterns you already know well: てください and てもいいですか. The goal is not full conjugation coverage yet. It is to make て-form feel readable and usable on a small, practical verb set.',
    prerequisites: ['grammar-permission-temo-ii-desu-ka', 'grammar-request-te-kudasai'],
    tags: ['verb-forms', 'te-form', 'request', 'permission', 'n5'],
    exampleIds: [
      'ex-pan-o-tabete-kudasai',
      'ex-kono-eiga-o-mite-kudasai',
      'ex-uchi-de-benkyoushite-kudasai',
      'ex-pan-o-tabete-mo-ii-desu-ka',
      'ex-eiga-o-mite-mo-ii-desu-ka',
      'ex-nihongo-de-hanashite-kudasai',
    ],
    commonMistakes: [
      'Leaving the verb in ます-form and writing パンをたべますください instead of パンをたべてください.',
      'Mixing the two familiar patterns and ending a request line with てもいいですか by mistake.',
      'Dropping the object marker を in short lines like このえいがをみてください.',
    ],
    drills: [
      {
        id: 'drill-te-form-core-familiar-verbs-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "Please eat the bread."',
        answer: 'パンをたべてください。',
        choices: [
          'パンをたべてください。',
          'パンをたべますください。',
          'パンはたべてです。',
        ],
      },
      {
        id: 'drill-te-form-core-familiar-verbs-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: このえいがを___ください。',
        answer: 'みて',
        support: 'Use the て-form みて before ください.',
      },
    ],
  },
  {
    id: 'grammar-te-form-core-sound-change-basics',
    title: 'Recognize the first て-form sound changes',
    objective:
      'Recognize common beginner て-form changes like のみます→のんで and いきます→いって.',
    explanation:
      'Some て-forms change sound instead of simply swapping the ending. Keep this set small and high-value: のんで, よんで, いって, かって, and まって. For now, treat them as practical chunks inside short beginner lines instead of trying to generalize every verb family at once.',
    prerequisites: ['grammar-te-form-core-familiar-verbs'],
    tags: ['verb-forms', 'te-form', 'request', 'permission', 'n5'],
    exampleIds: [
      'ex-koohii-o-nonde-kudasai',
      'ex-kono-hon-o-yonde-kudasai',
      'ex-eki-ni-itte-mo-ii-desu-ka',
      'ex-kore-o-katte-kudasai',
      'ex-koko-de-matte-kudasai',
      'ex-ongaku-o-kiite-kudasai',
      'ex-kouen-o-aruite-mo-ii-desu-ka',
      'ex-namae-o-kaite-kudasai',
    ],
    commonMistakes: [
      'Writing のみて or よみて instead of the actual て-form chunks のんで and よんで.',
      'Changing いきます to いきて instead of いって.',
      'Dropping で after ここ in a line like ここでまってください.',
    ],
    drills: [
      {
        id: 'drill-te-form-core-sound-change-basics-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "May I go to the station?"',
        answer: 'えきにいってもいいですか。',
        choices: [
          'えきにいってもいいですか。',
          'えきにいきてもいいですか。',
          'えきをいってもいいですか。',
        ],
      },
      {
        id: 'drill-te-form-core-sound-change-basics-2',
        type: 'reorder',
        prompt: 'Reorder: これを / かってください',
        answer: 'これをかってください。',
        support: 'Keep the object first, then use the て-form request chunk かってください.',
      },
    ],
  },
  {
    id: 'grammar-action-sequence-te-sorekara',
    title: 'Link short actions with て and それから',
    objective:
      'Describe a simple two-step action chain with a て-form verb followed by それから.',
    explanation:
      'Use a first action in て-form, then add それから before the next sentence part. This gives the learner a clear, beginner-safe way to describe short action chains without jumping into long, dense sequencing grammar.',
    prerequisites: ['grammar-te-form-core-sound-change-basics'],
    tags: ['verb-forms', 'sequence', 'daily-routine', 'n5'],
    exampleIds: [
      'ex-asa-pan-o-tabete-sorekara-gakkou-ni-ikimasu',
      'ex-kafe-de-koohii-o-nonde-sorekara-benkyoushimasu',
      'ex-hon-o-yonde-sorekara-nemasu',
      'ex-eki-ni-itte-sorekara-densha-ni-norimasu',
      'ex-ringo-o-katte-sorekara-uchi-ni-ikimasu',
      'ex-uchi-ni-kaette-sorekara-hon-o-yomimasu',
      'ex-mado-o-akete-sorekara-benkyoushimasu',
    ],
    commonMistakes: [
      'Leaving the first verb in ます-form instead of switching it to て-form before それから.',
      'Dropping それから and turning the line into a single unfinished action chunk.',
      'Mixing the order of the two actions so the sentence does not reflect the intended sequence.',
    ],
    drills: [
      {
        id: 'drill-action-sequence-te-sorekara-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "I eat bread, then go to school."',
        answer: 'あさパンをたべて、それからがっこうにいきます。',
        choices: [
          'あさパンをたべて、それからがっこうにいきます。',
          'あさパンをたべます、それからがっこうにいきます。',
          'あさパンをたべて、がっこうそれからにいきます。',
        ],
      },
      {
        id: 'drill-action-sequence-te-sorekara-2',
        type: 'reorder',
        prompt: 'Reorder: えきにいって、 / それからでんしゃにのります',
        answer: 'えきにいって、それからでんしゃにのります。',
        support: 'Put the first action in て-form, then add それから before the second action.',
      },
    ],
  },
  {
    id: 'grammar-action-sequence-tekara',
    title: 'Use てから for after-that order',
    objective:
      'Use てから to say that one action happens after another, as in たべてからいきます.',
    explanation:
      'Use てから when the order is important: first action, then second action. This stays close to familiar daily actions so the learner can feel the sequencing difference between a simple chain with それから and a tighter after-that pattern with てから.',
    prerequisites: ['grammar-action-sequence-te-sorekara'],
    tags: ['verb-forms', 'sequence', 'daily-routine', 'n5'],
    exampleIds: [
      'ex-asa-pan-o-tabete-kara-gakkou-ni-ikimasu',
      'ex-koohii-o-nonde-kara-benkyoushimasu',
      'ex-hon-o-yonde-kara-nemasu',
      'ex-toshokan-ni-itte-kara-hon-o-yomimasu',
      'ex-ringo-o-katte-kara-kafe-ni-ikimasu',
      'ex-asa-okite-kara-koohii-o-nomimasu',
      'ex-denki-o-keshite-kara-nemasu',
    ],
    commonMistakes: [
      'Using から without first changing the verb to て-form.',
      'Placing から at the very end of the sentence instead of right after the first action.',
      'Dropping the second verb and leaving the line incomplete after てから.',
    ],
    drills: [
      {
        id: 'drill-action-sequence-tekara-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "I drink coffee and then study."',
        answer: 'コーヒーをのんでからべんきょうします。',
        choices: [
          'コーヒーをのんでからべんきょうします。',
          'コーヒーをのみますからべんきょうします。',
          'コーヒーをのんでべんきょうしてからです。',
        ],
      },
      {
        id: 'drill-action-sequence-tekara-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: ほんをよんで___ねます。',
        answer: 'から',
        support: 'Use てから to show that sleeping happens after reading.',
      },
    ],
  },
  {
    id: 'grammar-progressive-actions-teimasu',
    title: 'Describe what is happening now with ています',
    objective:
      'Use ています for a small set of current-action lines like いまほんをよんでいます.',
    explanation:
      'After learning a small て-form core, move into a very limited set of ています lines for actions happening now. Keep the verb set familiar and practical: reading, drinking, studying, buying, and waiting.',
    prerequisites: ['grammar-action-sequence-tekara'],
    tags: ['verb-forms', 'progressive', 'current-state', 'n5'],
    exampleIds: [
      'ex-ima-hon-o-yondeimasu',
      'ex-ima-koohii-o-nondeimasu',
      'ex-ima-nihongo-o-benkyoushiteimasu',
      'ex-ima-pan-o-katteimasu',
      'ex-ima-eki-de-matteimasu',
      'ex-ima-eiga-o-miteimasu',
      'ex-ima-tomodachi-to-hanashiteimasu',
    ],
    commonMistakes: [
      'Stopping at the て-form chunk and forgetting to add います.',
      'Dropping いま when the lesson prompt is specifically about what is happening now.',
      'Using a plain ます line like よみます instead of the ongoing-action line よんでいます.',
    ],
    drills: [
      {
        id: 'drill-progressive-actions-teimasu-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "I am reading a book now."',
        answer: 'いまほんをよんでいます。',
        choices: [
          'いまほんをよんでいます。',
          'いまほんをよんでです。',
          'いまほんをよみますいます。',
        ],
      },
      {
        id: 'drill-progressive-actions-teimasu-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: いまにほんごを___います。',
        answer: 'べんきょうして',
        support: 'Use the て-form chunk べんきょうして before います.',
      },
    ],
  },
  {
    id: 'grammar-progressive-states-teimasu',
    title: 'Use ています for status and stable present lines',
    objective:
      'Use carefully limited ています lines for waiting status, living somewhere, and ongoing study habits.',
    explanation:
      'This lesson keeps ています narrow but useful. Some lines describe a current status like いまえきでまっています. Others describe a stable present situation like とうきょうにすんでいます or まいにちにほんごをべんきょうしています. The pattern is the same, but the meaning can be current or ongoing depending on the verb and context.',
    prerequisites: ['grammar-progressive-actions-teimasu'],
    tags: ['verb-forms', 'progressive', 'status', 'n5'],
    exampleIds: [
      'ex-toukyou-ni-sundeimasu',
      'ex-ima-kaisatsu-no-mae-de-matteimasu',
      'ex-ima-toshokan-de-hon-o-yondeimasu',
      'ex-ima-kafe-de-koohii-o-nondeimasu',
      'ex-mainichi-nihongo-o-benkyoushiteimasu',
      'ex-mainichi-ongaku-o-kiiteimasu',
      'ex-ima-kouen-o-aruiteimasu',
    ],
    commonMistakes: [
      'Using に incorrectly after a waiting place when the pattern needs で, as in えきでまっています.',
      'Dropping ています and falling back to a plain present-tense line when the prompt is about an ongoing state.',
      'Treating every ています line as only happening right now, even in a stable-present line like とうきょうにすんでいます.',
    ],
    drills: [
      {
        id: 'drill-progressive-states-teimasu-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "I live in Tokyo."',
        answer: 'とうきょうにすんでいます。',
        choices: [
          'とうきょうにすんでいます。',
          'とうきょうですんでいます。',
          'とうきょうにすみますいます。',
        ],
      },
      {
        id: 'drill-progressive-states-teimasu-2',
        type: 'reorder',
        prompt: 'Reorder: いまえきで / まっています',
        answer: 'いまえきでまっています。',
        support: 'Keep the time word first, then the waiting place with で, then まっています.',
      },
    ],
  },
  {
    id: 'grammar-adjective-negatives-i',
    title: 'Make い-adjectives negative with くないです',
    objective:
      'Use short negative い-adjective lines like おもしろくないです and たかくないです.',
    explanation:
      'For a small beginner-safe set of い-adjectives, change the ending to くないです to make the description negative. Keep the pattern practical and concrete with familiar things like books, cameras, bags, restaurants, and tea.',
    prerequisites: ['grammar-adjectives-predicates'],
    tags: ['adjectives', 'negative', 'description', 'n5'],
    exampleIds: [
      'ex-hon-omoshirokunai-desu',
      'ex-kaban-ookikunai-desu',
      'ex-kamera-atarashikunai-desu',
      'ex-heya-hirokunai-desu',
      'ex-resutoran-takakunai-desu',
      'ex-kono-kaban-atarashikunai-desu',
      'ex-kono-pan-oishikunai-desu',
      'ex-kono-kaban-ookikunai-desu',
      'ex-kono-heya-hirokunai-desu',
    ],
    commonMistakes: [
      'Leaving the adjective in its positive form and only adding ない at the end of the sentence.',
      'Using じゃないです with an い-adjective instead of changing it to くないです.',
      'Dropping です when the lesson target is still polite beginner Japanese.',
    ],
    drills: [
      {
        id: 'drill-adjective-negatives-i-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "The book is not interesting."',
        answer: 'ほんはおもしろくないです。',
        choices: [
          'ほんはおもしろくないです。',
          'ほんはおもしろいじゃないです。',
          'ほんはおもしろいないです。',
        ],
      },
      {
        id: 'drill-adjective-negatives-i-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: レストランはたか___です。',
        answer: 'くない',
        support: 'For an い-adjective negative, change い to くない before です.',
      },
    ],
  },
  {
    id: 'grammar-adjective-negatives-na',
    title: 'Make な-adjectives negative with じゃないです',
    objective:
      'Use short negative な-adjective lines like しずかじゃないです and きれいじゃないです.',
    explanation:
      'For a small beginner-safe set of な-adjectives, use じゃないです to make the description negative. This gives the learner a practical contrast with い-adjective negatives without widening into broader plain-style adjective work.',
    prerequisites: ['grammar-adjective-negatives-i'],
    tags: ['adjectives', 'negative', 'description', 'n5'],
    exampleIds: [
      'ex-heya-shizuka-janai-desu',
      'ex-mise-kirei-janai-desu',
      'ex-kafe-shizuka-janai-desu',
      'ex-resutoran-kirei-janai-desu',
      'ex-hito-shizuka-janai-desu',
      'ex-kono-kafe-kirei-janai-desu',
    ],
    commonMistakes: [
      'Using くないです on a な-adjective like しずか.',
      'Leaving out じゃ and writing しずかないです instead of しずかじゃないです.',
      'Mixing a noun-description pattern with a predicate pattern and inserting な before じゃないです.',
    ],
    drills: [
      {
        id: 'drill-adjective-negatives-na-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "The room is not quiet."',
        answer: 'へやはしずかじゃないです。',
        choices: [
          'へやはしずかじゃないです。',
          'へやはしずかくないです。',
          'へやはしずかなじゃないです。',
        ],
      },
      {
        id: 'drill-adjective-negatives-na-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: みせはきれい___です。',
        answer: 'じゃない',
        support: 'For a な-adjective negative, use じゃない before です.',
      },
    ],
  },
  {
    id: 'grammar-adjective-past-i',
    title: 'Use い-adjective past lines with かったです',
    objective:
      'Use short past い-adjective lines like おもしろかったです and おいしかったです.',
    explanation:
      'To talk about a past impression or condition with an い-adjective, change the ending to かったです. Keep the situations concrete and easy to picture: books, bags, cameras, bread, and restaurants.',
    prerequisites: ['grammar-adjective-negatives-na'],
    tags: ['adjectives', 'past-description', 'description', 'n5'],
    exampleIds: [
      'ex-hon-omoshirokatta-desu',
      'ex-kaban-ookikatta-desu',
      'ex-kamera-atarashikatta-desu',
      'ex-pan-oishikatta-desu',
      'ex-resutoran-takakatta-desu',
      'ex-jugyou-wa-nagakatta-desu',
      'ex-kaigi-wa-mijikakatta-desu',
      'ex-ryokou-wa-tanoshikatta-desu',
    ],
    commonMistakes: [
      'Keeping the adjective in present form and only adding でした at the end.',
      'Using じゃなかったです on an い-adjective instead of changing it to かったです.',
      'Dropping the topic marker は in a sentence that is still a simple adjective predicate.',
    ],
    drills: [
      {
        id: 'drill-adjective-past-i-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "The bread was tasty."',
        answer: 'パンはおいしかったです。',
        choices: [
          'パンはおいしかったです。',
          'パンはおいしいでした。',
          'パンはおいしかです。',
        ],
      },
      {
        id: 'drill-adjective-past-i-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: ほんはおもしろ___です。',
        answer: 'かった',
        support: 'Change the い-adjective ending to かった before です.',
      },
    ],
  },
  {
    id: 'grammar-adjective-past-na',
    title: 'Use な-adjective past lines with でした',
    objective:
      'Use short past な-adjective lines like しずかでした and きれいでした.',
    explanation:
      'For a past description with a な-adjective, keep the adjective and finish with でした. This lets the learner talk about past rooms, shops, cafes, and people without jumping into longer recall language.',
    prerequisites: ['grammar-adjective-past-i'],
    tags: ['adjectives', 'past-description', 'description', 'n5'],
    exampleIds: [
      'ex-heya-shizuka-deshita',
      'ex-mise-kirei-deshita',
      'ex-kafe-shizuka-deshita',
      'ex-heya-kirei-deshita',
      'ex-toshokan-shizuka-deshita',
      'ex-shiken-wa-kantan-deshita',
      'ex-hoteru-wa-benri-deshita',
    ],
    commonMistakes: [
      'Using かったです with a な-adjective like しずか.',
      'Dropping で and writing しずかした instead of しずかでした.',
      'Confusing a past description with a present one and leaving the sentence as しずかです.',
    ],
    drills: [
      {
        id: 'drill-adjective-past-na-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "The shop was pretty."',
        answer: 'みせはきれいでした。',
        choices: [
          'みせはきれいでした。',
          'みせはきれいかったです。',
          'みせはきれいですた。',
        ],
      },
      {
        id: 'drill-adjective-past-na-2',
        type: 'reorder',
        prompt: 'Reorder: へやは / しずかでした',
        answer: 'へやはしずかでした。',
        support: 'Keep the topic first, then the short past description.',
      },
    ],
  },
  {
    id: 'grammar-comparison-yori-houga-adjectives',
    title: 'Compare things with より and のほうが',
    objective:
      'Use short adjective comparisons like AよりBのほうがしずかです and AよりBのほうがやすいです.',
    explanation:
      'To compare two things, put A first with より, then Bのほうが, then the description. Keep the pairings practical and easy to imagine: library versus station, cafe versus restaurant, bus versus train.',
    prerequisites: ['grammar-adjective-past-na'],
    tags: ['comparison', 'particles', 'adjectives', 'n5'],
    exampleIds: [
      'ex-hon-yori-eiga-no-hou-ga-omoshiroi-desu',
      'ex-eki-yori-toshokan-no-hou-ga-shizuka-desu',
      'ex-resutoran-yori-kafe-no-hou-ga-yasui-desu',
      'ex-basu-yori-densha-no-hou-ga-hayai-desu',
      'ex-mizu-yori-koohii-no-hou-ga-takai-desu',
      'ex-basu-yori-kuruma-no-hou-ga-hayai-desu',
      'ex-pasuta-yori-raamen-no-hou-ga-oishii-desu',
      'ex-konbini-yori-supaa-no-hou-ga-benri-desu',
    ],
    commonMistakes: [
      'Reversing the order and changing which item is actually stronger in the comparison.',
      'Dropping の before ほうが and breaking the fixed comparison chunk.',
      'Using the adjective without finishing the comparison pattern first.',
    ],
    drills: [
      {
        id: 'drill-comparison-yori-houga-adjectives-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "The library is quieter than the station."',
        answer: 'えきよりとしょかんのほうがしずかです。',
        choices: [
          'えきよりとしょかんのほうがしずかです。',
          'としょかんよりえきのほうがしずかです。',
          'えきよりとしょかんほうがしずかです。',
        ],
      },
      {
        id: 'drill-comparison-yori-houga-adjectives-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: バスよりでんしゃの___はやいです。',
        answer: 'ほうが',
        support: 'Use のほうが as the fixed comparison chunk after the second item.',
      },
    ],
  },
  {
    id: 'grammar-comparison-yori-houga-preferences',
    title: 'Compare preferences with より and のほうが',
    objective:
      'Use short preference comparisons like コーヒーよりおちゃのほうがすきです.',
    explanation:
      'The same comparison frame works well with beginner preference language. Keep the comparisons practical and familiar so the learner can say what they like more without adding broader opinion grammar.',
    prerequisites: ['grammar-comparison-yori-houga-adjectives'],
    tags: ['comparison', 'preference', 'particles', 'n5'],
    exampleIds: [
      'ex-koohii-yori-cha-no-hou-ga-suki-desu',
      'ex-eiga-yori-hon-no-hou-ga-suki-desu',
      'ex-pan-yori-keeki-no-hou-ga-oishii-desu',
      'ex-kafe-yori-resutoran-no-hou-ga-suki-desu',
      'ex-kamera-yori-hon-no-hou-ga-yasui-desu',
      'ex-raamen-yori-udon-no-hou-ga-suki-desu',
    ],
    commonMistakes: [
      'Using plain すき instead of the beginner polite line すきです.',
      'Putting the more-liked item before より instead of after it.',
      'Treating より like a destination or location particle instead of part of a comparison frame.',
    ],
    drills: [
      {
        id: 'drill-comparison-yori-houga-preferences-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "I like tea more than coffee."',
        answer: 'コーヒーよりおちゃのほうがすきです。',
        choices: [
          'コーヒーよりおちゃのほうがすきです。',
          'おちゃよりコーヒーのほうがすきです。',
          'コーヒーよりおちゃほうがすきです。',
        ],
      },
      {
        id: 'drill-comparison-yori-houga-preferences-2',
        type: 'reorder',
        prompt: 'Reorder: えいがより / ほんのほうがすきです',
        answer: 'えいがよりほんのほうがすきです。',
        support: 'Put the first item with より, then the preferred item with のほうが.',
      },
    ],
  },
  {
    id: 'grammar-superlatives-ichiban-preferences',
    title: 'Use いちばん for strongest preferences',
    objective:
      'Use short preference lines like えいががいちばんすきです and おちゃがいちばんすきです.',
    explanation:
      'Use いちばん before a familiar preference expression to say what you like best. Keep the pattern narrow and concrete with food, drinks, places, study topics, and hobbies the learner already knows.',
    prerequisites: ['grammar-comparison-yori-houga-preferences'],
    tags: ['superlative', 'preference', 'particle-ga', 'n5'],
    exampleIds: [
      'ex-eiga-ga-ichiban-suki-desu',
      'ex-cha-ga-ichiban-suki-desu',
      'ex-toshokan-ga-ichiban-suki-desu',
      'ex-keeki-ga-ichiban-suki-desu',
      'ex-nihongo-ga-ichiban-suki-desu',
      'ex-supootsu-ga-ichiban-suki-desu',
      'ex-koucha-ga-ichiban-suki-desu',
    ],
    commonMistakes: [
      'Dropping が after the thing you like best and turning the sentence into an incomplete chunk.',
      'Placing いちばん after すきです instead of before the preference phrase.',
      'Mixing this pattern up with より / のほうが comparisons when the prompt only asks for a strongest preference.',
    ],
    drills: [
      {
        id: 'drill-superlatives-ichiban-preferences-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "Movies are what I like best."',
        answer: 'えいががいちばんすきです。',
        choices: [
          'えいががいちばんすきです。',
          'えいがはいちばんのすきです。',
          'えいががすきいちばんです。',
        ],
      },
      {
        id: 'drill-superlatives-ichiban-preferences-2',
        type: 'reorder',
        prompt: 'Reorder: おちゃが / いちばんすきです',
        answer: 'おちゃがいちばんすきです。',
        support: 'Put the liked item first with が, then add いちばん before すきです.',
      },
    ],
  },
  {
    id: 'grammar-superlatives-ichiban-adjectives',
    title: 'Use いちばん with familiar adjectives',
    objective:
      'Use short superlative descriptions like カフェがいちばんやすいです and としょかんがいちばんしずかです.',
    explanation:
      'The same いちばん pattern works with familiar beginner adjectives. Put the thing first, then いちばん, then the adjective. Keep the comparisons implicit and practical so the learner can say what is cheapest, quietest, fastest, tastiest, or most interesting in a small known set.',
    prerequisites: ['grammar-superlatives-ichiban-preferences'],
    tags: ['superlative', 'adjectives', 'description', 'n5'],
    exampleIds: [
      'ex-kafe-ga-ichiban-yasui-desu',
      'ex-toshokan-ga-ichiban-shizuka-desu',
      'ex-densha-ga-ichiban-hayai-desu',
      'ex-keeki-ga-ichiban-oishii-desu',
      'ex-eiga-ga-ichiban-omoshiroi-desu',
      'ex-kono-kurasu-ga-ichiban-shizuka-desu',
      'ex-karee-ga-ichiban-oishii-desu',
    ],
    commonMistakes: [
      'Leaving out いちばん and falling back to a plain adjective description.',
      'Putting the adjective before いちばん instead of keeping いちばん right before the adjective.',
      'Using より / のほうが when the sentence is meant to be a simple strongest-description line.',
    ],
    drills: [
      {
        id: 'drill-superlatives-ichiban-adjectives-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "The train is the fastest."',
        answer: 'でんしゃがいちばんはやいです。',
        choices: [
          'でんしゃがいちばんはやいです。',
          'でんしゃはいちばんのはやいです。',
          'でんしゃがはやいいちばんです。',
        ],
      },
      {
        id: 'drill-superlatives-ichiban-adjectives-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: としょかんが___しずかです。',
        answer: 'いちばん',
        support: 'Place いちばん right before the adjective to make the description strongest.',
      },
    ],
  },
  {
    id: 'grammar-frequency-adverbs-routine',
    title: 'Use frequency adverbs for real routines',
    objective:
      'Use short routine lines with いつも, よく, and ときどき to describe how often something happens.',
    explanation:
      'Frequency adverbs make routine Japanese sound more real than one fixed daily line. Put the adverb early in the sentence, then keep the familiar time, place, object, and polite verb pattern that the learner already knows.',
    prerequisites: ['grammar-superlatives-ichiban-adjectives'],
    tags: ['frequency', 'daily-routine', 'verb-forms', 'n5'],
    exampleIds: [
      'ex-itsumo-asa-pan-o-tabemasu',
      'ex-yoku-kafe-de-koohii-o-nomimasu',
      'ex-tokidoki-eiga-o-mimasu',
      'ex-itsumo-yoru-nihongo-o-benkyoushimasu',
      'ex-yoku-ongaku-o-kikimasu',
      'ex-itsumo-nikki-o-kakimasu',
      'ex-tokidoki-tegami-o-kakimasu',
    ],
    commonMistakes: [
      'Dropping the adverb and leaving only a plain routine line.',
      'Placing the adverb after the object instead of near the front of the sentence.',
      'Using あまり with a positive verb ending instead of saving it for the negative pattern.',
    ],
    drills: [
      {
        id: 'drill-frequency-adverbs-routine-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "I sometimes watch movies."',
        answer: 'ときどきえいがをみます。',
        choices: [
          'ときどきえいがをみます。',
          'えいがをときどきみますです。',
          'ときどきえいがをみません。',
        ],
      },
      {
        id: 'drill-frequency-adverbs-routine-2',
        type: 'reorder',
        prompt: 'Reorder: よく / おんがくをききます',
        answer: 'よくおんがくをききます。',
        support: 'Put the frequency adverb first, then keep the familiar object + verb order.',
      },
    ],
  },
  {
    id: 'grammar-frequency-adverbs-amari-masen',
    title: 'Use あまり with negative routine lines',
    objective:
      'Use short low-frequency lines like あまりコーヒーをのみません and あまりカフェにいきません.',
    explanation:
      'For beginner-safe frequency talk, pair あまり with a negative polite verb ending. This creates a useful "not very often" meaning without needing a more advanced adverb system. Keep the lines short and familiar.',
    prerequisites: ['grammar-frequency-adverbs-routine'],
    tags: ['frequency', 'negative', 'verb-forms', 'n5'],
    exampleIds: [
      'ex-amari-koohii-o-nomimasen',
      'ex-amari-eiga-o-mimasen',
      'ex-amari-kafe-ni-ikimasen',
      'ex-amari-pan-o-tabemasen',
      'ex-amari-hon-o-yomimasen',
      'ex-amari-terebi-o-mimasen',
      'ex-amari-supootsu-o-shimasen',
    ],
    commonMistakes: [
      'Using あまり with a positive ます ending instead of a negative ません ending.',
      'Dropping あまり and turning the line into a plain negative routine statement.',
      'Treating あまり like a topic or object word instead of an adverb that changes frequency.',
    ],
    drills: [
      {
        id: 'drill-frequency-adverbs-amari-masen-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "I do not drink coffee very often."',
        answer: 'あまりコーヒーをのみません。',
        choices: [
          'あまりコーヒーをのみません。',
          'あまりコーヒーをのみます。',
          'コーヒーをあまりのみますません。',
        ],
      },
      {
        id: 'drill-frequency-adverbs-amari-masen-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: あまりほんを___。',
        answer: 'よみません',
        support: 'Keep the pattern negative after あまり so the line means "not very often."',
      },
    ],
  },
  {
    id: 'grammar-reasons-kara-choices',
    title: 'Use から to give short polite reasons for choices',
    objective:
      'Use short reason lines like このカフェはやすいですからよくいきます and としょかんはしずかですからべんきょうします.',
    explanation:
      'To keep reason language beginner-safe in this repo, the first clause stays polite and short: Xですから or Xますから. Then add the result or choice in a second short clause. This is narrower than full plain-style reason grammar, but it covers practical beginner explanation well.',
    prerequisites: ['grammar-frequency-adverbs-amari-masen'],
    tags: ['reason', 'adjectives', 'verb-forms', 'n5'],
    exampleIds: [
      'ex-kono-kafe-wa-yasui-desukara-yoku-ikimasu',
      'ex-toshokan-wa-shizuka-desukara-benkyoushimasu',
      'ex-eiga-wa-omoshiroi-desukara-yoku-mimasu',
      'ex-densha-wa-hayai-desukara-yoku-norimasu',
      'ex-keeki-wa-oishii-desukara-yoku-tabemasu',
      'ex-basu-wa-osoi-desukara-densha-ni-norimasu',
      'ex-kyou-wa-nemui-desukara-hayaku-nemasu',
    ],
    commonMistakes: [
      'Stopping after the reason clause and forgetting to add the result part of the sentence.',
      'Dropping から so the line becomes two unrelated statements.',
      'Trying to add too much extra detail instead of keeping both clauses short and clear.',
    ],
    drills: [
      {
        id: 'drill-reasons-kara-choices-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "Because the library is quiet, I study there."',
        answer: 'としょかんはしずかですからべんきょうします。',
        choices: [
          'としょかんはしずかですからべんきょうします。',
          'としょかんはしずかべんきょうしますからです。',
          'としょかんはしずかですべんきょうしますから。',
        ],
      },
      {
        id: 'drill-reasons-kara-choices-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: このカフェはやすいです___よくいきます。',
        answer: 'から',
        support: 'Use から to connect the reason clause to the result clause.',
      },
    ],
  },
  {
    id: 'grammar-reasons-kara-refusals',
    title: 'Use から for simple refusals and follow-up decisions',
    objective:
      'Use short reason lines like きょうはべんきょうしますからえいがをみません and このレストランはたかいですからいきません.',
    explanation:
      'The same から pattern works well for small refusals and changed plans. Keep the reason clause first, then follow it with a short negative or decision line. This helps the learner explain a choice without needing broader connective grammar.',
    prerequisites: ['grammar-reasons-kara-choices'],
    tags: ['reason', 'negative', 'verb-forms', 'n5'],
    exampleIds: [
      'ex-kyou-wa-benkyoushimasu-kara-eiga-o-mimasen',
      'ex-ashita-wa-shigoto-desukara-yoru-eiga-o-mimasen',
      'ex-kono-resutoran-wa-takai-desukara-ikimasen',
      'ex-heya-wa-shizuka-janai-desukara-koko-de-benkyoushimasen',
      'ex-kinou-eiga-o-mimashita-kara-kyou-wa-mimasen',
      'ex-kyou-wa-isogashii-desukara-kafe-ni-ikimasen',
      'ex-ashita-wa-shiken-desukara-yoru-wa-geemu-o-shimasen',
    ],
    commonMistakes: [
      'Putting the refusal first and the reason second when the target pattern starts with the reason clause.',
      'Losing the negative ending in the result clause and changing the meaning completely.',
      'Breaking the line into two unrelated statements by omitting から.',
    ],
    drills: [
      {
        id: 'drill-reasons-kara-refusals-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "Because this restaurant is expensive, I do not go there."',
        answer: 'このレストランはたかいですからいきません。',
        choices: [
          'このレストランはたかいですからいきません。',
          'このレストランはいきませんからたかいです。',
          'このレストランはたかいですいきませんから。',
        ],
      },
      {
        id: 'drill-reasons-kara-refusals-2',
        type: 'reorder',
        prompt: 'Reorder: きょうはべんきょうしますから / えいがをみません',
        answer: 'きょうはべんきょうしますからえいがをみません。',
        support: 'Keep the reason clause first, then add the short negative result.',
      },
    ],
  },
  {
    id: 'grammar-desire-tai-places',
    title: 'Use たいです to say where you want to go',
    objective:
      'Use short desire lines like えいがかんにいきたいです and レストランにいきたいです.',
    explanation:
      'Use the place + に + いきたいです pattern to say where you want to go. Keep the lines short and practical so the learner can talk about simple plans and preferences without needing more advanced future grammar.',
    prerequisites: ['grammar-reasons-kara-refusals'],
    tags: ['desire', 'movement', 'verb-forms', 'n5'],
    exampleIds: [
      'ex-eigakan-ni-ikitai-desu',
      'ex-toshokan-ni-ikitai-desu',
      'ex-kafe-ni-ikitai-desu',
      'ex-resutoran-ni-ikitai-desu',
      'ex-doyoubi-ni-eigakan-ni-ikitai-desu',
    ],
    commonMistakes: [
      'Using を instead of に before the place when the line means "want to go to".',
      'Dropping たいです and turning the sentence back into a plain いきます statement.',
      'Adding too much schedule detail before the learner is comfortable with the core pattern.',
    ],
    drills: [
      {
        id: 'drill-desire-tai-places-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "I want to go to the cafe."',
        answer: 'カフェにいきたいです。',
        choices: ['カフェにいきたいです。', 'カフェをいきたいです。', 'カフェにいきますたいです。'],
      },
      {
        id: 'drill-desire-tai-places-2',
        type: 'reorder',
        prompt: 'Reorder: どようびに / えいがかんにいきたいです',
        answer: 'どようびにえいがかんにいきたいです。',
        support: 'Keep the time first, then the destination with に, then いきたいです.',
      },
    ],
  },
  {
    id: 'grammar-desire-tai-actions',
    title: 'Use たいです for things you want to do',
    objective:
      'Use short desire lines like パンをたべたいです and にほんごをべんきょうしたいです.',
    explanation:
      'The same たいです ending works with familiar actions. Keep the pattern concrete with eating, drinking, reading, watching, and studying so the learner can say what they want to do in daily life.',
    prerequisites: ['grammar-desire-tai-places'],
    tags: ['desire', 'actions', 'verb-forms', 'n5'],
    exampleIds: [
      'ex-pan-o-tabetai-desu',
      'ex-koohii-o-nomitai-desu',
      'ex-hon-o-yomitai-desu',
      'ex-eiga-o-mitai-desu',
      'ex-nihongo-o-benkyoushitai-desu',
    ],
    commonMistakes: [
      'Keeping the base polite verb like たべます instead of changing it to たべたいです.',
      'Dropping the object marker を and making the sentence harder to parse.',
      'Mixing たいです up with ほしいです even though this pack is for actions, not wanted objects.',
    ],
    drills: [
      {
        id: 'drill-desire-tai-actions-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "I want to watch a movie."',
        answer: 'えいがをみたいです。',
        choices: ['えいがをみたいです。', 'えいががみたいです。', 'えいがをみますたいです。'],
      },
      {
        id: 'drill-desire-tai-actions-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: コーヒーを___。',
        answer: 'のみたいです',
        support: 'Use the desire ending with the familiar verb so the line means "want to drink."',
      },
    ],
  },
  {
    id: 'grammar-object-desire-hoshii',
    title: 'Use ほしいです for things you want',
    objective:
      'Use short wanted-object lines like ほんがほしいです and みずがほしいです.',
    explanation:
      'Use noun + が + ほしいです to say what you want. Keep this separate from たいです: ほしいです is for wanted things, not for actions you want to do.',
    prerequisites: ['grammar-desire-tai-actions'],
    tags: ['desire-object', 'particle-ga', 'noun', 'n5'],
    exampleIds: [
      'ex-hon-ga-hoshii-desu',
      'ex-kamera-ga-hoshii-desu',
      'ex-jitensha-ga-hoshii-desu',
      'ex-mizu-ga-hoshii-desu',
      'ex-keeki-ga-hoshii-desu',
    ],
    commonMistakes: [
      'Using を instead of が in the core ほしいです pattern taught in this repo.',
      'Mixing ほしいです with action verbs when the sentence should use たいです instead.',
      'Dropping the wanted thing and leaving only ほしいです with no clear object.',
    ],
    drills: [
      {
        id: 'drill-object-desire-hoshii-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "I want water."',
        answer: 'みずがほしいです。',
        choices: ['みずがほしいです。', 'みずをほしいです。', 'みずがほしいます。'],
      },
      {
        id: 'drill-object-desire-hoshii-2',
        type: 'reorder',
        prompt: 'Reorder: ケーキが / ほしいです',
        answer: 'ケーキがほしいです。',
        support: 'Put the wanted thing first with が, then finish with ほしいです.',
      },
    ],
  },
  {
    id: 'grammar-object-desire-hoshii-questions',
    title: 'Ask and specify what you want with ほしいです',
    objective:
      'Use short question and detail lines like なにがほしいですか and このほんがほしいです.',
    explanation:
      'Once the learner knows the core ほしいです pattern, they can ask what someone wants and add small details like この or あたらしい. Keep the sentence shape the same and only change the noun phrase.',
    prerequisites: ['grammar-object-desire-hoshii'],
    tags: ['desire-object', 'question', 'noun-linking', 'n5'],
    exampleIds: [
      'ex-nani-ga-hoshii-desu-ka',
      'ex-pan-ga-hoshii-desu',
      'ex-koohii-ga-hoshii-desu',
      'ex-kono-hon-ga-hoshii-desu',
      'ex-atarashii-kamera-ga-hoshii-desu',
    ],
    commonMistakes: [
      'Changing the sentence order instead of keeping the same がほしいです shape.',
      'Dropping the question ending か when the prompt asks what someone wants.',
      'Adding extra detail that breaks the beginner-safe noun phrase pattern.',
    ],
    drills: [
      {
        id: 'drill-object-desire-hoshii-questions-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "What do you want?"',
        answer: 'なにがほしいですか。',
        choices: ['なにがほしいですか。', 'なにをほしいですか。', 'ほしいですかなにが。'],
      },
      {
        id: 'drill-object-desire-hoshii-questions-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: このほんが___。',
        answer: 'ほしいです',
        support: 'Keep the same wanted-object pattern after the noun phrase.',
      },
    ],
  },
  {
    id: 'grammar-ability-kotoga-dekimasu-actions',
    title: 'Use ことができます for things you can do',
    objective:
      'Use short ability lines like にほんごをよむことができます and じてんしゃにのることができます.',
    explanation:
      'For this repo, ability is introduced with dictionary-form verb + ことができます. Keep it narrow and concrete with reading, speaking, riding, walking, and buying so the learner sees the full chunk as one useful pattern.',
    prerequisites: ['grammar-object-desire-hoshii-questions'],
    tags: ['ability', 'verb-forms', 'dictionary-form', 'n5'],
    exampleIds: [
      'ex-nihongo-o-yomu-koto-ga-dekimasu',
      'ex-eigo-o-hanasu-koto-ga-dekimasu',
      'ex-jitensha-ni-noru-koto-ga-dekimasu',
      'ex-kafe-made-aruku-koto-ga-dekimasu',
      'ex-hon-o-kau-koto-ga-dekimasu',
    ],
    commonMistakes: [
      'Using the polite ます form before ことができます instead of the dictionary form taught here.',
      'Dropping こと and breaking the fixed beginner-safe ability chunk.',
      'Confusing this pattern with たいです or ほしいです when the meaning is ability, not desire.',
    ],
    drills: [
      {
        id: 'drill-ability-kotoga-dekimasu-actions-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "I can speak English."',
        answer: 'えいごをはなすことができます。',
        choices: [
          'えいごをはなすことができます。',
          'えいごをはなしますことができます。',
          'えいごがはなすことできます。',
        ],
      },
      {
        id: 'drill-ability-kotoga-dekimasu-actions-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: にほんごをよむ___できます。',
        answer: 'ことが',
        support: 'The fixed ability chunk is dictionary-form verb + ことができます.',
      },
    ],
  },
  {
    id: 'grammar-ability-kotoga-dekimasu-questions',
    title: 'Ask and answer simple ability questions',
    objective:
      'Use short ability question lines like にほんごをよむことができますか and はい、にほんごをよむことができます.',
    explanation:
      'Once the learner knows the full ability chunk, they can use the same pattern in questions and short answers. Keep the full sentence intact and only add か or a short yes-response.',
    prerequisites: ['grammar-ability-kotoga-dekimasu-actions'],
    tags: ['ability', 'question', 'response', 'n5'],
    exampleIds: [
      'ex-eiga-o-miru-koto-ga-dekimasu',
      'ex-ongaku-o-kiku-koto-ga-dekimasu',
      'ex-densha-ni-noru-koto-ga-dekimasu',
      'ex-nihongo-o-yomu-koto-ga-dekimasu-ka',
      'ex-hai-nihongo-o-yomu-koto-ga-dekimasu',
    ],
    commonMistakes: [
      'Dropping part of ことができます when turning the statement into a question.',
      'Trying to answer with just はい when the task expects the full beginner-safe sentence.',
      'Switching back to a plain verb sentence instead of keeping the ability pattern.',
    ],
    drills: [
      {
        id: 'drill-ability-kotoga-dekimasu-questions-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "Can you read Japanese?"',
        answer: 'にほんごをよむことができますか。',
        choices: [
          'にほんごをよむことができますか。',
          'にほんごをよみますことができますか。',
          'にほんごがよむことできますか。',
        ],
      },
      {
        id: 'drill-ability-kotoga-dekimasu-questions-2',
        type: 'reorder',
        prompt: 'Reorder: はい、 / にほんごをよむことができます',
        answer: 'はい、にほんごをよむことができます。',
        support: 'Keep the full ability sentence after the short yes-response.',
      },
    ],
  },
  {
    id: 'grammar-experience-takotoga-arimasu-places',
    title: 'Use たことがあります for places you have been',
    objective:
      'Use short experience lines like えいがかんにいったことがあります and とうきょうにいったことがあります.',
    explanation:
      'This repo introduces experience as a fixed past-action chunk plus ことがあります. For now, treat lines like いったことがあります as one useful pattern for saying you have been somewhere before, not as a full free-form past-tense lesson.',
    prerequisites: ['grammar-ability-kotoga-dekimasu-questions'],
    tags: ['experience', 'movement', 'verb-forms', 'n5'],
    exampleIds: [
      'ex-eigakan-ni-itta-koto-ga-arimasu',
      'ex-toukyou-ni-itta-koto-ga-arimasu',
      'ex-kuukou-ni-itta-koto-ga-arimasu',
      'ex-kono-kafe-ni-itta-koto-ga-arimasu',
      'ex-eigakan-ni-itta-koto-ga-arimasu-ka',
    ],
    commonMistakes: [
      'Replacing the fixed past chunk いった with the polite form いきました inside this pattern.',
      'Dropping こと and breaking the beginner-safe experience chunk.',
      'Treating the sentence like a plain past statement instead of an "have done before" experience line.',
    ],
    drills: [
      {
        id: 'drill-experience-takotoga-arimasu-places-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "I have been to Tokyo before."',
        answer: 'とうきょうにいったことがあります。',
        choices: [
          'とうきょうにいったことがあります。',
          'とうきょうにいきましたことがあります。',
          'とうきょうをいったことがあります。',
        ],
      },
      {
        id: 'drill-experience-takotoga-arimasu-places-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: えいがかんにいった___あります。',
        answer: 'ことが',
        support: 'Keep the fixed experience pattern together as いったことがあります.',
      },
    ],
  },
  {
    id: 'grammar-experience-takotoga-arimasu-activities',
    title: 'Use たことがあります for things you have done',
    objective:
      'Use short experience lines like すしをたべたことがあります and えいがをみたことがあります.',
    explanation:
      'The same experience pattern works with familiar activities. Keep the set small and concrete so the learner can say they have tried a food or watched something before without needing a broad new verb system.',
    prerequisites: ['grammar-experience-takotoga-arimasu-places'],
    tags: ['experience', 'object', 'verb-forms', 'n5'],
    exampleIds: [
      'ex-sushi-o-tabeta-koto-ga-arimasu',
      'ex-raamen-o-tabeta-koto-ga-arimasu',
      'ex-eiga-o-mita-koto-ga-arimasu',
      'ex-anime-o-mita-koto-ga-arimasu',
      'ex-sushi-o-tabeta-koto-ga-arimasu-ka',
    ],
    commonMistakes: [
      'Changing the fixed past chunk into a plain present verb like たべます or みます.',
      'Leaving out the object marker を in a pattern that still needs it.',
      'Thinking this means a single past event instead of prior experience in general.',
    ],
    drills: [
      {
        id: 'drill-experience-takotoga-arimasu-activities-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "I have eaten sushi before."',
        answer: 'すしをたべたことがあります。',
        choices: [
          'すしをたべたことがあります。',
          'すしをたべますことがあります。',
          'すしがたべたことがあります。',
        ],
      },
      {
        id: 'drill-experience-takotoga-arimasu-activities-2',
        type: 'reorder',
        prompt: 'Reorder: えいがを / みたことがあります',
        answer: 'えいがをみたことがあります。',
        support: 'Keep the object first, then use the fixed experience chunk after it.',
      },
    ],
  },
  {
    id: 'grammar-companions-dare-to',
    title: 'Ask and answer who you go with',
    objective:
      'Use short follow-up lines like だれとえいがかんにいきますか and ともだちとえいがかんにいきます.',
    explanation:
      'This slice keeps companion language narrow: ask with だれと and answer with a known person + と. That gives the learner a practical follow-up question without broadening into more complex relationship language.',
    prerequisites: ['grammar-experience-takotoga-arimasu-activities'],
    tags: ['companions', 'question', 'movement', 'n5'],
    exampleIds: [
      'ex-dare-to-eigakan-ni-ikimasu-ka',
      'ex-tomodachi-to-eigakan-ni-ikimasu',
      'ex-kazoku-to-resutoran-ni-ikimasu',
      'ex-sensei-to-toshokan-ni-ikimasu',
      'ex-ane-to-kafe-ni-ikimasu',
    ],
    commonMistakes: [
      'Using に instead of と after the companion when the sentence means "with someone."',
      'Dropping だれ in the question and leaving only an incomplete と phrase.',
      'Mixing the companion phrase with the destination phrase so the sentence becomes hard to read.',
    ],
    drills: [
      {
        id: 'drill-companions-dare-to-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "Who do you go to the movie theater with?"',
        answer: 'だれとえいがかんにいきますか。',
        choices: [
          'だれとえいがかんにいきますか。',
          'だれにえいがかんにいきますか。',
          'えいがかんにだれといきますですか。',
        ],
      },
      {
        id: 'drill-companions-dare-to-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: ともだち___えいがかんにいきます。',
        answer: 'と',
        support: 'Use と after the companion to mean "with."',
      },
    ],
  },
  {
    id: 'grammar-methods-douyatte-transport',
    title: 'Ask and answer how you get somewhere',
    objective:
      'Use short method lines like どうやってえきにいきますか and バスでえきにいきます.',
    explanation:
      'This lesson recombines a new question word with familiar transport language. Ask with どうやって, then answer with transport + で + destination + いきます. The grammar stays narrow and practical.',
    prerequisites: ['grammar-companions-dare-to'],
    tags: ['methods', 'question', 'transport', 'n5'],
    exampleIds: [
      'ex-douyatte-eki-ni-ikimasu-ka',
      'ex-basu-de-eki-ni-ikimasu',
      'ex-densha-de-toukyou-ni-ikimasu',
      'ex-jitensha-de-kafe-ni-ikimasu',
      'ex-takushii-de-resutoran-ni-ikimasu',
    ],
    commonMistakes: [
      'Forgetting で after the transport and losing the method meaning.',
      'Answering a どうやって question with only a destination and no transport method.',
      'Mixing に and で so the transport and destination roles are reversed.',
    ],
    drills: [
      {
        id: 'drill-methods-douyatte-transport-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "How do you get to the station?"',
        answer: 'どうやってえきにいきますか。',
        choices: [
          'どうやってえきにいきますか。',
          'どうやってえきでいきますか。',
          'えきにどうやってですか。',
        ],
      },
      {
        id: 'drill-methods-douyatte-transport-2',
        type: 'reorder',
        prompt: 'Reorder: バスで / えきにいきます',
        answer: 'バスでえきにいきます。',
        support: 'Put the transport + で chunk first, then keep the destination and verb together.',
      },
    ],
  },
  {
    id: 'grammar-choice-dore-dono-items',
    title: 'Use どれ and どの for simple item choices',
    objective:
      'Use short choice questions like どれがいいですか and どのほんがいいですか.',
    explanation:
      'Use どれ when the item is already understood and どの before a noun when you want to name the category. This keeps choice language beginner-safe while reusing familiar nouns like books, cakes, movies, and cafes.',
    prerequisites: ['grammar-methods-douyatte-transport'],
    tags: ['choice', 'question', 'noun-linking', 'n5'],
    exampleIds: [
      'ex-dore-ga-ii-desu-ka',
      'ex-dono-hon-ga-ii-desu-ka',
      'ex-dono-keeki-ga-hoshii-desu-ka',
      'ex-dono-eiga-o-mitai-desu-ka',
      'ex-dono-kafe-ni-ikitai-desu-ka',
    ],
    commonMistakes: [
      'Using どれ right before a noun instead of switching to どの.',
      'Dropping the noun after どの and leaving the question unfinished.',
      'Forgetting that these are choice questions and turning them into plain statements.',
    ],
    drills: [
      {
        id: 'drill-choice-dore-dono-items-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "Which book is good?"',
        answer: 'どのほんがいいですか。',
        choices: [
          'どのほんがいいですか。',
          'どれほんがいいですか。',
          'どのほんをいいですか。',
        ],
      },
      {
        id: 'drill-choice-dore-dono-items-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: ___ケーキがほしいですか。',
        answer: 'どの',
        support: 'Use どの before a noun when asking which specific item in a category.',
      },
    ],
  },
  {
    id: 'grammar-choice-dochira-decisions',
    title: 'Use どちら for simple two-choice decisions',
    objective:
      'Use short two-option choice lines like パンとケーキとどちらがいいですか and パンがいいです.',
    explanation:
      'Use どちら when there are two options. Keep the answer equally short with Xがいいです. This gives the learner a clean beginner pattern for choosing between food, transport, and simple plans.',
    prerequisites: ['grammar-choice-dore-dono-items'],
    tags: ['choice', 'question', 'decision', 'n5'],
    exampleIds: [
      'ex-pan-to-keeki-to-dochira-ga-ii-desu-ka',
      'ex-pan-ga-ii-desu',
      'ex-basu-to-densha-to-dochira-ga-ii-desu-ka',
      'ex-densha-ga-ii-desu',
      'ex-koohii-to-ocha-to-dochira-ga-suki-desu-ka',
    ],
    commonMistakes: [
      'Using どちら without clearly giving two options first.',
      'Answering with only the noun and forgetting the short response pattern がいいです.',
      'Mixing this choice pattern up with broader comparisons from より / のほうが.',
    ],
    drills: [
      {
        id: 'drill-choice-dochira-decisions-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "Which is better, the bus or the train?"',
        answer: 'バスとでんしゃとどちらがいいですか。',
        choices: [
          'バスとでんしゃとどちらがいいですか。',
          'どちらバスとでんしゃがいいですか。',
          'バスとでんしゃがどちらいいですか。',
        ],
      },
      {
        id: 'drill-choice-dochira-decisions-2',
        type: 'reorder',
        prompt: 'Reorder: でんしゃが / いいです',
        answer: 'でんしゃがいいです。',
        support: 'Keep the chosen option first, then answer with the short fixed response pattern.',
      },
    ],
  },
  {
    id: 'grammar-health-condition-basics',
    title: 'Use simple condition checks and answers',
    objective:
      'Use short health lines like だいじょうぶですか, げんきです, and あたまがいたいです.',
    explanation:
      'This pack introduces very short condition language first. Keep the lines compact and practical so the learner can check on someone, say they are okay, or mention one simple physical problem without needing a broad medical vocabulary.',
    prerequisites: ['grammar-choice-dochira-decisions'],
    tags: ['health', 'condition', 'copula', 'n5'],
    exampleIds: [
      'ex-daijoubu-desu',
      'ex-daijoubu-desu-ka',
      'ex-genki-desu',
      'ex-genki-desu-ka',
      'ex-atama-ga-itai-desu',
    ],
    commonMistakes: [
      'Dropping か in a short check like だいじょうぶですか and turning it into a statement.',
      'Trying to force a topic marker into the short condition line when the repo treats these as compact fixed expressions.',
      'Replacing が in あたまがいたいです with は and making the line less natural for this beginner pattern.',
    ],
    drills: [
      {
        id: 'drill-health-condition-basics-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "Are you okay?"',
        answer: 'だいじょうぶですか。',
        choices: ['だいじょうぶですか。', 'だいじょうぶかです。', 'だいじょうぶをですか。'],
      },
      {
        id: 'drill-health-condition-basics-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: あたま___いたいです。',
        answer: 'が',
        support: 'Use が in this short body-part condition line.',
      },
    ],
  },
  {
    id: 'grammar-health-simple-response-and-action',
    title: 'Add one simple response or next action for health',
    objective:
      'Use short follow-up lines like きょうはびょういんにいきます and くすりをのみます.',
    explanation:
      'After a short condition line, the learner often needs one small next step. This lesson keeps that next step practical and narrow: go to the hospital, take medicine, or say you are not well today.',
    prerequisites: ['grammar-health-condition-basics'],
    tags: ['health', 'negative', 'destination-ni', 'n5'],
    exampleIds: [
      'ex-kyou-wa-atama-ga-itai-desu',
      'ex-byouin-ni-ikimasu',
      'ex-kusuri-o-nomimasu',
      'ex-kyou-wa-byouin-ni-ikimasu',
      'ex-kyou-wa-genki-janai-desu',
    ],
    commonMistakes: [
      'Turning the follow-up into a broad explanation instead of one short practical next step.',
      'Dropping に in びょういんにいきます even though the line needs a destination.',
      'Forgetting the negative part of げんきじゃないです when the intended meaning is not being well.',
    ],
    drills: [
      {
        id: 'drill-health-simple-response-and-action-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "I am going to the hospital today."',
        answer: 'きょうはびょういんにいきます。',
        choices: [
          'きょうはびょういんにいきます。',
          'きょうはびょういんでいきます。',
          'きょうはびょういんにいきますか。',
        ],
      },
      {
        id: 'drill-health-simple-response-and-action-2',
        type: 'reorder',
        prompt: 'Reorder: くすりを / のみます',
        answer: 'くすりをのみます。',
        support: 'Keep the object first, then finish with the familiar polite verb.',
      },
    ],
  },
  {
    id: 'grammar-weather-comfort-basics',
    title: 'Use simple weather and comfort lines',
    objective:
      'Use short lines like きょうはあついです, きょうはさむいです, and きょうはあめです.',
    explanation:
      'This lesson adds a small everyday weather/comfort set. Keep the lines short and observation-based so the learner can describe how it feels without widening into a broad weather unit.',
    prerequisites: ['grammar-health-simple-response-and-action'],
    tags: ['weather', 'comfort', 'copula', 'n5'],
    exampleIds: [
      'ex-kyou-wa-atsui-desu',
      'ex-kyou-wa-samui-desu',
      'ex-kyou-wa-ame-desu',
      'ex-samui-desu-ka',
      'ex-atsui-desu-ka',
    ],
    commonMistakes: [
      'Dropping きょうは when the prompt is specifically about today’s condition.',
      'Mixing weather adjectives up with object-description use cases from earlier adjective packs.',
      'Forgetting か in a short weather question.',
    ],
    drills: [
      {
        id: 'drill-weather-comfort-basics-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "It is cold today."',
        answer: 'きょうはさむいです。',
        choices: ['きょうはさむいです。', 'きょうはさむいをです。', 'きょうにさむいです。'],
      },
      {
        id: 'drill-weather-comfort-basics-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: きょうはあめ___。',
        answer: 'です',
        support: 'Keep this weather observation as a short copula line.',
      },
    ],
  },
  {
    id: 'grammar-weather-practical-choices',
    title: 'Connect weather to one practical choice',
    objective:
      'Use short practical lines like さむいですからコートをきます and あめですからかさをもちます.',
    explanation:
      'The learner already has beginner-safe から lines, so this lesson reuses them for weather. Keep the pattern narrow: one short condition first, then one small practical response like wearing a coat or carrying an umbrella.',
    prerequisites: ['grammar-weather-comfort-basics'],
    tags: ['weather', 'reason', 'verb-forms', 'n5'],
    exampleIds: [
      'ex-kooto-o-kimasu',
      'ex-samui-desukara-kooto-o-kimasu',
      'ex-ame-desukara-kasa-o-mochimasu',
      'ex-kyou-wa-atsui-desukara-mizu-o-nomimasu',
      'ex-kyou-wa-kooto-o-kimasen',
    ],
    commonMistakes: [
      'Leaving out から and turning the condition and action into two unrelated statements.',
      'Mixing the practical action up with a broad explanation instead of one short response.',
      'Forgetting the negative ending in きません when the prompt is about not wearing a coat.',
    ],
    drills: [
      {
        id: 'drill-weather-practical-choices-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "Because it is cold, I wear a coat."',
        answer: 'さむいですからコートをきます。',
        choices: [
          'さむいですからコートをきます。',
          'さむいですコートをきますから。',
          'コートをさむいですからきます。',
        ],
      },
      {
        id: 'drill-weather-practical-choices-2',
        type: 'reorder',
        prompt: 'Reorder: あめですから / かさをもちます',
        answer: 'あめですからかさをもちます。',
        support: 'Keep the weather reason first, then the practical action.',
      },
    ],
  },
  {
    id: 'grammar-travel-steps-getting-on-and-off',
    title: 'Use simple getting on and getting off lines',
    objective:
      'Use short travel-step lines like でんしゃにのります and バスをおります.',
    explanation:
      'This lesson deepens movement language with two tightly scoped travel steps: getting on and getting off. Keep the patterns concrete and transport-focused so the learner can talk about movement changes without a full transit unit.',
    prerequisites: ['grammar-weather-practical-choices'],
    tags: ['travel-steps', 'movement', 'transport', 'n5'],
    exampleIds: [
      'ex-densha-ni-norimasu',
      'ex-basu-ni-norimasu',
      'ex-densha-o-orimasu',
      'ex-basu-o-orimasu',
      'ex-kuukou-de-takushii-ni-norimasu',
    ],
    commonMistakes: [
      'Using を after the transport when the sentence means getting on rather than getting off.',
      'Using に after the transport when the sentence means getting off.',
      'Losing the transport word and leaving only a bare movement verb.',
    ],
    drills: [
      {
        id: 'drill-travel-steps-getting-on-and-off-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "I get off the train."',
        answer: 'でんしゃをおります。',
        choices: ['でんしゃをおります。', 'でんしゃにおります。', 'でんしゃをのります。'],
      },
      {
        id: 'drill-travel-steps-getting-on-and-off-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: バス___のります。',
        answer: 'に',
        support: 'Use に when the sentence means getting on a bus.',
      },
    ],
  },
  {
    id: 'grammar-travel-steps-changing-and-arrival',
    title: 'Use simple change, exit, and arrival lines',
    objective:
      'Use short travel-step lines like えきでのりかえます, くうこうをでます, and もうくうこうにつきました.',
    explanation:
      'Once the learner can get on and off transport, they can add one more compact layer: change at a station, leave a place, or say they have already arrived. This keeps travel Japanese practical without widening into full travel-problem language yet.',
    prerequisites: ['grammar-travel-steps-getting-on-and-off'],
    tags: ['travel-steps', 'status', 'transport', 'n5'],
    exampleIds: [
      'ex-eki-de-norikaemasu',
      'ex-kuukou-o-demasu',
      'ex-eki-o-demasu',
      'ex-kuukou-ni-tsukimashita',
      'ex-mou-kuukou-ni-tsukimashita',
    ],
    commonMistakes: [
      'Dropping で in えきでのりかえます even though the station is the place where the change happens.',
      'Using に instead of を in short leave/exit lines like くうこうをでます.',
      'Forgetting もう when the prompt is specifically about already having arrived.',
    ],
    drills: [
      {
        id: 'drill-travel-steps-changing-and-arrival-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "I change trains at the station."',
        answer: 'えきでのりかえます。',
        choices: ['えきでのりかえます。', 'えきにのりかえます。', 'えきをのりかえます。'],
      },
      {
        id: 'drill-travel-steps-changing-and-arrival-2',
        type: 'reorder',
        prompt: 'Reorder: もう / くうこうにつきました',
        answer: 'もうくうこうにつきました。',
        support: 'Put もう first when the meaning is "already arrived."',
      },
    ],
  },
  {
    id: 'grammar-problems-okuremasu',
    title: 'Use short delay lines',
    objective: 'Use short real-life friction lines like ちょっとおくれます and でんしゃがおくれます.',
    explanation:
      'This pack keeps problem language narrow and practical. First learn a few short delay lines the learner can actually use when plans slip or transport is delayed. The goal is not broad apology language yet, just a clean way to signal a problem.',
    prerequisites: ['grammar-travel-steps-changing-and-arrival'],
    tags: ['problems', 'status', 'transport', 'n5'],
    exampleIds: [
      'ex-chotto-okuremasu',
      'ex-kyou-wa-chotto-okuremasu',
      'ex-densha-ga-okuremasu',
      'ex-basu-ga-okuremasu',
    ],
    commonMistakes: [
      'Forgetting that the delayed thing can be the subject, as in でんしゃがおくれます.',
      'Dropping ちょっと in lines that are meant to sound softer and more beginner-natural.',
      'Trying to widen into longer apology sentences before the core delay pattern is stable.',
    ],
    drills: [
      {
        id: 'drill-problems-okuremasu-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "The train is delayed."',
        answer: 'でんしゃがおくれます。',
        choices: ['でんしゃがおくれます。', 'でんしゃをおくれます。', 'でんしゃにおくれます。'],
      },
      {
        id: 'drill-problems-okuremasu-2',
        type: 'reorder',
        prompt: 'Reorder: きょうは / ちょっと / おくれます',
        answer: 'きょうはちょっとおくれます。',
        support: 'Put the topic first, then the softener ちょっと, then the delay verb.',
      },
    ],
  },
  {
    id: 'grammar-problems-muzukashii-renraku',
    title: 'Say something is difficult and contact someone',
    objective:
      'Use short problem and response lines like ちょっとむずかしいです and ともだちにれんらくします.',
    explanation:
      'After the learner can signal delay, add one more small layer: say something is difficult, then say they will contact someone. This keeps the slice realistic without widening into long explanations or problem-solving dialogue.',
    prerequisites: ['grammar-problems-okuremasu'],
    tags: ['problems', 'communication', 'n5'],
    exampleIds: [
      'ex-chotto-muzukashii-desu',
      'ex-kyou-wa-chotto-muzukashii-desu',
      'ex-tomodachi-ni-renrakushimasu',
      'ex-sensei-ni-renrakushimasu',
      'ex-ima-renrakushimasu',
      'ex-sugu-renrakushimasu',
    ],
    commonMistakes: [
      'Using a longer English-shaped explanation when the pack goal is a short line like ちょっとむずかしいです.',
      'Dropping に before the person in lines like ともだちにれんらくします.',
      'Forgetting that すぐ or いま can come before the contact verb to keep the response practical.',
    ],
    drills: [
      {
        id: 'drill-problems-muzukashii-renraku-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural line for "I will contact a friend."',
        answer: 'ともだちにれんらくします。',
        choices: ['ともだちにれんらくします。', 'ともだちをれんらくします。', 'ともだちでれんらくします。'],
      },
      {
        id: 'drill-problems-muzukashii-renraku-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: すぐ___。',
        answer: 'れんらくします',
        support: 'Use the short response line すぐれんらくします.',
      },
    ],
  },
  {
    id: 'grammar-before-after-maeni',
    title: 'Use noun + のまえに for simple ordering',
    objective: 'Use short ordering lines like しごとのまえにコーヒーをのみます.',
    explanation:
      'This pack keeps before/after language beginner-safe by starting with noun + のまえに. That lets the learner coordinate order and timing without needing verb-short-form grammar yet.',
    prerequisites: ['grammar-problems-muzukashii-renraku'],
    tags: ['before-after', 'ordering', 'time', 'n5'],
    exampleIds: [
      'ex-shigoto-no-mae-ni-koohii-o-nomimasu',
      'ex-gakkou-no-mae-ni-pan-o-tabemasu',
      'ex-jugyou-no-mae-ni-hon-o-yomimasu',
      'ex-eiga-no-mae-ni-tomodachi-ni-renrakushimasu',
    ],
    commonMistakes: [
      'Dropping の before まえに in noun-based ordering lines.',
      'Trying to use verb-short-form before introducing that grammar later in the curriculum.',
      'Forgetting that the action comes after the full Xのまえに chunk.',
    ],
    drills: [
      {
        id: 'drill-before-after-maeni-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "I drink coffee before work."',
        answer: 'しごとのまえにコーヒーをのみます。',
        choices: ['しごとのまえにコーヒーをのみます。', 'しごとまえにコーヒーをのみます。', 'しごとのあとでコーヒーをのみます。'],
      },
      {
        id: 'drill-before-after-maeni-2',
        type: 'reorder',
        prompt: 'Reorder: がっこうのまえに / パンをたべます',
        answer: 'がっこうのまえにパンをたべます。',
        support: 'Keep the full ordering chunk first, then add the action.',
      },
    ],
  },
  {
    id: 'grammar-before-after-atode',
    title: 'Use noun + のあとで for simple follow-up actions',
    objective: 'Use short after-lines like しごとのあとでえいがをみます.',
    explanation:
      'After the learner is comfortable with まえに, add noun + のあとで. It works the same way and keeps planning language short, practical, and easy to recombine with familiar actions.',
    prerequisites: ['grammar-before-after-maeni'],
    tags: ['before-after', 'ordering', 'time', 'n5'],
    exampleIds: [
      'ex-shigoto-no-ato-de-eiga-o-mimasu',
      'ex-gakkou-no-ato-de-kafe-ni-ikimasu',
      'ex-eiga-no-ato-de-koohii-o-nomimasu',
      'ex-byouin-no-ato-de-uchi-de-yasumimasu',
      'ex-jugyou-no-ato-de-tomodachi-ni-renrakushimasu',
    ],
    commonMistakes: [
      'Forgetting that あとで also stays attached to a noun with の in this pack.',
      'Mixing up まえに and あとで when the English prompt clearly means after.',
      'Breaking the ordering chunk apart instead of keeping Xのあとで together.',
    ],
    drills: [
      {
        id: 'drill-before-after-atode-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "I watch a movie after work."',
        answer: 'しごとのあとでえいがをみます。',
        choices: ['しごとのあとでえいがをみます。', 'しごとのまえにえいがをみます。', 'しごとあとでえいがをみます。'],
      },
      {
        id: 'drill-before-after-atode-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: えいがの___コーヒーをのみます。',
        answer: 'あとで',
        support: 'Use あとで when the coffee comes after the movie.',
      },
    ],
  },
  {
    id: 'grammar-plain-style-recognition-copula-and-na',
    title: 'Recognize short plain noun and な-adjective endings',
    objective: 'Recognize short plain lines like ともだちはがくせいだ and へやはしずかじゃない.',
    explanation:
      'This is a recognition-first slice. The learner is not being asked to master plain-style production yet. The goal is simply to reduce shock when familiar beginner content appears without です in short reading and listening lines.',
    prerequisites: ['grammar-before-after-atode'],
    tags: ['plain-style', 'recognition', 'copula', 'n5'],
    exampleIds: [
      'ex-tomodachi-wa-gakusei-da',
      'ex-heya-wa-shizuka-da',
      'ex-kono-mise-wa-kirei-da',
      'ex-kyou-wa-genki-janai',
      'ex-heya-wa-shizuka-janai',
    ],
    commonMistakes: [
      'Assuming だ or じゃない creates a totally new meaning instead of a familiar plain-style form.',
      'Trying to produce broad plain-style output before the learner has seen enough recognition examples.',
      'Missing that familiar nouns and な-adjectives are still doing the same basic sentence job as in polite forms.',
    ],
    drills: [
      {
        id: 'drill-plain-style-recognition-copula-and-na-1',
        type: 'multiple-choice',
        prompt: 'Which sentence is the short plain-style line for "The room is quiet"?',
        answer: 'へやはしずかだ。',
        choices: ['へやはしずかだ。', 'へやはしずかですか。', 'へやはしずかをだ。'],
      },
      {
        id: 'drill-plain-style-recognition-copula-and-na-2',
        type: 'multiple-choice',
        prompt: 'Choose the plain negative line.',
        answer: 'きょうはげんきじゃない。',
        choices: ['きょうはげんきじゃない。', 'きょうはげんきです。', 'きょうはげんきをじゃない。'],
      },
    ],
  },
  {
    id: 'grammar-plain-style-recognition-i-adjectives',
    title: 'Recognize short plain い-adjective lines',
    objective: 'Recognize short plain adjective lines like きょうはさむい and このほんはおもしろくない.',
    explanation:
      'This second plain-style lesson stays narrow: the learner only needs to recognize that familiar い-adjectives may appear without です, and that plain negatives end with くない. It is still a recognition layer, not broad plain-style grammar production.',
    prerequisites: ['grammar-plain-style-recognition-copula-and-na'],
    tags: ['plain-style', 'recognition', 'adjectives', 'n5'],
    exampleIds: [
      'ex-kyou-wa-samui',
      'ex-kyou-wa-atsukunai',
      'ex-kono-hon-wa-omoshiroi',
      'ex-kono-hon-wa-omoshirokunai',
      'ex-kafe-wa-yasui',
    ],
    commonMistakes: [
      'Waiting for です at the end even when the sentence is already complete in plain style.',
      'Missing くない as the plain negative counterpart of familiar polite negative adjective lines.',
      'Overproducing plain style instead of treating this pack mainly as a reading and listening recognition step.',
    ],
    drills: [
      {
        id: 'drill-plain-style-recognition-i-adjectives-1',
        type: 'multiple-choice',
        prompt: 'Which line means "This book is not interesting"?',
        answer: 'このほんはおもしろくない。',
        choices: ['このほんはおもしろくない。', 'このほんはおもしろい。', 'このほんはおもしろくです。'],
      },
      {
        id: 'drill-plain-style-recognition-i-adjectives-2',
        type: 'reorder',
        prompt: 'Reorder: きょうは / さむい',
        answer: 'きょうはさむい。',
        support: 'The plain adjective line is already complete without adding です.',
      },
    ],
  },
  {
    id: 'grammar-plain-style-recognition-verbs-present',
    title: 'Recognize short plain present and negative verb lines',
    objective: 'Recognize short plain verb lines like きょうえいがをみる and きょうコーヒーをのまない.',
    explanation:
      'This next plain-style slice stays recognition-first. The learner only needs to notice that familiar verbs can appear in short dictionary or negative plain forms instead of ます and ません. Keep it tied to known verbs and daily-use situations.',
    prerequisites: ['grammar-plain-style-recognition-i-adjectives'],
    tags: ['plain-style', 'recognition', 'verbs', 'n5'],
    exampleIds: [
      'ex-kyou-eiga-o-miru',
      'ex-uchi-de-hon-o-yomu',
      'ex-ashita-kafe-ni-iku',
      'ex-kyou-pan-o-taberu',
      'ex-kyou-koohii-o-nomanai',
      'ex-ashita-pan-o-tabenai',
    ],
    commonMistakes: [
      'Treating the short plain verb as a completely new word instead of a familiar verb without ます.',
      'Assuming every plain negative is advanced grammar when the pack goal is only recognition of a small, taught set.',
      'Trying to generalize broad conjugation rules beyond the few familiar verbs used here.',
    ],
    drills: [
      {
        id: 'drill-plain-style-recognition-verbs-present-1',
        type: 'multiple-choice',
        prompt: 'Which line is the short plain-style version of "I go to a cafe tomorrow"?',
        answer: 'あしたカフェにいく。',
        choices: ['あしたカフェにいく。', 'あしたカフェにいきますか。', 'あしたカフェをいく。'],
      },
      {
        id: 'drill-plain-style-recognition-verbs-present-2',
        type: 'multiple-choice',
        prompt: 'Choose the short plain negative line.',
        answer: 'きょうコーヒーをのまない。',
        choices: ['きょうコーヒーをのまない。', 'きょうコーヒーをのみます。', 'きょうコーヒーをのまです。'],
      },
    ],
  },
  {
    id: 'grammar-plain-style-recognition-verbs-past-and-questions',
    title: 'Recognize short plain past verb lines and simple questions',
    objective: 'Recognize short plain past lines like きのうえいがをみた and simple questions like あしたカフェにいくか.',
    explanation:
      'Keep this pack narrow. The learner is not being asked to produce full plain-style conversation. They only need to recognize a few familiar plain past forms and the short plain question ending か when it appears in reading and listening.',
    prerequisites: ['grammar-plain-style-recognition-verbs-present'],
    tags: ['plain-style', 'recognition', 'verbs', 'n5'],
    exampleIds: [
      'ex-kinou-eiga-o-mita',
      'ex-kinou-hon-o-yonda',
      'ex-ashita-kafe-ni-iku-ka',
      'ex-kyou-eiga-o-miru-ka',
    ],
    commonMistakes: [
      'Expecting ました every time a past action appears, even in a recognition-focused plain-style slice.',
      'Reading final か as automatically polite when the rest of the sentence is clearly plain-style.',
      'Trying to infer broad plain-style production rules from this small recognition-only lesson.',
    ],
    drills: [
      {
        id: 'drill-plain-style-recognition-verbs-past-and-questions-1',
        type: 'multiple-choice',
        prompt: 'Which line means "I watched a movie yesterday"?',
        answer: 'きのうえいがをみた。',
        choices: ['きのうえいがをみた。', 'きのうえいがをみます。', 'きのうえいがをみない。'],
      },
      {
        id: 'drill-plain-style-recognition-verbs-past-and-questions-2',
        type: 'reorder',
        prompt: 'Reorder: あした / カフェに / いくか',
        answer: 'あしたカフェにいくか。',
        support: 'Keep the short plain verb before the final question ending か.',
      },
    ],
  },
  {
    id: 'grammar-connected-speech-soshite-sorekara',
    title: 'Use そして and それから for short sentence-level flow',
    objective: 'Use short connected lines like あさパンをたべます。そして、コーヒーをのみます.',
    explanation:
      'This pack keeps connected speech practical and sentence-level. The learner joins two familiar short sentences with そして or それから. It does not widen into harder clause-linking or hidden new conjugation work.',
    prerequisites: ['grammar-plain-style-recognition-verbs-past-and-questions'],
    tags: ['connected-speech', 'sequence', 'n5'],
    exampleIds: [
      'ex-asa-pan-o-tabemasu-soshite-koohii-o-nomimasu',
      'ex-kafe-ni-ikimasu-soshite-benkyoushimasu',
      'ex-byouin-ni-ikimasu-sorekara-uchi-de-yasumimasu',
      'ex-shigoto-no-ato-de-kafe-ni-ikimasu-sorekara-hon-o-yomimasu',
    ],
    commonMistakes: [
      'Collapsing the two short sentences into one more complex clause before that grammar has been taught.',
      'Mixing up そして and それから with te-form sequencing when the pack goal is explicit sentence connectors.',
      'Forgetting that the learner is still working with familiar polite sentence shapes on both sides of the connector.',
    ],
    drills: [
      {
        id: 'drill-connected-speech-soshite-sorekara-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence-level connector for "I go to the hospital. After that, I rest at home."',
        answer: 'びょういんにいきます。それから、うちでやすみます。',
        choices: [
          'びょういんにいきます。それから、うちでやすみます。',
          'びょういんにいきます。だから、うちでやすみます。',
          'びょういんにいきます。でも、うちでやすみます。',
        ],
      },
      {
        id: 'drill-connected-speech-soshite-sorekara-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: あさパンをたべます。___、コーヒーをのみます。',
        answer: 'そして',
        support: 'Use そして for a simple sentence-level "and then" connection.',
      },
    ],
  },
  {
    id: 'grammar-connected-speech-demo-dakara',
    title: 'Use でも and だから for short contrast and result lines',
    objective: 'Use short connected lines like あめです。でも、いきます and きょうはさむいです。だから、コートをきます.',
    explanation:
      'This pack stays narrow and beginner-safe. でも marks a short contrast between two familiar sentences. だから marks a short result. It does not introduce longer discourse structure or plain-style clause reasoning.',
    prerequisites: ['grammar-connected-speech-soshite-sorekara'],
    tags: ['connected-speech', 'contrast', 'reason', 'n5'],
    exampleIds: [
      'ex-ame-desu-demo-ikimasu',
      'ex-kyou-wa-atama-ga-itai-desu-demo-benkyoushimasu',
      'ex-kyou-wa-atama-ga-itai-desu-dakara-uchi-de-yasumimasu',
      'ex-densha-ga-okuremasu-dakara-sugu-renrakushimasu',
      'ex-kyou-wa-samui-desu-dakara-kooto-o-kimasu',
      'ex-kono-hon-wa-omoshiroi-demo-chotto-takai-desu',
    ],
    commonMistakes: [
      'Confusing だから with the earlier narrow `から` grammar even though this pack uses it as a sentence connector between two complete short lines.',
      'Adding extra hidden grammar after でも or だから instead of keeping both sides as familiar short sentences.',
      'Treating でも as a reason marker when it is only showing contrast in this pack.',
    ],
    drills: [
      {
        id: 'drill-connected-speech-demo-dakara-1',
        type: 'multiple-choice',
        prompt: 'Choose the line that shows a short reason/result connection.',
        answer: 'でんしゃがおくれます。だから、すぐれんらくします。',
        choices: [
          'でんしゃがおくれます。だから、すぐれんらくします。',
          'でんしゃがおくれます。でも、すぐれんらくします。',
          'でんしゃがおくれます。そして、すぐれんらくします。',
        ],
      },
      {
        id: 'drill-connected-speech-demo-dakara-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: あめです。___、いきます。',
        answer: 'でも',
        support: 'Use でも when the second sentence contrasts with the first.',
      },
    ],
  },
  {
    id: 'grammar-listing-to-combinations',
    title: 'Use と for short full noun lists',
    objective: 'Use short list lines like パンとコーヒーをかいます and コーヒーとおちゃがすきです.',
    explanation:
      'This pack keeps listing language concrete and noun-based. と joins a full list of familiar items. The learner can use it in buying, preference, and want lines without having to widen into more complex phrase structure.',
    prerequisites: ['grammar-connected-speech-demo-dakara'],
    tags: ['listing', 'choice', 'n5'],
    exampleIds: [
      'ex-pan-to-koohii-o-kaimasu',
      'ex-koohii-to-ocha-ga-suki-desu',
      'ex-eiga-to-anime-ga-suki-desu',
      'ex-pan-to-keeki-o-tabemasu',
      'ex-kamera-to-hon-ga-hoshii-desu',
      'ex-pan-to-keeki-to-koohii-o-kaimasu',
    ],
    commonMistakes: [
      'Using と as if it meant "things like" when this pack is about full, explicit lists.',
      'Dropping the final particle like を or が after the full noun list.',
      'Trying to add broader comparison or contrast grammar when the pack goal is simply listing familiar nouns.',
    ],
    drills: [
      {
        id: 'drill-listing-to-combinations-1',
        type: 'multiple-choice',
        prompt: 'Choose the natural sentence for "I buy bread and coffee."',
        answer: 'パンとコーヒーをかいます。',
        choices: ['パンとコーヒーをかいます。', 'パンやコーヒーをかいます。', 'パンコーヒーをかいます。'],
      },
      {
        id: 'drill-listing-to-combinations-2',
        type: 'reorder',
        prompt: 'Reorder: コーヒーとおちゃ / がすきです',
        answer: 'コーヒーとおちゃがすきです。',
        support: 'Keep the full item list together before the final preference pattern.',
      },
    ],
  },
  {
    id: 'grammar-listing-ya-open-lists',
    title: 'Use や for open noun lists',
    objective: 'Use short open-list lines like パンやケーキをたべます and えいがやアニメをみます.',
    explanation:
      'After explicit lists with と, add や for short "things like..." lists. Keep it noun-based and practical. This helps the learner sound less trapped in one-item statements without widening into harder discourse.',
    prerequisites: ['grammar-listing-to-combinations'],
    tags: ['listing', 'choice', 'n5'],
    exampleIds: [
      'ex-pan-ya-keeki-o-tabemasu',
      'ex-koohii-ya-ocha-o-nomimasu',
      'ex-kamera-ya-hon-o-kaimasu',
      'ex-eiga-ya-anime-o-mimasu',
    ],
    commonMistakes: [
      'Using や when the meaning is a fully closed list rather than a loose "for example" style list.',
      'Dropping the final を after the open noun list.',
      'Treating や as if it changes the verb pattern; it only changes how the noun list feels.',
    ],
    drills: [
      {
        id: 'drill-listing-ya-open-lists-1',
        type: 'multiple-choice',
        prompt: 'Which line means "I watch things like movies and anime"?',
        answer: 'えいがやアニメをみます。',
        choices: ['えいがやアニメをみます。', 'えいがとアニメをみます。', 'えいがやアニメがみます。'],
      },
      {
        id: 'drill-listing-ya-open-lists-2',
        type: 'fill-in',
        prompt: 'Complete the sentence: パン___ケーキをたべます。',
        answer: 'や',
        support: 'Use や when the list means "things like bread and cake."',
      },
    ],
  },
] satisfies GrammarLesson[];
