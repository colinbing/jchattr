import { useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppNav } from './AppNav';

export function AppShell() {
  const location = useLocation();
  const isMissionDetailRoute =
    location.pathname.startsWith('/mission/') || location.pathname.startsWith('/capstone/');
  const preserveScroll = Boolean(
    (location.state as { preserveScroll?: boolean } | null)?.preserveScroll,
  );

  useLayoutEffect(() => {
    if (preserveScroll) {
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.hash, location.pathname, preserveScroll]);

  return (
    <div className={`app-frame${isMissionDetailRoute ? ' app-frame--mission-detail' : ''}`}>
      <div className="app-shell">
        <aside className="app-shell__sidebar">
          <div className="brand-mark">
            <p className="brand-mark__eyebrow">Japanese OS</p>
            <h1 className="brand-mark__title">Short daily loops, built to stick.</h1>
            <p className="brand-mark__body">
              A local-first Japanese learning workspace designed for quick sessions,
              clear feedback, and simple expansion.
            </p>
          </div>
          <AppNav mode="desktop" />
        </aside>

        <div className="app-shell__main">
          <main className="app-content">
            <Outlet />
          </main>
        </div>
      </div>

      <div className={`app-mobile-nav${isMissionDetailRoute ? ' app-mobile-nav--hidden' : ''}`}>
        <AppNav mode="mobile" />
      </div>
    </div>
  );
}
