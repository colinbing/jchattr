import type { Mission, StarterContent } from '../../../lib/content/types';
import {
  getMissionProgressEntry,
  type MissionProgressRecord,
} from '../../../lib/progress/missionProgress';
import type { WeakPoint } from '../../../lib/progress/weakPoints';
import type { MissionSessionMode } from '../../missions/lib/missionSession';
import {
  formatWeakPointCount,
  type ReviewAwareness,
} from './todayRecommendationReview';
import type { TodayRecommendation } from './todayRecommendationTypes';

export type SupportMissionSelection = {
  mission: Mission;
  slotLabel: string;
  reason: string;
  ctaLabel: string;
  sessionMode: MissionSessionMode;
};

export type ReinforcementAnchor = {
  mission: Mission;
  source: 'next-step' | 'weak-point';
};

export type MissionRecommendationContext = {
  targetSkill: Mission['targetSkill'];
  grammarTags: Set<string>;
};

export type MissionPersonalization = {
  focus: string;
  directWeakPointCount: number;
  relatedWeakPointCount: number;
  completedSameSkillCount: number;
  sharedWeakPointTags: string[];
};

export function isMissionUnlocked(
  mission: Mission,
  missionProgress: MissionProgressRecord,
) {
  const requiredMissionIds = mission.unlockRules?.requiredMissionIds;

  if (!requiredMissionIds?.length) {
    return true;
  }

  return requiredMissionIds.every((requiredMissionId) => {
    return getMissionProgressEntry(missionProgress, requiredMissionId).isCompleted;
  });
}

export function isScenarioMission(mission: Mission) {
  return mission.scenario?.kind === 'scenario';
}

export function createMissionRecommendationContextById(starterContent: StarterContent) {
  return starterContent.missions.reduce<Record<string, MissionRecommendationContext>>(
    (record, mission) => {
      const grammarTags = new Set<string>();
      const exampleIds = new Set<string>(mission.contentRefs.exampleIds ?? []);

      (mission.contentRefs.grammarLessonIds ?? []).forEach((lessonId) => {
        const lesson = starterContent.byId.grammarLessons[lessonId];

        lesson?.tags
          .filter((tag) => tag !== 'n5')
          .forEach((tag) => grammarTags.add(tag));

        lesson?.exampleIds.forEach((exampleId) => {
          exampleIds.add(exampleId);
        });
      });

      mission.readingChecks?.forEach((check) => {
        exampleIds.add(check.exampleId);
      });

      exampleIds.forEach((exampleId) => {
        starterContent.byId.exampleSentences[exampleId]?.grammarTags.forEach((tag) =>
          grammarTags.add(tag),
        );
      });

      record[mission.id] = {
        targetSkill: mission.targetSkill,
        grammarTags,
      };

      return record;
    },
    {},
  );
}

