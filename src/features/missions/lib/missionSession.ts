import type { Mission, MissionType } from '../../../lib/content/types';

export type MissionSessionMode = 'default' | 'reinforce';

export type MissionCompletionSummary = {
  missionId: string;
  missionTitle: string;
  missionType: MissionType;
  targetSkill: Mission['targetSkill'];
  sessionMode: MissionSessionMode;
  clearedCount: number;
  totalCount: number;
};

export type MissionCompletionRouteState = {
  missionCompletion: MissionCompletionSummary;
};

export type MissionReplayVariantMeta = {
  sessionMode: MissionSessionMode;
  variantId: string;
  sourceCount: number;
  itemCount: number;
  maxItemCount: number;
  rotationSeed: number;
  startIndex: number;
  isSubset: boolean;
};

export type MissionReplayVariant<T> = {
  items: T[];
  meta: MissionReplayVariantMeta;
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
  return selectMissionReplayVariant(items, sessionMode, rotationSeed, maxItemCount).items;
}

export function selectMissionReplayVariant<T>(
  items: T[],
  sessionMode: MissionSessionMode,
  rotationSeed: number,
  maxItemCount: number,
): MissionReplayVariant<T> {
  const safeMaxItemCount = Math.max(1, maxItemCount);
  const sourceCount = items.length;

  if (sessionMode !== 'reinforce' || sourceCount <= safeMaxItemCount) {
    return {
      items,
      meta: {
        sessionMode,
        variantId: `${sessionMode}:full:${sourceCount}`,
        sourceCount,
        itemCount: sourceCount,
        maxItemCount: safeMaxItemCount,
        rotationSeed,
        startIndex: 0,
        isSubset: false,
      },
    };
  }

  const safeCount = Math.min(safeMaxItemCount, sourceCount);
  const startIndex = Math.abs(rotationSeed) % sourceCount;
  const variantItems = Array.from({ length: safeCount }, (_, index) => {
    return items[(startIndex + index) % sourceCount];
  });

  return {
    items: variantItems,
    meta: {
      sessionMode,
      variantId: `reinforce:${sourceCount}:${safeCount}:${startIndex}`,
      sourceCount,
      itemCount: safeCount,
      maxItemCount: safeMaxItemCount,
      rotationSeed,
      startIndex,
      isSubset: true,
    },
  };
}

export function formatMissionReplayVariant(
  meta: MissionReplayVariantMeta,
  unitLabel: string,
) {
  const unit = `${unitLabel}${meta.itemCount === 1 ? '' : 's'}`;

  if (meta.sessionMode !== 'reinforce') {
    return `${meta.itemCount} ${unit}`;
  }

  if (!meta.isSubset) {
    return `Full reinforce set · ${meta.itemCount} ${unit}`;
  }

  return `Variant ${meta.startIndex + 1} · ${meta.itemCount}/${meta.sourceCount} ${unit}`;
}
