import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../../lib/navigation';

type AppNavProps = {
  mode: 'desktop' | 'mobile';
};

export function AppNav({ mode }: AppNavProps) {
  return (
    <nav
      aria-label="Primary"
      className={`app-nav app-nav--${mode}`}
    >
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          aria-label={item.label}
          className={({ isActive }) =>
            `app-nav__link${isActive ? ' app-nav__link--active' : ''}`
          }
          end={item.to === '/'}
        >
          <span className="app-nav__label">
            {mode === 'mobile' ? item.mobileLabel ?? item.label : item.label}
          </span>
          {mode === 'desktop' ? (
            <span className="app-nav__caption">{item.caption}</span>
          ) : null}
        </NavLink>
      ))}
    </nav>
  );
}
