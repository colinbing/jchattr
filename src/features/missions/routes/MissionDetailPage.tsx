import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { PageShell, SurfaceCard } from '../../../components/layout/PageShell';
import { getStarterContent } from '../../../lib/content/loader';
import type {
  ExampleSentence,
  GrammarLesson,
  ListeningItem,
  OutputTask,
  ReadingCheck,
  VocabItem,
} from '../../../lib/content/types';
import type { MissionSessionMode } from '../lib/missionSession';
import { GrammarMissionPlayer } from '../components/GrammarMissionPlayer';
import { ListeningMissionPlayer } from '../components/ListeningMissionPlayer';
import { OutputMissionPlayer } from '../components/OutputMissionPlayer';
import { ReadingMissionPlayer } from '../components/ReadingMissionPlayer';

export function MissionDetailPage() {
  const { missionId } = useParams<{ missionId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const starterContent = getStarterContent();
  const sessionMode: MissionSessionMode =
    (location.state as MissionRouteState | null)?.sessionMode ?? 'default';

  if (!missionId) {
    return (
      <MissionFallbackState
        title="Mission unavailable"
        description="This route needs a mission id before it can load starter content."
      />
    );
  }

  const mission = starterContent.byId.missions[missionId];

  if (!mission) {
    return (
      <MissionFallbackState
        title="Mission not found"
        description="The requested mission id does not exist in starter content."
      />
    );
  }

  if (mission.type === 'grammar') {
    const lessonId = mission.contentRefs.grammarLessonIds?.[0];
    const lesson = lessonId ? starterContent.byId.grammarLessons[lessonId] : undefined;

    if (!lesson) {
      return (
        <MissionFallbackState
          title="Lesson link missing"
          description="This grammar mission does not have a valid linked grammar lesson yet."
        />
      );
    }

    const examples = resolveExamples(
      starterContent.byId.exampleSentences,
      lesson.exampleIds,
      mission.contentRefs.exampleIds,
    );

    return (
      <PageShell
        eyebrow="Mission"
        title={mission.title}
        description="Focus on one grammar pass without the full mobile nav in the way."
        aside={<span className="status-chip">Grammar</span>}
        variant="compact"
      >
        <MissionRouteBar onGoBack={() => handleGoBack(navigate)} />
        <GrammarMissionPlayer
          mission={mission}
          lesson={lesson}
          examples={examples}
          sessionMode={sessionMode}
        />
      </PageShell>
    );
  }

  if (mission.type === 'listening') {
    const listeningItems = resolveListeningItems(
      starterContent.byId.listeningItems,
      mission.contentRefs.listeningItemIds,
    );
    const relatedLessons = resolveGrammarLessons(
      starterContent.byId.grammarLessons,
      mission.contentRefs.grammarLessonIds,
    );
    const relatedExamples = resolveExamples(
      starterContent.byId.exampleSentences,
      [],
      mission.contentRefs.exampleIds,
    );

    if (listeningItems.length === 0) {
      return (
        <MissionFallbackState
          title="Listening content missing"
          description="This listening mission does not have starter listening items linked yet."
        />
      );
    }

    return (
      <PageShell
        eyebrow="Mission"
        title={mission.title}
        description="Stay with one listening line at a time and keep the space for the task."
        aside={<span className="status-chip">Listening</span>}
        variant="compact"
      >
        <MissionRouteBar onGoBack={() => handleGoBack(navigate)} />
        <ListeningMissionPlayer
          mission={mission}
          listeningItems={listeningItems}
          relatedLessons={relatedLessons}
          relatedExamples={relatedExamples}
          choicePool={starterContent.listeningItems}
          sessionMode={sessionMode}
        />
      </PageShell>
    );
  }

  if (mission.type === 'output') {
    const relatedLessons = resolveGrammarLessons(
      starterContent.byId.grammarLessons,
      mission.contentRefs.grammarLessonIds,
    );
    const relatedExamples = resolveExamples(
      starterContent.byId.exampleSentences,
      [],
      mission.contentRefs.exampleIds,
    );
    const relatedVocab = resolveVocabItems(
      starterContent.byId.vocabItems,
      mission.contentRefs.vocabIds,
    );
    const outputTasks = resolveOutputTasks(mission.outputTasks);

    if (outputTasks.length === 0) {
      return (
        <MissionFallbackState
          title="Output content missing"
          description="This output mission does not have starter prompts and accepted answers linked yet."
        />
      );
    }

    return (
      <PageShell
        eyebrow="Mission"
        title={mission.title}
        description="Keep the mission route focused on the current prompt and answer."
        aside={<span className="status-chip">Output</span>}
        variant="compact"
      >
        <MissionRouteBar onGoBack={() => handleGoBack(navigate)} />
        <OutputMissionPlayer
          mission={mission}
          tasks={outputTasks}
          relatedLessons={relatedLessons}
          relatedExamples={relatedExamples}
          relatedVocab={relatedVocab}
          sessionMode={sessionMode}
        />
      </PageShell>
    );
  }

  if (mission.type === 'reading') {
    const readingChecks = resolveReadingChecks(mission.readingChecks);
    const examplesById = readingChecks.reduce<Record<string, ExampleSentence>>((record, check) => {
      const example = starterContent.byId.exampleSentences[check.exampleId];

      if (example) {
        record[check.exampleId] = example;
      }

      return record;
    }, {});

    if (readingChecks.length === 0 || Object.keys(examplesById).length === 0) {
      return (
        <MissionFallbackState
          title="Reading content missing"
          description="This reading mission does not have starter reading checks linked yet."
        />
      );
    }

    return (
      <PageShell
        eyebrow="Mission"
        title={mission.title}
        description="Read first, answer, then reveal support without extra chrome."
        aside={<span className="status-chip">Reading</span>}
        variant="compact"
      >
        <MissionRouteBar onGoBack={() => handleGoBack(navigate)} />
        <ReadingMissionPlayer
          mission={mission}
          checks={readingChecks}
          examplesById={examplesById}
          vocabItems={starterContent.vocabItems}
          sessionMode={sessionMode}
        />
      </PageShell>
    );
  }

  return (
    <MissionFallbackState
      title="Mission type not supported yet"
      description="This route currently supports grammar, listening, output, and reading starter missions."
    />
  );
}

type MissionRouteState = {
  preserveScroll?: boolean;
  sessionMode?: MissionSessionMode;
};

type MissionRouteBarProps = {
  onGoBack: () => void;
};

function MissionRouteBar({ onGoBack }: MissionRouteBarProps) {
  return (
    <div className="mission-route-bar">
      <button
        type="button"
        className="mission-route-bar__button"
        onClick={onGoBack}
      >
        Back
      </button>
      <div className="mission-route-bar__links">
        <Link to="/" className="mission-route-bar__link">
          Today
        </Link>
        <Link
          to="/missions"
          className="mission-route-bar__link mission-route-bar__link--secondary"
        >
          Missions
        </Link>
      </div>
    </div>
  );
}

function handleGoBack(navigate: ReturnType<typeof useNavigate>) {
  if (window.history.length > 1) {
    navigate(-1);
    return;
  }

  navigate('/');
}

function resolveExamples(
  exampleRecord: Record<string, ExampleSentence>,
  primaryIds: string[],
  secondaryIds?: string[],
) {
  return Array.from(new Set([...primaryIds, ...(secondaryIds ?? [])]))
    .map((exampleId) => exampleRecord[exampleId])
    .filter((example): example is ExampleSentence => Boolean(example));
}

function resolveGrammarLessons(
  lessonRecord: Record<string, GrammarLesson>,
  lessonIds?: string[],
) {
  return (lessonIds ?? [])
    .map((lessonId) => lessonRecord[lessonId])
    .filter((lesson): lesson is GrammarLesson => Boolean(lesson));
}

function resolveListeningItems(
  listeningRecord: Record<string, ListeningItem>,
  listeningItemIds?: string[],
) {
  return (listeningItemIds ?? [])
    .map((itemId) => listeningRecord[itemId])
    .filter((item): item is ListeningItem => Boolean(item));
}

function resolveVocabItems(
  vocabRecord: Record<string, VocabItem>,
  vocabIds?: string[],
) {
  return (vocabIds ?? [])
    .map((vocabId) => vocabRecord[vocabId])
    .filter((item): item is VocabItem => Boolean(item));
}

function resolveOutputTasks(outputTasks?: OutputTask[]) {
  return (outputTasks ?? []).filter((task): task is OutputTask => Boolean(task));
}

function resolveReadingChecks(readingChecks?: ReadingCheck[]) {
  return (readingChecks ?? []).filter((check): check is ReadingCheck => Boolean(check));
}

type MissionFallbackStateProps = {
  title: string;
  description: string;
};

function MissionFallbackState({
  title,
  description,
}: MissionFallbackStateProps) {
  return (
    <PageShell
      eyebrow="Mission Player"
      title={title}
      description={description}
      aside={<span className="status-chip">Unavailable</span>}
    >
      <SurfaceCard
        title="Back to today"
        description="Return to the daily mission list and open a starter grammar, listening, output, or reading mission to use the current player slices."
      >
        <Link to="/" className="inline-link">
          View today&apos;s missions
        </Link>
      </SurfaceCard>
    </PageShell>
  );
}
