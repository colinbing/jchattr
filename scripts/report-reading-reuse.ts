import { getContentQaSnapshot } from './lib/contentQa';

const snapshot = getContentQaSnapshot();
const neverReusedExampleIds = snapshot.content.exampleSentences
  .map((example) => example.id)
  .filter((exampleId) => !snapshot.readingExampleIdSet.has(exampleId));
const recentPackSummaries = snapshot.packSummaries.slice(-5);

console.log('Japanese OS Reading Reuse Report');
console.log('');
console.log(
  `Examples reused in reading: ${snapshot.readingExampleIds.length}/${snapshot.content.exampleSentences.length}`,
);
console.log(`Examples never reused in reading: ${neverReusedExampleIds.length}`);

console.log('');
console.log('Per-pack linked reading reuse:');
snapshot.packSummaries.forEach((pack) => {
  const percent = Math.round(pack.readingReuseRatio * 100);
  console.log(
    `- Pack ${pack.packNumber}: ${pack.readingReuseCount}/${pack.linkedExampleCount} linked examples reused (${percent}%)`,
  );
});

console.log('');
console.log('Latest 5 packs missing reading reuse:');
const recentPacksMissingReuse = recentPackSummaries.filter((pack) => pack.readingReuseCount === 0);
if (recentPacksMissingReuse.length === 0) {
  console.log('- none');
} else {
  recentPacksMissingReuse.forEach((pack) => {
    console.log(`- Pack ${pack.packNumber}: ${pack.title}`);
  });
}

console.log('');
console.log('Sample unreused example ids by pack:');
snapshot.packSummaries.forEach((pack) => {
  const sampleIds = pack.unreusedExampleIds.slice(0, 5);
  const suffix = pack.unreusedExampleIds.length > 5 ? ' ...' : '';
  console.log(
    `- Pack ${pack.packNumber}: ${sampleIds.length ? sampleIds.join(', ') : 'none'}${suffix}`,
  );
});

console.log('');
console.log('First 20 example ids never used in reading:');
neverReusedExampleIds.slice(0, 20).forEach((exampleId) => {
  console.log(`- ${exampleId}`);
});
