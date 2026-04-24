import { Outlet } from 'react-router-dom';
import { AppNav } from './AppNav';

export function AppShell() {
  return (
    <div className="app-frame">
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

      <div className="app-mobile-nav">
        <AppNav mode="mobile" />
      </div>
    </div>
  );
}
