import { exampleSentences } from './exampleSentences';
import { grammarLessons } from './grammarLessons';
import { listeningItems } from './listeningItems';
import { missions } from './missions';

type ContentPackStatus = 'shipped' | 'planned';

interface ContentPackSeed {
  packNumber: number;
  packId: string;
  title: string;
  theme: string;
  batch: string;
  status: ContentPackStatus;
  grammarLessonIds: string[];
  missionIds: string[];
  introducedGrammarTags: string[];
  reinforcedGrammarTags: string[];
  scenarioTags: string[];
}

export interface ContentPack extends ContentPackSeed {
  vocabIds: string[];
  exampleIds: string[];
  listeningItemIds: string[];
}

function createRecordById<T extends { id: string }>(items: T[]) {
  return items.reduce<Record<string, T>>((record, item) => {
    record[item.id] = item;
    return record;
  }, {});
}

function createOrderRecord(items: { id: string }[]) {
  return items.reduce<Record<string, number>>((record, item, index) => {
    record[item.id] = index;
    return record;
  }, {});
}

function getOrderedUniqueIds(ids: string[], orderRecord: Record<string, number>) {
  return Array.from(new Set(ids)).sort((left, right) => {
    const leftOrder = orderRecord[left] ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = orderRecord[right] ?? Number.MAX_SAFE_INTEGER;

    return leftOrder - rightOrder;
  });
}

const grammarLessonRecord = createRecordById(grammarLessons);
const missionRecord = createRecordById(missions);
const exampleOrderRecord = createOrderRecord(exampleSentences);
const listeningOrderRecord = createOrderRecord(listeningItems);

function buildContentPack(seed: ContentPackSeed): ContentPack {
  const linkedMissions = seed.missionIds.map((missionId) => missionRecord[missionId]);
  const linkedLessons = seed.grammarLessonIds.map((lessonId) => grammarLessonRecord[lessonId]);

  const vocabIds = getOrderedUniqueIds(
    linkedMissions.flatMap((mission) => mission.contentRefs.vocabIds ?? []),
    createOrderRecord(
      linkedMissions
        .flatMap((mission) => mission.contentRefs.vocabIds ?? [])
        .map((id) => ({ id })),
    ),
  );

  const exampleIds = getOrderedUniqueIds(
    [
      ...linkedLessons.flatMap((lesson) => lesson.exampleIds),
      ...linkedMissions.flatMap((mission) => mission.contentRefs.exampleIds ?? []),
    ],
    exampleOrderRecord,
  );

  const listeningItemIds = getOrderedUniqueIds(
    linkedMissions.flatMap((mission) => mission.contentRefs.listeningItemIds ?? []),
    listeningOrderRecord,
  );

  return {
    ...seed,
    vocabIds,
    exampleIds,
    listeningItemIds,
  };
}

