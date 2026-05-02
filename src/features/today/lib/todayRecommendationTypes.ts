import type { CapstoneStory, Mission } from '../../../lib/content/types';
import type { MissionSessionMode } from '../../missions/lib/missionSession';

export type TodayRecommendationPriority = 'core' | 'bonus';

export type TodayRecommendationOptions = {
  limit?: number;
};

export type TodayRecommendation =
  | {
      id: 'review-loop';
      kind: 'review';
      slotLabel: string;
      title: string;
      reason: string;
      ctaLabel: string;
      to: '/review';
      weakPointCount: number;
      batchSize: number;
      priority?: TodayRecommendationPriority;
    }
  | {
      id: string;
      kind: 'mission';
      slotLabel: string;
      title: string;
      reason: string;
      ctaLabel: string;
      to: string;
      mission: Mission;
      sessionMode: MissionSessionMode;
      personalFocus: string;
      priority?: TodayRecommendationPriority;
    }
  | {
      id: string;
      kind: 'capstone';
      slotLabel: string;
      title: string;
      reason: string;
      ctaLabel: string;
      to: string;
      capstoneStory: CapstoneStory;
      capstoneMode: 'closeout' | 'recombination';
      lineCount: number;
      checkCount: number;
      estimatedMinutes: number;
      personalFocus: string;
      priority?: TodayRecommendationPriority;
    };
