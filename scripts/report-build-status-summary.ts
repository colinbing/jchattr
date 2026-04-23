import { getContentQaSnapshot } from './lib/contentQa';

const snapshot = getContentQaSnapshot();
const latestPack = snapshot.contentPacks.at(-1);

console.log('Japanese OS Build Status Summary');
console.log('');
console.log('Content totals:');
console.log(`- missions: ${snapshot.content.summary.missionCount}`);
console.log(`- grammar lessons: ${snapshot.content.summary.grammarLessonCount}`);
console.log(`- vocab items: ${snapshot.content.summary.vocabCount}`);
console.log(`- example sentences: ${snapshot.content.summary.exampleCount}`);
console.log(`- listening items: ${snapshot.content.summary.listeningCount}`);
console.log(`- reading missions: ${snapshot.readingMissions.length}`);
console.log(`- reading checks: ${snapshot.readingCheckCount}`);

console.log('');
console.log('Mission type totals:');
Object.entries(snapshot.missionTypeCounts)
  .sort((left, right) => left[0].localeCompare(right[0]))
  .forEach(([type, count]) => {
    console.log(`- ${type}: ${count}`);
  });

console.log('');
console.log('Pack summary:');
console.log(`- shipped packs: ${snapshot.contentPacks.length}`);
if (latestPack) {
  console.log(`- latest pack: ${latestPack.packNumber} (${latestPack.title})`);
}

console.log('');
console.log('Listening audio summary:');
console.log(`- listening items with audioRef: ${snapshot.audioStatus.itemsWithAudioRefCount}`);
console.log(`- generated asset refs in manifest: ${snapshot.audioStatus.generatedAssetCount}`);
console.log(`- matched asset refs: ${snapshot.audioStatus.matchedAssetCount}`);
console.log(`- missing listening items: ${snapshot.audioStatus.missingItemCount}`);
