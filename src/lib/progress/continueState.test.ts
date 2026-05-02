import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CONTINUE_STATE_STORAGE_KEY,
  clearContinueState,
  readContinueState,
  resolveContinuePosition,
  resolveContinueStepIndex,
  updateContinueState,
} from './continueState';
import { installMockWindow, type MockWindowControls } from '../../test/mockWindow';

let mockWindow: MockWindowControls;

describe('continue state progress', () => {
  beforeEach(() => {
    mockWindow = installMockWindow();
    clearContinueState();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('stores and resolves a valid legacy step index', () => {
    const continueState = updateContinueState({
      missionId: 'mission-grammar-topic-desu',
      missionType: 'grammar',
      stepIndex: 2,
      visitedAt: new Date('2026-01-01T00:00:00.000Z'),
    });

    expect(resolveContinueStepIndex(continueState, 'mission-grammar-topic-desu', 'grammar', 2)).toBe(2);
  });

  it('stores and resolves a v2 continue position', () => {
    const continueState = updateContinueState({
      missionId: 'mission-grammar-topic-desu',
      missionType: 'grammar',
      stepIndex: 2,
      position: {
        sectionId: 'drills',
        itemIndex: 1,
      },
      visitedAt: new Date('2026-01-01T00:00:00.000Z'),
    });

    expect(
      resolveContinuePosition(continueState, 'mission-grammar-topic-desu', 'grammar', {
        sectionIds: ['intro', 'examples', 'drills'],
        maxItemIndex: 1,
      }),
    ).toEqual({
      sectionId: 'drills',
      itemIndex: 1,
      subItemIndex: null,
    });
  });

  it('parses legacy continue state and derives a grammar section position', () => {
    mockWindow.setRaw(
      CONTINUE_STATE_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        lastActiveMissionId: 'mission-grammar-topic-desu',
        missionType: 'grammar',
        lastVisitedAt: '2026-01-01T00:00:00.000Z',
        stepIndex: 2,
      }),
    );

    expect(
      resolveContinuePosition(readContinueState(), 'mission-grammar-topic-desu', 'grammar', {
        sectionIds: ['intro', 'examples', 'drills'],
      }),
    ).toEqual({
      sectionId: 'drills',
      itemIndex: null,
      subItemIndex: null,
    });
  });

  it('derives item position from legacy step index for item-based missions', () => {
    mockWindow.setRaw(
      CONTINUE_STATE_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        lastActiveMissionId: 'mission-output-daily-lines',
        missionType: 'output',
        lastVisitedAt: '2026-01-01T00:00:00.000Z',
        stepIndex: 1,
      }),
    );

    expect(
      resolveContinuePosition(readContinueState(), 'mission-output-daily-lines', 'output', {
        sectionIds: ['tasks'],
        legacySectionId: 'tasks',
        maxItemIndex: 1,
      }),
    ).toEqual({
      sectionId: 'tasks',
      itemIndex: 1,
      subItemIndex: null,
    });
  });

  it('rejects mission, type, and range mismatches', () => {
    const continueState = updateContinueState({
      missionId: 'mission-grammar-topic-desu',
      missionType: 'grammar',
      stepIndex: 2,
    });

    expect(resolveContinueStepIndex(continueState, 'other-mission', 'grammar', 2)).toBeNull();
    expect(resolveContinueStepIndex(continueState, 'mission-grammar-topic-desu', 'output', 2)).toBeNull();
    expect(resolveContinueStepIndex(continueState, 'mission-grammar-topic-desu', 'grammar', 1)).toBeNull();
  });

  it('rejects invalid v2 section and item indices', () => {
    const continueState = updateContinueState({
      missionId: 'mission-grammar-topic-desu',
      missionType: 'grammar',
      position: {
        sectionId: 'drills',
        itemIndex: 2,
      },
    });

    expect(
      resolveContinuePosition(continueState, 'mission-grammar-topic-desu', 'grammar', {
        sectionIds: ['intro', 'examples'],
        maxItemIndex: 2,
      }),
    ).toBeNull();
    expect(
      resolveContinuePosition(continueState, 'mission-grammar-topic-desu', 'grammar', {
        sectionIds: ['intro', 'examples', 'drills'],
        maxItemIndex: 1,
      }),
    ).toBeNull();
  });

  it('clears only the matching active mission when a mission id is supplied', () => {
    updateContinueState({
      missionId: 'mission-grammar-topic-desu',
      missionType: 'grammar',
      stepIndex: 1,
    });

    expect(clearContinueState('other-mission').lastActiveMissionId).toBe('mission-grammar-topic-desu');
    expect(clearContinueState('mission-grammar-topic-desu').lastActiveMissionId).toBeNull();
  });

  it('falls back safely when localStorage is corrupted', () => {
    mockWindow.setRaw(CONTINUE_STATE_STORAGE_KEY, '{not valid json');

    expect(readContinueState()).toMatchObject({
      lastActiveMissionId: null,
      missionType: null,
      stepIndex: null,
      position: null,
    });
  });
});