export function buildMissionPersonalization(
  starterContent: StarterContent,
  mission: Mission,
  missionProgress: MissionProgressRecord,
  reviewAwareness: ReviewAwareness,
  missionContextById: Record<string, MissionRecommendationContext>,
): MissionPersonalization {
  const context = missionContextById[mission.id];
  const relatedWeakPointSummary = getRelatedWeakPointSummary(
    mission,
    reviewAwareness.weakPointList,
    missionContextById,
  );
  const completedSameSkillCount = starterContent.missions.filter((candidate) => {
    return (
      candidate.id !== mission.id &&
      candidate.targetSkill === mission.targetSkill &&
      getMissionProgressEntry(missionProgress, candidate.id).isCompleted
    );
  }).length;
  const ownTags = context
    ? getPersonalizationTags([...context.grammarTags], mission.targetSkill).slice(0, 2)
    : [];

  if (relatedWeakPointSummary.directWeakPointCount > 0) {
    return {
      ...relatedWeakPointSummary,
      completedSameSkillCount,
      focus: `${formatWeakPointCount(relatedWeakPointSummary.directWeakPointCount)} ${
        relatedWeakPointSummary.directWeakPointCount === 1 ? 'is' : 'are'
      } still tied to this mission.`,
    };
  }

  if (
    relatedWeakPointSummary.relatedWeakPointCount > 0 &&
    relatedWeakPointSummary.sharedWeakPointTags.length > 0
  ) {
    return {
      ...relatedWeakPointSummary,
      completedSameSkillCount,
      focus: `${formatFocusTargetSkill(mission.targetSkill)} linked to ${formatTagList(
        relatedWeakPointSummary.sharedWeakPointTags,
      )} review pressure.`,
    };
  }

  if (relatedWeakPointSummary.relatedWeakPointCount > 0) {
    return {
      ...relatedWeakPointSummary,
      completedSameSkillCount,
      focus: `${formatFocusTargetSkill(mission.targetSkill)} while ${formatWeakPointCount(
        relatedWeakPointSummary.relatedWeakPointCount,
      )} in that lane ${
        relatedWeakPointSummary.relatedWeakPointCount === 1 ? 'is' : 'are'
      } open.`,
    };
  }

  if (completedSameSkillCount > 0) {
    return {
      ...relatedWeakPointSummary,
      completedSameSkillCount,
      focus: `${formatFocusTargetSkill(mission.targetSkill)} after ${completedSameSkillCount} completed ${
        completedSameSkillCount === 1 ? 'mission' : 'missions'
      } in this skill.`,
    };
  }

  if (ownTags.length > 0) {
    return {
      ...relatedWeakPointSummary,
      completedSameSkillCount,
      focus: `${formatFocusTargetSkill(mission.targetSkill)} with ${formatTagList(ownTags)}.`,
    };
  }

  return {
    ...relatedWeakPointSummary,
    completedSameSkillCount,
    focus: `${formatFocusTargetSkill(mission.targetSkill)} practice.`,
  };
}

export function buildNextMissionReason(
  hasReviewRecommendation: boolean,
  reviewAwareness: ReviewAwareness,
  personalization: MissionPersonalization,
) {
  if (personalization.directWeakPointCount > 0) {
    return 'This is the next unlocked step and it also cleans up pressure already tied to this mission.';
  }

  if (personalization.relatedWeakPointCount > 0) {
    return 'This advances the path while staying close to the skill or grammar lane currently showing review pressure.';
  }

  if (personalization.completedSameSkillCount > 0) {
    return 'This keeps the path moving by building on skill work you have already finished locally.';
  }

  if (hasReviewRecommendation) {
    return 'This is the cleanest next step once the retry pass is done.';
  }

  if (reviewAwareness.hasRecentReview) {
    return 'You just finished review, so this keeps the path moving without extra noise.';
  }

  return 'This keeps the core path moving with one fresh mission.';
}

export function selectNextOpenMission(
  unlockedMissions: Mission[],
  missionProgress: MissionProgressRecord,
) {
  return unlockedMissions.find((mission) => {
    return getMissionProgressEntry(missionProgress, mission.id).completionCount === 0;
  }) ?? null;
}

export function buildNextMissionRecommendation({
  starterContent,
  mission,
  missionProgress,
  reviewAwareness,
  missionContextById,
  hasReviewRecommendation,
}: {
  starterContent: StarterContent;
  mission: Mission;
  missionProgress: MissionProgressRecord;
  reviewAwareness: ReviewAwareness;
  missionContextById: Record<string, MissionRecommendationContext>;
  hasReviewRecommendation: boolean;
}): TodayRecommendation {
  const personalization = buildMissionPersonalization(
    starterContent,
    mission,
    missionProgress,
    reviewAwareness,
    missionContextById,
  );

  return {
    id: mission.id,
    kind: 'mission',
    slotLabel: 'Next up',
    title: mission.title,
    reason: buildNextMissionReason(
      hasReviewRecommendation,
      reviewAwareness,
      personalization,
    ),
    ctaLabel: 'Open mission',
    to: `/mission/${mission.id}`,
    mission,
    sessionMode: 'default',
    personalFocus: personalization.focus,
  };
}

