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
