# Remediation Plan

> Completed remediation record. This file is not an active implementation queue after the 2026-05-03 wrap-up audit; use it as historical context for the completed Phases 1-8 changes.

## Purpose

This plan captures verified repo-review findings that are worth fixing in small, auditable phases. It is not a broad refactor mandate. Each phase should be started manually, implemented narrowly, validated, then stopped with a recap and the next best prompt.

Current source of truth remains:

1. current TypeScript and tests
2. active docs in `docs/`
3. content/report output
4. archived docs only as historical context

Do not implement from memory. Each phase starts by reopening the named files and confirming repo reality.

## Operating Rules

- One phase per Codex session unless the user explicitly asks otherwise.
- Do not change app runtime behavior in architecture-only phases.
- Do not add backend, auth, sync, browser API keys, or AI grading.
- Prefer pure helpers and focused tests before moving UI code.
- Keep patches small enough to review manually.
- Update this file only after a phase materially changes status.
- End every phase with validation results, risks, and one next best prompt.

## Standard Validation

For code changes:

```bash
npm run typecheck
npm run test
npm run build
```

For content or content-mapping changes, also run:

```bash
npm run report:content-coverage
npm run report:reading-reuse
npm run report:progression-gaps
npm run report:content-overlap
npm run report:scenario-inventory
```

For UI-affecting phases, manually inspect the affected route in a phone-width viewport before calling the phase done.

## Progress Tracker

| Phase | Status | Scope | Primary Risk |
| --- | --- | --- | --- |
| 1 | Done | Listening hint/support scoring semantics | Product correctness |
| 2 | Done | Grammar focus rules extraction | UI/content logic coupling |
| 3 | Done | Skill-map mapping guardrails | Silent progress drift |
| 4 | Done | Mission detail resolver extraction | Route branching drift |
| 5 | Done | Today controller/view-model extraction | High-risk integration hub |
| 6 | Done | Storage version comments and store consistency audit | Migration/debug confusion |
| 7 | Done | Review/mission shared UI primitives audit | Duplication drift |
| 8 | Done | Settings and scenario/capstone scope polish | Future product sprawl |

Status values: `Not started`, `In progress`, `Blocked`, `Done`, `Deferred`.

## Final Wrap-Up Audit

Date: 2026-05-03

Phases 1-8 are complete. The full remediation diff was re-read against this plan after implementation. No unintended runtime behavior changes were found outside the planned listening support-scoring fix. Architecture phases stayed to tested helper extraction, comments, a small shared presentation primitive, documentation boundaries, and CI validation wiring.

Completed outcomes:

- Listening transcript/reading/focus-assisted correct answers now record `supported`, while no-hint correct answers still record `correct`.
- Grammar focus term derivation moved out of `GrammarMissionPlayer` into a tested content helper.
- Skill-map coverage now has a testable guardrail for unmapped grammar lessons, missions, and target skills.
- Mission detail route resolution moved into a tested pure view-model helper.
- Today route orchestration was reduced through a tested view-model helper without changing recommendation, plan, Review, or bonus semantics.
- localStorage key/version comments now explain stable key suffixes versus internal record versions; no keys were renamed.
- Review and reading mission feedback share one small `MissionFeedbackBlock` primitive; no generic exercise engine was added.
- Scenario/capstone scope boundaries are documented as local, deterministic, source-auditable, and not AI chat or AI grading surfaces.
- GitHub Actions CI now runs install, typecheck, tests, build, and standard content reports on pull requests.

Final validation:

- `npm run typecheck`: passed.
- `npm run test`: passed, 34 test files / 175 tests.
- `npm run build`: passed with the existing Vite large chunk-size warning.
- `npm run report:content-coverage`: passed.
- `npm run report:reading-reuse`: passed.
- `npm run report:progression-gaps`: passed, 0 progression issues and 0 registry warnings.
- `npm run report:content-overlap`: passed.
- `npm run report:scenario-inventory`: passed with existing scenario coverage warnings for packs without scenario/application missions.
- `git diff --check`: passed.

