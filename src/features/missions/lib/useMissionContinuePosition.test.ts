import { describe, expect, it } from 'vitest';
import type { ContinueStateRecord } from '../../../lib/progress/continueState';
import { resolveMissionContinueStart } from './useMissionContinuePosition';

describe('resolveMissionContinueStart', () => {
  it('preserves grammar section and item resume positions', () => {
    const start = resolveMissionContinueStart({
      continueState: createContinueState({
        lastActiveMissionId: 'mission-grammar-topic-desu',
        missionType: 'grammar',
        stepIndex: 1,
        position: {
          sectionId: 'examples',
          itemIndex: 0,
        },
      }),
      missionId: 'mission-grammar-topic-desu',
      missionType: 'grammar',
      maxStepIndex: 2,
      positionOptions: {
        sectionIds: ['intro', 'examples', 'drills'],
        maxItemIndex: 1,
      },
    });

    expect(start).toEqual({
      position: {
        sectionId: 'examples',
        itemIndex: 0,
        subItemIndex: null,
      },
      stepIndex: 1,
    });
  });

  it('maps legacy item-based step indexes into the configured section', () => {
    const start = resolveMissionContinueStart({
      continueState: createContinueState({
        lastActiveMissionId: 'mission-listening-place-de',
        missionType: 'listening',
        stepIndex: 2,
        position: null,
      }),
      missionId: 'mission-listening-place-de',
      missionType: 'listening',
      maxStepIndex: 4,
      positionOptions: {
        sectionIds: ['prep', 'checks'],
        legacySectionId: 'checks',
        maxItemIndex: 4,
      },
    });

    expect(start).toEqual({
      position: {
        sectionId: 'checks',
        itemIndex: 2,
        subItemIndex: null,
      },
      stepIndex: 2,
    });
  });

  it('rejects mission mismatches for both position and step index', () => {
    const start = resolveMissionContinueStart({
      continueState: createContinueState({
        lastActiveMissionId: 'mission-output-daily-lines',
        missionType: 'output',
        stepIndex: 1,
        position: {
          sectionId: 'tasks',
          itemIndex: 1,
        },
      }),
      missionId: 'mission-reading-starter-recognition',
      missionType: 'reading',
      maxStepIndex: 4,
      positionOptions: {
        sectionIds: ['checks'],
        legacySectionId: 'checks',
        maxItemIndex: 4,
      },
    });

    expect(start).toEqual({
      position: null,
      stepIndex: null,
    });
  });
});

function createContinueState(
  overrides: Partial<ContinueStateRecord>,
): ContinueStateRecord {
  return {
    version: 2,
    lastActiveMissionId: null,
    missionType: null,
    lastVisitedAt: null,
    stepIndex: null,
    position: null,
    ...overrides,
  };
}
