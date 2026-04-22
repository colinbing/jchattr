import { PageShell, SurfaceCard } from '../../../components/layout/PageShell';

export function SettingsPage() {
  return (
    <PageShell
      eyebrow="Preferences"
      title="Settings"
      description="This area will hold local-first preferences and study controls without introducing account or backend requirements."
      aside={<span className="status-chip">Local-first shell</span>}
    >
      <SurfaceCard
        title="App preferences"
        description="Future settings can live here without spreading persistence concerns across the feature code."
      >
        <ul className="simple-list">
          <li>Audio behavior</li>
          <li>Input preferences</li>
          <li>Study session defaults</li>
        </ul>
      </SurfaceCard>

      <SurfaceCard
        title="Storage and debug"
        description="A dedicated place for local storage controls, schema versioning, and development toggles."
      >
        <ul className="simple-list">
          <li>Reset local data</li>
          <li>Content version info</li>
          <li>Feature flags</li>
        </ul>
      </SurfaceCard>
    </PageShell>
  );
}
