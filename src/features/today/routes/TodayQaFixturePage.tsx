import { Link, Navigate, useParams } from 'react-router-dom';
import { PageShell, SurfaceCard } from '../../../components/layout/PageShell';
import { getStarterContent } from '../../../lib/content/loader';
import {
  getEmptyMissionProgress,
  type MissionProgressRecord,
} from '../../../lib/progress/missionProgress';
import {
  SessionSummary,
  type SessionSummaryItem,
} from '../components/SessionSummary';
import { TodayRecommendationCard } from '../components/TodayRecommendationCard';
import type { TodayRecommendation } from '../lib/todayRecommendations';

export type TodayQaFixtureId =
  | 'no-bonus'
  | 'one-bonus'
  | 'review-return'
  | 'reinforce-plan'
  | 'completed-summary'
  | 'completed-no-bonus';

type TodayQaFixture = {
  id: TodayQaFixtureId;
  label: string;
  description: string;
  items: SessionSummaryItem[];
  remainingMinutes: number;
  bonusRecommendations: TodayRecommendation[];
  missionProgress: MissionProgressRecord;
  supportCard?: {
    title: string;
    description: string;
    body: string;
  };
};

export const todayQaFixtureIds: TodayQaFixtureId[] = [
  'no-bonus',
  'one-bonus',
  'review-return',
  'reinforce-plan',
  'completed-summary',
  'completed-no-bonus',
];

