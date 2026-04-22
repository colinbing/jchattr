import type { PropsWithChildren, ReactNode } from 'react';

type PageShellProps = PropsWithChildren<{
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
}>;

type SurfaceCardProps = PropsWithChildren<{
  title: string;
  description: string;
}>;

export function PageShell({
  eyebrow,
  title,
  description,
  aside,
  children,
}: PageShellProps) {
  return (
    <section className="page-shell">
      <div className="page-shell__hero">
        <div>
          <p className="page-shell__eyebrow">{eyebrow}</p>
          <h1 className="page-shell__title">{title}</h1>
          <p className="page-shell__description">{description}</p>
        </div>
        {aside ? <div className="page-shell__aside">{aside}</div> : null}
      </div>

      <div className="page-shell__grid">{children}</div>
    </section>
  );
}

export function SurfaceCard({
  title,
  description,
  children,
}: SurfaceCardProps) {
  return (
    <section className="surface-card">
      <div className="surface-card__header">
        <h2 className="surface-card__title">{title}</h2>
        <p className="surface-card__description">{description}</p>
      </div>
      {children ? <div className="surface-card__body">{children}</div> : null}
    </section>
  );
}
