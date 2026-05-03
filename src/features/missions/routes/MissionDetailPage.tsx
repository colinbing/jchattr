import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { PageShell, SurfaceCard } from '../../../components/layout/PageShell';
import { getStarterContent } from '../../../lib/content/loader';
import type { MissionSessionMode } from '../lib/missionSession';
import type { PlayableMissionDetailViewModel } from '../lib/missionDetailViewModel';
import { resolveMissionDetailViewModel } from '../lib/missionDetailViewModel';
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
  const viewModel = resolveMissionDetailViewModel(missionId, starterContent);

  if (viewModel.kind === 'fallback') {
    return (
      <MissionFallbackState
        title={viewModel.title}
        description={viewModel.description}
      />
    );
  }

  return (
    <PageShell
      eyebrow="Mission"
      title={viewModel.mission.title}
      description={viewModel.shellDescription}
      aside={<span className="status-chip">{viewModel.statusLabel}</span>}
      variant="compact"
    >
      <MissionRouteBar onGoBack={() => handleGoBack(navigate)} />
      <MissionPlayerRenderer viewModel={viewModel} sessionMode={sessionMode} />
    </PageShell>
  );
}

type MissionRouteState = {
  preserveScroll?: boolean;
  sessionMode?: MissionSessionMode;
};

type MissionRouteBarProps = {
  onGoBack: () => void;
};

type MissionPlayerRendererProps = {
  viewModel: PlayableMissionDetailViewModel;
  sessionMode: MissionSessionMode;
};

function MissionPlayerRenderer({
  viewModel,
  sessionMode,
}: MissionPlayerRendererProps) {
  switch (viewModel.kind) {
    case 'grammar':
      return (
        <GrammarMissionPlayer
          mission={viewModel.mission}
          lesson={viewModel.lesson}
          examples={viewModel.examples}
          sessionMode={sessionMode}
        />
      );
    case 'listening':
      return (
        <ListeningMissionPlayer
          mission={viewModel.mission}
          listeningItems={viewModel.listeningItems}
          relatedLessons={viewModel.relatedLessons}
          relatedExamples={viewModel.relatedExamples}
          choicePool={viewModel.choicePool}
          sessionMode={sessionMode}
        />
      );
    case 'output':
      return (
        <OutputMissionPlayer
          mission={viewModel.mission}
          tasks={viewModel.tasks}
          relatedLessons={viewModel.relatedLessons}
          relatedExamples={viewModel.relatedExamples}
          relatedVocab={viewModel.relatedVocab}
          sessionMode={sessionMode}
        />
      );
    case 'reading':
      return (
        <ReadingMissionPlayer
          mission={viewModel.mission}
          checks={viewModel.checks}
          examplesById={viewModel.examplesById}
          vocabItems={viewModel.vocabItems}
          sessionMode={sessionMode}
        />
      );
  }
}

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
