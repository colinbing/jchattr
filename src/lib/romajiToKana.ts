const ROMAJI_TO_HIRAGANA = new Map<string, string>([
  ['kya', 'きゃ'],
  ['kyu', 'きゅ'],
  ['kyo', 'きょ'],
  ['gya', 'ぎゃ'],
  ['gyu', 'ぎゅ'],
  ['gyo', 'ぎょ'],
  ['sha', 'しゃ'],
  ['shu', 'しゅ'],
  ['sho', 'しょ'],
  ['sya', 'しゃ'],
  ['syu', 'しゅ'],
  ['syo', 'しょ'],
  ['ja', 'じゃ'],
  ['ju', 'じゅ'],
  ['jo', 'じょ'],
  ['jya', 'じゃ'],
  ['jyu', 'じゅ'],
  ['jyo', 'じょ'],
  ['cha', 'ちゃ'],
  ['chu', 'ちゅ'],
  ['cho', 'ちょ'],
  ['cya', 'ちゃ'],
  ['cyu', 'ちゅ'],
  ['cyo', 'ちょ'],
  ['tya', 'ちゃ'],
  ['tyu', 'ちゅ'],
  ['tyo', 'ちょ'],
  ['nya', 'にゃ'],
  ['nyu', 'にゅ'],
  ['nyo', 'にょ'],
  ['hya', 'ひゃ'],
  ['hyu', 'ひゅ'],
  ['hyo', 'ひょ'],
  ['bya', 'びゃ'],
  ['byu', 'びゅ'],
  ['byo', 'びょ'],
  ['pya', 'ぴゃ'],
  ['pyu', 'ぴゅ'],
  ['pyo', 'ぴょ'],
  ['mya', 'みゃ'],
  ['myu', 'みゅ'],
  ['myo', 'みょ'],
  ['rya', 'りゃ'],
  ['ryu', 'りゅ'],
  ['ryo', 'りょ'],
  ['fa', 'ふぁ'],
  ['fi', 'ふぃ'],
  ['fe', 'ふぇ'],
  ['fo', 'ふぉ'],
  ['tsu', 'つ'],
  ['shi', 'し'],
  ['chi', 'ち'],
  ['fu', 'ふ'],
  ['ji', 'じ'],
  ['zu', 'ず'],
  ['da', 'だ'],
  ['de', 'で'],
  ['do', 'ど'],
  ['di', 'ぢ'],
  ['du', 'づ'],
  ['ka', 'か'],
  ['ki', 'き'],
  ['ku', 'く'],
  ['ke', 'け'],
  ['ko', 'こ'],
  ['ga', 'が'],
  ['gi', 'ぎ'],
  ['gu', 'ぐ'],
  ['ge', 'げ'],
  ['go', 'ご'],
  ['sa', 'さ'],
  ['su', 'す'],
  ['se', 'せ'],
  ['so', 'そ'],
  ['za', 'ざ'],
  ['ze', 'ぜ'],
  ['zo', 'ぞ'],
  ['ta', 'た'],
  ['te', 'て'],
  ['to', 'と'],
  ['na', 'な'],
  ['ni', 'に'],
  ['nu', 'ぬ'],
  ['ne', 'ね'],
  ['no', 'の'],
  ['ha', 'は'],
  ['hi', 'ひ'],
  ['he', 'へ'],
  ['ho', 'ほ'],
  ['ba', 'ば'],
  ['bi', 'び'],
  ['bu', 'ぶ'],
  ['be', 'べ'],
  ['bo', 'ぼ'],
  ['pa', 'ぱ'],
  ['pi', 'ぴ'],
  ['pu', 'ぷ'],
  ['pe', 'ぺ'],
  ['po', 'ぽ'],
  ['ma', 'ま'],
  ['mi', 'み'],
  ['mu', 'む'],
  ['me', 'め'],
  ['mo', 'も'],
  ['ya', 'や'],
  ['yu', 'ゆ'],
  ['yo', 'よ'],
  ['ra', 'ら'],
  ['ri', 'り'],
  ['ru', 'る'],
  ['re', 'れ'],
  ['ro', 'ろ'],
  ['wa', 'わ'],
  ['wo', 'を'],
  ['nn', 'ん'],
  ['a', 'あ'],
  ['i', 'い'],
  ['u', 'う'],
  ['e', 'え'],
  ['o', 'お'],
]);

const CONSONANTS = new Set([
  'b',
  'c',
  'd',
  'f',
  'g',
  'h',
  'j',
  'k',
  'm',
  'p',
  'q',
  'r',
  's',
  't',
  'v',
  'w',
  'x',
  'y',
  'z',
]);
const SOKUON_CONSONANTS = new Set(['c', 'k', 'p', 's', 't']);

export function convertRomajiToKana(input: string) {
  return input.replace(/[A-Za-z'-]+/g, (segment) => convertLatinSegment(segment));
}

function convertLatinSegment(segment: string) {
  const lower = segment.toLowerCase();
  let result = '';
  let index = 0;

  while (index < lower.length) {
    const current = lower[index];
    const next = lower[index + 1];

    if (
      current &&
      next &&
      current === next &&
      current !== 'n' &&
      SOKUON_CONSONANTS.has(current)
    ) {
      result += 'っ';
      index += 1;
      continue;
    }

    if (current === 'n') {
      if (next === '\'') {
        result += 'ん';
        index += 2;
        continue;
      }

      if (!next) {
        result += 'n';
        index += 1;
        continue;
      }

      if (next === 'n') {
        result += 'ん';
        index += 2;
        continue;
      }

      if (CONSONANTS.has(next) && next !== 'y') {
        result += 'ん';
        index += 1;
        continue;
      }
    }

    if (
      current &&
      next &&
      current === next &&
      current !== 'n' &&
      !SOKUON_CONSONANTS.has(current) &&
      canMatchFrom(lower, index + 1)
    ) {
      index += 1;
      continue;
    }

    const threeCharacterChunk = lower.slice(index, index + 3);
    const twoCharacterChunk = lower.slice(index, index + 2);
    const oneCharacterChunk = lower.slice(index, index + 1);
    const matched =
      ROMAJI_TO_HIRAGANA.get(threeCharacterChunk) ??
      ROMAJI_TO_HIRAGANA.get(twoCharacterChunk) ??
      ROMAJI_TO_HIRAGANA.get(oneCharacterChunk);

    if (matched) {
      result += matched;
      index += ROMAJI_TO_HIRAGANA.has(threeCharacterChunk)
        ? 3
        : ROMAJI_TO_HIRAGANA.has(twoCharacterChunk)
          ? 2
          : 1;
      continue;
    }

    result += segment[index] ?? '';
    index += 1;
  }

  return result;
}

function canMatchFrom(value: string, index: number) {
  return (
    ROMAJI_TO_HIRAGANA.has(value.slice(index, index + 3)) ||
    ROMAJI_TO_HIRAGANA.has(value.slice(index, index + 2)) ||
    ROMAJI_TO_HIRAGANA.has(value.slice(index, index + 1))
  );
}
