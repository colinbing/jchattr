import { hasDistinctReading } from './japaneseText';
import type { ReadingDisplayMode } from './settings/studyPreferences';

export type ReadingSupportPlacement = 'prompt' | 'reveal';

export function shouldShowReadingSupport({
  japanese,
  reading,
  mode,
  placement,
}: {
  japanese: string;
  reading: string;
  mode: ReadingDisplayMode;
  placement: ReadingSupportPlacement;
}) {
  if (!hasDistinctReading(japanese, reading) || mode === 'japanese-only') {
    return false;
  }

  if (mode === 'kana-support') {
    return placement === 'prompt';
  }

  return placement === 'reveal';
}
