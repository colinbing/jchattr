import { contentPacks } from '../../../content/contentPacks';
import type { CapstoneStory, StarterContent } from '../../../lib/content/types';
import {
  getCapstoneProgressEntry,
  type CapstoneProgressRecord,
} from '../../../lib/progress/capstoneProgress';
import {
  getMissionProgressEntry,
  type MissionProgressRecord,
} from '../../../lib/progress/missionProgress';
import type { ReviewAwareness } from './todayRecommendationReview';
import type { TodayRecommendation } from './todayRecommendationTypes';

export function getCapstoneRecommendation(
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
    } finished. Wrap the chapter with one short story built from lines you have already practiced.`,
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

export function getCapstoneRecombinationRecommendation(
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