export function buildSupportMissionRecommendation({
  starterContent,
  supportMission,
  missionProgress,
  reviewAwareness,
  missionContextById,
}: {
  starterContent: StarterContent;
  supportMission: SupportMissionSelection;
  missionProgress: MissionProgressRecord;
  reviewAwareness: ReviewAwareness;
  missionContextById: Record<string, MissionRecommendationContext>;
}): TodayRecommendation {
  return {
    id: supportMission.mission.id,
    kind: 'mission',
    slotLabel: supportMission.slotLabel,
    title: supportMission.mission.title,
    reason: supportMission.reason,
    ctaLabel: supportMission.ctaLabel,
    to: `/mission/${supportMission.mission.id}`,
    mission: supportMission.mission,
    sessionMode: supportMission.sessionMode,
    personalFocus: buildMissionPersonalization(
      starterContent,
      supportMission.mission,
      missionProgress,
      reviewAwareness,
      missionContextById,
    ).focus,
  };
}

export function buildRemainingMissionRecommendations({
  starterContent,
  unlockedMissions,
  missionProgress,
  reviewAwareness,
  missionContextById,
  selectedMissionIds,
  limit,
}: {
  starterContent: StarterContent;
  unlockedMissions: Mission[];
  missionProgress: MissionProgressRecord;
  reviewAwareness: ReviewAwareness;
  missionContextById: Record<string, MissionRecommendationContext>;
  selectedMissionIds: Set<string>;
  limit: number;
}): TodayRecommendation[] {
  if (limit <= 0) {
    return [];
  }

  const recommendations: TodayRecommendation[] = [];
  const remainingMissions = sortRemainingMissionsByRecommendationPriority(
    unlockedMissions.filter((mission) => !selectedMissionIds.has(mission.id)),
    starterContent,
    missionProgress,
    reviewAwareness,
  );

  remainingMissions.forEach((mission) => {
    if (recommendations.length >= limit) {
      return;
    }

    const progress = getMissionProgressEntry(missionProgress, mission.id);
    const slotLabel = progress.completionCount === 0 ? 'Keep moving' : 'Light pass';
    const baseReason =
      progress.completionCount === 0
        ? 'This is another open step if you want to keep the path moving.'
        : 'This has had lighter practice than your other completed missions.';

    recommendations.push({
      id: mission.id,
      kind: 'mission',
      slotLabel,
      title: mission.title,
      reason: baseReason,
      ctaLabel: 'Open mission',
      to: `/mission/${mission.id}`,
      mission,
      sessionMode: progress.completionCount > 0 ? 'reinforce' : 'default',
      personalFocus: buildMissionPersonalization(
        starterContent,
        mission,
        missionProgress,
        reviewAwareness,
        missionContextById,
      ).focus,
    });
  });

  return recommendations;
}

