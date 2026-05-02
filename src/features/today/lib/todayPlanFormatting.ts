import type { MissionCompletionSummary } from '../../missions/lib/missionSession';
import {
  formatSkillTierLabel,
  type SkillAreaProgress,
} from '../../../lib/progress/skillMap';

export function buildMissionPracticeRecap(
  missionCompletion: MissionCompletionSummary,
) {
  const reviewItemCount = missionCompletion.incorrectCount + missionCompletion.supportedCount;
  const unitLabel = formatMissionUnitLabel(
    missionCompletion.missionType,
    missionCompletion.totalCount,
  );

  if (reviewItemCount === 0) {
    return `${missionCompletion.attemptedCount}/${missionCompletion.totalCount} ${unitLabel} attempted; ${missionCompletion.correctCount} correct.`;
  }

  return `${missionCompletion.attemptedCount}/${missionCompletion.totalCount} ${unitLabel} attempted; ${missionCompletion.correctCount} correct and ${reviewItemCount} saved for Review.`;
}

export function buildMissionSkillRecap(
  skillArea: SkillAreaProgress | null,
  missionCompletion: MissionCompletionSummary,
) {
  if (!skillArea) {
    return missionCompletion.isMasteryComplete
      ? `${formatTargetSkillLabel(missionCompletion.targetSkill)} got one clean local practice signal.`
      : `${formatTargetSkillLabel(missionCompletion.targetSkill)} got exposure practice with review pressure still open.`;
  }

  const tierLabel = formatSkillTierLabel(skillArea.tier).toLowerCase();
  const completionLabel = `${skillArea.completionCount} related finished pass${
    skillArea.completionCount === 1 ? '' : 's'
  }`;

  return missionCompletion.isMasteryComplete
    ? `${skillArea.label} is ${tierLabel}; clean pass recorded with ${completionLabel} on this device.`
    : `${skillArea.label} is ${tierLabel}; exposure recorded, but this was not a clean pass.`;
}

export function buildMissionCompletionTitle(
  missionCompletion: MissionCompletionSummary,
) {
  if (missionCompletion.isMasteryComplete) {
    return `${missionCompletion.correctCount}/${missionCompletion.totalCount} correct · clean pass`;
  }

  const reviewItemCount = missionCompletion.incorrectCount + missionCompletion.supportedCount;

  return `${missionCompletion.attemptedCount}/${missionCompletion.totalCount} attempted · ${
    missionCompletion.correctCount
  } correct${
    reviewItemCount > 0
      ? ` · ${reviewItemCount} review item${reviewItemCount === 1 ? '' : 's'}`
      : ''
  }`;
}

export function buildMissionReviewImpact(missionWeakPointCount: number) {
  if (missionWeakPointCount > 0) {
    return `${missionWeakPointCount} item${
      missionWeakPointCount === 1 ? '' : 's'
    } from this mission still ${missionWeakPointCount === 1 ? 'needs' : 'need'} review.`;
  }

  return 'No open weak point from this mission right now.';
}

export function formatMissionTypeLabel(
  type: MissionCompletionSummary['missionType'],
) {
  switch (type) {
    case 'grammar':
      return 'Grammar';
    case 'listening':
      return 'Listening';
    case 'output':
      return 'Output';
    case 'reading':
      return 'Reading';
  }
}

export function formatTargetSkillLabel(
  targetSkill: MissionCompletionSummary['targetSkill'],
) {
  return targetSkill.replace(/-/g, ' ');
}

export function formatMissionUnitLabel(
  missionType: MissionCompletionSummary['missionType'],
  totalCount: number,
) {
  const unitLabel =
    missionType === 'grammar'
      ? 'drill'
      : missionType === 'listening'
        ? 'listening check'
        : missionType === 'output'
          ? 'output task'
          : 'reading check';

  return `${unitLabel}${totalCount === 1 ? '' : 's'}`;
}
