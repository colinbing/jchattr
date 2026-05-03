> Archived historical document. Not current source of truth.

# jchattr Patch Series — Non-AI Architecture Hardening & Pre-Scenario Readiness

> **Repo target:** `colinbing/jchattr`  
> **Patch type:** non-AI architecture hardening, test hardening, QA hardening  
> **Intended executor:** Codex / repo-aware coding agent  
> **Primary goal:** remove brittle orchestration from route/player components and harden deterministic learning logic before any `jp-immersion` / AI scenario integration.  
> **Important context:** the first Today extraction prompt may already have been run. This document starts by requiring Codex to verify whether that extraction actually happened, rather than assuming it did.

---

## 0. Product boundary for this patch series

This patch series is **not** about adding AI chat, scenario chat, OpenAI runtime behavior, accounts, sync, backend work, or new curriculum packs.

The current product direction is:

- `jchattr` remains the structured, local-first curriculum spine.
- Today remains an app-directed daily plan, not a user-biased “choose your focus” scheduler.
- Weak points, review pressure, unfinished work, and curriculum order should drive the core loop.
- Bonus practice remains optional.
- Future `jp-immersion` style practice should be added only after the deterministic core is easier to reason about.

This patch series addresses the non-AI priorities:

1. `TodayPage.tsx` owning too much product logic.
2. Mission player components owning too much repeated session/outcome/continue logic.
3. Today recommendation logic becoming large and fragile.
4. Runtime/dependency boundaries needing a quick audit.
5. Store/localStorage resilience needing documented tests.
6. Visual QA needing consistent local-browser checks after each architectural move.
7. Keeping the app stable while preparing for a future micro-scenario layer.

---

## 1. Non-negotiable rules

### Do not add

- AI chat.
- OpenAI browser calls.
- New backend.
- Auth/accounts/sync.
- Analytics.
- New major curriculum packs.
- New scenario/chat feature behavior.
- New state-management library.
- Broad CSS redesign.

### Preserve

- Local-first architecture.
- TypeScript.
- Existing daily plan semantics.
- Existing mission completion semantics:
  - exposure / finished pass
  - clean pass / mastery
  - weak-point review pressure
- Existing review transaction semantics.
- Existing daily plan item keys.
- Existing 3 AM ET study-day rollover.
- Existing reading-display preferences.
- Existing optional AI fallback boundaries if present.
- Existing dev-only QA routes unless explicitly broken.

### Always verify repo reality

Before editing in each phase:

1. Run `git status`.
2. Inspect current implementation.
3. Do not assume prior prompts were completed.
4. Do not rely on `.md` claims as truth.
5. If docs and code disagree, code wins.
6. If current code already satisfies the phase, do not rewrite it; add missing tests/audit notes only.

---

## 2. Required validation commands

Unless a phase explicitly says otherwise, after code changes run:

```bash
npm run typecheck
npm run test
npm run build
```

If report scripts are relevant to the touched area, also run:

```bash
npm run report:build-status-summary
npm run report:content-coverage
npm run report:content-overlap
npm run report:progression-gaps
npm run report:reading-reuse
npm run report:scenario-inventory
```

Do not claim success if these fail.

---

## 3. Required local visual QA

After every phase that touches UI, routing, Today, missions, Review, Settings, or Progress:

1. Run the app locally with `npm run dev`.
2. Open the app in browser.
3. Test both:
   - desktop/laptop-ish viewport
   - iPhone-like viewport
4. Watch browser console.
5. Record exact flows tested.

Minimum recurring visual QA flows:

- Today initial load.
- Today after a mission return.
- Today after Review return.
- Today with bonus practice visible.
- Today with no bonus practice.
- Missions page.
- One grammar mission.
- One listening mission.
- One output mission.
- One reading mission.
- Review landing and one retry.
- Progress page.
- Settings page.

If a flow is infeasible in the current phase, explicitly say why.

---

## 4. Patch progress log format

Codex must update this file after each gate.

Use this exact format:

```md
### Gate N audit — YYYY-MM-DD HH:mm
- Completed:
- Files changed:
- Commands run:
- Results:
- Manual UI checks:
- Console errors:
- Risks / questions:
- Recommended next action:
```

Do not continue past a failed gate unless the issue is fixed or explicitly accepted by the user.

### Gate 1 audit — 2026-05-02 16:44
- Completed: Verified from repo reality that the Today plan-state extraction already exists. `TodayPage.tsx` now handles route/page orchestration, local navigation state, daily-session write/read side effects, and rendering; `todayPlanState.ts` owns plan snapshot creation/hydration/normalization, completion decoration, continue promotion, primary action selection, plan key/mission/capstone exclusion sets, and summary item decoration. No Today code was rewritten in this pass.
- Files changed: None for Gate 1 verification.
- Commands run: `git status`; full read of this patch file; `sed`/`rg` inspections of Phase 1 files and Today tests; later full-pass validation commands from the Phase 2 slice (`npm run typecheck`, `npm run test`, `npm run build`).
- Results: Today extraction verified. `todayPlanState.test.ts`, `todayPlanCompletion.test.ts`, `todayPlanKeys.test.ts`, `todayPlanSnapshot.test.ts`, and `todayBonusRecommendations.test.ts` cover the required plan-key, completion, continue promotion, primary action, bonus filtering, and snapshot persistence behavior. Full validation passed after the Phase 2 slice.
- Manual UI checks: During Gate 2 QA, Today initial load, Today after mission returns, Today with no bonus practice, and Today with bonus practice visible were observed. A full standalone Phase 1 visual QA matrix was not rerun because no Today code changed in this pass.
- Console errors: None observed during local browser QA.
- Risks / questions: `TodayPage.tsx` still owns continue-mission detail copy and route-return disclosure copy, but the pure plan-state logic named in Phase 1 acceptance criteria is extracted.
- Recommended next action: Continue Phase 2 with mission-player architecture hardening.

