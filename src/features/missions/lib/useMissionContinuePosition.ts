import { useEffect, useMemo } from 'react';
import type { MissionType } from '../../../lib/content/types';
import {
  type ContinuePosition,
  type ContinueStateRecord,
  readContinueState,
  resolveContinuePosition,
  resolveContinueStepIndex,
  updateContinueState,
} from '../../../lib/progress/continueState';

type MissionContinueIdentity = {
  missionId: string;
  missionType: MissionType;
};

type MissionContinuePositionOptions = {
  sectionIds?: string[];
  maxItemIndex?: number;
  maxSubItemIndex?: number;
  legacySectionId?: string;
  maxLegacyStepIndex?: number;
};

type MissionContinueStartParams = MissionContinueIdentity & {
  continueState: ContinueStateRecord;
  maxStepIndex: number;
  positionOptions?: MissionContinuePositionOptions;
};

type UseInitialMissionContinuePositionParams = MissionContinueIdentity &
  MissionContinuePositionOptions & {
    maxStepIndex: number;
  };

type UseMissionContinuePositionParams = MissionContinueIdentity & {
  stepIndex: number | null;
  position: ContinuePosition | null;
};

export function resolveMissionContinueStart({
  continueState,
  missionId,
  missionType,
  maxStepIndex,
  positionOptions = {},
}: MissionContinueStartParams) {
  return {
    position: resolveContinuePosition(
      continueState,
      missionId,
      missionType,
      positionOptions,
    ),
    stepIndex: resolveContinueStepIndex(
      continueState,
      missionId,
      missionType,
      maxStepIndex,
    ),
  };
}

export function useInitialMissionContinuePosition({
  missionId,
  missionType,
  sectionIds,
  maxItemIndex,
  maxSubItemIndex,
  legacySectionId,
  maxLegacyStepIndex,
  maxStepIndex,
}: UseInitialMissionContinuePositionParams) {
  return useMemo(
    () =>
      resolveMissionContinueStart({
        continueState: readContinueState(),
        missionId,
        missionType,
        maxStepIndex,
        positionOptions: {
          sectionIds,
          maxItemIndex,
          maxSubItemIndex,
          legacySectionId,
          maxLegacyStepIndex,
        },
      }),
    [
      legacySectionId,
      maxItemIndex,
      maxLegacyStepIndex,
      maxStepIndex,
      maxSubItemIndex,
      missionId,
      missionType,
      sectionIds,
    ],
  );
}

export function useMissionContinuePosition({
  missionId,
  missionType,
  stepIndex,
  position,
}: UseMissionContinuePositionParams) {
  useEffect(() => {
    updateContinueState({
      missionId,
      missionType,
      stepIndex,
      position,
    });
  }, [
    missionId,
    missionType,
    position?.itemIndex,
    position?.sectionId,
    position?.subItemIndex,
    stepIndex,
  ]);
}

