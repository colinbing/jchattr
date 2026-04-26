import { contentPacks } from '../../../content/contentPacks';
import type { CapstoneStory, Mission, StarterContent } from '../../../lib/content/types';
import {
  getMissionProgressEntry,
  type MissionProgressRecord,
} from '../../../lib/progress/missionProgress';
import {
  getCapstoneProgressEntry,
  type CapstoneProgressRecord,
} from '../../../lib/progress/capstoneProgress';
import type { ReviewLoopProgress } from '../../../lib/progress/reviewLoop';
import {
  type WeakPoint,
  getWeakPointList,
  type WeakPointStore,
} from '../../../lib/progress/weakPoints';
import type { StudyFocusMode } from '../../../lib/settings/studyPreferences';
import type { MissionSessionMode } from '../../missions/lib/missionSession';
import { selectReviewBatch } from '../../review/lib/reviewBatch';

export const TODAY_RECOMMENDATION_LIMIT = 3;
const FRESH_WEAK_POINT_WINDOW_MS = 24 * 60 * 60 * 1000;
const RECENT_REVIEW_WINDOW_MS = 12 * 60 * 60 * 1000;
const RECENT_MISSION_COMPLETION_WINDOW_MS = 12 * 60 * 60 * 1000;
const URGENT_WEAK_POINT_COUNT = 3;
const REPEATED_MISS_THRESHOLD = 2;

export type TodayRecommendationPriority = 'core' | 'bonus';