Remaining follow-ups:

- Decide whether to address the Vite large chunk warning with route-level code splitting.
- Decide whether scenario/application mission gaps should become a content roadmap item; current gaps are reported but not blocking.
- Keep future Review/mission primitive extraction narrow; choices, audio cards, and reorder builders remain intentionally deferred.

## Phase 1: Listening Hint/Support Scoring

### Finding

`ListeningMissionPlayer` records final-answer reveal as `supported`, but revealing transcript, reading, or pattern focus before answering can still record `correct`. The feedback copy says support made the result lighter, but stored mission outcome still counts as clean correct.

Verified anchors:

- `src/features/missions/components/ListeningMissionPlayer.tsx`
- `src/features/missions/lib/missionCompletion.ts`
- `src/features/missions/lib/missionCompletion.test.ts`
- `src/features/missions/lib/useMissionAttemptOutcomes.ts`

### Goal

Make listening mastery mean no pre-answer transcript/reading/focus support was used.

### Suggested Fix

Keep the existing outcome model unless inspection proves it is insufficient:

```ts
type MissionItemOutcome = 'correct' | 'incorrect' | 'supported';
```

When a learner reveals transcript, reading, or focus before answering, a later correct answer should record `supported`, not `correct`. Final translation reveal should continue to record `supported` and create/keep Review pressure.

### Acceptance Criteria

- No-hint correct listening answer records `correct`.
- Transcript/reading/focus-assisted correct listening answer records `supported`.
- Translation reveal records `supported`.
- Supported listening items complete exposure but do not mark mission mastery.
- Feedback copy and stored outcome agree.
- Existing grammar/output/reading completion semantics are unchanged.

### Tests

Add or update focused tests around the smallest pure helper possible. If needed, extract a small helper from `ListeningMissionPlayer`, such as:

```ts
getListeningOutcomeForAnswer({ isCorrect, revealedBeforeAnswer })
```

Run standard validation.

### Manual QA

- Start one listening mission.
- Answer first item correctly without hints.
- On another item, reveal transcript or focus before answering correctly.
- Reveal final answer on another item.
- Confirm completion recap distinguishes correct versus review/support pressure.

### Next Prompt

```text
Start Phase 1 from docs/REMEDIATION_PLAN.md. Reopen the listening player and mission completion helpers first. Fix listening semantics so transcript/reading/focus-assisted correct answers record supported rather than clean correct, while no-hint correct answers still record correct and final answer reveal remains supported. Keep the patch narrow, add focused tests, preserve non-listening behavior, and run npm run typecheck, npm run test, and npm run build.
```

## Phase 2: Grammar Focus Rules Extraction

### Finding

`GrammarMissionPlayer.tsx` contains a large `GRAMMAR_FOCUS_RULES` regex table and helper logic. That is content/product logic embedded in a large UI component.

Verified anchors:

- `src/features/missions/components/GrammarMissionPlayer.tsx`
- `src/components/JapaneseTextPair.tsx`

### Goal

Move grammar focus rule derivation into a small tested helper without changing UI behavior.

### Suggested Fix

Create:

```text
src/lib/content/grammarFocusRules.ts
src/lib/content/grammarFocusRules.test.ts
```

Export a function such as:

```ts
getGrammarFocusTerms(lesson: Pick<GrammarLesson, 'id' | 'title'>): string[]
```

Update `GrammarMissionPlayer` to import it.

### Acceptance Criteria

- The focus terms returned for representative grammar lessons match current behavior.
- `GrammarMissionPlayer` no longer owns the regex table.
- No lesson/player UI behavior changes.

### Tests

Cover several representative rules:

- particles
- verb forms
- comparison/superlative
- plain-style recognition
- Japanese terms extracted from title

