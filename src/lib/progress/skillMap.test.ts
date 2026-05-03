import { describe, expect, it } from 'vitest';
import { starterContent } from '../content/loader';
import type { StarterContent, TargetSkill } from '../content/types';
import { getSkillMapCoverageGaps } from './skillMap';

describe('getSkillMapCoverageGaps', () => {
  it('keeps current starter content covered by visible skill-map signals', () => {
    expect(getSkillMapCoverageGaps(starterContent)).toEqual({
      unmappedGrammarLessonIds: [],
      unmappedMissionIds: [],
      unmappedMissionTargetSkills: [],
    });
  });

  it('flags a grammar lesson that is linked to a particle mission but not mapped', () => {
    const content = withAdditionalGrammarMission({
      lessonId: 'grammar-new-particle-pattern',
      missionId: 'mission-grammar-new-particle-pattern',
      targetSkill: 'particles',
    });

    expect(getSkillMapCoverageGaps(content).unmappedGrammarLessonIds).toEqual([
      'grammar-new-particle-pattern',
    ]);
    expect(getSkillMapCoverageGaps(content).unmappedMissionIds).toEqual([
      'mission-grammar-new-particle-pattern',
    ]);
  });

  it('flags mission target skills without a visible skill area', () => {
    const targetSkill = 'pitch-accent' as TargetSkill;
    const content = withAdditionalGrammarMission({
      lessonId: 'grammar-pitch-accent-basics',
      missionId: 'mission-grammar-pitch-accent-basics',
      targetSkill,
    });

    expect(getSkillMapCoverageGaps(content).unmappedMissionTargetSkills).toEqual([
      targetSkill,
    ]);
  });
});

function withAdditionalGrammarMission({
  lessonId,
  missionId,
  targetSkill,
}: {
  lessonId: string;
  missionId: string;
  targetSkill: TargetSkill;
}): StarterContent {
  const sourceLesson = starterContent.grammarLessons[0];
  const sourceMission = starterContent.missions[0];

  return {
    ...starterContent,
    grammarLessons: [
      ...starterContent.grammarLessons,
      {
        ...sourceLesson,
        id: lessonId,
        title: `Synthetic lesson ${lessonId}`,
        tags: [lessonId],
      },
    ],
    missions: [
      ...starterContent.missions,
      {
        ...sourceMission,
        id: missionId,
        title: `Synthetic mission ${missionId}`,
        targetSkill,
        contentRefs: {
          ...sourceMission.contentRefs,
          grammarLessonIds: [lessonId],
        },
      },
    ],
  };
}
