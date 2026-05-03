import { describe, expect, it } from 'vitest';
import type { Mission } from '../../../lib/content/types';
import { getStarterContent } from '../../../lib/content/loader';
import type { ContinueStateRecord } from '../../../lib/progress/continueState';
import { formatContinueDetailFromPosition } from './todayContinueDetail';

const starterContent = getStarterContent();

describe('formatContinueDetailFromPosition', () => {
  it('formats grammar drills from position without stale common-mistakes copy', () => {
    const detail = formatContinueDetail(getMission('mission-grammar-topic-desu'), {
      sectionId: 'drills',
      itemIndex: 1,
    });

    expect(detail).toBe('Resume drill 2.');
    expect(detail).not.toContain('common mistakes');
  });

  it('formats grammar examples from position', () => {
    expect(
      formatContinueDetail(getMission('mission-grammar-topic-desu'), {
        sectionId: 'examples',
        itemIndex: 0,
      }),
    ).toBe('Resume example 1.');
  });

  it('formats listening prep and checks from position', () => {
    const mission = getMission('mission-listening-place-de');

    expect(formatContinueDetail(mission, { sectionId: 'prep', itemIndex: 0 })).toBe(
      'Resume listening prep.',
    );
    expect(formatContinueDetail(mission, { sectionId: 'checks', itemIndex: 1 })).toBe(
      'Resume listening check 2.',
    );
  });

  it('formats output tasks from position', () => {
    expect(
      formatContinueDetail(getMission('mission-output-daily-lines'), {
        sectionId: 'tasks',
        itemIndex: 1,
      }),
    ).toBe('Resume output task 2.');
  });

  it('formats reading checks from position', () => {
    expect(
      formatContinueDetail(getMission('mission-reading-starter-recognition'), {
        sectionId: 'checks',
        itemIndex: 1,
      }),
    ).toBe('Resume reading check 2.');
  });

  it('falls back to legacy step index safely when position is absent', () => {
    const detail = formatContinueDetailFromPosition({
      starterContent,
      mission: getMission('mission-grammar-topic-desu'),
      continueState: createContinueState(getMission('mission-grammar-topic-desu'), {
        stepIndex: 3,
        position: null,
      }),
    });

    expect(detail).toBe('Resume drill 1.');
    expect(detail).not.toContain('common mistakes');
  });
});

function formatContinueDetail(
  mission: Mission,
  position: NonNullable<ContinueStateRecord['position']>,
) {
  return formatContinueDetailFromPosition({
    starterContent,
    mission,
    continueState: createContinueState(mission, { position }),
  });
}

function createContinueState(
  mission: Mission,
  overrides: Partial<ContinueStateRecord> = {},
): ContinueStateRecord {
  return {
    version: 2,
    lastActiveMissionId: mission.id,
    missionType: mission.type,
    lastVisitedAt: '2026-05-02T12:00:00.000Z',
    stepIndex: null,
    position: null,
    ...overrides,
  };
}

function getMission(missionId: string) {
  const mission = starterContent.byId.missions[missionId];

  if (!mission) {
    throw new Error(`Missing test mission: ${missionId}`);
  }

  return mission;
}
