import { getContentQaSnapshot, sortCountEntries } from './lib/contentQa';

const snapshot = getContentQaSnapshot();
const recentPackSummaries = snapshot.packSummaries.slice(-5);

console.log('Japanese OS Content Coverage Report');
console.log('');
console.log(`Shipped packs: ${snapshot.contentPacks.length}`);
console.log(`Grammar lessons: ${snapshot.content.summary.grammarLessonCount}`);
console.log(`Vocab items: ${snapshot.content.summary.vocabCount}`);
console.log(`Example sentences: ${snapshot.content.summary.exampleCount}`);
console.log(`Listening items: ${snapshot.content.summary.listeningCount}`);
console.log(`Missions: ${snapshot.content.summary.missionCount}`);
console.log(`Reading missions: ${snapshot.readingMissions.length}`);
console.log(`Reading checks: ${snapshot.readingCheckCount}`);

console.log('');
console.log('Mission type totals:');
sortCountEntries(snapshot.missionTypeCounts).forEach(([type, count]) => {
  console.log(`- ${type}: ${count}`);
});

console.log('');
console.log('Pack-linked coverage:');
snapshot.packSummaries.forEach((pack) => {
  console.log(
    `- Pack ${pack.packNumber}: ${pack.title} | lessons ${pack.linkedGrammarLessonCount}, vocab ${pack.linkedVocabCount}, examples ${pack.linkedExampleCount}, listening ${pack.linkedListeningCount}, missions ${pack.linkedMissionCount}`,
  );
});

console.log('');
console.log('Introduced grammar tag frequency:');
sortCountEntries(snapshot.introducedGrammarTagCounts).forEach(([tag, count]) => {
  console.log(`- ${tag}: ${count}`);
});

console.log('');
console.log('Reinforced grammar tag frequency:');
sortCountEntries(snapshot.reinforcedGrammarTagCounts).forEach(([tag, count]) => {
  console.log(`- ${tag}: ${count}`);
});

console.log('');
console.log('Scenario lane frequency:');
sortCountEntries(snapshot.scenarioTagCounts).forEach(([tag, count]) => {
  console.log(`- ${tag}: ${count}`);
});

console.log('');
console.log('Vocab part-of-speech distribution:');
sortCountEntries(snapshot.vocabPartOfSpeechCounts).forEach(([partOfSpeech, count]) => {
  console.log(`- ${partOfSpeech}: ${count}`);
});

console.log('');
console.log('Reading reuse for the latest 5 packs:');
recentPackSummaries.forEach((pack) => {
  const percent = Math.round(pack.readingReuseRatio * 100);
  console.log(
    `- Pack ${pack.packNumber}: ${pack.readingReuseCount}/${pack.linkedExampleCount} linked examples reused in reading (${percent}%)`,
  );
});
