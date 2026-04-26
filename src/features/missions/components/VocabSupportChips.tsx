import type { VocabItem } from '../../../lib/content/types';
import type { SeenVocabLookup } from '../../../lib/progress/seenVocab';

type VocabSupportChipsProps = {
  vocabItems: VocabItem[];
  seenVocabLookup: SeenVocabLookup;
};

export function VocabSupportChips({
  vocabItems,
  seenVocabLookup,
}: VocabSupportChipsProps) {
  if (vocabItems.length === 0) {
    return null;
  }

  const seenCount = vocabItems.filter((item) => seenVocabLookup.hasSeenVocab(item.id)).length;

  return (
    <details className="vocab-support-drawer">
      <summary className="vocab-support-drawer__summary">
        Vocab support · {seenCount}/{vocabItems.length} seen
      </summary>
      <div className="vocab-support-chip-row" aria-label="Vocabulary support">
        {vocabItems.map((item) => {
          const isSeen = seenVocabLookup.hasSeenVocab(item.id);
          const displayForm = item.kanji ? `${item.kanji} / ${item.kana}` : item.kana;

          return (
            <article
              key={item.id}
              className={`vocab-support-chip${
                isSeen ? ' vocab-support-chip--seen' : ' vocab-support-chip--new'
              }`}
            >
              <span className="vocab-support-chip__form">{displayForm}</span>
              <span className="vocab-support-chip__meaning">{item.meaning}</span>
              <span className="vocab-support-chip__status">
                {isSeen ? 'Seen' : 'New'}
              </span>
            </article>
          );
        })}
      </div>
    </details>
  );
}