### Next Prompt

```text
Start Phase 2 from docs/REMEDIATION_PLAN.md. Extract grammar focus term derivation out of GrammarMissionPlayer into a tested helper under src/lib/content. Preserve current highlighting behavior, add focused tests for representative grammar IDs/title extraction, and run npm run typecheck, npm run test, and npm run build.
```

## Phase 3: Skill-Map Mapping Guardrails

### Finding

`src/lib/progress/skillMap.ts` hardcodes grammar lesson IDs and mission mappings. New content can silently miss the visible skill map.

### Goal

Add a guardrail before changing content schemas.

### Suggested Fix

Add tests or a report that identifies grammar lessons and mission target skills not covered by any skill signal. Prefer a focused test first. Do not move skill metadata into content yet unless the test proves the current model is too brittle.

### Acceptance Criteria

- New or existing test fails if a grammar lesson has no visible skill mapping and no explicit allowed exception.
- The report/test output is actionable.
- Current content passes without changing user-facing progress behavior.

### Tests

Add tests around exported mapping helpers. If current helpers are too private, extract minimal pure functions from `skillMap.ts`.

### Content Reports

Run standard validation plus content reports if mapping touches content interpretation.

### Next Prompt

```text
Start Phase 3 from docs/REMEDIATION_PLAN.md. Inspect skillMap.ts and current content first. Add a small test/report guardrail so new grammar lessons or mission target skills cannot silently fall outside visible skill-map signals. Preserve current progress behavior and run npm run typecheck, npm run test, npm run build, and the standard content reports if content interpretation changes.
```

## Phase 4: Mission Detail Resolver

### Finding

`MissionDetailPage.tsx` resolves mission content inline for grammar, listening, output, and reading missions. It is readable now, but it will accumulate branching as mission surfaces grow.

### Goal

Extract route-independent mission resolution into a pure helper.

### Suggested Fix

Create:

```text
src/features/missions/lib/missionDetailViewModel.ts
src/features/missions/lib/missionDetailViewModel.test.ts
```

Keep rendering in the route. The helper should answer: mission ID plus content -> valid playable view model or fallback reason.

### Acceptance Criteria

- Missing mission, missing lesson, missing listening items, missing output tasks, and missing reading checks are covered by tests.
- Valid grammar/listening/output/reading missions resolve to the same data the route currently passes.
- Route behavior and copy remain unchanged unless a copy mismatch is found during extraction.

### Next Prompt

```text
Start Phase 4 from docs/REMEDIATION_PLAN.md. Extract mission ID to playable mission data resolution from MissionDetailPage into a pure tested helper. Preserve route rendering and user-facing behavior, add tests for valid and fallback cases, and run npm run typecheck, npm run test, and npm run build.
```

## Phase 5: Today Controller/View Model

### Finding

`TodayPage.tsx` reads many stores, derives recommendations, manages daily session state, handles route completion state, writes plan snapshots, filters bonus work, and refreshes study day rollover.

### Goal

Reduce route-component orchestration without changing Today semantics.

### Suggested Fix

Do not start with a full rewrite. First extract a controller hook or pure view-model builder around the safest boundary discovered during inspection.

Candidate:

```text
src/features/today/lib/useTodayController.ts
```

or a pure helper if hook extraction is too broad:

```text
src/features/today/lib/todayViewModel.ts
```

### Acceptance Criteria

- Today recommendations, daily plan, completion handoff, bonus filtering, and rollover behavior are unchanged.
- Existing Today tests pass.
- Add focused tests for any newly extracted pure logic.
- Manual QA covers empty state, in-progress mission, completed core plan, Review pressure, and bonus state.

### Next Prompt

```text
Start Phase 5 from docs/REMEDIATION_PLAN.md. Inspect TodayPage and existing Today lib tests first. Extract only one safe controller/view-model layer from TodayPage without changing recommendation, daily-session, Review, or bonus semantics. Add focused tests where pure logic is extracted, manually QA key Today states, and run npm run typecheck, npm run test, and npm run build.
```

