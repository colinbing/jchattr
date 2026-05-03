import { describe, expect, it } from 'vitest';
import { starterContent } from '../../../lib/content/loader';
import type { Mission, StarterContent } from '../../../lib/content/types';
import { resolveMissionDetailViewModel } from './missionDetailViewModel';

describe('resolveMissionDetailViewModel', () => {
  it('resolves grammar mission data', () => {
    const viewModel = resolveMissionDetailViewModel(
      'mission-grammar-topic-desu',
      starterContent,
    );

    expect(viewModel.kind).toBe('grammar');

    if (viewModel.kind !== 'grammar') {
      throw new Error('Expected grammar view model.');
    }

    expect(viewModel.mission.id).toBe('mission-grammar-topic-desu');
    expect(viewModel.lesson.id).toBe('grammar-topic-desu');
    expect(viewModel.examples.map((example) => example.id)).toEqual(
      expect.arrayContaining(viewModel.lesson.exampleIds),
    );
    expect(viewModel.shellDescription).toBe(
      'Focus on one grammar pass without the full mobile nav in the way.',
    );
  });

  it('resolves listening mission data', () => {
    const viewModel = resolveMissionDetailViewModel(
      'mission-listening-place-de',
      starterContent,
    );

    expect(viewModel.kind).toBe('listening');

    if (viewModel.kind !== 'listening') {
      throw new Error('Expected listening view model.');
    }

    expect(viewModel.listeningItems.length).toBeGreaterThan(0);
    expect(viewModel.listeningItems.map((item) => item.id)).toEqual(
      starterContent.byId.missions['mission-listening-place-de'].contentRefs.listeningItemIds,
    );
    expect(viewModel.relatedLessons.map((lesson) => lesson.id)).toEqual(
      starterContent.byId.missions['mission-listening-place-de'].contentRefs.grammarLessonIds,
    );
    expect(viewModel.choicePool).toBe(starterContent.listeningItems);
  });

  it('resolves output mission data', () => {
    const viewModel = resolveMissionDetailViewModel(
      'mission-output-daily-lines',
      starterContent,
    );

    expect(viewModel.kind).toBe('output');

    if (viewModel.kind !== 'output') {
      throw new Error('Expected output view model.');
    }

    expect(viewModel.tasks).toEqual(
      starterContent.byId.missions['mission-output-daily-lines'].outputTasks,
    );
    expect(viewModel.relatedVocab.length).toBeGreaterThan(0);
  });

  it('resolves reading mission data', () => {
    const viewModel = resolveMissionDetailViewModel(
      'mission-reading-starter-recognition',
      starterContent,
    );

    expect(viewModel.kind).toBe('reading');

    if (viewModel.kind !== 'reading') {
      throw new Error('Expected reading view model.');
    }

    expect(viewModel.checks).toEqual(
      starterContent.byId.missions['mission-reading-starter-recognition'].readingChecks,
    );
    expect(Object.keys(viewModel.examplesById).length).toBeGreaterThan(0);
    expect(viewModel.vocabItems).toBe(starterContent.vocabItems);
  });

  it('returns fallback for missing route id and missing mission', () => {
    expect(resolveMissionDetailViewModel(undefined, starterContent)).toMatchObject({
      kind: 'fallback',
      reason: 'missing-route-id',
      title: 'Mission unavailable',
    });
    expect(resolveMissionDetailViewModel('missing-mission', starterContent)).toMatchObject({
      kind: 'fallback',
      reason: 'missing-mission',
      title: 'Mission not found',
    });
  });

  it('returns fallback for a grammar mission without a valid lesson', () => {
    const mission = {
      ...starterContent.byId.missions['mission-grammar-topic-desu'],
      contentRefs: { grammarLessonIds: ['missing-lesson'] },
    };

    expect(
      resolveMissionDetailViewModel(mission.id, withMission(mission)),
    ).toMatchObject({
      kind: 'fallback',
      reason: 'missing-grammar-lesson',
      title: 'Lesson link missing',
    });
  });

  it('returns fallback for a listening mission without linked items', () => {
    const mission = {
      ...starterContent.byId.missions['mission-listening-place-de'],
      contentRefs: { listeningItemIds: [] },
    };

    expect(
      resolveMissionDetailViewModel(mission.id, withMission(mission)),
    ).toMatchObject({
      kind: 'fallback',
      reason: 'missing-listening-items',
      title: 'Listening content missing',
    });
  });

  it('returns fallback for an output mission without tasks', () => {
    const mission = {
      ...starterContent.byId.missions['mission-output-daily-lines'],
      outputTasks: [],
    };

    expect(
      resolveMissionDetailViewModel(mission.id, withMission(mission)),
    ).toMatchObject({
      kind: 'fallback',
      reason: 'missing-output-tasks',
      title: 'Output content missing',
    });
  });

  it('returns fallback for a reading mission without checks', () => {
    const mission = {
      ...starterContent.byId.missions['mission-reading-starter-recognition'],
      readingChecks: [],
    };

    expect(
      resolveMissionDetailViewModel(mission.id, withMission(mission)),
    ).toMatchObject({
      kind: 'fallback',
      reason: 'missing-reading-checks',
      title: 'Reading content missing',
    });
  });
});

function withMission(mission: Mission): StarterContent {
  return {
    ...starterContent,
    missions: starterContent.missions.map((candidate) =>
      candidate.id === mission.id ? mission : candidate,
    ),
    byId: {
      ...starterContent.byId,
      missions: {
        ...starterContent.byId.missions,
        [mission.id]: mission,
      },
    },
  };
}
