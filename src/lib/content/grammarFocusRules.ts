import type { GrammarLesson } from './types';

const GRAMMAR_FOCUS_RULES: Array<{ pattern: RegExp; terms: string[] }> = [
  { pattern: /topic-desu/, terms: ['は', 'です'] },
  { pattern: /place-de|transport-de|meeting-place-de/, terms: ['で'] },
  { pattern: /destination-ni|time-ni|weekdays-ni/, terms: ['に'] },
  { pattern: /question-nan/, terms: ['なんですか'] },
  { pattern: /existence/, terms: ['あります', 'います'] },
  { pattern: /adjectives-predicates/, terms: ['は', 'です'] },
  { pattern: /position-no|possession-no|family-possession|noun-linking/, terms: ['の'] },
  { pattern: /preference/, terms: ['が', 'すきです', 'きらいです', 'すきですか'] },
  { pattern: /where|navigation-place/, terms: ['どこですか'] },
  { pattern: /masendeshita/, terms: ['ませんでした'] },
  { pattern: /mashita/, terms: ['ました'] },
  { pattern: /masen|amari-masen/, terms: ['ません'] },
  { pattern: /masu-routine/, terms: ['ます'] },
  { pattern: /invitation-plan-questions/, terms: ['か', 'いきますか', 'あいますか'] },
  { pattern: /permission/, terms: ['てもいいですか', 'でもいいですか'] },
  { pattern: /request-te-kudasai/, terms: ['てください'] },
  { pattern: /shopping-o-kudasai|quantity-request/, terms: ['をください'] },
  { pattern: /shopping-kaimasu/, terms: ['をかいます'] },
  { pattern: /time-nanji/, terms: ['なんじですか', 'じです'] },
  { pattern: /destination-made/, terms: ['まで'] },
  { pattern: /navigation-migi-hidari/, terms: ['みぎ', 'ひだり', 'まっすぐ'] },
  { pattern: /arrival-status-updates/, terms: ['つきました', 'いま'] },
  { pattern: /suggestion-masenka/, terms: ['ませんか'] },
  { pattern: /mashou-plan-proposals/, terms: ['ましょう'] },
  { pattern: /mashou-plan-questions/, terms: ['ましょうか'] },
  { pattern: /time-ranges-kara-made/, terms: ['から', 'まで'] },
  { pattern: /calendar-when/, terms: ['いつ', 'なんがつ', 'に'] },
  { pattern: /calendar-appointment/, terms: ['に', 'から', 'まで'] },
  { pattern: /quantity-ikutsu/, terms: ['いくつ', 'ひとつ', 'ふたつ', 'みっつ', 'よっつ', 'いつつ'] },
  { pattern: /price-ikura/, terms: ['いくらですか', 'えんです'] },
  { pattern: /availability/, terms: ['ありますか', 'あります'] },
  { pattern: /action-sequence-te-sorekara/, terms: ['て', 'それから'] },
  { pattern: /action-sequence-tekara/, terms: ['てから'] },
  { pattern: /progressive|teimasu/, terms: ['ています', 'でいます'] },
  { pattern: /adjective-negatives-i/, terms: ['くないです'] },
  { pattern: /adjective-negatives-na/, terms: ['じゃないです'] },
  { pattern: /adjective-past-i/, terms: ['かったです'] },
  { pattern: /adjective-past-na/, terms: ['でした'] },
  { pattern: /comparison/, terms: ['より', 'のほうが'] },
  { pattern: /superlative/, terms: ['いちばん'] },
  { pattern: /frequency-adverbs-routine/, terms: ['いつも', 'よく', 'ときどき'] },
  { pattern: /reasons-kara/, terms: ['から'] },
  { pattern: /desire-tai/, terms: ['たいです'] },
  { pattern: /hoshii/, terms: ['ほしいです'] },
  { pattern: /ability-kotoga-dekimasu/, terms: ['ことができます'] },
  { pattern: /experience/, terms: ['たことがあります'] },
  { pattern: /companions/, terms: ['だれと', 'と'] },
  { pattern: /methods/, terms: ['どうやって', 'で'] },
  { pattern: /choice-dore-dono/, terms: ['どれ', 'どの'] },
  { pattern: /choice-dochira/, terms: ['どちら'] },
  { pattern: /before-after-maeni/, terms: ['のまえに'] },
  { pattern: /before-after-atode/, terms: ['のあとで'] },
  { pattern: /plain-style-recognition-copula/, terms: ['だ', 'じゃない'] },
  { pattern: /connected-speech-soshite/, terms: ['そして', 'それから'] },
  { pattern: /connected-speech-demo/, terms: ['でも', 'だから'] },
  { pattern: /listing-to/, terms: ['と'] },
  { pattern: /listing-ya/, terms: ['や'] },
  { pattern: /health-condition-basics/, terms: ['ですか', 'です', 'いたいです', 'あります'] },
  { pattern: /weather-comfort-basics/, terms: ['ですか', 'です'] },
  { pattern: /travel-steps-getting-on-and-off/, terms: ['にのります', 'をおります', 'のります', 'おります'] },
  { pattern: /problems-okuremasu/, terms: ['おくれます'] },
  { pattern: /plain-style-recognition-verbs-present/, terms: ['たべない', 'のまない', 'よまない', 'たべる', 'みる', 'よむ', 'いく', 'きく'] },
];

export function getGrammarFocusTerms(
  lesson: Pick<GrammarLesson, 'id' | 'title'>,
) {
  return normalizeGrammarFocusTerms([
    ...extractJapaneseTerms(lesson.title),
    ...GRAMMAR_FOCUS_RULES.flatMap((rule) =>
      rule.pattern.test(lesson.id) ? rule.terms : [],
    ),
  ]);
}

function extractJapaneseTerms(value: string) {
  return value.match(/[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ー]+/gu) ?? [];
}

function normalizeGrammarFocusTerms(terms: string[]) {
  const uniqueTerms = new Set<string>();

  terms.forEach((term) => {
    const nextTerm = term.trim();

    if (nextTerm.length > 0) {
      uniqueTerms.add(nextTerm);
    }
  });

  return Array.from(uniqueTerms).sort(
    (left, right) => right.length - left.length || left.localeCompare(right),
  );
}
