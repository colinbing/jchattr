export type NavigationItem = {
  to: string;
  label: string;
  caption: string;
  eyebrow: string;
  description: string;
};

export const NAV_ITEMS: NavigationItem[] = [
  {
    to: '/',
    label: 'Today',
    caption: 'Daily loop',
    eyebrow: 'Daily Entry',
    description: 'Start a short session, see recommended work, and keep momentum visible.',
  },
  {
    to: '/missions',
    label: 'Missions',
    caption: 'Mission queue',
    eyebrow: 'Mission Library',
    description: 'Browse the mission stack and enter focused grammar, listening, or output work.',
  },
  {
    to: '/progress',
    label: 'Progress',
    caption: 'Skill map',
    eyebrow: 'Skill Map',
    description: 'Track current strength, completion history, and visible growth over time.',
  },
  {
    to: '/review',
    label: 'Review',
    caption: 'Weak points',
    eyebrow: 'Weak Points',
    description: 'Return to misses, recurring confusion, and the next best reinforcement steps.',
  },
  {
    to: '/settings',
    label: 'Settings',
    caption: 'Preferences',
    eyebrow: 'Preferences',
    description: 'Manage local app behavior, study defaults, and future storage controls.',
  },
];

export function getRouteMeta(pathname: string) {
  return NAV_ITEMS.find((item) => item.to === pathname) ?? NAV_ITEMS[0];
}
