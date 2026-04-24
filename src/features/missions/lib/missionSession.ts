import type { Mission, MissionType } from '../../../lib/content/types';

export type MissionSessionMode = 'default' | 'reinforce';

export type MissionCompletionSummary = {
  missionId: string;
  missionTitle: string;
  missionType: MissionType;
  targetSkill: string;
  sessionMode: MissionSessionMode;
  clearedCount: number;
  totalCount: number;
};

export type MissionCompletionRouteState = {
  missionCompletion: MissionCompletionSummary;
};

export function buildMissionCompletionRouteState(
  mission: Mission,
  sessionMode: MissionSessionMode,
  clearedCount: number,
  totalCount: number,
): MissionCompletionRouteState {
  return {
    missionCompletion: {
      missionId: mission.id,
      missionTitle: mission.title,
      missionType: mission.type,
      targetSkill: mission.targetSkill,
      sessionMode,
      clearedCount,
      totalCount,
    },
  };
}

export function selectMissionSessionItems<T>(
  items: T[],
  sessionMode: MissionSessionMode,
  rotationSeed: number,
  maxItemCount: number,
) {
  if (sessionMode !== 'reinforce' || items.length <= maxItemCount) {
    return items;
  }

  const safeCount = Math.max(1, Math.min(maxItemCount, items.length));
  const startIndex = Math.abs(rotationSeed) % items.length;

  return Array.from({ length: safeCount }, (_, index) => {
    return items[(startIndex + index) % items.length];
  });
}
