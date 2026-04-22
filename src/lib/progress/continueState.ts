import { useSyncExternalStore } from 'react';
import type { MissionType } from '../content/types';

export const CONTINUE_STATE_STORAGE_KEY = 'japanese-os.continue-state.v1';

const CONTINUE_STATE_UPDATED_EVENT = 'japanese-os:continue-state-updated';
const CONTINUE_STATE_VERSION = 1;

export interface ContinueStateRecord {
  version: number;
  lastActiveMissionId: string | null;
  missionType: MissionType | null;
  lastVisitedAt: string | null;
  stepIndex: number | null;
}

type UpdateContinueStateParams = {
  missionId: string;
  missionType: MissionType;
  stepIndex?: number | null;
  visitedAt?: Date;
};

const EMPTY_CONTINUE_STATE: ContinueStateRecord = {
  version: CONTINUE_STATE_VERSION,
  lastActiveMissionId: null,
  missionType: null,
  lastVisitedAt: null,
  stepIndex: null,
};

let cachedRawContinueState: string | null | undefined;
let cachedContinueState: ContinueStateRecord = EMPTY_CONTINUE_STATE;

export function getEmptyContinueState() {
  return EMPTY_CONTINUE_STATE;
}

export function useContinueState() {
  return useSyncExternalStore(
    subscribeToContinueState,
    readContinueState,
    getEmptyContinueState,
  );
}

export function readContinueState(): ContinueStateRecord {
  if (typeof window === 'undefined') {
    return EMPTY_CONTINUE_STATE;
  }

  try {
    const rawContinueState = window.localStorage.getItem(CONTINUE_STATE_STORAGE_KEY);

    if (rawContinueState === cachedRawContinueState) {
      return cachedContinueState;
    }

    if (!rawContinueState) {
      cachedRawContinueState = rawContinueState;
      cachedContinueState = EMPTY_CONTINUE_STATE;
      return cachedContinueState;
    }

    cachedRawContinueState = rawContinueState;
    cachedContinueState = parseContinueState(JSON.parse(rawContinueState));
    return cachedContinueState;
  } catch {
    cachedRawContinueState = undefined;
    cachedContinueState = EMPTY_CONTINUE_STATE;
    return cachedContinueState;
  }
}

export function updateContinueState({
  missionId,
  missionType,
  stepIndex = null,
  visitedAt = new Date(),
}: UpdateContinueStateParams) {
  if (!missionId.trim()) {
    return readContinueState();
  }

  const nextContinueState = parseContinueState({
    version: CONTINUE_STATE_VERSION,
    lastActiveMissionId: missionId,
    missionType,
    lastVisitedAt: visitedAt.toISOString(),
    stepIndex,
  });

  writeContinueState(nextContinueState);
  return nextContinueState;
}

export function clearContinueState(missionId?: string) {
  const currentContinueState = readContinueState();

  if (
    missionId &&
    currentContinueState.lastActiveMissionId &&
    currentContinueState.lastActiveMissionId !== missionId
  ) {
    return currentContinueState;
  }

  writeContinueState(EMPTY_CONTINUE_STATE);
  return EMPTY_CONTINUE_STATE;
}

export function resolveContinueStepIndex(
  continueState: ContinueStateRecord,
  missionId: string,
  missionType: MissionType,
  maxStepIndex: number,
) {
  if (
    continueState.lastActiveMissionId !== missionId ||
    continueState.missionType !== missionType ||
    continueState.stepIndex === null
  ) {
    return null;
  }

  if (!Number.isInteger(continueState.stepIndex)) {
    return null;
  }

  if (continueState.stepIndex < 0 || continueState.stepIndex > maxStepIndex) {
    return null;
  }

  return continueState.stepIndex;
}

function subscribeToContinueState(onStoreChange: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const handleContinueStateUpdate = () => onStoreChange();
  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === CONTINUE_STATE_STORAGE_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener(
    CONTINUE_STATE_UPDATED_EVENT,
    handleContinueStateUpdate as EventListener,
  );
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(
      CONTINUE_STATE_UPDATED_EVENT,
      handleContinueStateUpdate as EventListener,
    );
    window.removeEventListener('storage', handleStorage);
  };
}

function writeContinueState(continueState: ContinueStateRecord) {
  if (typeof window === 'undefined') {
    return;
  }

  const serializedContinueState = JSON.stringify(continueState);
  cachedRawContinueState = serializedContinueState;
  cachedContinueState = continueState;

  window.localStorage.setItem(CONTINUE_STATE_STORAGE_KEY, serializedContinueState);
  window.dispatchEvent(new Event(CONTINUE_STATE_UPDATED_EVENT));
}

function parseContinueState(rawValue: unknown): ContinueStateRecord {
  if (!isRecord(rawValue)) {
    return EMPTY_CONTINUE_STATE;
  }

  const missionId =
    typeof rawValue.lastActiveMissionId === 'string' && rawValue.lastActiveMissionId.trim()
      ? rawValue.lastActiveMissionId
      : null;
  const missionType = isMissionType(rawValue.missionType) ? rawValue.missionType : null;

  if (!missionId || !missionType) {
    return EMPTY_CONTINUE_STATE;
  }

  return {
    version: CONTINUE_STATE_VERSION,
    lastActiveMissionId: missionId,
    missionType,
    lastVisitedAt:
      typeof rawValue.lastVisitedAt === 'string' &&
      !Number.isNaN(Date.parse(rawValue.lastVisitedAt))
        ? rawValue.lastVisitedAt
        : null,
    stepIndex:
      typeof rawValue.stepIndex === 'number' &&
      Number.isInteger(rawValue.stepIndex) &&
      rawValue.stepIndex >= 0
        ? rawValue.stepIndex
        : null,
  };
}

function isMissionType(value: unknown): value is MissionType {
  return (
    value === 'grammar' ||
    value === 'listening' ||
    value === 'output' ||
    value === 'reading'
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
