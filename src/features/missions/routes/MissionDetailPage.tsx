import { Link, useParams } from 'react-router-dom';
import { PageShell, SurfaceCard } from '../../../components/layout/PageShell';
import { getStarterContent } from '../../../lib/content/loader';
import type {
  ExampleSentence,
  GrammarLesson,
  ListeningItem,
  OutputTask,
  VocabItem,
} from '../../../lib/content/types';
import { GrammarMissionPlayer } from '../components/GrammarMissionPlayer';
import { ListeningMissionPlayer } from '../components/ListeningMissionPlayer';
import { OutputMissionPlayer } from '../components/OutputMissionPlayer';

export function MissionDetailPage() {
  const { missionId } = useParams<{ missionId: string }>();
  const starterContent = getStarterContent();

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
        eyebrow="Mission Player"
        title={mission.title}
        description="A focused grammar mission flow built from starter content. Move from lesson context into examples, mistakes, and drills in one mobile-friendly pass."
        aside={<span className="status-chip">Grammar mission</span>}
      >
        <GrammarMissionPlayer mission={mission} lesson={lesson} examples={examples} />
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
        eyebrow="Mission Player"
        title={mission.title}
        description="A staged listening flow built from starter content. Reveal one layer at a time, then use a small check to confirm the line."
        aside={<span className="status-chip">Listening mission</span>}
      >
        <ListeningMissionPlayer
          mission={mission}
          listeningItems={listeningItems}
          relatedLessons={relatedLessons}
          relatedExamples={relatedExamples}
          choicePool={starterContent.listeningItems}
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
        eyebrow="Mission Player"
        title={mission.title}
        description="A first-pass output flow built from starter content. Use the prompt, check the support patterns, then type one short line at a time."
        aside={<span className="status-chip">Output mission</span>}
      >
        <OutputMissionPlayer
          mission={mission}
          tasks={outputTasks}
          relatedLessons={relatedLessons}
          relatedExamples={relatedExamples}
          relatedVocab={relatedVocab}
        />
      </PageShell>
    );
  }

  return (
    <MissionFallbackState
      title="Mission type not supported yet"
      description="This route currently supports grammar, listening, and output starter missions."
    />
  );
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
        description="Return to the daily mission list and open a starter grammar, listening, or output mission to use the current player slices."
      >
        <Link to="/" className="inline-link">
          View today&apos;s missions
        </Link>
      </SurfaceCard>
    </PageShell>
  );
}