### Gate 2 audit — 2026-05-02 16:52
- Completed: Completed Phase 2 mission-player hardening. Extracted shared mission attempt/outcome state into `useMissionAttemptOutcomes`, backed by pure mission outcome helpers. Extracted shared continue-position initial read/write behavior into `useInitialMissionContinuePosition`, `useMissionContinuePosition`, and pure `resolveMissionContinueStart`, while keeping each player responsible for its own section semantics (`intro/examples/drills`, `prep/checks`, `tasks`, `checks`).
- Files changed: `src/features/missions/lib/missionCompletion.ts`; `src/features/missions/lib/useMissionAttemptOutcomes.ts`; `src/features/missions/lib/useMissionContinuePosition.ts`; `src/features/missions/lib/missionCompletion.test.ts`; `src/features/missions/lib/useMissionContinuePosition.test.ts`; `src/features/missions/components/GrammarMissionPlayer.tsx`; `src/features/missions/components/ListeningMissionPlayer.tsx`; `src/features/missions/components/OutputMissionPlayer.tsx`; `src/features/missions/components/ReadingMissionPlayer.tsx`; `jchattr_patch_non_ai_architecture_hardening.md`.
- Commands run: `npm run typecheck`; `npm run test`; `npm run build`; `npm run dev -- --host 127.0.0.1`; local browser QA at `http://127.0.0.1:5173/`.
- Results: `npm run typecheck` passed. `npm run test` passed with 21 files and 106 tests. `npm run build` passed; Vite still reports the existing large chunk warning for `dist/assets/index-*.js`.
- Manual UI checks: Today initial/return states from the first Phase 2 slice; grammar mission moved to Drills, reload resumed Drills; listening mission moved from Prep into checks, reload resumed checks; output mission submitted a wrong answer, used Keep moving, reload resumed prompt 2; reading mission answered check 1, moved to check 2, reload resumed check 2; Review opened with weak points, started a retry batch, and accepted one correct output retry.
- Console errors: None. Browser console warnings also none.
- Risks / questions: The new React hooks are not directly hook-tested because the repo has no React testing library; pure outcome and continue-start behavior are covered in `missionCompletion.test.ts` and `useMissionContinuePosition.test.ts`. Per-player index clamping remains intentionally local because each mission owns different UI state. Deferred finding: when reopening a previously completed reading mission, `MissionCompletionCard` shows "Ready for Today" / "This mission pass is done" while the current pass can still be 0/5 attempted; this may be intended as prior-completion status but the copy is potentially confusing and was not changed in this phase.
- Recommended next action: Move to Phase 3: decompose Today recommendation logic into smaller pure modules without changing recommendation behavior.

### Gate 3 audit — 2026-05-02 16:59
- Completed: Completed Phase 3 Today recommender decomposition. `deriveTodayRecommendations` remains the public orchestration API, while review awareness/review recommendations, mission recommendation selection, capstone closeout/recombination recommendations, and shared recommendation types now live in adjacent pure modules. Recommendation behavior was intended to remain unchanged.
- Files changed: `src/features/today/lib/todayRecommendations.ts`; `src/features/today/lib/todayRecommendations.test.ts`; `src/features/today/lib/todayRecommendationTypes.ts`; `src/features/today/lib/todayRecommendationReview.ts`; `src/features/today/lib/todayMissionRecommendation.ts`; `src/features/today/lib/todayCapstoneRecommendation.ts`; `jchattr_patch_non_ai_architecture_hardening.md`.
- Commands run: `npm run typecheck`; `npm run test`; `npm run build`; `npm run dev -- --host 127.0.0.1`; local browser QA at `http://127.0.0.1:5174/`.
- Results: `npm run typecheck` passed. `npm run test` passed with 21 files and 108 tests. `npm run build` passed; Vite still reports the existing large chunk warning for `dist/assets/index-*.js`.
- Manual UI checks: Today rendered the current local plan with a resume mission, weak-point retry, listening recommendation, and primary Continue action. Missions rendered the review-first recommendation panel, recommended-today mission count, next mission card, capstone card, and "Also recommended" section.
- Console errors: None. Browser console warnings also none.
- Risks / questions: Tests now cover no duplicate core/bonus mission recommendations and capstone recombination remaining bonus, in addition to the existing priority/review/capstone/reinforcement/scenario coverage. This phase did not reset local progress into every possible manual QA state; browser QA used the current local progress state and test coverage verifies the targeted recommendation branches.
- Recommended next action: Move to Phase 4 runtime/dependency boundary audit; keep it read-heavy and preserve the local-first architecture.