export type TodayRecommendationOptions = {
  limit?: number;
  studyFocusMode?: StudyFocusMode;
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

// Keep the heuristics intentionally small and readable:
// 1. Recommend Review first when there are unresolved weak points.
// 2. Mark review as urgent when weak points are fresh, repeated, or numerous.
// 3. Recommend the next unlocked incomplete mission in starter order.
// 4. When a chapter is cleared, add its capstone as a closeout only if Review is not urgent.
// 5. Once the capstone is complete, offer bonus story-mode or recombination rereads through the same capstone surface.
// 6. Use the third slot to stabilize the mission tied to the top open weak point when review is urgent.
// 7. Otherwise recommend one reinforcement mission, preferring related alternate missions by target skill and linked grammar tags.
// 8. If slots remain, fill them with the next least-practiced unlocked missions, while lightly de-prioritizing just-reviewed missions.
export function deriveTodayRecommendations(
  starterContent: StarterContent,
  missionProgress: MissionProgressRecord,
  weakPoints: WeakPointStore,
  reviewLoopProgress: ReviewLoopProgress,
  capstoneProgress?: CapstoneProgressRecord,
  options: TodayRecommendationOptions = {},
): TodayRecommendation[] {
  const limit = options.limit ?? TODAY_RECOMMENDATION_LIMIT;
  const studyFocusMode = options.studyFocusMode ?? 'balanced';
  const recommendations: TodayRecommendation[] = [];
  const missionContextById = createMissionRecommendationContextById(starterContent);
  const selectedMissionIds = new Set<string>();
  const unlockedMissions = starterContent.missions.filter((mission) =>
    isMissionUnlocked(mission, missionProgress),
  );
  const reviewAwareness = deriveReviewAwareness(
    starterContent,
    missionProgress,
    weakPoints,
    reviewLoopProgress,
  );

  const reviewRecommendation = getReviewRecommendation(
    reviewAwareness,
  );

  if (reviewRecommendation) {
    recommendations.push(reviewRecommendation);
  }

  const nextMission = unlockedMissions.find((mission) => {
    return getMissionProgressEntry(missionProgress, mission.id).completionCount === 0;
  });

  if (nextMission) {
    const nextMissionPersonalization = buildMissionPersonalization(
      starterContent,
      nextMission,
      missionProgress,
      reviewAwareness,
      missionContextById,
    );

    recommendations.push({
      id: nextMission.id,
      kind: 'mission',
      slotLabel: 'Next up',
      title: nextMission.title,
      reason: buildNextMissionReason(
        Boolean(reviewRecommendation),
        reviewAwareness,
        nextMissionPersonalization,
      ),
      ctaLabel: 'Open mission',
      to: `/mission/${nextMission.id}`,
      mission: nextMission,
      sessionMode: 'default',
      personalFocus: nextMissionPersonalization.focus,
    });
    selectedMissionIds.add(nextMission.id);
  }

  const capstoneRecommendation = getCapstoneRecommendation(
    starterContent,
    missionProgress,
    capstoneProgress,
    reviewAwareness,
  );

  if (capstoneRecommendation) {
    recommendations.push(capstoneRecommendation);
  }

  const recombinationRecommendation = getCapstoneRecombinationRecommendation(
    starterContent,
    missionProgress,
    capstoneProgress,
    reviewAwareness,
    Boolean(capstoneRecommendation),
  );

  if (recombinationRecommendation) {
    recommendations.push(recombinationRecommendation);
  }

  const supportMission = selectSupportMission(
    unlockedMissions,
    missionProgress,
    selectedMissionIds,
    reviewAwareness,
    missionContextById,
    studyFocusMode,
    nextMission
      ? { mission: nextMission, source: 'next-step' }
      : getFallbackReinforcementAnchor(
          unlockedMissions,
          selectedMissionIds,
          reviewAwareness.topWeakPoint,
        ),
  );

  if (supportMission) {
    recommendations.push({
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
    });
    selectedMissionIds.add(supportMission.mission.id);
  }

  if (recommendations.length >= limit) {
    return recommendations.slice(0, limit);
  }

  const remainingMissions = unlockedMissions
    .filter((mission) => !selectedMissionIds.has(mission.id))
    .sort((left, right) => {
      const leftWasReviewed = reviewAwareness.recentlyReviewedMissionIds.has(left.id);
      const rightWasReviewed = reviewAwareness.recentlyReviewedMissionIds.has(right.id);

      if (leftWasReviewed !== rightWasReviewed) {
        return leftWasReviewed ? 1 : -1;
      }

      const focusDelta =
        getStudyFocusMissionScore(right, studyFocusMode, reviewAwareness, missionContextById) -
        getStudyFocusMissionScore(left, studyFocusMode, reviewAwareness, missionContextById);

      if (focusDelta !== 0) {
        return focusDelta;
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

  remainingMissions.forEach((mission) => {
    if (recommendations.length >= limit) {
      return;
    }

    const progress = getMissionProgressEntry(missionProgress, mission.id);
    const slotLabel = progress.completionCount === 0 ? 'Keep moving' : 'Light pass';
    const focusReason = buildStudyFocusReason(
      mission,
      studyFocusMode,
      reviewAwareness,
      missionContextById,
    );
    const baseReason =
      progress.completionCount === 0
        ? 'This is another open step if you want to keep the path moving.'
        : 'This has had lighter practice than your other completed missions.';

    recommendations.push({
      id: mission.id,
      kind: 'mission',
      slotLabel,
      title: mission.title,
      reason: withStudyFocusReason(baseReason, focusReason),
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

  return recommendations.slice(0, limit);
}

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

function getReviewRecommendation(
  reviewAwareness: ReviewAwareness,
): TodayRecommendation | null {
  const { weakPointList, reviewBatch } = reviewAwareness;

  if (weakPointList.length === 0 || reviewBatch.length === 0) {
    return null;
  }

  const repeatedWeakPointCount = weakPointList.filter(
    (weakPoint) => weakPoint.missCount >= REPEATED_MISS_THRESHOLD,
  ).length;
  const reviewReason = reviewAwareness.isUrgent
    ? buildUrgentReviewReason(reviewAwareness, repeatedWeakPointCount)
    : reviewAwareness.lastReviewAt
      ? `${formatWeakPointCount(weakPointList.length)} ${
          weakPointList.length === 1 ? 'is' : 'are'
        } still open after your last review pass, so start by retrying ${
          weakPointList.length === 1 ? 'it' : 'them'
        }.`
      : `${formatWeakPointCount(weakPointList.length)} ${
          weakPointList.length === 1 ? 'is' : 'are'
        } waiting for a retry, so lead with a short review batch.`;

  return {
    id: 'review-loop',
    kind: 'review',
    slotLabel: reviewAwareness.isUrgent ? 'Review now' : 'Review',
    title: reviewAwareness.isUrgent ? 'Fresh weak spots need a retry' : 'Retry weak spots first',
    reason: reviewReason,
    ctaLabel: 'Open review',
    to: '/review',
    weakPointCount: weakPointList.length,
    batchSize: reviewBatch.length,
  };
}

function getCapstoneRecommendation(
  starterContent: StarterContent,
  missionProgress: MissionProgressRecord,
  capstoneProgress: CapstoneProgressRecord | undefined,
  reviewAwareness: ReviewAwareness,
): TodayRecommendation | null {
  if (!capstoneProgress || reviewAwareness.isUrgent) {
    return null;
  }

  const capstoneStory = starterContent.capstoneStories.find((story) => {
    if (!isPrimaryCapstoneStory(story)) {
      return false;
    }

    const progressEntry = getCapstoneProgressEntry(capstoneProgress, story.id);
    const sourceMissionIds = getCapstoneSourceMissionIds(story);

    return (
      !progressEntry.isCompleted &&
      sourceMissionIds.length > 0 &&
      sourceMissionIds.every((missionId) => {
        return getMissionProgressEntry(missionProgress, missionId).isCompleted;
      })
    );
  });

  if (!capstoneStory) {
    return null;
  }

  const sourcePackLabel = formatCapstoneSourcePackLabel(capstoneStory.sourcePackIds);
  const lineCount = capstoneStory.lineIds.length;
  const checkCount = capstoneStory.checkIds.length;

  return {
    id: capstoneStory.id,
    kind: 'capstone',
    slotLabel: 'Chapter closeout',
    title: capstoneStory.title,
    reason: `${sourcePackLabel} ${
      capstoneStory.sourcePackIds.length === 1 ? 'is' : 'are'
    } clear. Wrap the chapter with one short story built from lines you have already practiced.`,
    ctaLabel: 'Read capstone',
    to: `/capstone/${capstoneStory.id}`,
    capstoneStory,
    capstoneMode: 'closeout',
    lineCount,
    checkCount,
    estimatedMinutes: capstoneStory.estimatedMinutes,
    personalFocus: `${lineCount} known-line story with ${checkCount} quick comprehension check${
      checkCount === 1 ? '' : 's'
    }.`,
  };
}

function getCapstoneRecombinationRecommendation(
  starterContent: StarterContent,
  missionProgress: MissionProgressRecord,
  capstoneProgress: CapstoneProgressRecord | undefined,
  reviewAwareness: ReviewAwareness,
  hasOpenCapstoneCloseout: boolean,
): TodayRecommendation | null {
  if (!capstoneProgress || reviewAwareness.isUrgent) {
    return null;
  }

  const naturalizedStory = starterContent.capstoneStories.find((story) => {
    if (story.variant !== 'naturalized' || !story.unlockAfterStoryId) {
      return false;
    }

    const unlockProgress = getCapstoneProgressEntry(
      capstoneProgress,
      story.unlockAfterStoryId,
    );
    const storyProgress = getCapstoneProgressEntry(capstoneProgress, story.id);
    const sourceMissionIds = getCapstoneSourceMissionIds(story);

    return (
      unlockProgress.isCompleted &&
      !storyProgress.isCompleted &&
      sourceMissionIds.length > 0 &&
      sourceMissionIds.every((missionId) => {
        return getMissionProgressEntry(missionProgress, missionId).isCompleted;
      })
    );
  });

  if (naturalizedStory) {
    const sourcePackLabel = formatCapstoneSourcePackLabel(naturalizedStory.sourcePackIds);
    const lineCount = naturalizedStory.lineIds.length;
    const checkCount = naturalizedStory.checkIds.length;

    return {
      id: `${naturalizedStory.id}-story-mode`,
      kind: 'capstone',
      slotLabel: 'Story mode',
      title: naturalizedStory.title,
      reason: `${sourcePackLabel} exact-source capstone is complete. Read the naturalized version as a bonus bridge from drills into beginner prose.`,
      ctaLabel: 'Read story mode',
      to: `/capstone/${naturalizedStory.id}?mode=recombination`,
      capstoneStory: naturalizedStory,
      capstoneMode: 'recombination',
      lineCount,
      checkCount,
      estimatedMinutes: naturalizedStory.estimatedMinutes,
      personalFocus: `${lineCount} naturalized story line${lineCount === 1 ? '' : 's'} traced back to the chapter closeout, with ${checkCount} comprehension check${checkCount === 1 ? '' : 's'}.`,
      priority: 'bonus',
    };
  }

  if (hasOpenCapstoneCloseout) {
    return null;
  }

  const capstoneStory = starterContent.capstoneStories.find((story) => {
    if (!isPrimaryCapstoneStory(story)) {
      return false;
    }

    const progressEntry = getCapstoneProgressEntry(capstoneProgress, story.id);
    const sourceMissionIds = getCapstoneSourceMissionIds(story);

    return (
      progressEntry.isCompleted &&
      sourceMissionIds.length > 0 &&
      sourceMissionIds.every((missionId) => {
        return getMissionProgressEntry(missionProgress, missionId).isCompleted;
      })
    );
  });

  if (!capstoneStory) {
    return null;
  }

  const sourcePackLabel = formatCapstoneSourcePackLabel(capstoneStory.sourcePackIds);
  const lineCount = capstoneStory.lineIds.length;
  const checkCount = capstoneStory.checkIds.length;

  return {
    id: `${capstoneStory.id}-recombination`,
    kind: 'capstone',
    slotLabel: 'Recombine',
    title: `${capstoneStory.title} reread`,
    reason: `${sourcePackLabel} capstone is already complete. Use this optional reread to recombine the same known lines without adding new work to Today.`,
    ctaLabel: 'Reread story',
    to: `/capstone/${capstoneStory.id}?mode=recombination`,
    capstoneStory,
    capstoneMode: 'recombination',
    lineCount,
    checkCount,
    estimatedMinutes: capstoneStory.estimatedMinutes,
    personalFocus: `Optional recombination pass through ${lineCount} familiar story line${
      lineCount === 1 ? '' : 's'
    } and ${checkCount} check${checkCount === 1 ? '' : 's'}.`,
    priority: 'bonus',
  };
}

function getCapstoneSourceMissionIds(story: CapstoneStory) {
  const sourcePackIds = new Set(story.sourcePackIds);

  return Array.from(
    new Set(
      contentPacks
        .filter((pack) => sourcePackIds.has(pack.packNumber))
        .flatMap((pack) => pack.missionIds),
    ),
  );
}

function isPrimaryCapstoneStory(story: CapstoneStory) {
  return story.variant !== 'naturalized' && !story.unlockAfterStoryId;
}

function formatCapstoneSourcePackLabel(sourcePackIds: number[]) {
  if (sourcePackIds.length === 0) {
    return 'The chapter packs';
  }

  const sortedPackIds = [...sourcePackIds].sort((left, right) => left - right);
  const firstPackId = sortedPackIds[0];
  const lastPackId = sortedPackIds[sortedPackIds.length - 1];

  if (firstPackId === lastPackId) {
    return `Pack ${firstPackId}`;
  }

  return `Packs ${firstPackId}-${lastPackId}`;
}

type ReviewAwareness = {
  weakPointList: WeakPoint[];
  reviewBatch: ReturnType<typeof selectReviewBatch>;
  lastReviewAt: number | null;
  latestWeakPointAt: number | null;
  hasFreshWeakPoints: boolean;
  hasRecentReview: boolean;
  isUrgent: boolean;
  topWeakPoint: WeakPoint | null;
  recentlyReviewedMissionIds: Set<string>;
  recentlyCompletedMissionIds: Set<string>;
};

type SupportMissionSelection = {
  mission: Mission;
  slotLabel: string;
  reason: string;
  ctaLabel: string;
  sessionMode: MissionSessionMode;
};

type ReinforcementAnchor = {
  mission: Mission;
  source: 'next-step' | 'weak-point';
};

type MissionRecommendationContext = {
  targetSkill: Mission['targetSkill'];
  grammarTags: Set<string>;
};

type MissionPersonalization = {
  focus: string;
  directWeakPointCount: number;
  relatedWeakPointCount: number;
  completedSameSkillCount: number;
  sharedWeakPointTags: string[];
};

function buildMissionPersonalization(
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

function buildNextMissionReason(
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
    return 'This keeps the path moving by building on skill work you have already cleared locally.';
  }

  if (hasReviewRecommendation) {
    return 'This is the cleanest next step once the retry pass is done.';
  }

  if (reviewAwareness.hasRecentReview) {
    return 'You just cleared review, so this keeps the path moving without extra noise.';
  }

  return 'This keeps the core path moving with one fresh mission.';
}

function selectSupportMission(
  unlockedMissions: Mission[],
  missionProgress: MissionProgressRecord,
  selectedMissionIds: Set<string>,
  reviewAwareness: ReviewAwareness,
  missionContextById: Record<string, MissionRecommendationContext>,
  studyFocusMode: StudyFocusMode,
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

      const focusDelta =
        getStudyFocusMissionScore(right, studyFocusMode, reviewAwareness, missionContextById) -
        getStudyFocusMissionScore(left, studyFocusMode, reviewAwareness, missionContextById);

      if (focusDelta !== 0) {
        return focusDelta;
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
    const focusReason = buildStudyFocusReason(
      mission,
      studyFocusMode,
      reviewAwareness,
      missionContextById,
    );
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
      reason: withStudyFocusReason(baseReason, focusReason),
      ctaLabel: 'Open short pass',
      sessionMode: 'reinforce',
    };
  }

  const mission = [...fallbackMissions].sort((left, right) => {
    const focusDelta =
      getStudyFocusMissionScore(right, studyFocusMode, reviewAwareness, missionContextById) -
      getStudyFocusMissionScore(left, studyFocusMode, reviewAwareness, missionContextById);

    return focusDelta !== 0 ? focusDelta : 0;
  })[0] ?? null;

  if (!mission) {
    return null;
  }

  const progress = getMissionProgressEntry(missionProgress, mission.id);
  const isCompleted = progress.completionCount > 0;
  const focusReason = buildStudyFocusReason(
    mission,
    studyFocusMode,
    reviewAwareness,
    missionContextById,
  );
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
    reason: withStudyFocusReason(baseReason, focusReason),
    ctaLabel:
      isCompleted ? 'Open short pass' : 'Open mission',
    sessionMode: isCompleted ? 'reinforce' : 'default',
  };
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

function getStudyFocusMissionScore(
  mission: Mission,
  studyFocusMode: StudyFocusMode,
  reviewAwareness: ReviewAwareness,
  missionContextById: Record<string, MissionRecommendationContext>,
) {
  switch (studyFocusMode) {
    case 'more-listening':
      return (mission.type === 'listening' ? 6 : 0) +
        (mission.targetSkill === 'listening-comprehension' ? 4 : 0);
    case 'more-output':
      return (mission.type === 'output' ? 6 : 0) +
        (mission.targetSkill === 'output-confidence' ? 4 : 0);
    case 'light-day':
      return Math.max(0, 10 - mission.estimatedMinutes);
    case 'class-prep':
      return getClassPrepMissionScore(mission);
    case 'weak-points-first': {
      const weakPointSummary = getRelatedWeakPointSummary(
        mission,
        reviewAwareness.weakPointList,
        missionContextById,
      );

      return weakPointSummary.directWeakPointCount * 6 +
        weakPointSummary.relatedWeakPointCount * 3;
    }
    case 'balanced':
      return 0;
  }
}

function getClassPrepMissionScore(mission: Mission) {
  const skillScore =
    mission.targetSkill === 'sentence-structure' ||
    mission.targetSkill === 'particles' ||
    mission.targetSkill === 'verb-forms'
      ? 4
      : mission.targetSkill === 'output-confidence'
        ? 2
        : 0;

  switch (mission.type) {
    case 'grammar':
      return skillScore + 4;
    case 'output':
      return skillScore + 3;
    case 'listening':
      return skillScore + 2;
    case 'reading':
      return skillScore + 1;
  }
}

function buildStudyFocusReason(
  mission: Mission,
  studyFocusMode: StudyFocusMode,
  reviewAwareness: ReviewAwareness,
  missionContextById: Record<string, MissionRecommendationContext>,
) {
  if (
    getStudyFocusMissionScore(
      mission,
      studyFocusMode,
      reviewAwareness,
      missionContextById,
    ) <= 0
  ) {
    return null;
  }

  switch (studyFocusMode) {
    case 'more-listening':
      return 'More listening nudges this slot toward ear-first practice.';
    case 'more-output':
      return 'More output nudges this slot toward active sentence work.';
    case 'light-day':
      return 'Light day prefers the shorter useful option here.';
    case 'class-prep':
      return 'Class prep prefers practical beginner structure here.';
    case 'weak-points-first': {
      const weakPointSummary = getRelatedWeakPointSummary(
        mission,
        reviewAwareness.weakPointList,
        missionContextById,
      );

      if (weakPointSummary.directWeakPointCount > 0) {
        return 'Weak points first keeps this tied to an open miss.';
      }

      if (weakPointSummary.relatedWeakPointCount > 0) {
        return 'Weak points first keeps this near an open review lane.';
      }

      return null;
    }
    case 'balanced':
      return null;
  }
}

function withStudyFocusReason(reason: string, focusReason: string | null) {
  return focusReason ? `${focusReason} ${reason}` : reason;
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
    return 'You have only cleared this once, so a short rotated follow-up pass should make it stick better.';
  }

  return 'This mission has a lighter practice count than the rest, so use a short rotated pass instead of replaying the full mission.';
}

function deriveReviewAwareness(
  starterContent: StarterContent,
  missionProgress: MissionProgressRecord,
  weakPoints: WeakPointStore,
  reviewLoopProgress: ReviewLoopProgress,
): ReviewAwareness {
  const weakPointList = getWeakPointList(weakPoints);
  const reviewBatch = selectReviewBatch(weakPoints, starterContent);
  const lastReviewAt = reviewLoopProgress.lastCompletedAt
    ? Date.parse(reviewLoopProgress.lastCompletedAt)
    : null;
  const latestWeakPointAt = weakPointList[0]
    ? Date.parse(weakPointList[0].lastMissedAt)
    : null;
  const now = Date.now();
  const hasFreshWeakPoints =
    latestWeakPointAt !== null && now - latestWeakPointAt <= FRESH_WEAK_POINT_WINDOW_MS;
  const hasRecentReview =
    lastReviewAt !== null && now - lastReviewAt <= RECENT_REVIEW_WINDOW_MS;
  const hasRepeatedWeakPoint = weakPointList.some(
    (weakPoint) => weakPoint.missCount >= REPEATED_MISS_THRESHOLD,
  );
  const needsReviewRefresh =
    latestWeakPointAt !== null && (lastReviewAt === null || latestWeakPointAt > lastReviewAt);
  const isUrgent =
    weakPointList.length > 0 &&
    (weakPointList.length >= URGENT_WEAK_POINT_COUNT ||
      hasRepeatedWeakPoint ||
      (hasFreshWeakPoints && needsReviewRefresh));

  return {
    weakPointList,
    reviewBatch,
    lastReviewAt,
    latestWeakPointAt,
    hasFreshWeakPoints,
    hasRecentReview,
    isUrgent,
    topWeakPoint: selectTopWeakPoint(weakPointList),
    recentlyReviewedMissionIds: hasRecentReview
      ? resolveRecentlyReviewedMissionIds(starterContent, reviewLoopProgress.lastCompletedItemIds)
      : new Set<string>(),
    recentlyCompletedMissionIds: resolveRecentlyCompletedMissionIds(missionProgress),
  };
}

function selectTopWeakPoint(weakPointList: WeakPoint[]) {
  return [...weakPointList].sort((left, right) => {
    if (right.missCount !== left.missCount) {
      return right.missCount - left.missCount;
    }

    return Date.parse(right.lastMissedAt) - Date.parse(left.lastMissedAt);
  })[0] ?? null;
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

function buildUrgentReviewReason(
  reviewAwareness: ReviewAwareness,
  repeatedWeakPointCount: number,
) {
  const weakPointCount = reviewAwareness.weakPointList.length;

  if (repeatedWeakPointCount > 0 && reviewAwareness.hasFreshWeakPoints) {
    const freshnessContext = reviewAwareness.lastReviewAt
      ? 'fresh errors since your last review'
      : 'fresh errors from this local session';

    return `${formatWeakPointCount(weakPointCount)} ${
      weakPointCount === 1 ? 'is' : 'are'
    } open, including ${repeatedWeakPointCount} with repeated misses and ${freshnessContext}.`;
  }

  if (repeatedWeakPointCount > 0) {
    return `${formatWeakPointCount(weakPointCount)} ${
      weakPointCount === 1 ? 'is' : 'are'
    } still open, and ${repeatedWeakPointCount} already ${
      repeatedWeakPointCount === 1 ? 'has' : 'have'
    } repeated misses.`;
  }

  return `${formatWeakPointCount(weakPointCount)} ${
    weakPointCount === 1 ? 'is' : 'are'
  } open and still fresh, so retry ${weakPointCount === 1 ? 'it' : 'them'} before taking on something broader.`;
}

function formatWeakPointCount(count: number) {
  return `${count} weak point${count === 1 ? '' : 's'}`;
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

function resolveRecentlyCompletedMissionIds(missionProgress: MissionProgressRecord) {
  const now = Date.now();

  return new Set(
    Object.entries(missionProgress.lastCompletedAtByMissionId)
      .filter(([, timestamp]) => now - Date.parse(timestamp) <= RECENT_MISSION_COMPLETION_WINDOW_MS)
      .map(([missionId]) => missionId),
  );
}

function getFallbackReinforcementAnchor(
  unlockedMissions: Mission[],
  selectedMissionIds: Set<string>,
  topWeakPoint: WeakPoint | null,
): ReinforcementAnchor | null {
  const mission = selectTopWeakPointMission(unlockedMissions, selectedMissionIds, topWeakPoint);

  return mission ? { mission, source: 'weak-point' } : null;
}

function createMissionRecommendationContextById(starterContent: StarterContent) {
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

function resolveRecentlyReviewedMissionIds(
  starterContent: StarterContent,
  itemIds: string[],
) {
  return new Set(
    itemIds
      .map((itemId) => findMissionIdForReviewItem(starterContent, itemId))
      .filter((missionId): missionId is string => Boolean(missionId)),
  );
}

function findMissionIdForReviewItem(
  starterContent: StarterContent,
  itemId: string,
) {
  return (
    starterContent.missions.find((mission) => missionContainsReviewItem(starterContent, mission, itemId))
      ?.id ?? null
  );
}

function missionContainsReviewItem(
  starterContent: StarterContent,
  mission: Mission,
  itemId: string,
) {
  if (mission.contentRefs.listeningItemIds?.includes(itemId)) {
    return true;
  }

  if (mission.outputTasks?.some((task) => task.id === itemId)) {
    return true;
  }

  if (mission.readingChecks?.some((check) => check.id === itemId)) {
    return true;
  }

  return (mission.contentRefs.grammarLessonIds ?? []).some((lessonId) => {
    const lesson = starterContent.byId.grammarLessons[lessonId];
    return lesson?.drills.some((drill) => drill.id === itemId);
  });
}
