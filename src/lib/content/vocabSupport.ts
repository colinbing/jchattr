import type { VocabItem } from './types';

export function getVocabItemsForExampleIds(
  vocabItems: VocabItem[],
  exampleIds: string[],
  maxItems = 8,
) {
  const exampleIdSet = new Set(exampleIds);

  if (exampleIdSet.size === 0) {
    return [];
  }

  return vocabItems
    .filter((item) => item.exampleIds.some((exampleId) => exampleIdSet.has(exampleId)))
    .slice(0, maxItems);
}