### Gate 4 audit — 2026-05-02 17:06
- Completed: Completed Phase 4 runtime/dependency boundary audit. Verified that browser runtime code has no `VITE_OPENAI_API_KEY`, no direct OpenAI client import, and no `Authorization` header path. Existing browser AI fallback/coach code remains disabled by default and posts only to optional configured proxy endpoints without holding an OpenAI key. Moved `openai` from runtime `dependencies` to `devDependencies` because it is only imported by Node scripts.
- Files changed: `package.json`; `package-lock.json`; `src/lib/feedback/aiBoundary.test.ts`; `jchattr_patch_non_ai_architecture_hardening.md`.
- Commands run: `git status --short`; inspected Phase 4 files with `sed`; searched repo with `rg -n "openai|OpenAI|VITE_|fetch\\(|Authorization|apiKey|OPENAI_API_KEY|Bearer" .`; `npm run typecheck`; `npm run test`; `npm run build`; `npm run dev -- --host 127.0.0.1`; local browser QA at `http://127.0.0.1:5174/settings`.
- Results: `npm run typecheck` passed. `npm run test` passed with 22 files and 112 tests. `npm run build` passed; Vite still reports the existing large chunk warning for `dist/assets/index-*.js`.
- Manual UI checks: Settings opened with AI explanation fallback status Off and AI output coach status Off. No API key was shown. Both cards state that local deterministic checks/scoring remain authoritative and that AI cannot change correctness.
- Console errors: None. Browser console warnings also none.
- Risks / questions: Optional browser `fetch` calls still exist for configured proxy endpoints, which is allowed by the Phase 4 rules because they do not carry an OpenAI key or `Authorization` header. The voice coach spike remains behind `VITE_VOICE_COACH_SPIKE_ENABLED`; it was noted in search results but not changed because Phase 4 listed it as out of scope and it does not call OpenAI.
- Recommended next action: Move to Phase 5 store/localStorage resilience audit. Keep reset testing scoped and do not perform a full local data reset unless using disposable state.

### Gate 5 audit — 2026-05-02 17:17
- Completed: Completed Phase 5 store/localStorage resilience audit. Inspected `missionProgress`, `capstoneProgress`, `weakPoints`, `reviewLoop`, `continueState`, `dailySession`, `studyPreferences`, and `studyData`. The stores already tolerate missing/corrupt localStorage with safe read fallbacks, sanitize stored shapes, and dispatch update events for `useSyncExternalStore` stores. No store behavior was changed; this phase added missing test coverage only.
- Files changed: `src/lib/progress/missionProgress.test.ts`; `src/lib/progress/dailySession.test.ts`; `src/lib/progress/capstoneProgress.test.ts`; `src/lib/progress/reviewLoop.test.ts`; `src/lib/settings/studyPreferences.test.ts`; `src/lib/settings/studyData.test.ts`; `jchattr_patch_non_ai_architecture_hardening.md`.
- Commands run: `git status --short`; inspected Phase 5 files with `sed`/`rg`; `npm run typecheck`; `npm run test`; `npm run build`; `npm run dev -- --host 127.0.0.1`; local browser QA at `http://127.0.0.1:5174/settings`, `/`, and `/review`.
- Results: `npm run typecheck` passed. `npm run test` passed with 25 files and 133 tests. `npm run build` passed; Vite still reports the existing large chunk warning for `dist/assets/index-*.js`.
- Manual UI checks: Settings rendered local snapshot and quick reset cards. Reset confirmation flows for weak points, review loop, and continue state opened and were canceled before deletion. Today rendered its plan surface. Review rendered its weak-point/retry surface. Full reset was not performed.
- Console errors: None. Browser console warnings also none.
- Risks / questions: Routine reset behavior was tested through confirmation/cancel in the browser plus direct unit coverage; actual browser deletion was not performed to preserve the user's local state. Existing `dailySession` is not a `useSyncExternalStore` store and does not dispatch store-update events; this matches current Today write/read usage and was not changed in this phase.
- Recommended next action: Move to Phase 6 content/report QA hardening. Keep it content-validation focused and do not add or rewrite curriculum content unless a verified report bug requires it.

### Gate 6 audit — 2026-05-02 17:22
- Completed: Completed Phase 6 content/report QA hardening. Inspected content loader/schema/scenario contract validation and the content report scripts. Fixed one report-output gap by adding listening audio manifest coverage to `report-content-coverage`; no curriculum content was changed.
- Files changed: `scripts/report-content-coverage.ts`; `jchattr_patch_non_ai_architecture_hardening.md`.
- Commands run: `git status --short`; inspected Phase 6 files with `sed`; `npm run report:content-coverage`; `npm run report:content-overlap`; `npm run report:progression-gaps`; `npm run report:reading-reuse`; `npm run report:scenario-inventory`; `npm run typecheck`; `npm run test`; `npm run build`; `npm run dev -- --host 127.0.0.1`; local browser QA at `http://127.0.0.1:5174/` and `/missions`.
- Results: All five content reports passed. Coverage reports 50 packs, 100 grammar lessons, 550 vocab items, 731 example sentences, 361 listening items, 361/361 listening audio refs matched, 206 missions, 49 reading missions, 245 reading checks, and 10/10 capstone chapter coverage. Overlap reports no exact duplicate Japanese examples and no exact duplicate English glosses, with expected repeated skeleton patterns. Progression gaps reports 0 issues and 0 metadata warnings. Reading reuse reports 232/731 examples reused in reading and no latest-five-pack total reuse gaps. Scenario inventory reports 7 scenario missions covering 13/50 packs, with optional-lane uncovered pack ranges listed. `npm run typecheck` passed. `npm run test` passed with 25 files and 133 tests. `npm run build` passed; Vite still reports the existing large chunk warning for `dist/assets/index-*.js`.
- Manual UI checks: Today rendered content-driven plan items. Missions rendered mission path, recommended-today count, capstone content, and chapter mission cards. The Scenarios tab opened as optional application practice and listed 7 controlled scenarios. No mission/curriculum content was edited.
- Console errors: None. Browser console warnings also none.
- Risks / questions: Scenario inventory warnings remain as known optional-lane coverage gaps, not runtime/content validation failures. Reading reuse intentionally reports many unreused examples because reading missions are recombination/reinforcement, not full coverage blockers. No actionable content bug was found in this phase.
- Recommended next action: Move to Phase 7 final non-AI regression QA. Keep it validation/QA focused; do not add AI/chat/micro-scenario features or change curriculum content.

