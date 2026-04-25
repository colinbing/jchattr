import type { ReactNode } from 'react';
import { hasDistinctReading } from '../lib/japaneseText';

type JapaneseTextPairProps = {
  japanese: string;
  reading: string;
  highlightTerms?: string[];
};

export function JapaneseTextPair({
  japanese,
  reading,
  highlightTerms = [],
}: JapaneseTextPairProps) {
  const showReading = hasDistinctReading(japanese, reading);

  return (
    <div className="japanese-text-pair">
      <div className="japanese-text-pair__line">
        {showReading ? (
          <p className="japanese-text-pair__label">Japanese</p>
        ) : null}
        <p className="japanese-text-pair__text japanese-text-pair__text--primary">
          {renderHighlightedText(japanese, highlightTerms)}
        </p>
      </div>
      {showReading ? (
        <div className="japanese-text-pair__line">
          <p className="japanese-text-pair__label">Reading</p>
          <p className="japanese-text-pair__text">
            {renderHighlightedText(reading, highlightTerms)}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function renderHighlightedText(text: string, highlightTerms: string[]) {
  const terms = normalizeHighlightTerms(highlightTerms);

  if (terms.length === 0) {
    return text;
  }

  const parts: ReactNode[] = [];
  let index = 0;

  while (index < text.length) {
    const term = terms.find((candidate) => {
      return text.startsWith(candidate, index) && isValidHighlightMatch(text, candidate, index);
    });

    if (!term) {
      parts.push(text[index]);
      index += 1;
      continue;
    }

    parts.push(
      <mark key={`${term}-${index}`} className="japanese-text-pair__focus">
        {term}
      </mark>,
    );
    index += term.length;
  }

  return parts;
}

function normalizeHighlightTerms(highlightTerms: string[]) {
  return Array.from(
    new Set(
      highlightTerms
        .map((term) => term.trim())
        .filter((term) => term.length > 0),
    ),
  ).sort((left, right) => right.length - left.length || left.localeCompare(right));
}

function isValidHighlightMatch(text: string, term: string, index: number) {
  const nextCharacter = text[index + term.length];

  if (term === 'か') {
    return !nextCharacter || '。？！?!'.includes(nextCharacter);
  }

  if (term === 'で') {
    return nextCharacter !== 'す';
  }

  return true;
}
