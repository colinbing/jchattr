import { describe, expect, it } from 'vitest';
import type { Mission } from '../../../lib/content/types';
import type { MissionAttemptSummary } from './missionCompletion';
import {
  buildFinishMissionToTodayParams,
  buildMissionCompletionRouteState,
} from './missionSession';

describe('buildFinishMissionToTodayParams', () => {
  it('keeps the Today return target and mission completion state together', () => {
    const mission = createMission();
    const attemptSummary = createAttemptSummary();

    expect(
      buildFinishMissionToTodayParams({
        mission,
        sessionMode: 'reinforce',
        attemptSummary,
      }),
    ).toEqual({
      to: '/',
      state: buildMissionCompletionRouteState(mission, 'reinforce', attemptSummary),
    });
  });
});

function createMission(): Mission {
  return {
    id: 'mission-grammar-topic-desu',
    title: 'Introduce yourself with は and です',
    type: 'grammar',
    targetSkill: 'sentence-structure',
    estimatedMinutes: 4,
    contentRefs: {
      grammarLessonIds: ['grammar-topic-desu'],
    },
  };
}

function createAttemptSummary(): MissionAttemptSummary {
  return {
    attemptedCount: 2,
    correctCount: 1,
    incorrectCount: 1,
    supportedCount: 0,
    totalCount: 2,
    isExposureComplete: true,
    isMasteryComplete: false,
  };
}
