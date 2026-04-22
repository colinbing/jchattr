import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { MissionDetailPage } from '../features/missions/routes/MissionDetailPage';
import { MissionsPage } from '../features/missions/routes/MissionsPage';
import { ProgressPage } from '../features/progress/routes/ProgressPage';
import { ReviewPage } from '../features/review/routes/ReviewPage';
import { SettingsPage } from '../features/settings/routes/SettingsPage';
import { TodayPage } from '../features/today/routes/TodayPage';

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
    ],
  },
]);
