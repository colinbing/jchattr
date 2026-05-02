import type { Mission, ScenarioSetting } from './types';

export type ScenarioInventoryMission = {
  missionId: string;
  title: string;
  setting: ScenarioSetting;
  sourcePackIds: number[];
  stepCount: number;
  requiredMissionIds: string[];
};

export type ScenarioInventoryGap = {
  severity: 'warning';
  scope: string;
  message: string;
};

export type ScenarioPackCoverage = {
  packNumber: number;
  scenarioMissionIds: string[];
};

export type ScenarioInventory = {
  scenarioMissions: ScenarioInventoryMission[];
  settingCounts: Record<string, number>;
  packCoverage: ScenarioPackCoverage[];
  uncoveredPackRanges: string[];
  gaps: ScenarioInventoryGap[];
};

export function createScenarioInventory(
  missions: Mission[],
  packNumbers: number[],
): ScenarioInventory {
  const sortedPackNumbers = [...new Set(packNumbers)].sort((left, right) => left - right);
  const knownPackNumbers = new Set(sortedPackNumbers);
  const scenarioMissions = missions
    .filter((mission) => mission.scenario?.kind === 'scenario')
    .map<ScenarioInventoryMission>((mission) => ({
      missionId: mission.id,
      title: mission.title,
      setting: mission.scenario!.setting,
      sourcePackIds: [...mission.scenario!.sourcePackIds].sort((left, right) => left - right),
      stepCount: mission.scenario!.steps.length,
      requiredMissionIds: mission.unlockRules?.requiredMissionIds ?? [],
    }));
  const settingCounts = scenarioMissions.reduce<Record<string, number>>((record, mission) => {
    record[mission.setting] = (record[mission.setting] ?? 0) + 1;
    return record;
  }, {});
  const packCoverage = sortedPackNumbers.map<ScenarioPackCoverage>((packNumber) => ({
    packNumber,
    scenarioMissionIds: scenarioMissions
      .filter((mission) => mission.sourcePackIds.includes(packNumber))
      .map((mission) => mission.missionId),
  }));
  const uncoveredPackRanges = formatPackRanges(
    packCoverage
      .filter((coverage) => coverage.scenarioMissionIds.length === 0)
      .map((coverage) => coverage.packNumber),
  );
  const gaps: ScenarioInventoryGap[] = [];

  if (scenarioMissions.length === 0) {
    gaps.push({
      severity: 'warning',
      scope: 'Scenario inventory',
      message: 'No scenario/application missions exist yet.',
    });
  }

  uncoveredPackRanges.forEach((range) => {
    gaps.push({
      severity: 'warning',
      scope: `Packs ${range}`,
      message: 'No scenario/application mission is linked to this pack range.',
    });
  });

  scenarioMissions.forEach((mission) => {
    const unknownPackIds = mission.sourcePackIds.filter((packId) => !knownPackNumbers.has(packId));

    if (unknownPackIds.length > 0) {
      gaps.push({
        severity: 'warning',
        scope: mission.missionId,
        message: `References source pack${
          unknownPackIds.length === 1 ? '' : 's'
        } ${unknownPackIds.join(', ')} outside the shipped pack registry.`,
      });
    }
  });

  return {
    scenarioMissions,
    settingCounts,
    packCoverage,
    uncoveredPackRanges,
    gaps,
  };
}

export function formatPackRanges(packNumbers: number[]) {
  const sortedPackNumbers = [...new Set(packNumbers)].sort((left, right) => left - right);
  const ranges: string[] = [];
  let rangeStart: number | null = null;
  let previousPackNumber: number | null = null;

  sortedPackNumbers.forEach((packNumber) => {
    if (rangeStart === null || previousPackNumber === null) {
      rangeStart = packNumber;
      previousPackNumber = packNumber;
      return;
    }

    if (packNumber === previousPackNumber + 1) {
      previousPackNumber = packNumber;
      return;
    }

    ranges.push(formatPackRange(rangeStart, previousPackNumber));
    rangeStart = packNumber;
    previousPackNumber = packNumber;
  });

  if (rangeStart !== null && previousPackNumber !== null) {
    ranges.push(formatPackRange(rangeStart, previousPackNumber));
  }

  return ranges;
}

function formatPackRange(start: number, end: number) {
  return start === end ? String(start) : `${start}-${end}`;
}