export function TodayQaFixturePage() {
  const { fixtureId = 'one-bonus' } = useParams();

  if (!isTodayQaFixtureId(fixtureId)) {
    return <Navigate to="/dev/today-qa/one-bonus" replace />;
  }

  const fixture = createTodayQaFixture(fixtureId);
  const completedCount = fixture.items.filter((item) => item.status === 'done').length;
  const remainingCount = fixture.items.filter((item) => item.status !== 'done').length;
  const bonusMinutes = fixture.bonusRecommendations.reduce((total, recommendation) => {
    if (recommendation.kind === 'review') {
      return total + Math.max(4, recommendation.batchSize * 2);
    }

    if (recommendation.kind === 'capstone') {
      return total + recommendation.estimatedMinutes;
    }

    return total + recommendation.mission.estimatedMinutes;
  }, 0);
  const firstOpenItem = fixture.items.find((item) => item.status !== 'done') ?? null;

  return (
    <PageShell
      variant="compact"
      eyebrow="Dev Fixture"
      title="Today QA"
      description={fixture.description}
      aside={<span className="status-chip">No localStorage</span>}
    >
      <SurfaceCard
        title="Fixture"
        description="Open fixed Today states without changing saved progress."
      >
        <ul className="simple-list">
          {todayQaFixtureIds.map((id) => (
            <li key={id}>
              <Link to={`/dev/today-qa/${id}`} className="inline-link">
                {id === fixture.id ? `Viewing ${id}` : id}
              </Link>
            </li>
          ))}
        </ul>
      </SurfaceCard>

      <SessionSummary
        brandName="JCHATTR"
        studyDateLabel="Saturday, May 2"
        weekDays={createFixtureWeekDays(remainingCount === 0)}
        items={fixture.items}
        completedCount={completedCount}
        remainingCount={remainingCount}
        remainingMinutes={fixture.remainingMinutes}
        bonusCount={fixture.bonusRecommendations.length}
        bonusMinutes={bonusMinutes}
        primaryAction={
          firstOpenItem
            ? {
                to: '#fixture-primary-action',
                label: firstOpenItem.status === 'current' ? 'Continue today' : 'Start today',
              }
            : null
        }
      />

      {fixture.supportCard ? (
        <SurfaceCard
          className="today-support-card"
          title={fixture.supportCard.title}
          description={fixture.supportCard.description}
        >
          <p className="review-launch-card__body">{fixture.supportCard.body}</p>
        </SurfaceCard>
      ) : null}

      <SurfaceCard
        className="today-support-card today-bonus-card"
        title={remainingCount === 0 ? 'Optional bonus practice' : 'Bonus later'}
        description={
          remainingCount === 0
            ? 'Core work is finished. Add one short pass only if you still want more.'
            : 'Extra practice stays available after the core plan.'
        }
      >
        <div className="today-bonus-card__header">
          <p className="today-bonus-card__meta">
            {fixture.bonusRecommendations.length > 0
              ? `${fixture.bonusRecommendations.length} option${
                  fixture.bonusRecommendations.length === 1 ? '' : 's'
                } · about ${bonusMinutes} min`
              : 'No bonus slot right now'}
          </p>
        </div>

        {fixture.bonusRecommendations.length > 0 ? (
          <div className="mission-list today-bonus-list" role="list">
            {fixture.bonusRecommendations.map((recommendation) => (
              <div key={recommendation.id} role="listitem">
                <TodayRecommendationCard
                  recommendation={recommendation}
                  missionProgress={fixture.missionProgress}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="today-details__body">
            No extra slot is needed in this fixture.
          </p>
        )}
      </SurfaceCard>
    </PageShell>
  );
}

export function createTodayQaFixture(id: TodayQaFixtureId): TodayQaFixture {
  const starterContent = getStarterContent();
  const grammarMission = starterContent.byId.missions['mission-grammar-topic-desu'];
  const listeningMission = starterContent.byId.missions['mission-listening-place-de'];
  const outputMission = starterContent.byId.missions['mission-output-daily-lines'];
  const progressWithGrammarComplete: MissionProgressRecord = {
    ...getEmptyMissionProgress(),
    completedMissionIds: [grammarMission.id],
    completionCountsByMissionId: {
      [grammarMission.id]: 1,
    },
    lastCompletedAtByMissionId: {
      [grammarMission.id]: '2026-05-02T12:00:00.000Z',
    },
  };
  const bonusRecommendation = createMissionRecommendation(listeningMission, 'Keep moving', 'default');

  switch (id) {
    case 'no-bonus':
      return {
        id,
        label: 'No bonus',
        description: 'Core plan visible with no optional recommendation.',
        items: [
          createSummaryItem(grammarMission.title, 'Grammar · sentence structure · 4 min', 'current'),
          createSummaryItem(outputMission.title, 'Output · output confidence · 5 min', 'waiting'),
        ],
        remainingMinutes: 9,
        bonusRecommendations: [],
        missionProgress: getEmptyMissionProgress(),
      };
    case 'review-return':
      return {
        id,
        label: 'Review return',
        description: 'Review pass returned with unresolved work still open.',
        items: [
          createSummaryItem('Retry weak spots first', 'Review pass done.', 'done'),
          createSummaryItem(grammarMission.title, 'Grammar · sentence structure · 4 min', 'current'),
        ],
        remainingMinutes: 4,
        bonusRecommendations: [bonusRecommendation],
        missionProgress: getEmptyMissionProgress(),
        supportCard: {
          title: 'Review pass ended',
          description: 'Some retry work is still open. The core plan can keep moving.',
          body: '1/3 still open. The unresolved weak point remains available for a future review pass.',
        },
      };
    case 'reinforce-plan':
      return {
        id,
        label: 'Reinforce plan',
        description: 'Core plan includes a same-mission reinforce pass.',
        items: [
          createSummaryItem(grammarMission.title, 'Grammar · sentence structure · 4 min', 'done'),
          createSummaryItem(grammarMission.title, 'Grammar · sentence structure · 4 min', 'current'),
        ],
        remainingMinutes: 4,
        bonusRecommendations: [bonusRecommendation],
        missionProgress: progressWithGrammarComplete,
      };
    case 'completed-summary':
      return {
        id,
        label: 'Completed summary',
        description: 'Core plan complete with finished-today summary and optional bonus.',
        items: [
          createSummaryItem(grammarMission.title, 'Grammar · sentence structure · 4 min', 'done'),
          createSummaryItem(outputMission.title, 'Output · output confidence · 5 min', 'done'),
        ],
        remainingMinutes: 0,
        bonusRecommendations: [bonusRecommendation],
        missionProgress: progressWithGrammarComplete,
        supportCard: {
          title: 'Finished today',
          description: `${outputMission.title} · 2/2 attempted · 2 correct · 0 review items`,
          body: 'Core work is finished for today. Bonus practice is optional.',
        },
      };
    case 'completed-no-bonus':
      return {
        id,
        label: 'Completed no bonus',
        description: 'Core plan complete without optional bonus recommendations.',
        items: [
          createSummaryItem(grammarMission.title, 'Grammar · sentence structure · 4 min', 'done'),
          createSummaryItem(outputMission.title, 'Output · output confidence · 5 min', 'done'),
        ],
        remainingMinutes: 0,
        bonusRecommendations: [],
        missionProgress: progressWithGrammarComplete,
        supportCard: {
          title: 'Finished today',
          description: `${outputMission.title} · 2/2 attempted · 2 correct · 0 review items`,
          body: 'Core work is finished for today. No extra slot is needed right now.',
        },
      };
    case 'one-bonus':
      return {
        id,
        label: 'One bonus',
        description: 'Core plan plus one directly visible optional recommendation.',
        items: [
          createSummaryItem(grammarMission.title, 'Grammar · sentence structure · 4 min', 'current'),
          createSummaryItem(outputMission.title, 'Output · output confidence · 5 min', 'waiting'),
        ],
        remainingMinutes: 9,
        bonusRecommendations: [bonusRecommendation],
        missionProgress: getEmptyMissionProgress(),
      };
  }
}

function createMissionRecommendation(
  mission: ReturnType<typeof getStarterContent>['missions'][number],
  slotLabel: string,
  sessionMode: 'default' | 'reinforce',
): TodayRecommendation {
  return {
    id: `${mission.id}-${sessionMode}`,
    kind: 'mission',
    slotLabel,
    title: mission.title,
    reason:
      sessionMode === 'reinforce'
        ? 'Use one short rotated pass without changing the core plan.'
        : 'This is another open step if you want to keep the path moving.',
    ctaLabel: sessionMode === 'reinforce' ? 'Open short pass' : 'Open mission',
    to: `/mission/${mission.id}`,
    mission,
    sessionMode,
    personalFocus: 'Listening comprehension with particles and location.',
  };
}

function createSummaryItem(
  title: string,
  meta: string,
  status: SessionSummaryItem['status'],
): SessionSummaryItem {
  return {
    id: `${title}-${status}-${meta}`,
    title,
    meta,
    status,
  };
}

function createFixtureWeekDays(isTodayComplete: boolean) {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayLabel, index) => ({
    key: `2026-04-${26 + index}`,
    dayLabel,
    dateLabel: dayLabel,
    isCurrent: index === 6,
    isComplete: index === 6 ? isTodayComplete : index === 1 || index === 3,
  }));
}

function isTodayQaFixtureId(value: string): value is TodayQaFixtureId {
  return todayQaFixtureIds.includes(value as TodayQaFixtureId);
}