### Gate 7 audit — 2026-05-02 17:35
- Completed: Ran the final non-AI regression command set and performed scoped local browser QA across Today, Missions, mission players, Review, Progress, and Settings. No AI/chat/micro-scenario feature was added, no curriculum content was changed, and no new deterministic regression requiring a code fix was verified.
- Files changed: `jchattr_patch_non_ai_architecture_hardening.md` for this Gate 7 audit only.
- Commands run: `npm run typecheck`; `npm run test`; `npm run build`; `npm run report:build-status-summary`; `npm run report:content-coverage`; `npm run report:content-overlap`; `npm run report:progression-gaps`; `npm run report:reading-reuse`; `npm run report:scenario-inventory`; `npm run dev -- --host 0.0.0.0`; local browser QA at `http://127.0.0.1:5173/`.
- Results: `npm run typecheck` passed. `npm run test` passed with 25 files and 133 tests. `npm run build` passed; Vite still reports the existing large chunk warning for `dist/assets/index-*.js`. Build status reports 206 missions, 100 grammar lessons, 550 vocab items, 731 examples, 361 listening items, 11 capstone stories, 116 capstone lines, 44 capstone checks, and 10/10 capstone chapter coverage. Content coverage reports 361/361 listening audio refs matched and 0 missing. Content overlap reports no exact duplicate Japanese examples and no exact duplicate English glosses. Progression gaps reports 0 issues and 0 registry metadata warnings. Reading reuse reports 232/731 examples reused in reading and no latest-five-pack total reuse gaps. Scenario inventory reports 7 optional scenario missions covering 13/50 packs, with uncovered optional-lane ranges still listed as warnings.
- Manual UI checks: Today dev fixtures covered no-bonus, one-bonus, review-return, reinforce-plan, and completed-summary states without localStorage writes. Live Today rendered review pressure, a completed review plan key after review, bonus reinforcement, and after-review return state. Missions rendered the review-first panel, chapter tabs, completed reinforce links, locked Chapter 2 states, and the optional Scenarios tab. Grammar mission accepted wrong and corrected answers. Listening mission covered transcript/pattern/answer reveal and a wrong answer. Output mission covered wrong and corrected typed answers. Reading mission covered wrong and corrected answers. Review showed weak points, ran a 3-item batch with two correct retries and one unresolved final retry, kept the unresolved item open, and returned to Today. Progress showed finished passes and clean passes as distinct, weak points influencing focus areas, and no mastery-copy blocker. Settings rendered local snapshot, reset controls, safe/off AI fallback statuses, audio coverage status, and reading-display preference save/restore. A separate iPhone-like viewport was not emulated because the available in-app Browser API did not expose viewport resizing; layout was checked in the current in-app browser viewport only.
- Console errors: None. Browser console warnings also none.
- Risks / questions: Existing Vite large chunk warning remains. Existing deferred copy issue remains on reopened completed reading missions: the completion card can say "Ready for Today" while the current replay pass is only partially attempted. This was already recorded as a deferred finding and was not changed in Phase 7. The 3 AM rollover state was not browser-forced; existing daily-session and Today plan-state tests cover the deterministic rollover behavior. Scenario pack coverage gaps remain optional-lane inventory warnings, not blockers.
- Recommended next action: The deterministic non-AI core is stable enough for the next patch to be a narrow micro-scenario architecture design pass: schema only, no OpenAI runtime, one controlled local scenario object, one deterministic/mock evaluator, and no full chat UI.