## Phase 6: Storage Version And Store Consistency Audit

### Finding

Some localStorage keys end in `v1` while internal schema version constants have advanced. Several stores repeat cache/read/sanitize/write/dispatch patterns, while daily session is more manual.

### Goal

Make storage debugging clearer without risky migrations.

### Suggested Fix

Add comments explaining stable storage keys versus internal record versions. Audit daily session behavior and decide whether it needs event/subscription consistency. Do not rename storage keys unless doing a real migration.

### Acceptance Criteria

- No storage key rename.
- Comments explain why key version and internal version can differ.
- Any behavioral inconsistency is documented or covered with tests.
- Existing reset behavior remains unchanged.

### Next Prompt

```text
Start Phase 6 from docs/REMEDIATION_PLAN.md. Audit localStorage stores for key/version clarity and consistency. Do not rename keys or migrate data. Add comments and only minimal tests if inspection finds unclear behavior. Preserve all reset and persistence semantics, then run npm run typecheck, npm run test, and npm run build.
```

## Phase 7: Review/Mission Shared Primitive Audit

### Finding

`ReviewBatchPlayer` duplicates several interaction patterns from mission players: choices, reorder assembly, feedback blocks, listening audio/reveal behavior, and answer controls.

### Goal

Identify and extract only tiny primitives that reduce duplication without creating a generic exercise engine.

### Suggested Fix

Start with an audit-only pass or one very small primitive. Candidate primitives:

- `MissionFeedbackBlock`
- `ChoiceGrid`
- `AudioPlayerCard`
- `ReorderAnswerBuilder`

### Acceptance Criteria

- No universal exercise engine.
- One primitive extraction maximum per implementation pass.
- Review behavior and mission player behavior remain unchanged.
- Tests or manual QA cover the affected item type.

### Next Prompt

```text
Start Phase 7 from docs/REMEDIATION_PLAN.md. Audit ReviewBatchPlayer and mission players for one small shared UI primitive worth extracting. Implement at most one primitive extraction, preserve behavior, manually QA the affected mission and Review item type, and run npm run typecheck, npm run test, and npm run build.
```

## Phase 8: Settings And Scenario/Capstone Scope Polish

### Finding

Settings is useful but increasingly diagnostic/admin-like. Scenario and capstone systems are powerful and should stay constrained to local, deterministic, source-auditable learning loops.

### Goal

Keep polish and scope discipline visible without expanding runtime behavior.

### Suggested Fix

Use this phase only after higher-priority correctness and architecture work. Possible small tasks:

- simplify Settings grouping/copy if it becomes confusing
- add scenario/capstone guardrail tests if new content lanes are added
- improve docs around scenario promotion criteria

### Acceptance Criteria

- No scenario chat.
- No AI grading.
- No backend.
- Settings remains understandable on mobile.
- Scenario/capstone content remains source-auditable.

### Next Prompt

```text
Start Phase 8 from docs/REMEDIATION_PLAN.md only after Phases 1-5 are complete or explicitly deferred. Inspect Settings, scenario contracts, capstone schemas, and active docs. Pick one narrow polish or guardrail task, preserve runtime scope, and run npm run typecheck, npm run test, npm run build, plus content reports if content constraints change.
```

## Phase Completion Report Template

Use this format at the end of every phase:

```text
## Status
- Phase:
- Result:

## Repo Reality Checked
- Files inspected:
- Confirmed assumptions:

## Changes
- Files changed:
- Behavior changed:

## Validation
- npm run typecheck:
- npm run test:
- npm run build:
- Content reports, if run:
- Manual QA, if run:

## Risks / Follow-ups
- Remaining risk:
- Deferred work:

## Next Best Prompt
<one copyable prompt for the next phase or follow-up>
```
