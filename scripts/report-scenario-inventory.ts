import { createScenarioInventory } from '../src/lib/content/scenarioInventory';
import { getContentQaSnapshot, sortCountEntries } from './lib/contentQa';

const snapshot = getContentQaSnapshot();
const inventory = createScenarioInventory(
  snapshot.content.missions,
  snapshot.contentPacks.map((pack) => pack.packNumber),
);

console.log('Japanese OS Scenario Inventory Report');
console.log('');
console.log(`Scenario missions: ${inventory.scenarioMissions.length}`);
console.log(
  `Covered packs: ${
    inventory.packCoverage.filter((pack) => pack.scenarioMissionIds.length > 0).length
  }/${inventory.packCoverage.length}`,
);
console.log(
  `Uncovered pack ranges: ${
    inventory.uncoveredPackRanges.length ? inventory.uncoveredPackRanges.join(', ') : 'none'
  }`,
);

console.log('');
console.log('Scenario setting coverage:');
if (Object.keys(inventory.settingCounts).length === 0) {
  console.log('- none');
} else {
  sortCountEntries(inventory.settingCounts).forEach(([setting, count]) => {
    console.log(`- ${setting}: ${count}`);
  });
}

console.log('');
console.log('Scenario missions:');
if (inventory.scenarioMissions.length === 0) {
  console.log('- none');
} else {
  inventory.scenarioMissions.forEach((mission) => {
    console.log(
      `- ${mission.missionId}: ${mission.setting} | packs ${mission.sourcePackIds.join(', ')} | ${mission.stepCount} moves | unlocks from ${mission.requiredMissionIds.join(', ') || 'none'}`,
    );
  });
}

console.log('');
console.log('Pack coverage:');
inventory.packCoverage.forEach((pack) => {
  console.log(
    `- Pack ${pack.packNumber}: ${pack.scenarioMissionIds.length ? pack.scenarioMissionIds.join(', ') : 'none'}`,
  );
});

console.log('');
console.log('Unsupported gaps:');
if (inventory.gaps.length === 0) {
  console.log('- none');
} else {
  inventory.gaps.forEach((gap) => {
    console.log(`- [${gap.severity}] ${gap.scope}: ${gap.message}`);
  });
}
