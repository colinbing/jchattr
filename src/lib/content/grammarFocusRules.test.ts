import { describe, expect, it } from 'vitest';
import { getGrammarFocusTerms } from './grammarFocusRules';

describe('getGrammarFocusTerms', () => {
  it('deduplicates Japanese title terms and matching rule terms', () => {
    expect(
      getGrammarFocusTerms({
        id: 'grammar-topic-desu',
        title: 'Topic statements with は and です',
      }),
    ).toEqual(['です', 'は']);
  });

  it('returns particle focus terms for place and destination lessons', () => {
    expect(
      getGrammarFocusTerms({
        id: 'grammar-place-de',
        title: 'Place of action with で',
      }),
    ).toEqual(['で']);

    expect(
      getGrammarFocusTerms({
        id: 'grammar-destination-ni',
        title: 'Destination with に and いきます',
      }),
    ).toEqual(['いきます', 'に']);
  });

  it('keeps longer focus terms before shorter terms', () => {
    expect(
      getGrammarFocusTerms({
        id: 'grammar-comparison-yori-nohouga',
        title: 'Compare two choices',
      }),
    ).toEqual(['のほうが', 'より']);
  });

  it('extracts Japanese terms from titles without a matching rule', () => {
    expect(
      getGrammarFocusTerms({
        id: 'grammar-custom-title-only',
        title: 'Use ます and ません',
      }),
    ).toEqual(['ません', 'ます']);
  });

  it('covers plain-style verb recognition terms', () => {
    expect(
      getGrammarFocusTerms({
        id: 'grammar-plain-style-recognition-verbs-present',
        title: 'Recognize plain present verb lines',
      }),
    ).toEqual([
      'たべない',
      'のまない',
      'よまない',
      'たべる',
      'いく',
      'きく',
      'みる',
      'よむ',
    ]);
  });
});
