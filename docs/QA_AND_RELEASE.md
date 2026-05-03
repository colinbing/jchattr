# QA And Release

## Required Local Commands

Run these before treating a code or content change as ready:

```bash
npm run typecheck
npm run test
npm run build
npm run report:content-coverage
npm run report:reading-reuse
npm run report:progression-gaps
npm run report:content-overlap
npm run report:scenario-inventory
```

For documentation-only changes, still run `typecheck`, `test`, and `build` unless dependencies or environment prevent it.

## Manual QA Checklist

- Today: finite plan, start/continue CTA, Review pressure, completion state, bonus practice, weekly tracker.
- Missions: active chapter, locked/unlocked/completed states, reading lane, capstone links, optional scenario lane.
- Grammar mission: intro/examples/drills, focus highlighting, feedback, weak-point recording, completion.
- Listening mission: audio-first behavior, transcript/reading/translation reveal, supported exposure versus mastery.
- Output mission: typed draft, kana assist where applicable, deterministic evaluation, feedback, weak-point recording.
- Reading mission: Japanese-first check, support reveal, known/unknown support chips if enabled.
- Review: queue landing, active retry, item-to-item state reset, weak-point resolution, return-to-Today behavior.
- Progress: skill tiers, completion/mastery counts, weak-point pressure.
- Settings: routine reset controls, full reset, preferences, audio status.
- Mobile viewport: portrait phone width, touch targets, no incoherent overlap, mission chrome behavior.

## CI Workflow

The repository has a GitHub Actions workflow at `.github/workflows/ci.yml` that runs on pull requests:

```bash
npm ci
npm run typecheck
npm run test
npm run build
npm run report:content-coverage
npm run report:reading-reuse
npm run report:progression-gaps
npm run report:content-overlap
npm run report:scenario-inventory
```

Content report failures should block merges when they indicate broken refs, missing audio assets, progression gaps, or unreviewed scenario drift.

## Static Hosting

The app is local-first and can be hosted as a static SPA. Keep rewrite configuration for client-side routes when deploying to Vercel, Netlify, or equivalent static hosts.
