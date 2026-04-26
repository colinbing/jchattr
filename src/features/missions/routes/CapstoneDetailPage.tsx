import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { PageShell, SurfaceCard } from '../../../components/layout/PageShell';
import { getStarterContent } from '../../../lib/content/loader';
import type { CapstoneCheck, CapstoneLine } from '../../../lib/content/types';
import {
  getCapstoneProgressEntry,
  useCapstoneProgress,
} from '../../../lib/progress/capstoneProgress';
import { CapstoneStoryPlayer } from '../components/CapstoneStoryPlayer';

export function CapstoneDetailPage() {
  const { storyId } = useParams<{ storyId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const starterContent = getStarterContent();
  const capstoneProgress = useCapstoneProgress();
  const capstoneMode =
    searchParams.get('mode') === 'recombination' ? 'recombination' : 'closeout';

  if (!storyId) {
    return (
      <CapstoneFallbackState
        title="Capstone unavailable"
        description="This route needs a capstone story id before it can load starter content."
      />
    );
  }

  const story = starterContent.byId.capstoneStories[storyId];

  if (!story) {
    return (
      <CapstoneFallbackState
        title="Capstone not found"
        description="The requested capstone story id does not exist in starter content."
      />
    );
  }

  if (story.unlockAfterStoryId) {
    const unlockProgress = getCapstoneProgressEntry(
      capstoneProgress,
      story.unlockAfterStoryId,
    );

    if (!unlockProgress.isCompleted) {
      return (
        <CapstoneFallbackState
          title="Story mode locked"
          description="Complete the chapter closeout first, then come back for this naturalized bonus reread."
        />
      );
    }
  }

  const lines = story.lineIds
    .map((lineId) => starterContent.byId.capstoneLines[lineId])
    .filter((line): line is CapstoneLine => Boolean(line));
  const checks = story.checkIds
    .map((checkId) => starterContent.byId.capstoneChecks[checkId])
    .filter((check): check is CapstoneCheck => Boolean(check));
  const checksByLineId = checks.reduce<Record<string, CapstoneCheck[]>>((record, check) => {
    record[check.lineId] = [...(record[check.lineId] ?? []), check];
    return record;
  }, {});

  if (lines.length === 0) {
    return (
      <CapstoneFallbackState
        title="Capstone content missing"
        description="This capstone does not have valid story lines linked yet."
      />
    );
  }

  return (
    <PageShell
      eyebrow={
        story.variant === 'naturalized'
          ? 'Story mode'
          : capstoneMode === 'recombination'
            ? 'Recombination'
            : 'Capstone'
      }
      title={story.title}
      description={
        story.variant === 'naturalized'
          ? 'Read a naturalized version after clearing the exact-source chapter closeout.'
          : capstoneMode === 'recombination'
          ? 'Reread the completed chapter story as an optional recombination pass.'
          : 'Close the chapter with a short, supported reading pass.'
      }
      aside={
        <span className="status-chip">
          {story.variant === 'naturalized'
            ? 'Bonus reread'
            : capstoneMode === 'recombination'
              ? 'Optional reread'
              : 'Chapter closeout'}
        </span>
      }
      variant="compact"
    >
      <CapstoneRouteBar onGoBack={() => handleGoBack(navigate)} />
      <CapstoneStoryPlayer
        story={story}
        lines={lines}
        checksByLineId={checksByLineId}
        vocabItems={starterContent.vocabItems}
        mode={capstoneMode}
      />
    </PageShell>
  );
}

type CapstoneRouteBarProps = {
  onGoBack: () => void;
};

function CapstoneRouteBar({ onGoBack }: CapstoneRouteBarProps) {
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
        <Link to="/missions" className="mission-route-bar__link">
          Missions
        </Link>
        <Link
          to="/"
          className="mission-route-bar__link mission-route-bar__link--secondary"
        >
          Today
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

  navigate('/missions');
}

type CapstoneFallbackStateProps = {
  title: string;
  description: string;
};

function CapstoneFallbackState({
  title,
  description,
}: CapstoneFallbackStateProps) {
  return (
    <PageShell
      eyebrow="Capstone"
      title={title}
      description={description}
      aside={<span className="status-chip">Unavailable</span>}
    >
      <SurfaceCard
        title="Back to missions"
        description="Return to the mission library and open an available chapter closeout."
      >
        <Link to="/missions" className="inline-link">
          View mission library
        </Link>
      </SurfaceCard>
    </PageShell>
  );
}
