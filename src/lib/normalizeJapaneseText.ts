export function normalizeJapaneseText(value: string) {
  return toHiragana(value)
    .normalize('NFKC')
    .replace(/\s+/g, '')
    .replace(/[。.!?！？]/g, '');
}

function toHiragana(value: string) {
  return Array.from(value).map(convertKatakanaChar).join('');
}

function convertKatakanaChar(char: string) {
  const codePoint = char.codePointAt(0);

  if (!codePoint) {
    return char;
  }

  if (codePoint >= 0x30a1 && codePoint <= 0x30f6) {
    return String.fromCodePoint(codePoint - 0x60);
  }

  return char;
}