export function selectSupportMission(
  unlockedMissions: Mission[],
  missionProgress: MissionProgressRecord,
  selectedMissionIds: Set<string>,
  reviewAwareness: ReviewAwareness,
  missionContextById: Record<string, MissionRecommendationContext>,
  anchor: ReinforcementAnchor | null,
): SupportMissionSelection | null {
  if (reviewAwareness.isUrgent) {
    const stabilizeMission = selectTopWeakPointMission(
      unlockedMissions,
      selectedMissionIds,
      reviewAwareness.topWeakPoint,
    );

    if (stabilizeMission) {
      return {
        mission: stabilizeMission,
        slotLabel: 'Stabilize',
        reason: buildStabilizeReason(reviewAwareness.topWeakPoint),
        ctaLabel: 'Open short pass',
        sessionMode: 'reinforce',
      };
    }
  }

  const remainingMissions = unlockedMissions.filter(
    (mission) =>
      !selectedMissionIds.has(mission.id) &&
      !reviewAwareness.recentlyReviewedMissionIds.has(mission.id),
  );
  const fallbackMissions = remainingMissions.length > 0
    ? remainingMissions
    : unlockedMissions.filter((mission) => !selectedMissionIds.has(mission.id));
  const completedCandidates = fallbackMissions.filter((mission) => {
    return getMissionProgressEntry(missionProgress, mission.id).completionCount > 0;
  });
  const alternateCompletedCandidates = completedCandidates.filter(
    (mission) => !reviewAwareness.recentlyCompletedMissionIds.has(mission.id),
  );
  const reinforceCandidates =
    alternateCompletedCandidates.length > 0
      ? alternateCompletedCandidates
      : completedCandidates;

  if (reinforceCandidates.length > 0) {
    const mission = reinforceCandidates.sort((left, right) => {
      const relatednessDelta =
        getMissionReinforcementScore(right, anchor, missionContextById) -
        getMissionReinforcementScore(left, anchor, missionContextById);

      if (relatednessDelta !== 0) {
        return relatednessDelta;
      }

      const leftProgress = getMissionProgressEntry(missionProgress, left.id);
      const rightProgress = getMissionProgressEntry(missionProgress, right.id);

      if (leftProgress.completionCount !== rightProgress.completionCount) {
        return leftProgress.completionCount - rightProgress.completionCount;
      }

      const leftTime = leftProgress.lastCompletedAt
        ? Date.parse(leftProgress.lastCompletedAt)
        : -Infinity;
      const rightTime = rightProgress.lastCompletedAt
        ? Date.parse(rightProgress.lastCompletedAt)
        : -Infinity;

      return leftTime - rightTime;
    })[0];
    const baseReason = buildReinforcementReason(
      mission,
      missionProgress,
      reviewAwareness,
      missionContextById,
      anchor,
    );

    return {
      mission,
      slotLabel: 'Reinforce',
      reason: baseReason,
      ctaLabel: 'Open short pass',
      sessionMode: 'reinforce',
    };
  }

  const mission = fallbackMissions
    .map((candidate, index) => ({ candidate, index }))
    .sort((left, right) => {
      const relatednessDelta =
        getMissionReinforcementScore(right.candidate, anchor, missionContextById) -
        getMissionReinforcementScore(left.candidate, anchor, missionContextById);

      if (relatednessDelta !== 0) {
        return relatednessDelta;
      }

      return left.index - right.index;
    })[0]?.candidate ?? null;

  if (!mission) {
    return null;
  }

  const progress = getMissionProgressEntry(missionProgress, mission.id);
  const isCompleted = progress.completionCount > 0;
  const baseReason = isCompleted
    ? buildReinforcementReason(
        mission,
        missionProgress,
        reviewAwareness,
        missionContextById,
        anchor,
      )
    : buildOpenSupportReason(mission, anchor, missionContextById);

  return {
    mission,
    slotLabel: isCompleted ? 'Light pass' : 'Keep moving',
    reason: baseReason,
    ctaLabel:
      isCompleted ? 'Open short pass' : 'Open mission',
    sessionMode: isCompleted ? 'reinforce' : 'default',
  };
}

export function sortRemainingMissionsByRecommendationPriority(
  missions: Mission[],
  starterContent: StarterContent,
  missionProgress: MissionProgressRecord,
  reviewAwareness: ReviewAwareness,
) {
  return [...missions].sort((left, right) => {
    const leftWasReviewed = reviewAwareness.recentlyReviewedMissionIds.has(left.id);
    const rightWasReviewed = reviewAwareness.recentlyReviewedMissionIds.has(right.id);

    if (leftWasReviewed !== rightWasReviewed) {
      return leftWasReviewed ? 1 : -1;
    }

    const leftProgress = getMissionProgressEntry(missionProgress, left.id);
    const rightProgress = getMissionProgressEntry(missionProgress, right.id);

    if (leftProgress.completionCount !== rightProgress.completionCount) {
      return leftProgress.completionCount - rightProgress.completionCount;
    }

    const leftTime = leftProgress.lastCompletedAt
      ? Date.parse(leftProgress.lastCompletedAt)
      : -Infinity;
    const rightTime = rightProgress.lastCompletedAt
      ? Date.parse(rightProgress.lastCompletedAt)
      : -Infinity;

    if (leftTime !== rightTime) {
      return leftTime - rightTime;
    }

    return (
      starterContent.missions.findIndex((mission) => mission.id === left.id) -
      starterContent.missions.findIndex((mission) => mission.id === right.id)
    );
  });
}

