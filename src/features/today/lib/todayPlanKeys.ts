import type { MissionSessionMode } from '../../missions/lib/missionSession';

export type TodayPlanItemKeyInput =
  | {
      kind: 'review';
    }
  | {
      kind: 'mission';
      missionId: string;
      sessionMode?: MissionSessionMode | null;
    }
  | {
      kind: 'capstone';
      capstoneStoryId: string;
      capstoneMode?: 'closeout' | 'recombination' | null;
    };

export function getTodayPlanItemKey(input: TodayPlanItemKeyInput) {
  if (input.kind === 'review') {
    return 'review-loop';
  }

  if (input.kind === 'capstone') {
    return `capstone:${input.capstoneStoryId}:${input.capstoneMode ?? 'closeout'}`;
  }

  return `mission:${input.missionId}:${input.sessionMode ?? 'default'}`;
}