### Gate 8 audit — 2026-05-02 17:38
- Completed: Completed Phase 8 Option A design only. Inspected current scenario schema/content, validation contracts, inventory reporting, Missions optional application lane, mission route dispatch, output player scenario handling, deterministic output evaluation, Review weak-point resolution, and scenario-related tests. No runtime behavior, UI, storage, dependencies, backend/API path, AI/chat feature, or curriculum content was added.
- Files changed: `jchattr_patch_non_ai_architecture_hardening.md` for this Gate 8 design audit only.
- Commands run: `git status --short`; `sed`/`rg` inspections of `src/lib/content/types.ts`, `src/lib/content/schemas.ts`, `src/lib/content/loader.ts`, `src/lib/content/scenarioContracts.ts`, `src/lib/content/scenarioInventory.ts`, `src/content/missions.ts`, `src/features/missions/lib/missionLibraryStructure.ts`, `src/features/missions/routes/MissionsPage.tsx`, `src/features/missions/routes/MissionDetailPage.tsx`, `src/features/missions/components/OutputMissionPlayer.tsx`, `src/lib/outputEvaluation.ts`, `src/features/review/lib/reviewBatch.ts`, and related tests. No validation commands were rerun because this was a documentation-only architecture pass.
- Results: Option A is recommended. Repo reality already has seven optional scenario/application missions represented as `Mission.type === 'output'` plus `scenario.kind === 'scenario'`, strict contracts requiring typed learner moves, mirrored output-task ids/answers/token patterns, source-pack inventory reporting, Missions optional-lane placement, Today exclusion tests, and deterministic local output scoring. The smallest future implementation should preserve that boundary by extracting a pure scenario attempt/evaluator layer instead of adding a chat engine or a new mission spine.
- Manual UI checks: Not run for Gate 8 because no runtime/UI code changed. Gate 7 browser QA already confirmed the optional Scenarios lane and output-style scenario surfaces render.
- Console errors: Not checked in Gate 8 because no browser session was needed for this documentation-only pass.
- Risks / questions: Do not introduce OpenAI runtime calls, free-form chat, backend sync, accounts, analytics, new curriculum packs, or Today scheduling semantics in the next slice. Do not add `choose` or `build` moves until the player can represent them; current scenario contracts intentionally reject them. Do not create a separate scenario progress store unless a later UI need proves mission progress is insufficient. Existing scenario coverage gaps remain optional-lane inventory warnings, not a blocker for one controlled architecture slice.
- Recommended next action: Implement one narrow pure-helper slice only. Future files to add/change: add `src/features/missions/lib/scenarioAttempt.ts` for `deriveScenarioAttemptPlan(mission, tasks)` and `evaluateScenarioStep(step, task, response)` that wraps existing `evaluateOutputResponse`; add `src/features/missions/lib/scenarioAttempt.test.ts`; optionally add `src/lib/content/microScenarioSchema.ts` only if the current `ScenarioMissionMetadata` shape proves too mission-coupled, but prefer extending current types first; update `src/features/missions/components/OutputMissionPlayer.tsx` only to consume the pure helper while keeping current scenario copy and output task UI unchanged; update `src/lib/content/scenarioContracts.ts` tests if the helper exposes stricter invariants. Single next prompt: "Continue with the Phase 8 Option A implementation slice only: add pure scenario attempt/evaluator helpers around existing scenario output missions and deterministic output evaluation, test them directly, wire them into `OutputMissionPlayer` only if behavior remains identical, and do not add chat, OpenAI, backend, new content, new storage, or Today recommendation changes."

### Gate 8 audit — 2026-05-02 17:42
- Completed: Completed the Phase 8 Option A implementation slice. Added pure scenario attempt helpers around existing scenario output missions and deterministic output evaluation, then wired `OutputMissionPlayer` through those helpers without changing output UI copy, completion behavior, weak-point storage, Today recommendation behavior, curriculum content, storage shape, backend/API boundaries, or AI/chat behavior.
- Files changed: `src/features/missions/lib/scenarioAttempt.ts`; `src/features/missions/lib/scenarioAttempt.test.ts`; `src/features/missions/components/OutputMissionPlayer.tsx`; `jchattr_patch_non_ai_architecture_hardening.md`.
- Commands run: `npx vitest run src/features/missions/lib/scenarioAttempt.test.ts src/lib/outputEvaluation.test.ts src/lib/content/scenarioContracts.test.ts`; `npm run typecheck`; `npm run test`; `npm run build`; `npm run dev -- --host 0.0.0.0`; focused browser QA at `http://127.0.0.1:5173/mission/mission-output-classroom-destination` and `http://127.0.0.1:5173/mission/mission-scenario-class-self-introduction`.
- Results: Targeted Vitest run passed with 3 files and 22 tests. `npm run typecheck` passed. `npm run test` passed with 26 files and 137 tests. `npm run build` passed; the existing Vite large chunk warning remains. The new helpers derive active scenario steps from the current output task list, tolerate partial/reinforcement task subsets, and evaluate scenario steps by delegating to the existing deterministic `evaluateOutputResponse`.
- Manual UI checks: Regular output mission loaded, accepted the correct answer, and showed the existing "Correct" feedback and "Next task" action. Scenario output mission loaded with the existing scenario brief, source-pack/move copy, answer pieces, and accepted the correct typed answer with the same deterministic feedback/action copy. No full scenario completion pass was performed because the slice is helper extraction and wrapper wiring only.
- Console errors: None. Browser console warnings also none.
- Risks / questions: Scenario helpers intentionally do not support free-form chat, OpenAI feedback, remote evaluation, `choose`/`build` moves, or separate scenario progress. Existing scenario contracts still reject move types that the output player cannot represent. Existing scenario inventory pack gaps remain optional-lane warnings, not blockers.
- Recommended next action: Stop Phase 8 here unless a specific follow-up is requested. A later separate slice could extract scenario brief formatting from `OutputMissionPlayer` into a presentational helper/component, but only if it stays behavior-neutral and test-backed.

---

# Phase 1 — Verify / complete Today plan-state extraction

## Goal

Confirm that `TodayPage.tsx` no longer owns too much product logic.

The user has already given Codex a prompt targeting this issue:

> `TodayPage.tsx` currently owns too much product logic: plan snapshot hydration, plan item completion, bonus filtering context, continue-mission promotion, primary action selection, and summary item decoration. This is working, but it is too much route-level orchestration before future micro-scenario integration.

This phase must **verify actual repo state first**.

## Inspect first

Open:

```txt
src/features/today/routes/TodayPage.tsx
src/features/today/lib/todayPlanState.ts
src/features/today/lib/todayPlanKeys.ts
src/features/today/lib/todayPlanCompletion.ts
src/features/today/lib/todayPlanSnapshot.ts
src/features/today/lib/todayBonusRecommendations.ts
src/features/today/lib/todayPlanFormatting.ts
src/features/today/lib/todayRecommendations.ts
src/features/today/components/SessionSummary.tsx
src/features/today/components/TodayRecommendationCard.tsx
```

Also inspect Today-related tests.

## Acceptance criteria

`TodayPage.tsx` should mostly do route/page work:

- read hooks/stores
- handle `location.state`
- call pure helper(s)
- render UI
- handle navigation side effects

It should **not** still define most of the following inline:

- `resolveTodayPlanState`
- `hydrateTodayPlanItem`
- `createTodayPlanSnapshot`
- `createTodayPlanSnapshotItem`
- `normalizeTodayPlanSnapshotItem`
- snapshot equality helpers
- `isValidTodayPlanItem`
- `isTodayPlanItemComplete`
- `buildTodayPlanAction`
- `formatTodayPlanItemMeta`
- `getRecommendationKey`
- bonus filtering behavior

If these are already extracted, do not move them again. Audit and test.

If these are still inside `TodayPage.tsx`, extract them into:

```txt
src/features/today/lib/todayPlanState.ts
```

or smaller adjacent modules if that is already the repo convention.

## Tests required

Add or verify tests for:

1. Historical mission completion does not auto-complete today’s item.
2. Reinforce/default keys remain distinct.
3. Completed plan item keys mark summary items done.
4. Continue mission promotion still works.
5. Primary action selects the first unfinished plan item.
6. Bonus duplicate filtering can use plan keys, mission IDs, and capstone IDs.
7. Today plan snapshot persists for same study day when local state exists.
8. Snapshot can refresh on clean/no-local-state mismatch.

## Manual QA

Use local browser.

Required Today flows:

1. Normal empty-ish Today state.
2. Today after mission completion route return.
3. Today after review return.
4. Today with reinforce item in plan.
5. Today with one bonus option.
6. Today with no bonus option.
7. Mobile Today layout.
8. Desktop Today layout.
9. Console errors.

## STOP AND AUDIT — Gate 1

Required audit:

- Is `TodayPage.tsx` now route/render orchestration only?
- What functions/types moved?
- Which tests cover plan-state behavior?
- Did Today daily completion semantics remain unchanged?
- Did bonus layout remain unchanged?
- What, if anything, is still too large in Today?

---

# Phase 2 — Extract shared mission attempt/session helpers

## Goal

Reduce duplicated session/outcome/continue-state logic in mission players without changing behavior.

Current mission players are much better semantically, but they still mix:

- session replay variant selection
- expected item IDs
- attempt outcome state
- attempt summary derivation
- continue-state write/restore
- weak-point mutation
- navigation
- UI rendering

This phase should be surgical. Do not redesign the mission UI.

## Inspect first

Open:

```txt
src/features/missions/components/GrammarMissionPlayer.tsx
src/features/missions/components/ListeningMissionPlayer.tsx
src/features/missions/components/OutputMissionPlayer.tsx
src/features/missions/components/ReadingMissionPlayer.tsx
src/features/missions/lib/missionCompletion.ts
src/features/missions/lib/missionSession.ts
src/features/missions/lib/useMissionAutoComplete.ts
src/lib/progress/continueState.ts
src/lib/progress/missionProgress.ts
src/lib/progress/weakPoints.ts
```

## Target extractions

Create small helpers/hooks only where they reduce repeated risk.

Preferred new helpers:

```txt
src/features/missions/lib/useMissionAttemptOutcomes.ts
src/features/missions/lib/useMissionContinuePosition.ts
```

or similarly named files.

### `useMissionAttemptOutcomes`

Should centralize:

- `resultsByItemId`
- `handleItemResult`
- `attemptSummary`
- expected item ID input
- `mergeMissionItemOutcome`

Suggested API:

```ts
const {
  resultsByItemId,
  attemptSummary,
  recordItemOutcome,
  resetItemOutcome,
} = useMissionAttemptOutcomes(expectedItemIds);
```

Only add `resetItemOutcome` if current flows need it.

### `useMissionContinuePosition`

Only extract if it remains simple. It can centralize common update/restore patterns for item-based missions.

Avoid forcing grammar/listening/output/reading into one awkward abstraction if that makes code less clear.

## Acceptance criteria

After this phase:

- Mission players are smaller or at least less state-heavy.
- Existing behavior is unchanged.
- Each mission type still:
  - records incorrect answers as weak points,
  - records supported listening reveal correctly,
  - derives attempts from expected IDs,
  - marks exposure complete only when all expected items have outcomes,
  - preserves continue-state behavior.

## Tests required

Add or update tests for helper(s):

- expected ID list controls counted outcomes.
- stale keys are ignored.
- duplicate expected IDs are deduped.
- prior incorrect remains incorrect after later correct.
- prior supported remains supported after later correct.

If hooks are hard to test without React testing libs, keep the extraction as pure functions instead of hooks.

## Manual QA

Run one mission of each type:

1. Grammar: correct and wrong answer paths.
2. Listening: wrong answer and answer reveal path.
3. Output: wrong answer and keep-moving path.
4. Reading: wrong answer and correct answer path.
5. Return to Today after each if practical.
6. Confirm Today recap remains honest.

## STOP AND AUDIT — Gate 2

Required audit:

- What logic was extracted?
- Which mission players changed?
- Which mission players were intentionally left alone?
- Did any user-visible behavior change?
- Did all mission types still work locally?

---

# Phase 3 — Decompose Today recommendation logic into smaller pure modules

## Goal

Make `deriveTodayRecommendations` easier to maintain before adding micro-scenarios.

The current recommender is deterministic and good, but it is becoming large and policy-heavy.

This phase should not change recommendation behavior.

## Inspect first

Open:

```txt
src/features/today/lib/todayRecommendations.ts
src/features/today/lib/todayRecommendations.test.ts
src/features/today/lib/todayBonusRecommendations.ts
src/lib/progress/missionProgress.ts
src/lib/progress/reviewLoop.ts
src/lib/progress/weakPoints.ts
src/lib/progress/capstoneProgress.ts
```

## Suggested decomposition

Only extract if it preserves clarity.

Possible files:

```txt
src/features/today/lib/todayReviewRecommendation.ts
src/features/today/lib/todayCapstoneRecommendation.ts
src/features/today/lib/todayMissionRecommendation.ts
src/features/today/lib/todayRecommendationContext.ts
src/features/today/lib/todayRecommendationScoring.ts
```

Do not create too many tiny files if the code becomes harder to follow.

## Behavior that must not change

- Review appears first when weak points exist.
- Urgent review suppresses capstone closeout.
- Next unlocked incomplete mission appears.
- Locked missions do not appear.
- Scenario missions stay out of core Today.
- Completed missions can appear as reinforcement.
- Recently reviewed/completed missions are de-prioritized where current logic says so.
- Capstone closeout appears only when prerequisites are done.
- Recombination/story mode stays bonus.
- Recommendation limit is respected.

## Tests required

Existing tests should still pass.

Add tests if there are gaps around:

- no duplicate core/bonus mission.
- capstone vs review priority.
- completed mission reinforcement.
- scenario exclusion.
- recently reviewed mission de-prioritization if not already covered.

## Manual QA

Check Today in browser with:

1. Fresh/empty progress.
2. Progress with one weak point.
3. Progress with completed first mission.
4. Progress with capstone prerequisites complete.
5. Progress with completed missions available for reinforce.
6. Missions page recommended badges still appear.

## STOP AND AUDIT — Gate 3

Required audit:

- What recommender logic moved?
- Did public `deriveTodayRecommendations` API remain stable?
- Did recommendation tests pass unchanged or with additions?
- Did manual Today behavior look unchanged?

---

# Phase 4 — Runtime/dependency boundary audit

## Goal

Confirm the app is still local-first and not accidentally carrying runtime/backend/API assumptions in the browser bundle.

There may be optional AI fallback endpoint code and scripts. That is acceptable only if bounded.

## Inspect first

Open:

```txt
package.json
src/lib/feedback/aiMistakeExplanations.ts
src/lib/feedback/aiOutputCoach.ts
src/features/settings/routes/SettingsPage.tsx
scripts/generate-listening-audio.ts
scripts/draft-capstone.ts
vite.config.ts
```

Search for:

```txt
openai
VITE_
fetch(
Authorization
apiKey
OPENAI_API_KEY
```

## Rules

Allowed:

- server/script-side `OPENAI_API_KEY` for offline asset generation.
- frontend optional endpoint URL flags if the frontend does not hold the OpenAI key.
- deterministic local scoring remains authoritative.
- AI fallback/coaching can be advisory only.

Not allowed:

- frontend `VITE_OPENAI_API_KEY`.
- browser requests directly to OpenAI with an Authorization header.
- AI result changing local correctness.
- AI result marking mission completion.
- AI result clearing weak points.

## Dependency decision

If `openai` is only used by Node scripts, decide whether it should remain in `dependencies` or move to `devDependencies`.

Do not change if uncertain. Document the reason.

## Tests required

Add tests for AI request builders if not already covered:

- `correctnessLocked: true`
- text limits are applied
- local evaluation is included for output coach
- fallback is disabled when env is not configured
- no correctness override is represented in response types

## Manual QA

Open Settings:

- AI fallback status displays clearly.
- No API key is shown.
- No broken runtime error when AI endpoints are unset.

## STOP AND AUDIT — Gate 4

Required audit:

- Is browser direct OpenAI usage absent?
- Is `openai` dependency placement correct?
- Are AI fallback boundaries clear?
- Did Settings show safe statuses?

---

# Phase 5 — Store/localStorage resilience audit

## Goal

Make sure all local-first stores fail safely and reset cleanly.

## Inspect first

Open all progress/settings stores:

```txt
src/lib/progress/missionProgress.ts
src/lib/progress/capstoneProgress.ts
src/lib/progress/weakPoints.ts
src/lib/progress/reviewLoop.ts
src/lib/progress/continueState.ts
src/lib/progress/dailySession.ts
src/lib/settings/studyPreferences.ts
src/lib/settings/studyData.ts
```

## Required checks

Each store should:

- tolerate missing localStorage.
- tolerate corrupt JSON.
- sanitize shape.
- avoid throwing during render.
- expose reset behavior if user-facing reset exists.
- dispatch store update events consistently if using `useSyncExternalStore`.
- preserve legacy fields when migration is required.
- not silently mix study-day semantics with global progress semantics.

## Tests required

For each store, ensure at least basic tests exist for:

- empty state.
- corrupted localStorage.
- valid write/read.
- reset.
- migration if relevant.