export function getFallbackReinforcementAnchor(
  unlockedMissions: Mission[],
  selectedMissionIds: Set<string>,
  topWeakPoint: WeakPoint | null,
): ReinforcementAnchor | null {
  const mission = selectTopWeakPointMission(unlockedMissions, selectedMissionIds, topWeakPoint);

  return mission ? { mission, source: 'weak-point' } : null;
}

function getRelatedWeakPointSummary(
  mission: Mission,
  weakPointList: WeakPoint[],
  missionContextById: Record<string, MissionRecommendationContext>,
) {
  const context = missionContextById[mission.id];
  const sharedWeakPointTags = new Set<string>();
  let directWeakPointCount = 0;
  let relatedWeakPointCount = 0;

  weakPointList.forEach((weakPoint) => {
    if (weakPoint.missionId === mission.id) {
      directWeakPointCount += 1;
      return;
    }

    const weakPointContext = missionContextById[weakPoint.missionId];

    if (!context || !weakPointContext) {
      return;
    }

    const sharedTags = getPersonalizationTags(
      [...context.grammarTags],
      mission.targetSkill,
    ).filter((tag) => weakPointContext.grammarTags.has(tag));
    const targetSkillMatches = context.targetSkill === weakPointContext.targetSkill;

    if (!targetSkillMatches && sharedTags.length === 0) {
      return;
    }

    relatedWeakPointCount += 1;
    sharedTags.forEach((tag) => sharedWeakPointTags.add(tag));
  });

  return {
    directWeakPointCount,
    relatedWeakPointCount,
    sharedWeakPointTags: [...sharedWeakPointTags].slice(0, 2),
  };
}

function selectTopWeakPointMission(
  unlockedMissions: Mission[],
  selectedMissionIds: Set<string>,
  topWeakPoint: WeakPoint | null,
) {
  if (!topWeakPoint) {
    return null;
  }

  return (
    unlockedMissions.find(
      (mission) =>
        mission.id === topWeakPoint.missionId && !selectedMissionIds.has(mission.id),
    ) ?? null
  );
}

function buildStabilizeReason(topWeakPoint: WeakPoint | null) {
  if (!topWeakPoint) {
    return 'This mission is tied to your most urgent open weak point, so it is the best support slot after review.';
  }

  const repeatedMisses = topWeakPoint.missCount > 1
    ? ` with ${topWeakPoint.missCount} recorded misses`
    : '';

  return `This mission owns your strongest open weak point${repeatedMisses}, so use one short stabilize pass instead of replaying the full lesson.`;
}

function buildOpenSupportReason(
  mission: Mission,
  anchor: ReinforcementAnchor | null,
  missionContextById: Record<string, MissionRecommendationContext>,
) {
  const relationSummary = anchor
    ? getMissionRelationSummary(mission, anchor, missionContextById)
    : null;

  if (!relationSummary) {
    return 'This is another unlocked mission if you want to keep the path moving.';
  }

  if (relationSummary.targetSkillMatches && relationSummary.sharedTags.length > 0) {
    return `This unlocked mission stays on ${formatTargetSkill(
      mission.targetSkill,
    )} and overlaps ${formatTagList(relationSummary.sharedTags)}, so it supports the same path lane.`;
  }

  if (relationSummary.targetSkillMatches) {
    return `This unlocked mission stays on ${formatTargetSkill(
      mission.targetSkill,
    )}, so it supports the same skill lane.`;
  }

  return `This unlocked mission overlaps ${formatTagList(
    relationSummary.sharedTags,
  )}, so it gives the next mission more context.`;
}

