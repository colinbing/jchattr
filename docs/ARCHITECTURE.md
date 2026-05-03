# Architecture

## Stack

- Vite
- React 19
- React Router 7
- TypeScript
- Zod for content validation
- Vitest for unit tests
- Browser localStorage for MVP study state

## Routes

Routes are defined in `src/app/router.tsx` under the shared `AppShell`:

- `/` Today
- `/missions`
- `/mission/:missionId`
- `/capstone/:storyId`
- `/review`
- `/progress`
- `/settings`
- dev-only Today QA fixture routes
- disabled-by-default voice coach spike route when `VITE_VOICE_COACH_SPIKE_ENABLED=true`

## Feature Folders

- `src/features/today/`: daily plan, recommendation cards, completion state, Today QA fixture.
- `src/features/missions/`: mission library, mission detail route, mission players, capstone player, session/attempt helpers.
- `src/features/review/`: Review route, retry batch player, batch construction/resolution.
- `src/features/progress/`: Progress route and skill map display.
- `src/features/settings/`: Settings route, local reset controls, study preferences.
- `src/features/voiceCoach/`: disabled dev-only spike surface.

Shared logic lives under `src/lib/`. Structured content lives under `src/content/`. Report scripts live under `scripts/`.

## Local-First Storage Model

The app persists study state in browser localStorage through explicit typed stores:

- mission progress and mastery
- capstone progress
- weak points
- review loop progress
- continue state
- daily sessions and weekly tracker
- study preferences

Stores sanitize malformed data and expose hooks or read/write helpers. No backend, auth, sync, or online clock is part of the MVP.

## Mission Player Architecture

Mission content comes from typed content refs and player-specific data:

- grammar missions use lessons, examples, common mistakes, and drills
- listening missions use listening items and local audio refs when available
- output missions use output tasks and deterministic token/answer evaluation
- reading missions use reading checks against example sentences
- scenario missions are currently structured output missions with scenario metadata
- capstones use capstone story, line, and check structures

Shared mission behavior should go into `src/features/missions/lib/` before duplicating it across players.

## Today Recommendation Overview

Today uses deterministic local inputs: mission progress, weak points, review loop state, daily session state, continue state, preferences, and content ordering. It should remain inspectable and testable. Recommendation semantics should not be changed during UI/controller cleanup.

## Review And Weak Points

Misses record weak-point items by item type, mission, content id where available, miss count, and timestamp. Review builds deterministic retry batches and resolves weak points only through successful retry behavior.

## Progress And Skill Map

Progress derives skill tiers from completed/mastered missions and weak-point pressure. Skill definitions map content, target skills, mission ids, and weak-point item types to visible skill areas. New content lanes should include tests or reports that prove they map into the intended skill signals.

## Where To Add Code

- New route surface: `src/features/<feature>/routes/`, then wire in `src/app/router.tsx`.
- New shared domain helper: `src/lib/<domain>/` or existing feature `lib/`.
- New mission player behavior: prefer `src/features/missions/lib/` plus player integration.
- New content: `src/content/` plus schema/report validation.
- New report: `scripts/` with an npm script in `package.json`.
