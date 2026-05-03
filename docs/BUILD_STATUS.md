# Build Status

## Current State

JCHATTR is a working local-first React + TypeScript study app. Current reports show 207 missions, 100 grammar lessons, 550 vocab items, 731 example sentences, 361 listening items with matched generated audio assets, 49 reading missions, and 11 capstone stories covering all 10 chapters.

The app is in a quality-hardening phase: the main product loop exists, CI is wired for pull requests, and the next useful work is risk reduction, targeted simplification, and content-roadmap decisions.

## Implemented

- App shell/routes: Today, Missions, mission detail, capstone detail, Review, Progress, Settings, and dev-only fixture/spike routes.
- Today plan: deterministic finite daily lesson, date-keyed local session state, 3 AM America/New_York rollover, weekly tracker, Review handoff, bonus practice, and focus-mode tie-breaker.
- Mission players: grammar, listening, output, reading, capstone story, and structured scenario-as-output missions.
- Review loop: weak-point retry batches, retry resolution, compact deterministic explanations, and local review completion state.
- Progress/skill map: skill-area tiers derived from mission completions, mastery, and weak-point pressure.
- Settings/local reset: mission progress, capstone progress, weak points, review loop, continue state, daily sessions, and preferences.
- Structured content: Zod schemas, relation validation, content indexes, capstone validation, scenario contracts, and report scripts.
- Local persistence: browser localStorage stores for mission progress, capstone progress, weak points, review loop, continue state, daily sessions, and study preferences.
- Reports/tests: Vitest unit tests plus content coverage, reading reuse, progression gap, content overlap, scenario inventory, and build-status summary reports.
- CI: GitHub Actions runs install, typecheck, tests, build, and standard content reports on pull requests.
- AI boundaries: optional mistake explanation and output coach helpers are disabled by default, endpoint-gated, schema-validated, and correctness-locked.

## Current Known Risks

- Vite still reports a large main bundle after production build.
- Scenario/application coverage is intentionally partial; the scenario inventory report lists pack ranges without scenario missions.
- `TodayPage.tsx` is smaller after view-model extraction, but should only be simplified further through narrow, tested slices.
- Review and mission players still duplicate some interaction patterns beyond the shared feedback block.
- Skill-map mappings remain hand-maintained, with tests now guarding current starter-content coverage.

## Next Priorities

1. Confirm the new pull request CI workflow passes after the branch is pushed.
2. Decide whether to address the Vite large chunk warning with route-level code splitting.
3. Decide whether scenario/application coverage gaps should become a content roadmap item.
4. Continue Today route simplification only through narrow, tested behavior-preserving slices.
5. Extract additional Review/mission UI primitives only when one small duplication clearly justifies it.

## Last Verified Commands

- `npm run report:build-status-summary`: passed on 2026-05-03.
- `npm run report:content-coverage`: passed on 2026-05-03.
- `npm run typecheck`: passed on 2026-05-03.
- `npm run test`: passed on 2026-05-03, 34 files and 175 tests.
- `npm run build`: passed on 2026-05-03; Vite reported the existing large main-chunk warning.
- `npm run report:reading-reuse`: passed on 2026-05-03.
- `npm run report:progression-gaps`: passed on 2026-05-03, 0 progression issues and 0 registry warnings.
- `npm run report:content-overlap`: passed on 2026-05-03.
- `npm run report:scenario-inventory`: passed on 2026-05-03 with existing scenario coverage warnings.

## Notes

- Current repo reality wins over archived patch docs.
- Documentation consolidation on 2026-05-03 moved historical plans and prompts to `docs/archive/`.