Do not overbuild, but cover high-risk stores:

- daily session
- mission progress
- weak points
- continue state
- review loop

## Manual QA

Open Settings and test safe reset flows:

1. Reset continue state.
2. Reset review loop.
3. Reset weak points.
4. Do not do full reset unless using a disposable local state.
5. Confirm no console errors.
6. Confirm Today/Review/Progress still render.

## STOP AND AUDIT — Gate 5

Required audit:

- Which stores had tests already?
- Which tests were added?
- Any unsafe parsing found?
- Any reset behavior changed?

---

# Phase 6 — Content/report QA hardening

## Goal

Make the content-driven curriculum safer without adding content.

## Inspect first

Open:

```txt
src/lib/content/loader.ts
src/lib/content/schemas.ts
src/lib/content/scenarioContracts.ts
scripts/report-content-coverage.ts
scripts/report-content-overlap.ts
scripts/report-progression-gaps.ts
scripts/report-reading-reuse.ts
scripts/report-scenario-inventory.ts
```

## Required checks

The app should be able to answer:

- Are all mission references valid?
- Are scenario missions optional and mapped to packs?
- Are capstones linked to source packs/missions?
- Are reading missions recombination/reinforcement, not accidental core blockers?
- Are listening items with audio refs covered by assets/manifest?
- Are there progression gaps?
- Are there suspicious content overlaps?

## Commands

Run:

```bash
npm run report:content-coverage
npm run report:content-overlap
npm run report:progression-gaps
npm run report:reading-reuse
npm run report:scenario-inventory
```

If scripts fail, fix only script/runtime issues, not curriculum content, unless the content bug is clear and narrow.

## Tests

If scripts contain logic that could regress, extract small helpers and test them only if easy.

Do not spend a huge phase testing reporting scripts unless a bug is found.

## STOP AND AUDIT — Gate 6

Required audit:

- Which reports passed?
- What did they report?
- Any actionable content risk?
- Any script failure?
- Any recommended content follow-up before micro-scenario work?

---

# Phase 7 — Final non-AI regression QA

## Goal

Confirm the deterministic app is stable before future micro-scenario planning.

## Required commands

Run:

```bash
npm run typecheck
npm run test
npm run build
npm run report:build-status-summary
npm run report:content-coverage
npm run report:content-overlap
npm run report:progression-gaps
npm run report:reading-reuse
npm run report:scenario-inventory
```

## Required local QA flows

Use local browser.

### Today

- Fresh/empty Today.
- Today after 3 AM rollover simulation if feasible.
- Today with review required.
- Today with reinforce item.
- Today with bonus option.
- Today with no bonus option.
- Today after mission return.
- Today after review return.

### Missions

- Open Missions.
- Switch chapters.
- Confirm application/scenario lane is optional.
- Open locked mission state if possible.
- Open completed mission reinforce state if possible.

### Mission players

- Grammar: wrong and correct.
- Listening: answer reveal/support.
- Output: wrong and correct.
- Reading: wrong and correct.

### Review

- Weak point appears after miss.
- Correct review resolves only on batch finish.
- Incorrect final review keeps weak point.
- Review return to Today shows honest copy.

### Progress

- Finished passes vs clean passes are distinct.
- Weak points affect focus areas.
- No misleading mastery copy.

### Settings

- Reading display preference works.
- Reset controls render.
- AI fallback statuses are safe/off unless configured.
- Audio coverage status renders.

## STOP AND AUDIT — Gate 7

Required audit:

- Is the deterministic app stable?
- Are all commands passing?
- Are there console errors?
- Are there visual layout issues?
- Any remaining non-AI blocker?
- Is the repo ready for a micro-scenario architecture patch?

---

# Phase 8 — Next patch recommendation

## Goal

Produce the next concrete prompt only after the above work is actually verified.

If all gates pass, recommend one of:

### Option A — Micro-scenario architecture design

Only if deterministic core is stable.

Scope:

- schema design
- no OpenAI yet
- one controlled micro-scenario object
- one deterministic/local mock evaluator
- no full chat

### Option B — Content/curriculum alignment pass

If reports or learning goals suggest content sequencing problems.

Scope:

- map curriculum to skill stages
- no code-heavy work
- no AI

### Option C — Additional refactor

If Today or mission players remain too large.

Scope:

- extract one remaining subsystem
- no behavior change

## STOP AND AUDIT — Gate 8

Required audit:

- Which option is recommended?
- Why?
- What is the single next prompt?
- What should not be done yet?

---

# Appendix — Compact Codex start prompt

Use this when beginning the patch series:

```txt
We are in the jchattr repo.

Read `jchattr_patch_non_ai_architecture_hardening.md` and start with Phase 1 only.

Do not assume prior prompts were completed. Verify current repo state first.

Do not add AI, backend, accounts, sync, analytics, or new curriculum content.

Phase 1 goal: verify or complete extraction of Today plan-state logic out of TodayPage.tsx.

Before editing:
- run git status
- inspect the files listed in Phase 1
- report whether the extraction is already done
- list exact files you intend to change

If the extraction is already done, do not rewrite it. Add missing tests/audit notes only.
If it is not done, extract pure logic into today lib modules as directed.

After changes:
- npm run typecheck
- npm run test
- npm run build
- run the app locally and perform the Phase 1 visual QA
- update the Gate 1 audit in the markdown file

Stop after Gate 1 and provide the next best prompt.
```
