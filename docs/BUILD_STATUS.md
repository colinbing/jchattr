# Build Status

## Current State

JCHATTR is a working local-first React + TypeScript study app. Current reports show 207 missions, 100 grammar lessons, 550 vocab items, 731 example sentences, 361 listening items with matched generated audio assets, 49 reading missions, and 11 capstone stories covering all 10 chapters.

The app is in a quality-hardening phase: the main product loop exists, and the next useful work is verification, risk reduction, and targeted simplification.

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
- AI boundaries: optional mistake explanation and output coach helpers are disabled by default, endpoint-gated, schema-validated, and correctness-locked.

## Current Known Risks

- CI/automated quality gates are not documented as present.
- `TodayPage.tsx` is still a large route/controller and should be decomposed carefully.
- Grammar focus/highlight rules appear to remain close to `GrammarMissionPlayer`.
- Skill-map mappings are hand-maintained and can miss new content lanes without guardrails.
- Archived docs contain many historical prompts and audit notes that should not be treated as current truth.

## Next Priorities

1. Add CI or another verified quality gate for typecheck, test, build, and content reports.
2. Re-audit listening supported-exposure versus mastery semantics.
3. Extract grammar focus rules into a small tested helper.
4. Split Today route/controller logic without changing recommendation behavior.
5. Add skill-map/content mapping tests or reports.

## Last Verified Commands

- `npm run report:build-status-summary`: passed on 2026-05-03.
- `npm run report:content-coverage`: passed on 2026-05-03.
- `npm run typecheck`: passed on 2026-05-03.
- `npm run test`: passed on 2026-05-03, 29 files and 148 tests.
- `npm run build`: passed on 2026-05-03; Vite reported the existing large main-chunk warning.

## Notes

- Current repo reality wins over archived patch docs.
- Documentation consolidation on 2026-05-03 moved historical plans and prompts to `docs/archive/`.
