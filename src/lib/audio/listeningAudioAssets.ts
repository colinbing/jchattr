import { listeningItems } from '../../content/listeningItems';

export const GENERATED_LISTENING_AUDIO_REFS = [
  '/audio/listening/listening-self-intro.mp3',
  '/audio/listening/listening-teacher-question.mp3',
  '/audio/listening/listening-home-study.mp3',
  '/audio/listening/listening-cafe-coffee.mp3',
  '/audio/listening/listening-kore-nan.mp3',
  '/audio/listening/listening-kore-hon.mp3',
  '/audio/listening/listening-sore-shukudai.mp3',
  '/audio/listening/listening-kore-eigo-hon.mp3',
  '/audio/listening/listening-sore-nan.mp3',
] as const;

export function getListeningAudioStatus() {
  const assetSet = new Set<string>(GENERATED_LISTENING_AUDIO_REFS);
  const itemsWithAudioRef = listeningItems.filter((item) => Boolean(item.audioRef));
  const availableItems = itemsWithAudioRef.filter((item) =>
    item.audioRef ? assetSet.has(item.audioRef) : false,
  );
  const missingItems = itemsWithAudioRef.filter((item) =>
    item.audioRef ? !assetSet.has(item.audioRef) : false,
  );

  return {
    listeningItemCount: listeningItems.length,
    itemsWithAudioRefCount: itemsWithAudioRef.length,
    generatedAssetCount: GENERATED_LISTENING_AUDIO_REFS.length,
    matchedAssetCount: availableItems.length,
    missingItemCount: missingItems.length,
    missingItems,
  };
}
