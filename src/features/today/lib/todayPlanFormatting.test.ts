import { describe, expect, it } from 'vitest';
import type { MissionCompletionSummary } from '../../missions/lib/missionSession';
import type { SkillAreaProgress } from '../../../lib/progress/skillMap';
import {
  buildMissionCompletionTitle,
  buildMissionPracticeRecap,
  buildMissionReviewImpact,
  buildMissionSkillRecap,
  formatMissionTypeLabel,
  formatMissionUnitLabel,
  formatTargetSkillLabel,
} from './todayPlanFormatting';

const baseMissionCompletion: MissionCompletionSummary = {
  missionId: 'mission-grammar-topic-desu',
  missionTitle: 'Introduce yourself with は and です',
  missionType: 'grammar',
  targetSkill: 'sentence-structure',
  sessionMode: 'default',
  attemptedCount: 2,
  correctCount: 2,
  incorrectCount: 0,
  supportedCount: 0,
  clearedCount: 2,
  totalCount: 2,
  isExposureComplete: true,
  isMasteryComplete: true,
};

describe('today plan formatting', () => {
  it('formats a clean mission completion title without review pressure', () => {
    expect(buildMissionCompletionTitle(baseMissionCompletion)).toBe(
      '2/2 correct · clean pass',
    );
  });

  it('formats an exposure completion title with review pressure', () => {
    expect(
      buildMissionCompletionTitle({
        ...baseMissionCompletion,
        correctCount: 1,
        incorrectCount: 1,
        isMasteryComplete: false,
      }),
    ).toBe('2/2 attempted · 1 correct · 1 review item');
  });

  it('formats mission practice recap with supported and missed items saved for Review', () => {
    expect(
      buildMissionPracticeRecap({
        ...baseMissionCompletion,
        missionType: 'listening',
        attemptedCount: 3,
        correctCount: 1,
        incorrectCount: 1,
        supportedCount: 1,
        totalCount: 3,
        isMasteryComplete: false,
      }),
    ).toBe('3/3 listening checks attempted; 1 correct and 2 saved for Review.');
  });

  it('formats skill signal copy with and without a skill area', () => {
    const skillArea: SkillAreaProgress = {
      id: 'sentence-structure',
      label: 'Sentence structure',
      tier: 'solid',
      completionCount: 1,
      weakPointCount: 0,
      totalMisses: 0,
      relatedMissionCount: 3,
      note: 'Stable',
    };

    expect(buildMissionSkillRecap(skillArea, baseMissionCompletion)).toBe(
      'Sentence structure is solid; clean pass recorded with 1 related finished pass on this device.',
    );
    expect(
      buildMissionSkillRecap(null, {
        ...baseMissionCompletion,
        correctCount: 1,
        incorrectCount: 1,
        isMasteryComplete: false,
      }),
    ).toBe('sentence structure got exposure practice with review pressure still open.');
  });

  it('formats mission labels and review impact copy', () => {
    expect(formatMissionTypeLabel('reading')).toBe('Reading');
    expect(formatTargetSkillLabel('output-confidence')).toBe('output confidence');
    expect(formatMissionUnitLabel('output', 1)).toBe('output task');
    expect(formatMissionUnitLabel('output', 2)).toBe('output tasks');
    expect(buildMissionReviewImpact(0)).toBe('No open weak point from this mission right now.');
    expect(buildMissionReviewImpact(2)).toBe(
      '2 items from this mission still need review.',
    );
  });
});