function buildReinforcementReason(
  mission: Mission,
  missionProgress: MissionProgressRecord,
  reviewAwareness: ReviewAwareness,
  missionContextById: Record<string, MissionRecommendationContext>,
  anchor: ReinforcementAnchor | null,
) {
  const progress = getMissionProgressEntry(missionProgress, mission.id);
  const relationSummary = anchor
    ? getMissionRelationSummary(mission, anchor, missionContextById)
    : null;

  if (relationSummary) {
    const relationAnchor = anchor;

    if (relationAnchor?.source === 'next-step') {
      return relationSummary.targetSkillMatches && relationSummary.sharedTags.length > 0
        ? `This short rotated pass stays on ${formatTargetSkill(mission.targetSkill)} and overlaps ${formatTagList(relationSummary.sharedTags)}, so it warms up the same lane as your next mission.`
        : relationSummary.targetSkillMatches
          ? `This short rotated pass stays on ${formatTargetSkill(mission.targetSkill)}, so it reinforces the same skill lane as your next mission without replaying the full mission.`
          : `This short rotated pass overlaps ${formatTagList(relationSummary.sharedTags)}, so it reinforces the same grammar lane as your next mission without replaying the full mission.`;
    }

    return relationSummary.targetSkillMatches && relationSummary.sharedTags.length > 0
      ? `This short rotated pass stays on ${formatTargetSkill(mission.targetSkill)} and overlaps ${formatTagList(relationSummary.sharedTags)}, so it reinforces the same weak-point lane without replaying the mission that created it.`
      : relationSummary.targetSkillMatches
        ? `This short rotated pass stays on ${formatTargetSkill(mission.targetSkill)}, so it reinforces the same weak-point lane without replaying the original mission.`
        : `This short rotated pass overlaps ${formatTagList(relationSummary.sharedTags)}, so it reinforces the same weak-point grammar lane without replaying the original mission.`;
  }

  if (reviewAwareness.hasRecentReview && !reviewAwareness.isUrgent) {
    return 'You reviewed recently, so this uses a shorter follow-up pass instead of another full retry loop.';
  }

  if (progress.completionCount <= 1) {
    return 'You have only finished this once, so a short rotated follow-up pass should make it stick better.';
  }

  return 'This mission has a lighter practice count than the rest, so use a short rotated pass instead of replaying the full mission.';
}

function getMissionReinforcementScore(
  mission: Mission,
  anchor: ReinforcementAnchor | null,
  missionContextById: Record<string, MissionRecommendationContext>,
) {
  if (!anchor) {
    return 0;
  }

  const relationSummary = getMissionRelationSummary(mission, anchor, missionContextById);

  if (!relationSummary) {
    return 0;
  }

  return (relationSummary.targetSkillMatches ? 6 : 0) + relationSummary.sharedTags.length * 2;
}

function getMissionRelationSummary(
  mission: Mission,
  anchor: ReinforcementAnchor,
  missionContextById: Record<string, MissionRecommendationContext>,
) {
  const missionContext = missionContextById[mission.id];
  const anchorContext = missionContextById[anchor.mission.id];

  if (!missionContext || !anchorContext) {
    return null;
  }

  const sharedTags = [...missionContext.grammarTags]
    .filter((tag) => anchorContext.grammarTags.has(tag))
    .filter((tag) => !isLowSignalGrammarTag(tag))
    .slice(0, 2);
  const targetSkillMatches = missionContext.targetSkill === anchorContext.targetSkill;

  if (!targetSkillMatches && sharedTags.length === 0) {
    return null;
  }

  return {
    targetSkillMatches,
    sharedTags,
  };
}

function isLowSignalGrammarTag(tag: string) {
  return tag === 'daily-conversation' || tag === 'daily-routine' || tag === 'n5';
}

function getHighSignalTags(tags: string[]) {
  return tags.filter((tag) => !isLowSignalGrammarTag(tag));
}

function getPersonalizationTags(tags: string[], targetSkill: Mission['targetSkill']) {
  return getHighSignalTags(tags).filter((tag) => tag !== targetSkill);
}

function formatTargetSkill(targetSkill: Mission['targetSkill']) {
  return targetSkill.replace(/-/g, ' ');
}

function formatFocusTargetSkill(targetSkill: Mission['targetSkill']) {
  const label = formatTargetSkill(targetSkill);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function formatTagList(tags: string[]) {
  return tags.map((tag) => tag.replace(/-/g, ' ')).join(' and ');
}
