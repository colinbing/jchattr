export type CapstoneStoryBlueprint = {
  chapterId: string;
  chapterLabel: string;
  sourcePackIds: number[];
  workingTitle: string;
  scenario: string;
  chapterTheme: string;
  grammarFocus: string[];
  recycleFocus: string[];
  expectedLineCount: {
    min: number;
    max: number;
  };
  expectedCheckCount: {
    min: number;
    max: number;
  };
  qualityRisks: string[];
};

export const capstoneStoryBlueprints: CapstoneStoryBlueprint[] = [
  {
    chapterId: 'chapter-core-01',
    chapterLabel: 'Chapter 1',
    sourcePackIds: [1, 2, 3, 4, 5],
    workingTitle: 'First day basics',
    scenario: 'A first-day classroom scene with self-introduction, object identification, and place questions.',
    chapterTheme: 'Introductions, questions, destinations, existence, preferences, and place answers.',
    grammarFocus: [
      'topic statements with wa and desu',
      'basic questions with ka and nan',
      'destination ni',
      'existence with arimasu and imasu',
      'simple place answers',
    ],
    recycleFocus: ['classroom objects', 'school places', 'preferences', 'daily study routine'],
    expectedLineCount: { min: 8, max: 14 },
    expectedCheckCount: { min: 3, max: 5 },
    qualityRisks: [
      'Avoid overusing isolated identity lines without a scene.',
      'Keep particle contrasts visible but not explanation-heavy.',
    ],
  },
  {
    chapterId: 'chapter-core-02',
    chapterLabel: 'Chapter 2',
    sourcePackIds: [6, 7, 8, 9, 10],
    workingTitle: 'Home and daily routine',
    scenario: 'A short day-at-home routine that moves through owned objects, simple actions, descriptions, and requests.',
    chapterTheme: 'Possession, daily verbs, adjectives, past actions, permission, and requests.',
    grammarFocus: [
      'noun linking with no',
      'polite present and negative verbs',
      'basic adjective predicates',
      'polite past and negative past',
      'te kudasai and temo ii desu ka',
    ],
    recycleFocus: ['identity statements', 'places of action', 'school and home objects', 'daily routine timing'],
    expectedLineCount: { min: 8, max: 14 },
    expectedCheckCount: { min: 3, max: 5 },
    qualityRisks: [
      'Do not turn the story into a list of unrelated chores.',
      'Keep request and permission lines polite and narrow.',
    ],
  },
  {
    chapterId: 'chapter-core-03',
    chapterLabel: 'Chapter 3',
    sourcePackIds: [11, 12, 13, 14, 15],
    workingTitle: 'Errand run through town',
    scenario: 'A learner checks the time, travels through town, asks directions, and buys a simple item.',
    chapterTheme: 'Shopping basics, time, weekdays, transport, destinations, and navigation.',
    grammarFocus: [
      'object o in shopping lines',
      'time ni',
      'weekday ni',
      'transport de',
      'navigation and where questions',
    ],
    recycleFocus: ['desu questions', 'destination ni', 'place answers', 'simple preferences'],
    expectedLineCount: { min: 8, max: 14 },
    expectedCheckCount: { min: 3, max: 5 },
    qualityRisks: [
      'Avoid too many time expressions in one line.',
      'Keep directions concrete and beginner-parseable.',
    ],
  },
  {
    chapterId: 'chapter-core-04',
    chapterLabel: 'Chapter 4',
    sourcePackIds: [16, 17, 18, 19, 20],
    workingTitle: 'Meetup plan',
    scenario: 'Two people make a plan, choose a meeting place, wait, and shift from invitation to proposal.',
    chapterTheme: 'Invitations, meeting places, arrival, waiting, suggestions, and proposals.',
    grammarFocus: [
      'invitation questions',
      'meeting place de',
      'arrival and waiting status',
      'masenka suggestions',
      'mashou and mashou ka proposals',
    ],
    recycleFocus: ['time ni', 'destination ni', 'transport de', 'place answers'],
    expectedLineCount: { min: 8, max: 14 },
    expectedCheckCount: { min: 3, max: 5 },
    qualityRisks: [
      'Avoid making the dialogue sound like schedule negotiation beyond N5.',
      'Keep status updates short and explicit.',
    ],
  },
  {
    chapterId: 'chapter-core-05',
    chapterLabel: 'Chapter 5',
    sourcePackIds: [21, 22, 23, 24, 25],
    workingTitle: 'A small outing on the calendar',
    scenario: 'A learner schedules an outing, confirms date and time, buys a few items, and checks a price.',
    chapterTheme: 'Time ranges, dates, appointments, counters, quantities, and prices.',
    grammarFocus: [
      'kara and made time ranges',
      'month and date expressions',
      'appointment lines',
      'basic counters and quantities',
      'price questions and yen answers',
    ],
    recycleFocus: ['meetup language', 'shopping requests', 'transport and destination lines'],
    expectedLineCount: { min: 8, max: 14 },
    expectedCheckCount: { min: 3, max: 5 },
    qualityRisks: [
      'Do not overload the story with dense date strings.',
      'Keep counters limited to taught forms.',
    ],
  },
  {
    chapterId: 'chapter-core-06',
    chapterLabel: 'Chapter 6',
    sourcePackIds: [26, 27, 28, 29, 30],
    workingTitle: 'Store request and follow-up',
    scenario: 'A store interaction continues into simple requests, action sequence, current state, and description contrast.',
    chapterTheme: 'Availability, te-form requests, action sequence, ongoing state, and adjective negatives.',
    grammarFocus: [
      'availability questions with arimasu ka',
      'te-form request and permission lines',
      'action sequence with te and tekara',
      'ongoing state with te imasu',
      'adjective negative contrast',
    ],
    recycleFocus: ['shopping objects', 'prices', 'place of action de', 'simple polite verbs'],
    expectedLineCount: { min: 8, max: 14 },
    expectedCheckCount: { min: 3, max: 5 },
    qualityRisks: [
      'Te-form should stay practical and not become a conjugation showcase.',
      'Progressive/state lines must remain beginner-obvious.',
    ],
  },
  {
    chapterId: 'chapter-core-07',
    chapterLabel: 'Chapter 7',
    sourcePackIds: [31, 32, 33, 34, 35],
    workingTitle: 'Choosing where to go',
    scenario: 'A learner compares options, talks about what was good, names a favorite, and gives a short reason.',
    chapterTheme: 'Adjective past, comparisons, superlatives, frequency, and reasons.',
    grammarFocus: [
      'adjective past forms',
      'comparison with yori and hou ga',
      'ichiban superlatives',
      'frequency adverbs',
      'short reasons with kara',
    ],
    recycleFocus: ['preferences', 'shopping and food places', 'routine actions', 'meetup plans'],
    expectedLineCount: { min: 8, max: 14 },
    expectedCheckCount: { min: 3, max: 5 },
    qualityRisks: [
      'Keep reasons short; avoid multi-clause opinion prose.',
      'Comparison lines should remain transparent and not stack too many adjectives.',
    ],
  },
  {
    chapterId: 'chapter-core-08',
    chapterLabel: 'Chapter 8',
    sourcePackIds: [36, 37, 38, 39, 40],
    workingTitle: 'Things I want to try',
    scenario: 'A learner talks about wanted activities, wanted objects, ability, prior experience, and who they do things with.',
    chapterTheme: 'Desire, object desire, ability, experience, companions, and methods.',
    grammarFocus: [
      'tai desire lines',
      'ga hoshii object desire',
      'koto ga dekimasu ability',
      'ta koto ga arimasu experience',
      'dare to and douyatte questions',
    ],
    recycleFocus: ['places, food, hobbies, transport, simple reasons'],
    expectedLineCount: { min: 8, max: 14 },
    expectedCheckCount: { min: 3, max: 5 },
    qualityRisks: [
      'Avoid abstract future goals; keep wants tied to concrete beginner nouns and verbs.',
      'Experience lines should use only taught past forms and familiar activities.',
    ],
  },
  {
    chapterId: 'chapter-core-09',
    chapterLabel: 'Chapter 9',
    sourcePackIds: [41, 42, 43, 44, 45],
    workingTitle: 'A small travel problem',
    scenario: 'A learner chooses an item or route, handles health/weather context, travels, and sends a delay message.',
    chapterTheme: 'Choices, health, weather, travel movement, delays, and contacting others.',
    grammarFocus: [
      'dore dono dochira choices',
      'health and condition basics',
      'weather and clothing choices',
      'travel step verbs',
      'delay and contact lines',
    ],
    recycleFocus: ['time, transport, reasons with kara, requests, place answers'],
    expectedLineCount: { min: 8, max: 14 },
    expectedCheckCount: { min: 3, max: 5 },
    qualityRisks: [
      'Keep health/weather lines practical and low-stakes.',
      'Delay/contact language should avoid business-level apology nuance.',
    ],
  },
  {
    chapterId: 'chapter-core-10',
    chapterLabel: 'Chapter 10',
    sourcePackIds: [46, 47, 48, 49, 50],
    workingTitle: 'Late N5 flow wrap-up',
    scenario: 'A familiar daily plan is reread with before/after timing, plain-form recognition, connectors, and flexible lists.',
    chapterTheme: 'Before/after, plain-style recognition, connected flow, contrast, and flexible listing.',
    grammarFocus: [
      'mae ni and ato de timing',
      'plain-style noun and adjective recognition',
      'plain-style verb recognition',
      'connected flow with soshite and sorekara',
      'open lists with to and ya',
    ],
    recycleFocus: ['all prior daily-life lanes, especially travel, shopping, health, wants, and reasons'],
    expectedLineCount: { min: 8, max: 14 },
    expectedCheckCount: { min: 3, max: 5 },
    qualityRisks: [
      'Plain style must stay recognition-safe, not broad production.',
      'Do not add hidden N4 connectors or clause structures to make the story feel advanced.',
    ],
  },
];
