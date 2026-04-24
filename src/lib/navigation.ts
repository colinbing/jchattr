export type NavigationItem = {
  to: string;
  label: string;
  mobileLabel?: string;
  caption: string;
  eyebrow: string;
  description: string;
};

export const NAV_ITEMS: NavigationItem[] = [
  {
    to: '/',
    label: 'Today',
    mobileLabel: 'Today',
    caption: 'Daily loop',
    eyebrow: 'Daily Entry',
    description: 'Start a short session, see recommended work, and keep momentum visible.',
  },
  {
    to: '/missions',
    label: 'Missions',
    mobileLabel: 'Path',
    caption: 'Mission path',
    eyebrow: 'Mission Library',
    description: 'Browse the progression path and enter focused grammar, listening, output, or reading work.',
  },
  {
    to: '/progress',
    label: 'Progress',
    mobileLabel: 'Skills',
    caption: 'Skill map',
    eyebrow: 'Skill Map',
    description: 'Track current strength, completion history, and visible growth over time.',
  },
  {
    to: '/review',
    label: 'Review',
    mobileLabel: 'Review',
    caption: 'Weak points',
    eyebrow: 'Weak Points',
    description: 'Return to misses, recurring confusion, and the next best reinforcement steps.',
  },
  {
    to: '/settings',
    label: 'Settings',
    mobileLabel: 'Prefs',
    caption: 'Preferences',
    eyebrow: 'Preferences',
    description: 'Manage local app behavior, study defaults, and future storage controls.',
  },
];

const MISSION_DETAIL_META: NavigationItem = {
  to: '/mission/:missionId',
  label: 'Mission Player',
  caption: 'Focused session',
  eyebrow: 'Mission Player',
  description: 'Work through one mission at a time with a compact, touch-friendly flow.',
};

export function getRouteMeta(pathname: string) {
  if (pathname.startsWith('/mission/')) {
    return MISSION_DETAIL_META;
  }

  return NAV_ITEMS.find((item) => item.to === pathname) ?? NAV_ITEMS[0];
}