const contentPackSeeds: ContentPackSeed[] = [
  {
    packNumber: 1,
    packId: 'pack-01-starter-introductions-and-places',
    title: 'Starter introductions and places',
    theme: 'identity statements and place-of-action basics',
    batch: 'legacy-foundation-a',
    status: 'shipped',
    grammarLessonIds: ['grammar-topic-desu', 'grammar-place-de'],
    missionIds: [
      'mission-grammar-topic-desu',
      'mission-listening-place-de',
      'mission-output-daily-lines',
    ],
    introducedGrammarTags: ['topic-statements', 'copula', 'place-of-action-de'],
    reinforcedGrammarTags: [],
    scenarioTags: ['self-introduction', 'home-study', 'cafe'],
  },
  {
    packNumber: 2,
    packId: 'pack-02-starter-questions-and-destinations',
    title: 'Starter questions and destinations',
    theme: 'basic identification questions and destination lines',
    batch: 'legacy-foundation-a',
    status: 'shipped',
    grammarLessonIds: ['grammar-question-nan', 'grammar-destination-ni'],
    missionIds: [
      'mission-grammar-destination-ni',
      'mission-listening-question-nan',
      'mission-output-classroom-destination',
    ],
    introducedGrammarTags: ['what-is-it-questions', 'destination-ni'],
    reinforcedGrammarTags: ['topic-statements', 'copula'],
    scenarioTags: ['classroom', 'school-routine', 'movement'],
  },
  {
    packNumber: 3,
    packId: 'pack-03-existence-and-room-locations',
    title: 'Existence and room locations',
    theme: 'where people and things are',
    batch: 'legacy-expansion-a',
    status: 'shipped',
    grammarLessonIds: ['grammar-existence-arimasu-imasu', 'grammar-position-no'],
    missionIds: [
      'mission-grammar-existence-arimasu-imasu',
      'mission-listening-existence-position',
      'mission-output-room-locations',
    ],
    introducedGrammarTags: ['existence-arimasu-imasu', 'position-no'],
    reinforcedGrammarTags: ['particles', 'location'],
    scenarioTags: ['room-objects', 'classroom', 'home'],
  },
  {
    packNumber: 4,
    packId: 'pack-04-preferences-and-simple-questions',
    title: 'Preferences and simple questions',
    theme: 'likes, dislikes, and asking what someone likes',
    batch: 'legacy-expansion-a',
    status: 'shipped',
    grammarLessonIds: ['grammar-preference-suki-kirai', 'grammar-preference-questions'],
    missionIds: [
      'mission-grammar-preference-suki-kirai',
      'mission-listening-preferences',
      'mission-output-preference-questions',
    ],
    introducedGrammarTags: ['suki-kirai', 'preference-questions'],
    reinforcedGrammarTags: ['question'],
    scenarioTags: ['food', 'hobbies', 'daily-conversation'],
  },
  {
    packNumber: 5,
    packId: 'pack-05-where-questions-and-place-answers',
    title: 'Where questions and place answers',
    theme: 'asking where something is and answering with simple place lines',
    batch: 'legacy-expansion-a',
    status: 'shipped',
    grammarLessonIds: ['grammar-where-doko-desu', 'grammar-location-answer-places'],
    missionIds: [
      'mission-grammar-where-doko-desu',
      'mission-listening-where-things-are',
      'mission-output-where-answers',
    ],
    introducedGrammarTags: ['where-questions', 'place-answers'],
    reinforcedGrammarTags: ['existence-arimasu-imasu', 'position-no'],
    scenarioTags: ['directions', 'school', 'home-objects'],
  },
  {
    packNumber: 6,
    packId: 'pack-06-possession-and-family-objects',
    title: 'Possession and family objects',
    theme: 'noun linking with の for ownership and family objects',
    batch: 'legacy-expansion-b',
    status: 'shipped',
    grammarLessonIds: ['grammar-possession-no', 'grammar-family-possession-lines'],
    missionIds: [
      'mission-grammar-possession-no',
      'mission-listening-family-objects',
      'mission-output-family-objects',
    ],
    introducedGrammarTags: ['noun-linking-no', 'family-possession'],
    reinforcedGrammarTags: ['copula'],
    scenarioTags: ['family', 'personal-objects', 'classroom-items'],
  },
  {
    packNumber: 7,
    packId: 'pack-07-daily-verb-forms',
    title: 'Daily verb forms',
    theme: 'polite present and negative present daily-life verbs',
    batch: 'legacy-expansion-b',
    status: 'shipped',
    grammarLessonIds: ['grammar-verb-forms-masu-routine', 'grammar-verb-forms-masen'],
    missionIds: [
      'mission-grammar-verb-forms-routine',
      'mission-listening-verb-forms-daily-life',
      'mission-output-verb-forms-daily-life',
    ],
    introducedGrammarTags: ['masu', 'masen'],
    reinforcedGrammarTags: ['object', 'location'],
    scenarioTags: ['daily-routine', 'study', 'home'],
  },
  {
    packNumber: 8,
    packId: 'pack-08-adjective-descriptions',
    title: 'Adjective descriptions',
    theme: 'simple adjective descriptions for people, places, and things',
    batch: 'legacy-expansion-b',
    status: 'shipped',
    grammarLessonIds: ['grammar-adjectives-predicates', 'grammar-adjectives-noun-description'],
    missionIds: [
      'mission-grammar-adjectives-daily-description',
      'mission-listening-adjective-descriptions',
      'mission-output-adjective-descriptions',
    ],
    introducedGrammarTags: ['adjective-predicate', 'adjective-plus-noun'],
    reinforcedGrammarTags: ['copula'],
    scenarioTags: ['objects', 'places', 'descriptions'],
  },
  {
    packNumber: 9,
    packId: 'pack-09-polite-past-actions',
    title: 'Polite past actions',
    theme: 'recent action lines in polite past and negative past',
    batch: 'legacy-expansion-c',
    status: 'shipped',
    grammarLessonIds: ['grammar-verb-forms-mashita-routine', 'grammar-verb-forms-masendeshita'],
    missionIds: [
      'mission-grammar-verb-forms-past-routine',
      'mission-listening-verb-forms-past-actions',
      'mission-output-verb-forms-past-actions',
    ],
    introducedGrammarTags: ['mashita', 'masen-deshita'],
    reinforcedGrammarTags: ['verb-forms', 'object'],
    scenarioTags: ['recent-actions', 'daily-routine', 'study'],
  },
  {
    packNumber: 10,
    packId: 'pack-10-permission-and-requests',
    title: 'Permission and requests',
    theme: 'simple permission checks and classroom-style requests',
    batch: 'legacy-expansion-c',
    status: 'shipped',
    grammarLessonIds: ['grammar-permission-temo-ii-desu-ka', 'grammar-request-te-kudasai'],
    missionIds: [
      'mission-grammar-permission-and-requests',
      'mission-listening-permission-and-requests',
      'mission-output-permission-and-requests',
    ],
    introducedGrammarTags: ['temo-ii-desu-ka', 'te-kudasai'],
    reinforcedGrammarTags: ['verb-forms', 'daily-conversation'],
    scenarioTags: ['classroom', 'etiquette', 'daily-conversation'],
  },
  {
    packNumber: 11,
    packId: 'pack-11-shopping-basics',
    title: 'Shopping basics',
    theme: 'asking for items and buying simple things',
    batch: 'legacy-expansion-c',
    status: 'shipped',
    grammarLessonIds: ['grammar-shopping-o-kudasai', 'grammar-shopping-kaimasu'],
    missionIds: [
      'mission-grammar-shopping-basics',
      'mission-listening-shopping-basics',
      'mission-output-shopping-basics',
    ],
    introducedGrammarTags: ['o-kudasai', 'kaimasu-shopping'],
    reinforcedGrammarTags: ['request', 'object'],
    scenarioTags: ['shopping', 'convenience-store', 'food-and-drink'],
  },
  {
    packNumber: 12,
    packId: 'pack-12-time-and-schedules',
    title: 'Time and schedules',
    theme: 'clock time and time-marked schedule lines',
    batch: 'legacy-expansion-d',
    status: 'shipped',
    grammarLessonIds: ['grammar-time-nanji-desu', 'grammar-time-ni-schedule'],
    missionIds: [
      'mission-grammar-time-schedule-basics',
      'mission-listening-time-schedule-basics',
      'mission-output-time-schedule-basics',
    ],
    introducedGrammarTags: ['nanji-desu-ka', 'time-ni'],
    reinforcedGrammarTags: ['movement', 'daily-routine'],
    scenarioTags: ['time', 'schedules', 'school-routine'],
  },
  {
    packNumber: 13,
    packId: 'pack-13-weekday-plans',
    title: 'Weekday plans',
    theme: 'weekday plans and asking what someone will do on a given day',
    batch: 'legacy-expansion-d',
    status: 'shipped',
    grammarLessonIds: ['grammar-weekdays-ni', 'grammar-weekday-plan-questions'],
    missionIds: [
      'mission-grammar-weekday-plans',
      'mission-listening-weekday-plans',
      'mission-output-weekday-plans',
    ],
    introducedGrammarTags: ['weekday-ni', 'weekday-plan-questions'],
    reinforcedGrammarTags: ['time-ni', 'movement'],
    scenarioTags: ['weekdays', 'plans', 'home-study'],
  },
  {
    packNumber: 14,
    packId: 'pack-14-transport-and-destinations',
    title: 'Transport and destinations',
    theme: 'transport with で and travel distance with まで',
    batch: 'legacy-expansion-d',
    status: 'shipped',
    grammarLessonIds: ['grammar-transport-de', 'grammar-destination-made-questions'],
    missionIds: [
      'mission-grammar-transport-basics',
      'mission-listening-transport-basics',
      'mission-output-transport-basics',
    ],
    introducedGrammarTags: ['transport-de', 'made-questions'],
    reinforcedGrammarTags: ['destination-ni', 'movement'],
    scenarioTags: ['transport', 'travel', 'daily-routine'],
  },
  {
    packNumber: 15,
    packId: 'pack-15-navigation-basics',
    title: 'Navigation basics',
    theme: 'simple turns, straight-ahead directions, and place answers',
    batch: 'legacy-expansion-e',
    status: 'shipped',
    grammarLessonIds: ['grammar-navigation-migi-hidari', 'grammar-navigation-place-answers'],
    missionIds: [
      'mission-grammar-navigation-basics',
      'mission-listening-navigation-basics',
      'mission-output-navigation-basics',
    ],
    introducedGrammarTags: ['navigation-turns', 'navigation-place-answers'],
    reinforcedGrammarTags: ['where-questions', 'place-answers'],
    scenarioTags: ['navigation', 'landmarks', 'directions'],
  },
  {
    packNumber: 16,
    packId: 'pack-16-invitation-and-plan-basics',
    title: 'Invitation and plan basics',
    theme: 'simple invitations, plan questions, and yes/no responses',
    batch: 'legacy-expansion-e',
    status: 'shipped',
    grammarLessonIds: ['grammar-invitation-plan-questions', 'grammar-plan-responses-yes-no'],
    missionIds: [
      'mission-grammar-invitation-plan-basics',
      'mission-listening-invitation-plan-basics',
      'mission-output-invitation-plan-basics',
    ],
    introducedGrammarTags: ['invitation-questions', 'plan-responses'],
    reinforcedGrammarTags: ['weekday-ni', 'time-ni'],
    scenarioTags: ['plans', 'invitations', 'meetups'],
  },
  {
    packNumber: 17,
    packId: 'pack-17-meeting-place-coordination',
    title: 'Meeting-place coordination',
    theme: 'asking where to meet and answering with practical landmark lines',
    batch: 'legacy-expansion-e',
    status: 'shipped',
    grammarLessonIds: ['grammar-meeting-place-de-questions', 'grammar-meeting-place-landmark-lines'],
    missionIds: [
      'mission-grammar-meeting-place-basics',
      'mission-listening-meeting-place-basics',
      'mission-output-meeting-place-basics',
    ],
    introducedGrammarTags: ['meeting-place-de', 'landmark-meetup-lines'],
    reinforcedGrammarTags: ['navigation-place-answers', 'invitation-questions'],
    scenarioTags: ['meetups', 'landmarks', 'navigation'],
  },
  {
    packNumber: 18,
    packId: 'pack-18-arrival-and-waiting-basics',
    title: 'Arrival and waiting basics',
    theme: 'short meetup arrival, location, and waiting status updates',
    batch: 'batch-01-social-coordination',
    status: 'shipped',
    grammarLessonIds: ['grammar-arrival-status-updates', 'grammar-waiting-status-lines'],
    missionIds: [
      'mission-grammar-arrival-waiting-basics',
      'mission-listening-arrival-waiting-basics',
      'mission-output-arrival-waiting-basics',
    ],
    introducedGrammarTags: ['arrival-status-updates', 'waiting-status-lines'],
    reinforcedGrammarTags: ['meeting', 'location', 'movement'],
    scenarioTags: ['meetups', 'status-updates', 'transport'],
  },
  {
    packNumber: 19,
    packId: 'pack-19-suggestions-with-masenka',
    title: 'Suggestions with ませんか',
    theme: 'soft polite suggestions for meetups, food, drinks, and study plans',
    batch: 'batch-01-social-coordination',
    status: 'shipped',
    grammarLessonIds: ['grammar-suggestion-masenka-basics', 'grammar-suggestion-masenka-activities'],
    missionIds: [
      'mission-grammar-suggestion-masenka-basics',
      'mission-listening-suggestion-masenka-basics',
      'mission-output-suggestion-masenka-basics',
    ],
    introducedGrammarTags: ['masenka-suggestions', 'masenka-activity-suggestions'],
    reinforcedGrammarTags: ['invitation', 'question', 'schedule'],
    scenarioTags: ['meetups', 'food-and-drink', 'study-plans'],
  },
  {
    packNumber: 20,
    packId: 'pack-20-mashou-plan-basics',
    title: 'Plan proposals with ましょう',
    theme: 'direct polite proposals and simple plan-shaping questions',
    batch: 'batch-01-social-coordination',
    status: 'shipped',
    grammarLessonIds: ['grammar-mashou-plan-proposals', 'grammar-mashou-plan-questions'],
    missionIds: [
      'mission-grammar-mashou-plan-basics',
      'mission-listening-mashou-plan-basics',
      'mission-output-mashou-plan-basics',
    ],
    introducedGrammarTags: ['mashou-proposals', 'mashou-plan-questions'],
    reinforcedGrammarTags: ['invitation', 'meeting', 'schedule'],
    scenarioTags: ['meetups', 'plans', 'decision-making'],
  },
  {
    packNumber: 21,
    packId: 'pack-21-time-ranges-kara-made',
    title: 'Time ranges with から / まで',
    theme: 'simple start and end time windows for class, work, and plans',
    batch: 'batch-02-calendar-planning',
    status: 'shipped',
    grammarLessonIds: ['grammar-time-ranges-kara-made', 'grammar-time-range-questions'],
    missionIds: [
      'mission-grammar-time-range-basics',
      'mission-listening-time-range-basics',
      'mission-output-time-range-basics',
    ],
    introducedGrammarTags: ['kara-made-time-ranges', 'time-window-questions'],
    reinforcedGrammarTags: ['schedule', 'question', 'movement'],
    scenarioTags: ['time-windows', 'school', 'work'],
  },
  {
    packNumber: 22,
    packId: 'pack-22-dates-months-and-when',
    title: 'Dates, months, and when',
    theme: 'asking when something happens and answering with practical month and date lines',
    batch: 'batch-02-calendar-planning',
    status: 'shipped',
    grammarLessonIds: ['grammar-calendar-when-questions', 'grammar-calendar-date-lines'],
    missionIds: [
      'mission-grammar-calendar-date-basics',
      'mission-listening-calendar-date-basics',
      'mission-output-calendar-date-basics',
    ],
    introducedGrammarTags: ['calendar-when-questions', 'calendar-date-lines'],
    reinforcedGrammarTags: ['question', 'schedule', 'meeting'],
    scenarioTags: ['calendar', 'meetups', 'plans'],
  },
  {
    packNumber: 23,
    packId: 'pack-23-calendar-plans-and-appointments',
    title: 'Calendar plans and appointments',
    theme: 'combining dates, times, and familiar invitation language into fuller plans',
    batch: 'batch-02-calendar-planning',
    status: 'shipped',
    grammarLessonIds: ['grammar-calendar-appointment-lines', 'grammar-calendar-plan-combination'],
    missionIds: [
      'mission-grammar-calendar-plan-combination',
      'mission-listening-calendar-plan-combination',
      'mission-output-calendar-plan-combination',
    ],
    introducedGrammarTags: ['calendar-appointment-lines', 'calendar-plan-recombination'],
    reinforcedGrammarTags: ['invitation', 'proposal', 'suggestion'],
    scenarioTags: ['calendar', 'appointments', 'meetups'],
  },
  {
    packNumber: 24,
    packId: 'pack-24-counters-and-quantity-basics',
    title: 'Counters and quantity basics',
    theme: 'asking how many items and making short counter-based request lines',
    batch: 'batch-03-shopping-depth',
    status: 'shipped',
    grammarLessonIds: ['grammar-quantity-ikutsu-questions', 'grammar-quantity-request-lines'],
    missionIds: [
      'mission-grammar-quantity-basics',
      'mission-listening-quantity-basics',
      'mission-output-quantity-basics',
    ],
    introducedGrammarTags: ['quantity-questions', 'quantity-request-lines'],
    reinforcedGrammarTags: ['shopping', 'question', 'request'],
    scenarioTags: ['shopping', 'quantities', 'food-and-drink'],
  },
  {
    packNumber: 25,
    packId: 'pack-25-price-and-payment-basics',
    title: 'Price and payment basics',
    theme: 'asking the price and answering with short yen-based shop lines',
    batch: 'batch-03-shopping-depth',
    status: 'shipped',
    grammarLessonIds: ['grammar-price-ikura-questions', 'grammar-price-yen-lines'],
    missionIds: [
      'mission-grammar-price-basics',
      'mission-listening-price-basics',
      'mission-output-price-basics',
    ],
    introducedGrammarTags: ['price-questions', 'yen-price-lines'],
    reinforcedGrammarTags: ['shopping', 'question', 'copula'],
    scenarioTags: ['shopping', 'money', 'checkout'],
  },
  {
    packNumber: 26,
    packId: 'pack-26-store-availability-and-item-requests',
    title: 'Store availability and item requests',
    theme: 'asking if an item is available and choosing it with short request lines',
    batch: 'batch-03-shopping-depth',
    status: 'shipped',
    grammarLessonIds: ['grammar-shopping-availability-arimasu-ka', 'grammar-shopping-selection-korede-ii-desu'],
    missionIds: [
      'mission-grammar-store-availability-basics',
      'mission-listening-store-availability-basics',
      'mission-output-store-availability-basics',
    ],
    introducedGrammarTags: ['availability-questions', 'selection-confirmation-lines'],
    reinforcedGrammarTags: ['shopping', 'request', 'existence-arimasu-imasu'],
    scenarioTags: ['shopping', 'store-requests', 'availability'],
  },
  {
    packNumber: 27,
    packId: 'pack-27-te-form-core-for-everyday-verbs',
    title: 'Te-form core for everyday verbs',
    theme: 'a tightly scoped て-form foundation on a small familiar verb set',
    batch: 'batch-04-te-form-foundations',
    status: 'shipped',
    grammarLessonIds: ['grammar-te-form-core-familiar-verbs', 'grammar-te-form-core-sound-change-basics'],
    missionIds: [
      'mission-grammar-te-form-core',
      'mission-listening-te-form-core',
      'mission-output-te-form-core',
    ],
    introducedGrammarTags: ['te-form-core', 'te-form-sound-changes'],
    reinforcedGrammarTags: ['verb-forms', 'request', 'permission'],
    scenarioTags: ['requests', 'permission', 'daily-actions'],
  },
  {
    packNumber: 28,
    packId: 'pack-28-action-sequence-with-te-and-tekara',
    title: 'Action sequence with て and てから',
    theme: 'short everyday action chains with それから and てから',
    batch: 'batch-04-te-form-foundations',
    status: 'shipped',
    grammarLessonIds: ['grammar-action-sequence-te-sorekara', 'grammar-action-sequence-tekara'],
    missionIds: [
      'mission-grammar-action-sequence',
      'mission-listening-action-sequence',
      'mission-output-action-sequence',
    ],
    introducedGrammarTags: ['action-sequence-te', 'action-sequence-tekara'],
    reinforcedGrammarTags: ['verb-forms', 'daily-routine', 'movement'],
    scenarioTags: ['daily-routine', 'study', 'shopping'],
  },
  {
    packNumber: 29,
    packId: 'pack-29-ongoing-state-with-teimasu',
    title: 'Ongoing state with ています',
    theme: 'carefully limited current-action and stable-present ています lines',
    batch: 'batch-04-te-form-foundations',
    status: 'shipped',
    grammarLessonIds: ['grammar-progressive-actions-teimasu', 'grammar-progressive-states-teimasu'],
    missionIds: [
      'mission-grammar-progressive-states',
      'mission-listening-progressive-states',
      'mission-output-progressive-states',
    ],
    introducedGrammarTags: ['progressive-actions', 'progressive-states'],
    reinforcedGrammarTags: ['verb-forms', 'location', 'daily-routine'],
    scenarioTags: ['current-state', 'meetups', 'study'],
  },
  {
    packNumber: 30,
    packId: 'pack-30-adjective-negative-and-contrast',
    title: 'Adjective negative and contrast',
    theme: 'negative adjective descriptions with a clear い-adjective and な-adjective contrast',
    batch: 'batch-05-adjective-depth',
    status: 'shipped',
    grammarLessonIds: ['grammar-adjective-negatives-i', 'grammar-adjective-negatives-na'],
    missionIds: [
      'mission-grammar-adjective-negatives',
      'mission-listening-adjective-negatives',
      'mission-output-adjective-negatives',
    ],
    introducedGrammarTags: ['adjective-negative-i', 'adjective-negative-na'],
    reinforcedGrammarTags: ['adjectives', 'description', 'predicate'],
    scenarioTags: ['descriptions', 'shopping', 'food-and-drink'],
  },
  {
    packNumber: 31,
    packId: 'pack-31-adjective-past-and-description-recall',
    title: 'Adjective past and description recall',
    theme: 'past adjective impressions and condition recall for familiar people, things, food, and places',
    batch: 'batch-05-adjective-depth',
    status: 'shipped',
    grammarLessonIds: ['grammar-adjective-past-i', 'grammar-adjective-past-na'],
    missionIds: [
      'mission-grammar-adjective-past-descriptions',
      'mission-listening-adjective-past-descriptions',
      'mission-output-adjective-past-descriptions',
    ],
    introducedGrammarTags: ['adjective-past-i', 'adjective-past-na'],
    reinforcedGrammarTags: ['adjectives', 'description', 'predicate'],
    scenarioTags: ['descriptions', 'food-and-drink', 'memory'],
  },
  {
    packNumber: 32,
    packId: 'pack-32-comparison-with-yori-houga',
    title: 'Comparison with より / ほうが',
    theme: 'simple adjective and preference comparisons across food, places, transport, and hobbies',
    batch: 'batch-05-adjective-depth',
    status: 'shipped',
    grammarLessonIds: ['grammar-comparison-yori-houga-adjectives', 'grammar-comparison-yori-houga-preferences'],
    missionIds: [
      'mission-grammar-comparisons-yori-houga',
      'mission-listening-comparisons-yori-houga',
      'mission-output-comparisons-yori-houga',
    ],
    introducedGrammarTags: ['comparison-yori-houga-adjectives', 'comparison-yori-houga-preferences'],
    reinforcedGrammarTags: ['adjectives', 'description', 'preference'],
    scenarioTags: ['comparisons', 'preferences', 'transport'],
  },
  {
    packNumber: 33,
    packId: 'pack-33-superlatives-with-ichiban',
    title: 'Superlatives with いちばん',
    theme: 'strongest likes and strongest adjective descriptions in a small familiar set',
    batch: 'batch-06-superlatives-frequency-reasons',
    status: 'shipped',
    grammarLessonIds: ['grammar-superlatives-ichiban-preferences', 'grammar-superlatives-ichiban-adjectives'],
    missionIds: [
      'mission-grammar-superlatives-ichiban',
      'mission-listening-superlatives-ichiban',
      'mission-output-superlatives-ichiban',
    ],
    introducedGrammarTags: ['superlatives-ichiban-preferences', 'superlatives-ichiban-adjectives'],
    reinforcedGrammarTags: ['comparison', 'preference', 'adjectives'],
    scenarioTags: ['preferences', 'descriptions', 'comparisons'],
  },
  {
    packNumber: 34,
    packId: 'pack-34-frequency-adverbs-and-routine-variation',
    title: 'Frequency adverbs and routine variation',
    theme: 'everyday routines with いつも, よく, ときどき, and beginner-safe あまり ... ません',
    batch: 'batch-06-superlatives-frequency-reasons',
    status: 'shipped',
    grammarLessonIds: ['grammar-frequency-adverbs-routine', 'grammar-frequency-adverbs-amari-masen'],
    missionIds: [
      'mission-grammar-frequency-adverbs',
      'mission-listening-frequency-adverbs',
      'mission-output-frequency-adverbs',
    ],
    introducedGrammarTags: ['frequency-adverbs-routine', 'frequency-adverbs-amari-masen'],
    reinforcedGrammarTags: ['daily-routine', 'verb-forms', 'negative'],
    scenarioTags: ['daily-routine', 'food-and-drink', 'hobbies'],
  },
  {
    packNumber: 35,
    packId: 'pack-35-simple-reasons-with-kara',
    title: 'Simple reasons with から',
    theme: 'short polite reasons for choices, routines, and refusals with familiar beginner content',
    batch: 'batch-06-superlatives-frequency-reasons',
    status: 'shipped',
    grammarLessonIds: ['grammar-reasons-kara-choices', 'grammar-reasons-kara-refusals'],
    missionIds: [
      'mission-grammar-reasons-kara',
      'mission-listening-reasons-kara',
      'mission-output-reasons-kara',
    ],
    introducedGrammarTags: ['reasons-kara-choices', 'reasons-kara-refusals'],
    reinforcedGrammarTags: ['frequency', 'adjectives', 'daily-routine'],
    scenarioTags: ['reasons', 'choices', 'refusals'],
  },
  {
    packNumber: 36,
    packId: 'pack-36-desire-with-tai',
    title: 'Desire with たいです',
    theme: 'short personal wants about places to go and things to do',
    batch: 'batch-07-desire-wants-and-ability',
    status: 'shipped',
    grammarLessonIds: ['grammar-desire-tai-places', 'grammar-desire-tai-actions'],
    missionIds: ['mission-grammar-desire-tai', 'mission-listening-desire-tai', 'mission-output-desire-tai'],
    introducedGrammarTags: ['desire-tai-places', 'desire-tai-actions'],
    reinforcedGrammarTags: ['movement', 'verb-forms', 'destination-ni'],
    scenarioTags: ['plans', 'food-and-drink', 'study'],
  },
  {
    packNumber: 37,
    packId: 'pack-37-object-desire-with-hoshii',
    title: 'Object desire with ほしいです',
    theme: 'wanted things in shopping and everyday object-focused contexts',
    batch: 'batch-07-desire-wants-and-ability',
    status: 'shipped',
    grammarLessonIds: ['grammar-object-desire-hoshii', 'grammar-object-desire-hoshii-questions'],
    missionIds: [
      'mission-grammar-object-desire-hoshii',
      'mission-listening-object-desire-hoshii',
      'mission-output-object-desire-hoshii',
    ],
    introducedGrammarTags: ['desire-object-hoshii', 'desire-object-hoshii-questions'],
    reinforcedGrammarTags: ['shopping', 'noun-linking', 'question'],
    scenarioTags: ['shopping', 'requests', 'daily-life'],
  },
  {
    packNumber: 38,
    packId: 'pack-38-ability-with-kotoga-dekimasu',
    title: 'Ability with ことができます',
    theme: 'simple can-do statements and questions in daily beginner contexts',
    batch: 'batch-07-desire-wants-and-ability',
    status: 'shipped',
    grammarLessonIds: ['grammar-ability-kotoga-dekimasu-actions', 'grammar-ability-kotoga-dekimasu-questions'],
    missionIds: [
      'mission-grammar-ability-kotoga-dekimasu',
      'mission-listening-ability-kotoga-dekimasu',
      'mission-output-ability-kotoga-dekimasu',
    ],
    introducedGrammarTags: ['ability-kotoga-dekimasu-actions', 'ability-kotoga-dekimasu-questions'],
    reinforcedGrammarTags: ['verb-forms', 'question', 'daily-routine'],
    scenarioTags: ['ability', 'study', 'transport'],
  },
  {
    packNumber: 39,
    packId: 'pack-39-experience-with-takotoga-arimasu',
    title: 'Experience with たことがあります',
    theme: 'fixed prior-experience lines about places visited and things tried before',
    batch: 'batch-08-experience-companions-and-choices',
    status: 'shipped',
    grammarLessonIds: [
      'grammar-experience-takotoga-arimasu-places',
      'grammar-experience-takotoga-arimasu-activities',
    ],
    missionIds: [
      'mission-grammar-experience-takotoga-arimasu',
      'mission-listening-experience-takotoga-arimasu',
      'mission-output-experience-takotoga-arimasu',
    ],
    introducedGrammarTags: ['experience-takotoga-arimasu-places', 'experience-takotoga-arimasu-activities'],
    reinforcedGrammarTags: ['verb-forms', 'movement', 'question'],
    scenarioTags: ['experience', 'travel', 'food-and-drink'],
  },
  {
    packNumber: 40,
    packId: 'pack-40-companions-and-methods',
    title: 'With whom and how',
    theme: 'simple follow-up questions about companions and transport methods',
    batch: 'batch-08-experience-companions-and-choices',
    status: 'shipped',
    grammarLessonIds: ['grammar-companions-dare-to', 'grammar-methods-douyatte-transport'],
    missionIds: [
      'mission-grammar-companions-and-methods',
      'mission-listening-companions-and-methods',
      'mission-output-companions-and-methods',
    ],
    introducedGrammarTags: ['companions-dare-to', 'methods-douyatte-transport'],
    reinforcedGrammarTags: ['question', 'transport-de', 'destination-ni'],
    scenarioTags: ['plans', 'transport', 'meetups'],
  },
  {
    packNumber: 41,
    packId: 'pack-41-choosing-with-dore-dono-dochira',
    title: 'Choosing with どれ / どの / どちら',
    theme: 'short choice questions and answers for items, meals, transport, and simple plans',
    batch: 'batch-08-experience-companions-and-choices',
    status: 'shipped',
    grammarLessonIds: ['grammar-choice-dore-dono-items', 'grammar-choice-dochira-decisions'],
    missionIds: [
      'mission-grammar-choices-dore-dono-dochira',
      'mission-listening-choices-dore-dono-dochira',
      'mission-output-choices-dore-dono-dochira',
    ],
    introducedGrammarTags: ['choices-dore-dono-items', 'choices-dochira-decisions'],
    reinforcedGrammarTags: ['question', 'shopping', 'noun-linking'],
    scenarioTags: ['shopping', 'choices', 'plans'],
  },
  {
    packNumber: 42,
    packId: 'pack-42-health-and-condition-basics',
    title: 'Health and condition basics',
    theme: 'short condition checks, simple physical-state lines, and basic help-seeking actions',
    batch: 'batch-09-health-weather-and-travel-friction',
    status: 'shipped',
    grammarLessonIds: ['grammar-health-condition-basics', 'grammar-health-simple-response-and-action'],
    missionIds: [
      'mission-grammar-health-condition',
      'mission-listening-health-condition',
      'mission-output-health-condition',
    ],
    introducedGrammarTags: ['health-condition-basics', 'health-response-and-action'],
    reinforcedGrammarTags: ['question', 'negative', 'daily-routine'],
    scenarioTags: ['health', 'condition', 'daily-life'],
  },
  {
    packNumber: 43,
    packId: 'pack-43-weather-clothing-and-comfort',
    title: 'Weather, clothing, and comfort',
    theme: 'simple comfort lines about hot, cold, rain, and practical clothing or item choices',
    batch: 'batch-09-health-weather-and-travel-friction',
    status: 'shipped',
    grammarLessonIds: ['grammar-weather-comfort-basics', 'grammar-weather-practical-choices'],
    missionIds: [
      'mission-grammar-weather-and-comfort',
      'mission-listening-weather-and-comfort',
      'mission-output-weather-and-comfort',
    ],
    introducedGrammarTags: ['weather-comfort-basics', 'weather-practical-choices'],
    reinforcedGrammarTags: ['adjectives', 'reason', 'daily-routine'],
    scenarioTags: ['weather', 'clothing', 'daily-life'],
  },
  {
    packNumber: 44,
    packId: 'pack-44-travel-steps-and-movement-changes',
    title: 'Travel steps and movement changes',
    theme: 'simple lines for getting on and off, changing transport, leaving, and arriving',
    batch: 'batch-09-health-weather-and-travel-friction',
    status: 'shipped',
    grammarLessonIds: ['grammar-travel-steps-getting-on-and-off', 'grammar-travel-steps-changing-and-arrival'],
    missionIds: [
      'mission-grammar-travel-steps',
      'mission-listening-travel-steps',
      'mission-output-travel-steps',
    ],
    introducedGrammarTags: ['travel-steps-getting-on-off', 'travel-steps-changing-arrival'],
    reinforcedGrammarTags: ['movement', 'destination-ni', 'transport-de'],
    scenarioTags: ['travel', 'transport', 'movement'],
  },
  {
    packNumber: 45,
    packId: 'pack-45-delays-problems-and-contacting-others',
    title: 'Delays, problems, and contacting others',
    theme: 'short beginner-safe lines for delays, practical friction, and contacting someone when plans slip',
    batch: 'batch-10-realistic-friction-and-plain-preparation',
    status: 'shipped',
    grammarLessonIds: ['grammar-problems-okuremasu', 'grammar-problems-muzukashii-renraku'],
    missionIds: [
      'mission-grammar-travel-problems',
      'mission-listening-travel-problems',
      'mission-output-travel-problems',
    ],
    introducedGrammarTags: ['problems-okuremasu', 'problems-muzukashii-renraku'],
    reinforcedGrammarTags: ['status', 'transport', 'destination-ni'],
    scenarioTags: ['travel', 'problems', 'communication'],
  },
  {
    packNumber: 46,
    packId: 'pack-46-before-after-ordering',
    title: 'Before and after ordering',
    theme: 'short noun-based before and after lines for coordination without widening into verb-short-form timing grammar',
    batch: 'batch-10-realistic-friction-and-plain-preparation',
    status: 'shipped',
    grammarLessonIds: ['grammar-before-after-maeni', 'grammar-before-after-atode'],
    missionIds: [
      'mission-grammar-before-and-after',
      'mission-listening-before-and-after',
      'mission-output-before-and-after',
    ],
    introducedGrammarTags: ['before-after-maeni', 'before-after-atode'],
    reinforcedGrammarTags: ['daily-routine', 'time-ni', 'destination-ni'],
    scenarioTags: ['timing', 'coordination', 'daily-life'],
  },
  {
    packNumber: 47,
    packId: 'pack-47-plain-style-recognition-i',
    title: 'Plain-style recognition I',
    theme: 'recognition-first exposure to short plain noun and adjective lines with very limited production',
    batch: 'batch-10-realistic-friction-and-plain-preparation',
    status: 'shipped',
    grammarLessonIds: ['grammar-plain-style-recognition-copula-and-na', 'grammar-plain-style-recognition-i-adjectives'],
    missionIds: [
      'mission-grammar-plain-style-recognition',
      'mission-listening-plain-style-recognition',
      'mission-output-plain-style-recognition',
    ],
    introducedGrammarTags: ['plain-style-recognition-copula-na', 'plain-style-recognition-i-adjectives'],
    reinforcedGrammarTags: ['adjectives', 'negative', 'health-condition-basics'],
    scenarioTags: ['reading', 'listening', 'plain-style'],
  },
  {
    packNumber: 48,
    packId: 'pack-48-plain-style-recognition-ii',
    title: 'Plain-style recognition II',
    theme: 'recognition-first exposure to short plain verb statements, negatives, past lines, and simple questions using only familiar verbs',
    batch: 'batch-11-final-n5-reinforcement-and-flow',
    status: 'shipped',
    grammarLessonIds: [
      'grammar-plain-style-recognition-verbs-present',
      'grammar-plain-style-recognition-verbs-past-and-questions',
    ],
    missionIds: [
      'mission-grammar-plain-style-recognition-ii',
      'mission-listening-plain-style-recognition-ii',
      'mission-output-plain-style-recognition-ii',
    ],
    introducedGrammarTags: ['plain-style-recognition-verbs-present', 'plain-style-recognition-verbs-past-questions'],
    reinforcedGrammarTags: ['plain-style-recognition-i-adjectives', 'verb-forms', 'daily-routine'],
    scenarioTags: ['reading', 'listening', 'plain-style'],
  },
  {
    packNumber: 49,
    packId: 'pack-49-connected-speech-everyday-flow',
    title: 'Connected speech for everyday flow',
    theme: 'short sentence-level connectors for sequence, contrast, and reason without widening into harder clause grammar',
    batch: 'batch-11-final-n5-reinforcement-and-flow',
    status: 'shipped',
    grammarLessonIds: ['grammar-connected-speech-soshite-sorekara', 'grammar-connected-speech-demo-dakara'],
    missionIds: [
      'mission-grammar-connected-speech',
      'mission-listening-connected-speech',
      'mission-output-connected-speech',
    ],
    introducedGrammarTags: ['connected-speech-soshite-sorekara', 'connected-speech-demo-dakara'],
    reinforcedGrammarTags: ['daily-routine', 'reason', 'problems-okuremasu'],
    scenarioTags: ['daily-life', 'communication', 'flow'],
  },
  {
    packNumber: 50,
    packId: 'pack-50-listing-and-flexible-choice-language',
    title: 'Listing and flexible choice language',
    theme: 'short noun-list combinations with と and や so daily-use lines sound less trapped in one-item statements',
    batch: 'batch-11-final-n5-reinforcement-and-flow',
    status: 'shipped',
    grammarLessonIds: ['grammar-listing-to-combinations', 'grammar-listing-ya-open-lists'],
    missionIds: [
      'mission-grammar-listing-and-flexible-choice',
      'mission-listening-listing-and-flexible-choice',
      'mission-output-listing-and-flexible-choice',
    ],
    introducedGrammarTags: ['listing-to-combinations', 'listing-ya-open-lists'],
    reinforcedGrammarTags: ['choice', 'shopping', 'preference'],
    scenarioTags: ['shopping', 'food-and-drink', 'choices'],
  },
];

export const contentPacks = contentPackSeeds.map(buildContentPack);

export const contentPackById = contentPacks.reduce<Record<string, ContentPack>>((record, pack) => {
  record[pack.packId] = pack;
  return record;
}, {});

export const contentPackByNumber = contentPacks.reduce<Record<number, ContentPack>>((record, pack) => {
  record[pack.packNumber] = pack;
  return record;
}, {});
