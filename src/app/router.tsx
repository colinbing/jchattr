import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { CapstoneDetailPage } from '../features/missions/routes/CapstoneDetailPage';
import { MissionDetailPage } from '../features/missions/routes/MissionDetailPage';
import { MissionsPage } from '../features/missions/routes/MissionsPage';
import { ProgressPage } from '../features/progress/routes/ProgressPage';
import { ReviewPage } from '../features/review/routes/ReviewPage';
import { SettingsPage } from '../features/settings/routes/SettingsPage';
import { TodayPage } from '../features/today/routes/TodayPage';

const LazyVoiceCoachSpikePage = lazy(() =>
  import('../features/voiceCoach/routes/VoiceCoachSpikePage').then((module) => ({
    default: module.VoiceCoachSpikePage,
  })),
);

const voiceCoachSpikeRoutes =
  import.meta.env.DEV && import.meta.env.VITE_VOICE_COACH_SPIKE_ENABLED === 'true'
    ? [
        {
          path: 'dev/voice-coach-spike',
          element: (
            <Suspense fallback={<span className="status-chip">Loading voice spike...</span>}>
              <LazyVoiceCoachSpikePage />
            </Suspense>
          ),
        },
      ]
    : [];

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <TodayPage />,
      },
      {
        path: 'missions',
        element: <MissionsPage />,
      },
      {
        path: 'mission/:missionId',
        element: <MissionDetailPage />,
      },
      {
        path: 'capstone/:storyId',
        element: <CapstoneDetailPage />,
      },
      {
        path: 'progress',
        element: <ProgressPage />,
      },
      {
        path: 'review',
        element: <ReviewPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      ...voiceCoachSpikeRoutes,
    ],
  },
]);
