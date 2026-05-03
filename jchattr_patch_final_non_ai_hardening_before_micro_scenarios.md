# jchattr Patch — Final Non-AI Hardening Before Micro-Scenarios

> **Repo target:** `colinbing/jchattr`  
> **Patch type:** final non-AI stabilization / architecture hardening  
> **Intended executor:** Codex / repo-aware coding agent  
> **Primary goal:** resolve the remaining brittle non-AI issues before introducing micro-scenarios, AI chat, or jp-immersion integration.  
> **Status:** This patch assumes the core learning-state work has mostly landed, but Codex must verify repo reality before changing anything.

---

## 0. Why this patch exists

The app has improved substantially. The current source appears to have:

- local-first daily planning
- per-study-day plan item completion
- honest mission outcomes: `correct`, `incorrect`, `supported`
- exposure-vs-mastery mission progress
- compound weak-point keys
- transactional review resolution
- Today plan-state extraction
- dev-only Today QA fixtures
- optional AI feedback boundaries that do not control pass/fail
- tests around Today, review, weak points, daily session, mission completion, and output evaluation

The remaining non-AI issues are now more subtle:

1. **Review wording can still overstate completion.**  
   A review pass can be completed for Today while unresolved weak points remain. The UI must not say “Review clear” in that case.

2. **Continue/resume copy appears stale.**  
   Grammar resume copy still appears to map `stepIndex` to a four-step sequence containing “common mistakes,” while the current grammar player uses `intro`, `examples`, and `drills`.

3. **Mission players still repeat orchestration logic.**  
   Grammar, listening, output, and reading players still each manage replay variants, expected item IDs, outcome state, continue-state persistence, route-return state, and finish behavior. This is not broken, but it is brittle before adding micro-scenarios.

4. **Today recommendation policy is still dense.**  
   `deriveTodayRecommendations` is readable but contains many product-policy branches in one module. It should be decomposed before more recommendation types are added.

5. **Final local QA needs to confirm the app is ready for the next phase.**  
   The next feature phase should be controlled micro-scenarios, but only after these final non-AI checks pass.

This patch is intentionally **not** a micro-scenario patch.

---

## 1. Non-negotiable boundaries

### Do not add in this patch

- AI chat
- micro-scenario mission type
- jp-immersion integration
- OpenAI runtime calls from the browser
- backend/API server code
- account/sync/auth
- analytics
- large UI redesign
- curriculum content expansion
- broad mission-player rewrites

### Preserve

- local-first architecture
- current daily-session storage semantics
- current mission completion semantics
- current review transactional semantics
- current weak-point storage shape
- current deterministic output evaluation authority
- dev-only QA fixture routes
- existing Today, Missions, Review, Progress, Settings navigation

### Allowed

- narrow pure-helper extraction
- small copy fixes
- small route/component cleanup
- tests around extracted helpers
- dev-only QA helper improvements
- dependency/runtime boundary cleanup if still needed
- patch-document audit logging

---

## 2. Required Codex operating rules

Codex must work in small phases. For every phase:

1. Run `git status`.
2. Inspect actual files before editing.
3. State the selected phase and intended files.
4. Make one focused change.
5. Run validation.
6. Run local visual/user-flow QA if behavior or UI changed.
7. Update this patch file’s progress log.
8. Stop.

Do **not** proceed to the next phase without a clean gate.

### Required validation commands

After any code change:

```bash
npm run typecheck
npm run test
npm run build
```

If a command fails, stop and report the failure. Do not continue into unrelated work.

### Required local QA baseline

For any phase touching Today, missions, review, or progress:

- run local dev server
- open app in browser
- inspect console
- check desktop width
- check mobile/iPhone-like viewport
- check at least the affected route(s)

### Required report format

Codex should report back in this format:

```md
## Status
- Git status:
- Patch phase:
- Files inspected:

## Diagnosis
- What was found:
- Why it matters:

## Changes
- Files changed:
- Summary:

## Tests
- Tests added/updated:
- `npm run typecheck`:
- `npm run test`:
- `npm run build`:

## Manual QA
- Local server:
- Viewports:
- Flows checked:
- Console errors:

## Patch doc update
- Updated: yes/no
- Section:

## Risks / deferred findings
- ...

## Next best prompt
...
```

---

# Phase 0 — Fresh repo verification

## Goal

Confirm current repo state without relying on any prior conversation or patch notes.

## Inspect

- `package.json`
- `src/features/today/routes/TodayPage.tsx`
- `src/features/today/lib/todayPlanState.ts`
- `src/features/today/lib/todayRecommendations.ts`
- `src/features/today/lib/todayBonusRecommendations.ts`
- `src/features/today/lib/todayPlanKeys.ts`
- `src/features/today/lib/todayPlanCompletion.ts`
- `src/lib/progress/dailySession.ts`
- `src/features/missions/lib/missionCompletion.ts`
- `src/features/missions/lib/missionSession.ts`
- `src/features/missions/lib/useMissionAutoComplete.ts`
- mission players:
  - `GrammarMissionPlayer.tsx`
  - `ListeningMissionPlayer.tsx`
  - `OutputMissionPlayer.tsx`
  - `ReadingMissionPlayer.tsx`
- Review:
  - `ReviewPage.tsx`
  - `ReviewBatchPlayer.tsx`
  - `reviewResolution.ts`
- Settings:
  - `SettingsPage.tsx`
  - `studyPreferences.ts`

## Verify

- `openai` should not be a runtime dependency unless runtime code actually needs it.
- Today plan-state extraction should exist.
- Focus-mode/study-focus recommendation bias should be removed if no longer intended.
- Daily plan completion should be based on completed plan item keys, not global mission completion.
- Mission summary should use expected item IDs, not object-value slicing.
- Review should still apply weak-point mutation transactionally.
- AI fallback/coaching should remain optional and advisory.

## Gate 0 audit

Record:

```md
### Gate 0 audit — YYYY-MM-DD HH:mm
- Current repo status:
- Confirmed already complete:
- Suspected remaining issues:
- First phase selected:
- Commands run:
- Results:
- Recommended next action:
```

Stop after Gate 0 if repo reality differs from this file.

---

# Phase 1 — Copy/state correctness patch

## Goal

Fix small but important user-trust issues without changing core behavior.

This phase addresses:

1. Review pass wording.
2. Continue/resume detail copy.

---

## 1A. Review pass wording

### Problem

Today can mark the `review-loop` plan item complete when the user completes a review pass, even if unresolved weak points remain. This can be a valid product choice: the user completed today’s review pass.

But the UI must not imply all review pressure is clear unless weak points are actually clear.

### Inspect

- `src/features/today/lib/todayPlanState.ts`
- `src/features/today/routes/TodayPage.tsx`
- `src/features/review/routes/ReviewPage.tsx`
- `src/features/review/lib/reviewResolution.ts`
- existing Today/review tests

### Implementation target

Find any copy equivalent to:

```txt
Review clear.
```

when the completed plan item may only mean “review pass completed.”

Preferred replacement:

```txt
Review pass done.
```

or:

```txt
Retry pass done.
```

Only use “Review clear” when the app knows no weak points remain.

### Tests

Add/update tests for the formatting helper or plan-state helper so that a completed review item formats as pass-complete copy, not queue-clear copy.

### Manual QA

- Create or use dev fixture for review return with unresolved items.
- Confirm summary does not say “Review clear” when unresolved items remain.
- Confirm the review return card still says unresolved items remain.
- Confirm a genuinely empty review queue can still say clear where appropriate.

---

## 1B. Continue/resume copy

### Problem

Continue/resume copy appears to use stale grammar step mapping. Grammar mission sections are currently `intro`, `examples`, and `drills`, but the resume copy may still use a four-step array that includes `common mistakes`.

### Inspect

- `src/features/today/routes/TodayPage.tsx`
- `src/lib/progress/continueState.ts`
- `src/features/missions/components/GrammarMissionPlayer.tsx`
- `src/features/missions/components/ListeningMissionPlayer.tsx`
- `src/features/missions/components/OutputMissionPlayer.tsx`
- `src/features/missions/components/ReadingMissionPlayer.tsx`

### Implementation target

Prefer using `continueState.position.sectionId` when present.

Suggested helper:

```ts
function formatContinueDetailFromPosition({
  mission,
  continueState,
  starterContent,
}: ...): string
```

Rules:

- Grammar:
  - `intro` → “Resume lesson intro.”
  - `examples` + item index → “Resume example N.”
  - `drills` + item index → “Resume drill N.”
- Listening:
  - `prep` → “Resume listening prep.”
  - `checks` + item index → “Resume listening check N.”
- Output:
  - `tasks` + item index → “Resume output task N.”
- Reading:
  - `checks` + item index → “Resume reading check N.”
- Fallback to legacy `stepIndex` only if `position` is absent.

### Tests

Add tests for continue detail formatting:

- grammar `drills` position does not show “common mistakes”
- grammar `examples` position shows example number
- listening `prep` and `checks` positions
- output task position
- reading check position
- legacy fallback still behaves safely

### Manual QA

- Start a grammar mission, move to drills, leave, return to Today.
- Confirm resume copy says drill, not common mistakes.
- Repeat quick check for output/listening/reading if feasible.
- Confirm the continue CTA still routes correctly.

## Gate 1 audit

```md
### Gate 1 audit — YYYY-MM-DD HH:mm
- Completed:
- Files changed:
- Review wording result:
- Continue copy result:
- Tests added:
- Commands run:
- Results:
- Manual QA:
- Risks / questions:
- Recommended next action:
```

---

# Phase 2 — Mission-player shared logic extraction

## Goal

Reduce repeated mission-player orchestration before micro-scenario work.

Do not rewrite the UI. Extract small shared helpers/hooks only where repetition is clear and safe.

## Current repeated patterns

Across mission players, look for:

- session replay variant selection
- expected item ID derivation
- local `resultsByItemId`
- `recordMissionItemOutcome`
- `summarizeMissionItemOutcomes`
- `useMissionAutoComplete`
- completion route state
- finish-to-Today navigation
- continue-state restore/update

## Inspect

- `GrammarMissionPlayer.tsx`
- `ListeningMissionPlayer.tsx`
- `OutputMissionPlayer.tsx`
- `ReadingMissionPlayer.tsx`
- `missionCompletion.ts`
- `missionSession.ts`
- `useMissionAutoComplete.ts`
- `continueState.ts`

## Recommended extraction order

### 2A. Outcome state helper

If not already done, create a lightweight hook:

```ts
useMissionOutcomeTracker(expectedItemIds: string[])
```

Possible API:

```ts
const {
  outcomesByItemId,
  attemptSummary,
  recordOutcome,
} = useMissionOutcomeTracker(expectedItemIds);
```

Internally:

- use `useState<Record<string, MissionItemOutcome>>`
- call `recordMissionItemOutcome`
- call `summarizeMissionItemOutcomes`

Keep it tiny.

Do **not** include weak-point recording inside this hook. Weak-point behavior differs by surface.

### 2B. Finish-to-Today helper

Optional if clean:

```ts
buildFinishMissionToTodayParams({
  mission,
  sessionMode,
  attemptSummary,
})
```

But avoid over-abstraction if it makes code less obvious.

### 2C. Continue-state helper

Only extract continue logic if it is clearly repeated and low-risk. Do not force it.

## Tests

For pure helpers:

- outcome tracker underlying pure logic should already be covered by `missionCompletion.test.ts`
- add tests only for new pure helpers
- avoid complex React hook tests unless a hook has non-trivial behavior

## Manual QA

Check all four mission types:

1. Grammar:
   - correct answer
   - wrong answer
   - Today return
2. Listening:
   - correct answer
   - reveal answer/support
   - Today return
3. Output:
   - rejected answer
   - accepted answer
   - Today return
4. Reading:
   - wrong answer
   - correct answer
   - Today return

Confirm:

- attempted/correct/support counts still correct
- weak points still saved
- completion route state still honest
- Today plan item still marks complete by exact key
- console clean

## Gate 2 audit

```md
### Gate 2 audit — YYYY-MM-DD HH:mm
- Completed:
- Files changed:
- Helpers/hooks extracted:
- Mission players touched:
- Behavior intentionally unchanged:
- Tests added:
- Commands run:
- Results:
- Manual QA:
- Risks / questions:
- Recommended next action:
```

---

# Phase 3 — Today recommendation decomposition

## Goal

Decompose Today recommendation internals without changing recommendation behavior.

This should make it safer to add future recommendation kinds, such as controlled micro-scenario practice, without turning `todayRecommendations.ts` into a fragile product-policy blob.

## Inspect

- `src/features/today/lib/todayRecommendations.ts`
- `src/features/today/lib/todayRecommendations.test.ts`
- content pack structures
- progress stores used by recommendations

## Desired public API

Keep this stable:

```ts
deriveTodayRecommendations(...)
```

Internal decomposition can change, but callers should not need to.

## Recommended module split

Create one or more of:

```txt
src/features/today/lib/recommendation/reviewRecommendation.ts
src/features/today/lib/recommendation/missionRecommendation.ts
src/features/today/lib/recommendation/capstoneRecommendation.ts
src/features/today/lib/recommendation/reinforcementRecommendation.ts
src/features/today/lib/recommendation/recommendationContext.ts
```

Or use a flatter naming pattern if the repo style prefers:

```txt
todayReviewRecommendation.ts
todayMissionRecommendation.ts
todayCapstoneRecommendation.ts
todayReinforcementRecommendation.ts
todayRecommendationContext.ts
```

## Rules

- No behavior change.
- No new recommendation type.
- No micro-scenario logic.
- No scenario promotion into core Today.
- Keep tests passing unchanged before adding new tests.
- If a behavior change is required to make extraction sane, stop and ask.

## Tests

Existing `todayRecommendations.test.ts` should continue to pass.

Add snapshot-like behavioral tests only if extraction exposes ambiguity:

- urgent Review first
- scenario exclusion from core Today
- capstone held during urgent review
- completed missions can be reinforcement
- least-practiced fallback still works

## Manual QA

- Today initial state
- Today with weak points
- Today after completing one mission
- Today with capstone-ready progress if easy via dev fixture or local state
- console clean

## Gate 3 audit

```md
### Gate 3 audit — YYYY-MM-DD HH:mm
- Completed:
- Files changed:
- Modules extracted:
- Public API preserved:
- Tests added/updated:
- Commands run:
- Results:
- Manual QA:
- Risks / questions:
- Recommended next action:
```

---

# Phase 4 — Dependency and runtime boundary audit

## Goal

Confirm runtime dependencies and optional AI endpoints are cleanly bounded.

## Inspect

- `package.json`
- `scripts/generate-listening-audio.ts`
- `scripts/draft-capstone.ts`
- `src/lib/feedback/aiMistakeExplanations.ts`
- `src/lib/feedback/aiOutputCoach.ts`
- any import of `openai`

## Verify

- `openai` should only be used in scripts/dev-side tooling, not browser runtime.
- Optional AI endpoints should not expose API keys in the browser.
- AI fallback should be disabled unless configured.
- AI fallback/coaching must not override deterministic correctness.

## Implementation target

If runtime boundary is already correct, do not change code. Record verification.

If `openai` is still imported in app runtime, stop and report before changing.

If `openai` is script-only and already in `devDependencies`, record as complete.

## Tests

Add tests only if there is an existing testable boundary helper.

## Manual QA

- Settings page AI fallback status
- Settings page output coach status
- Confirm no console errors when endpoints are not configured

## Gate 4 audit

```md
### Gate 4 audit — YYYY-MM-DD HH:mm
- Completed:
- Files inspected:
- Runtime dependency status:
- AI boundary status:
- Commands run:
- Results:
- Manual QA:
- Risks / questions:
- Recommended next action:
```

---

# Phase 5 — Dev QA fixture hardening

## Goal

Keep dev-only fixture routes useful and safe.

## Inspect

- `src/app/router.tsx`
- `src/features/today/routes/TodayQaFixturePage.tsx`
- `src/features/today/components/SessionSummary.tsx`
- `src/features/today/components/TodayRecommendationCard.tsx`

## Verify

- Today QA fixtures are dev-only.
- Fixtures do not mutate localStorage.
- Fixtures represent meaningful states:
  - no bonus
  - one bonus
  - review return
  - reinforce plan
  - completed summary
- Fixture labels/copy do not contradict current product semantics.

## Optional improvements

Only if small:

- Add fixture for unresolved review + bonus hidden.
- Add fixture for no review/no bonus complete state.
- Add fixture for capstone-ready state.

Do not overbuild fixture system.

## Manual QA

Open:

- `/dev/today-qa/no-bonus`
- `/dev/today-qa/one-bonus`
- `/dev/today-qa/review-return`
- `/dev/today-qa/reinforce-plan`
- `/dev/today-qa/completed-summary`

Check desktop and mobile.

## Gate 5 audit

```md
### Gate 5 audit — YYYY-MM-DD HH:mm
- Completed:
- Files changed:
- Fixtures verified:
- New fixtures:
- Commands run:
- Results:
- Manual QA:
- Risks / questions:
- Recommended next action:
```

---

# Phase 6 — Final non-AI readiness audit

## Goal

Confirm the app is ready for the first controlled micro-scenario design patch.

This is an audit phase. It should not make broad changes.

## Required commands

```bash
npm run typecheck
npm run test
npm run build
npm run report:content-coverage
npm run report:progression-gaps
npm run report:scenario-inventory
```

If any report script fails, stop and document.

## Required manual QA

### Today

- clean/new learner state
- existing learner state with completed missions
- state with weak points
- state with review return unresolved
- state with reinforce plan item
- bonus visible / no bonus visible
- 3 AM rollover behavior inspected by test or date helper

### Missions

- core chapter
- application/scenario lane
- reading lane
- locked mission copy
- completed vs clean-pass copy

### Mission players

- grammar wrong + correct
- listening support reveal
- output wrong + correct
- reading wrong + correct
- reinforce session

### Review

- weak point appears
- correct retry clears/decrements after batch completion
- incorrect retry remains open
- Today return copy is honest

### Progress

- finished vs clean pass visible
- weak-point skill priority visible
- no misleading mastery language

### Settings

- reading display preference works
- reset controls visible
- AI fallback statuses are non-invasive
- audio status visible

### Console/layout

- desktop wide
- laptop-ish
- iPhone-like
- no console errors

## Final readiness checklist

Codex should answer:

- Is Today plan completion still per-day and per-plan-item?
- Is historical mission progress still separate from Today item completion?
- Does Review pass completion copy avoid overclaiming queue clearance?
- Does continue/resume copy match actual mission sections?
- Are mission players still behaviorally correct after extraction?
- Are recommendation tests still protecting core policies?
- Are dev fixtures still dev-only?
- Are runtime dependencies clean?
- Are there any known blockers before micro-scenarios?

## Gate 6 audit

```md
### Gate 6 audit — YYYY-MM-DD HH:mm
- Completed:
- Commands run:
- Results:
- Manual QA matrix:
- Reports run:
- Remaining non-AI blockers:
- Ready for controlled micro-scenario planning: yes/no
- Recommended next patch:
```

---

# Suggested Codex prompt sequence

Use these prompts one at a time. Do not combine them unless Codex has already verified the previous phase is complete.

---

## Prompt A — Start this patch

```txt
We are in the jchattr repo.

Begin working through `jchattr_patch_final_non_ai_hardening_before_micro_scenarios.md`.

Treat the file as the source of truth. Do not add AI/chat/micro-scenario features.

Start with Phase 0. Run git status, read the patch file fully, inspect the listed files, and verify current repo state. Do not edit code yet unless Phase 0 finds a tiny doc/audit update is required.

Report:
## Status
## Diagnosis
## Files inspected
## Confirmed complete
## Remaining issues
## Patch doc update
## Next best prompt
```

---

## Prompt B — Phase 1 copy/state correctness

```txt
Continue `jchattr_patch_final_non_ai_hardening_before_micro_scenarios.md`.

Work only on Phase 1: copy/state correctness.

Fix review-plan wording so a completed review pass does not say “Review clear” when unresolved weak points can remain. Then fix continue/resume copy so grammar resume details match actual section IDs instead of stale step-index mapping.

Do not change daily-session storage, review semantics, mission semantics, or recommendation behavior.

Run:
npm run typecheck
npm run test
npm run build

Manual QA:
- Today with review return unresolved
- Today with continue mission
- grammar resume from drills
- output/listening/reading resume quick check if feasible
- console check

Update the patch doc Gate 1 audit and report in the required compact format.
```

---

## Prompt C — Phase 2 mission-player helper extraction

```txt
Continue `jchattr_patch_final_non_ai_hardening_before_micro_scenarios.md`.

Work only on Phase 2: mission-player shared logic extraction.

Do not change UI behavior. Do not add micro-scenarios. Extract only small shared helpers/hooks where repeated mission outcome/session logic is obvious and safe.

Prioritize:
- outcome state tracking
- expected item ID / attempt summary flow
- finish-to-Today helpers only if clean

Run:
npm run typecheck
npm run test
npm run build

Manual QA:
- grammar mission wrong/correct
- listening support reveal
- output wrong/correct
- reading wrong/correct
- reinforce pass
- Today return state
- console check

Update Gate 2 audit and report in the required compact format.
```

---

## Prompt D — Phase 3 recommendation decomposition

```txt
Continue `jchattr_patch_final_non_ai_hardening_before_micro_scenarios.md`.

Work only on Phase 3: Today recommendation decomposition.

Do not change behavior. Keep the public API `deriveTodayRecommendations(...)` stable. Split internals into smaller modules only where clean.

Do not add new recommendation types. Do not add scenario/micro-scenario logic.

Run:
npm run typecheck
npm run test
npm run build

Manual QA:
- Today initial state
- Today with weak points
- Today after completed mission
- capstone-ready state if easy
- console check

Update Gate 3 audit and report in the required compact format.
```

---

## Prompt E — Phase 4 and 5 boundary/fixture audit

```txt
Continue `jchattr_patch_final_non_ai_hardening_before_micro_scenarios.md`.

Work on Phase 4 and Phase 5 only if Phase 4 is verification-only. If code changes are needed in Phase 4, stop after Phase 4.

Phase 4:
Audit dependency/runtime and optional AI endpoint boundaries. Confirm OpenAI SDK is not used by browser runtime. Confirm AI fallback/coaching is endpoint-based and advisory only.

Phase 5:
Verify Today QA fixture routes are dev-only and still useful. Make only tiny fixture improvements if clearly needed.

Run:
npm run typecheck
npm run test
npm run build

Manual QA:
- Settings AI fallback/output coach status
- /dev/today-qa/no-bonus
- /dev/today-qa/one-bonus
- /dev/today-qa/review-return
- /dev/today-qa/reinforce-plan
- /dev/today-qa/completed-summary
- desktop/mobile
- console check

Update Gate 4 and Gate 5 audits and report compactly.
```

---

## Prompt F — Final readiness audit

```txt
Continue `jchattr_patch_final_non_ai_hardening_before_micro_scenarios.md`.

Work only on Phase 6: final non-AI readiness audit.

Do not add features unless a critical regression is found.

Run:
npm run typecheck
npm run test
npm run build
npm run report:content-coverage
npm run report:progression-gaps
npm run report:scenario-inventory

Then perform the manual QA matrix listed in Phase 6.

Update Gate 6 audit with:
- commands and results
- reports and results
- manual QA matrix
- remaining non-AI blockers
- whether the repo is ready for controlled micro-scenario planning

Report compactly and include the single best next patch recommendation.
```

---

# Patch Progress Log

Codex should append gate audits below this line.

---

### Gate 0 audit — 2026-05-02 22:14
- Current repo status: `## main...origin/main`; `A  jchattr_patch_final_non_ai_hardening_before_micro_scenarios.md`.
- Confirmed already complete:
  - `openai` is in `devDependencies`, with SDK imports limited to script-side tooling (`scripts/draft-capstone.ts`, `scripts/generate-listening-audio.ts`).
  - Browser AI fallback/coaching uses optional Vite endpoint configuration and marks correctness as locked/advisory in request payloads.
  - Today plan-state extraction exists in `src/features/today/lib/todayPlanState.ts`.
  - Daily plan completion is keyed by completed plan item keys for the current study day, not global mission completion.
  - Mission attempt summaries are bounded to expected item IDs through `summarizeMissionItemOutcomes`.
  - Mission outcome tracking and continue-position hooks already exist (`useMissionAttemptOutcomes`, `useMissionContinuePosition`).
  - Review resolution mutates weak points transactionally after batch completion.
  - Today recommendation code is already split across review, mission, capstone, and type modules, and tests cover scenario exclusion plus reinforcement without focus-mode preference bias.
  - Today QA fixture routes are guarded by `import.meta.env.DEV`.
- Suspected remaining issues:
  - `formatTodayPlanItemMeta` still returns `Review clear.` for a completed review plan item even when unresolved weak points can remain.
  - Today QA fixtures contain stale `Review clear.` examples.
  - Today continue/resume copy still formats grammar progress from legacy step-index labels including `common mistakes`, rather than preferring `continueState.position.sectionId`.
  - Phase 2 and Phase 3 repo reality is ahead of this patch file in places; future passes should audit existing helper/split quality instead of assuming no extraction has happened.
- First phase selected: Phase 1 — Copy/state correctness (`1A` review wording, `1B` continue/resume copy).
- Commands run: `git status --short --branch`; full patch-file reads with `sed`; targeted `sed` inspections of Phase 0 files; `rg` audits for OpenAI/runtime boundary, focus-mode, stale review/continue copy, mission outcome/continue hooks; `date`.
- Results: Phase 0 verification complete. No app code changed. No validation commands were run because Phase 0 was audit-only.
- Recommended next action: Work only on Phase 1. Fix review pass wording and continue/resume detail formatting with focused tests, then run `npm run typecheck`, `npm run test`, and `npm run build` plus affected manual QA.

### Gate 1 audit — 2026-05-02 22:21
- Completed:
  - 1A review-plan wording now uses `Review pass done.` for a completed review plan item instead of implying queue clearance.
  - 1B Today continue/resume detail formatting now prefers structured `continueState.position` and matches current mission section IDs.
- Files changed:
  - `src/features/today/lib/todayPlanState.ts`
  - `src/features/today/lib/todayPlanState.test.ts`
  - `src/features/today/lib/todayContinueDetail.ts`
  - `src/features/today/lib/todayContinueDetail.test.ts`
  - `src/features/today/routes/TodayPage.tsx`
  - `src/features/today/routes/TodayQaFixturePage.tsx`
  - `jchattr_patch_final_non_ai_hardening_before_micro_scenarios.md`
- Review wording result:
  - Completed review plan items say `Review pass done.`
  - Review return copy still says the queue is clear only when `remainingWeakPointCount === 0`.
  - Dev review-return fixture shows unresolved work with `Review pass done.` and no `Review clear.` copy.
- Continue copy result:
  - Added `formatContinueDetailFromPosition`.
  - Grammar: `intro` → lesson intro, `examples` → example N, `drills` → drill N.
  - Listening: `prep` → listening prep, `checks` → listening check N.
  - Output: `tasks` → output task N.
  - Reading: `checks` → reading check N.
  - Legacy grammar fallback no longer emits `common mistakes`.
- Tests added:
  - Updated `todayPlanState.test.ts` completed review expectation.
  - Added `todayContinueDetail.test.ts` coverage for grammar drill/example, listening prep/check, output task, reading check, and legacy fallback.
- Commands run:
  - `git status --short --branch`
  - targeted `sed`/`rg` inspections
  - `npm run typecheck`
  - `npm run test`
  - `npm run build`
  - local dev server: `npm run dev -- --host 127.0.0.1` on `http://127.0.0.1:5174/`
- Results:
  - `npm run typecheck`: passed.
  - `npm run test`: passed, 27 files / 143 tests.
  - `npm run build`: passed. Vite emitted the existing large chunk warning.
- Manual QA:
  - Normal Today at `/`: loaded, no `Review clear.`, no stale resume/common-mistakes copy, no console errors.
  - Review return fixture at `/dev/today-qa/review-return`: showed `Review pass done.`, unresolved review card, and no console errors.
  - Grammar mission: opened `mission-grammar-topic-desu`, moved to `Drills`, returned Today; no stale resume/common-mistakes copy or console errors.
  - Listening/output/reading mission routes: opened representative missions without completing them; all loaded and produced no console errors.
  - Today after reading continue state: showed continue mission, no `Review clear.`, no stale resume/common-mistakes copy, no console errors.
- Risks / questions:
  - In-app browser QA covered the available desktop viewport; a separate mobile/iPhone viewport was not available through the current browser-control surface.
  - Existing unrelated copy issue observed in a mission card: `passs` pluralization. Deferred because it is outside Phase 1 review/resume copy scope.
- Recommended next action:
  - Proceed to Phase 2, but audit current repo reality first because mission outcome and continue-position hooks already exist.

### Gate 2 audit — 2026-05-02 22:33
- Completed:
  - Audited current mission-player shared logic and confirmed Phase 2A-style outcome tracking already exists as `useMissionAttemptOutcomes`.
  - Confirmed continue-position restore/update logic already exists as `useInitialMissionContinuePosition` and `useMissionContinuePosition`.
  - Extracted only the remaining small pure route-return helper for mission finish-to-Today behavior.
- Files changed:
  - `src/features/missions/lib/missionSession.ts`
  - `src/features/missions/lib/missionSession.test.ts`
  - `src/features/missions/components/GrammarMissionPlayer.tsx`
  - `src/features/missions/components/ListeningMissionPlayer.tsx`
  - `src/features/missions/components/OutputMissionPlayer.tsx`
  - `src/features/missions/components/ReadingMissionPlayer.tsx`
  - `jchattr_patch_final_non_ai_hardening_before_micro_scenarios.md`
- Helpers/hooks extracted:
  - Added `buildFinishMissionToTodayParams({ mission, sessionMode, attemptSummary })`.
  - The helper returns the unchanged Today route target `/` and the existing `missionCompletion` route state from `buildMissionCompletionRouteState`.
- Mission players touched:
  - Grammar, listening, output, and reading players now use `buildFinishMissionToTodayParams` for finish-to-Today navigation state.
  - Reading also reuses the helper state for `MissionCompletionCard` return state.
- Behavior intentionally unchanged:
  - Mission outcome recording still flows through `useMissionAttemptOutcomes`.
  - Weak-point recording remains in each player surface.
  - Auto-completion still flows through `useMissionAutoComplete`.
  - Continue-state storage/clearing semantics are unchanged.
  - Today plan completion and recommendation behavior are unchanged.
- Tests added:
  - Added `missionSession.test.ts` coverage for `buildFinishMissionToTodayParams`.
- Commands run:
  - `git status --short --branch`
  - targeted `sed`/`rg` inspections of mission players and mission shared helpers
  - `npm run typecheck`
  - `npm run test`
  - `npm run build`
  - local dev server: `npm run dev -- --host 127.0.0.1` on `http://127.0.0.1:5174/`
- Results:
  - `npm run typecheck`: passed.
  - `npm run test`: passed, 28 files / 144 tests.
  - `npm run build`: passed. Vite emitted the existing large chunk warning.
- Manual QA:
  - Grammar mission: wrong answer, corrected answer, finish-to-Today return; Today showed completion state with honest review item count; console clean.
  - Listening mission: support reveal path, correct answer, supported remaining lines, finish-to-Today return; Today showed completion state with review item count; console clean.
  - Output mission: rejected typed answer, corrected accepted answer, finish-to-Today return; Today showed completion state with review item count; console clean.
  - Reading mission: wrong answer, corrected/continued checks, `MissionCompletionCard` Open Today return; Today showed completion state with review item count; console clean.
  - Reinforce pass: opened a short reinforce grammar pass from Today, completed drills, finish-to-Today return; console clean.
- Risks / questions:
  - Manual QA used the available in-app browser desktop viewport. No separate mobile viewport control was available through this browser surface.
  - Existing deferred copy issue remains: a mission card can render `passs` pluralization.
- Recommended next action:
  - Proceed to Phase 3 — Today recommendation decomposition. Start by auditing current repo reality because recommendation internals are already partially split into review, mission, capstone, and type modules.

### Gate 3 audit — 2026-05-02 22:39
- Completed:
  - Audited current Today recommendation structure and confirmed internals were already partially split into review, mission, capstone, and type modules.
  - Kept `deriveTodayRecommendations(...)` as the public API and preserved its ordering/limit behavior.
  - Moved remaining mission recommendation construction out of `todayRecommendations.ts` and into `todayMissionRecommendation.ts`.
- Files changed:
  - `src/features/today/lib/todayRecommendations.ts`
  - `src/features/today/lib/todayMissionRecommendation.ts`
  - `jchattr_patch_final_non_ai_hardening_before_micro_scenarios.md`
- Modules extracted:
  - No new module was necessary because the repo already has `todayMissionRecommendation.ts`.
  - Added mission-policy helpers there:
    - `selectNextOpenMission`
    - `buildNextMissionRecommendation`
    - `buildSupportMissionRecommendation`
    - `buildRemainingMissionRecommendations`
- Public API preserved:
  - `deriveTodayRecommendations(...)` signature unchanged.
  - Type exports from `todayRecommendations.ts` unchanged.
  - `isMissionUnlocked` re-export unchanged.
- Tests added/updated:
  - No new tests added. Existing recommendation tests already cover urgent review first, scenario exclusion, capstone urgent-review hold, reinforcement availability, duplicate mission prevention, capstone recombination bonus, and unresolved review availability.
- Commands run:
  - `git status --short --branch`
  - targeted `sed`/`rg` inspections of Today recommendation modules and tests
  - `npm run typecheck`
  - `npm run test`
  - `npm run build`
  - local dev server: `npm run dev -- --host 127.0.0.1` on `http://127.0.0.1:5174/`
- Results:
  - `npm run typecheck`: passed.
  - `npm run test`: passed, 28 files / 144 tests.
  - `npm run build`: passed. Vite emitted the existing large chunk warning.
- Manual QA:
  - Current Today state: loaded with review and mission recommendations present, completed state visible from existing local progress, and no console errors.
  - Today QA fixtures opened without mutating localStorage:
    - `/dev/today-qa/no-bonus`
    - `/dev/today-qa/one-bonus`
    - `/dev/today-qa/review-return`
    - `/dev/today-qa/reinforce-plan`
    - `/dev/today-qa/completed-summary`
  - All fixture routes loaded expected Today surfaces and reported no console errors.
  - Capstone-ready app state was not forced because that would require localStorage manipulation outside this behavior-preserving recommendation extraction; existing tests cover capstone recommendation behavior.
- Risks / questions:
  - Manual QA used current/local fixture states rather than synthetic localStorage mutation.
  - Existing deferred copy issue remains: a mission card can render `passs` pluralization.
- Recommended next action:
  - Proceed to Phase 4 — dependency and runtime boundary audit. If Phase 4 is verification-only, Phase 5 may follow in the same pass per the patch prompt guidance.

### Gate 4 audit — 2026-05-02 22:44
- Completed:
  - Audited dependency/runtime boundaries for OpenAI SDK usage and optional browser AI endpoints.
  - Confirmed Phase 4 is verification-only; no runtime code changes were needed.
- Files inspected:
  - `package.json`
  - `scripts/generate-listening-audio.ts`
  - `scripts/draft-capstone.ts`
  - `src/lib/feedback/aiMistakeExplanations.ts`
  - `src/lib/feedback/aiOutputCoach.ts`
  - `src/lib/feedback/aiBoundary.test.ts`
  - `src/features/settings/routes/SettingsPage.tsx`
  - `src/vite-env.d.ts`
  - `src/app/router.tsx`
- Runtime dependency status:
  - `openai` remains in `devDependencies`, not runtime `dependencies`.
  - `openai` imports are limited to scripts/dev-side tooling.
  - Browser runtime AI paths use endpoint URLs only; no API key env var is exposed to app code.
- AI boundary status:
  - AI mistake explanation fallback is disabled unless `VITE_AI_MISTAKE_EXPLANATIONS_ENABLED === 'true'` and an endpoint is configured.
  - AI output coach is disabled unless `VITE_AI_OUTPUT_COACH_ENABLED === 'true'` and an endpoint is configured.
  - Existing request payloads lock correctness with `correctnessLocked: true`.
  - Existing tests confirm disabled endpoints do not call `fetch` and result types cannot override correctness/completion.
- Commands run:
  - `git status --short --branch`
  - targeted `sed`/`rg` inspections of runtime dependency, AI boundary, Settings, and route files
  - `npm run typecheck`
  - `npm run test`
  - `npm run build`
  - local dev server: `npm run dev -- --host 127.0.0.1` on `http://127.0.0.1:5174/`
- Results:
  - `npm run typecheck`: passed.
  - `npm run test`: passed, 29 files / 148 tests.
  - `npm run build`: passed. Vite emitted the existing large chunk warning.
- Manual QA:
  - Settings page loaded with AI explanation fallback status Off.
  - Settings page loaded with AI output coach status Off.
  - Settings copy confirmed local deterministic checks/scoring remain authoritative.
  - Browser console reported 0 errors with endpoints not configured.
- Risks / questions:
  - None for Phase 4.
- Recommended next action:
  - Phase 5 was allowed in the same pass because Phase 4 was verification-only.

### Gate 5 audit — 2026-05-02 22:44
- Completed:
  - Verified Today QA fixture routes are dev-only through the `import.meta.env.DEV` route guard.
  - Verified fixture code does not call localStorage, progress mutation helpers, or reset helpers.
  - Added one small fixture-only state for completed core work with no bonus recommendation.
- Files changed:
  - `src/features/today/routes/TodayQaFixturePage.tsx`
  - `src/features/today/routes/TodayQaFixturePage.test.ts`
  - `jchattr_patch_final_non_ai_hardening_before_micro_scenarios.md`
- Fixtures verified:
  - `/dev/today-qa/no-bonus`
  - `/dev/today-qa/one-bonus`
  - `/dev/today-qa/review-return`
  - `/dev/today-qa/reinforce-plan`
  - `/dev/today-qa/completed-summary`
  - `/dev/today-qa/completed-no-bonus`
- New fixtures:
  - `completed-no-bonus`: completed core state with no bonus recommendations and finished-today support copy.
- Commands run:
  - `git status --short --branch`
  - targeted `sed`/`rg` inspections of router, fixture route, SessionSummary, and TodayRecommendationCard
  - `npm run typecheck`
  - `npm run test`
  - `npm run build`
  - local dev server: `npm run dev -- --host 127.0.0.1` on `http://127.0.0.1:5174/`
- Results:
  - `npm run typecheck`: passed.
  - `npm run test`: passed, 29 files / 148 tests.
  - `npm run build`: passed. Vite emitted the existing large chunk warning.
- Manual QA:
  - All fixture routes loaded `Today QA`, showed the `No localStorage` chip, and finished lazy loading.
  - `review-return` showed `Review pass done.` and did not show `Review clear.`.
  - `completed-summary` showed finished-today state with an optional bonus.
  - `completed-no-bonus` showed finished-today state with no bonus slot.
  - Browser console reported 0 errors on every fixture route.
- Risks / questions:
  - The in-app browser surface available in this session did not expose mobile viewport control, so manual QA covered the available desktop viewport only.
  - Existing deferred copy issue remains: a mission card can render `passs` pluralization.
- Recommended next action:
  - Proceed to Phase 6 — final regression/readiness QA and patch closeout. Re-run the required validation and full manual QA matrix without changing product behavior unless a blocking regression is found.

### Gate 6 audit — 2026-05-02 22:56
- Completed:
  - Final non-AI readiness audit completed without product behavior changes.
  - Confirmed Today plan completion remains per-day and per-plan-item through existing daily-session tests.
  - Confirmed historical mission progress remains separate from Today item completion.
  - Confirmed Review pass completion copy avoids overclaiming queue clearance.
  - Confirmed continue/resume copy matches current grammar/listening/output/reading section IDs through tests and manual Today checks.
  - Confirmed mission players still work after shared helper extraction.
  - Confirmed recommendation tests still protect urgent-review, scenario-exclusion, capstone, reinforcement, duplicate-prevention, and review-availability policies.
  - Confirmed dev fixtures are still guarded by `import.meta.env.DEV`.
  - Confirmed runtime dependencies remain clean: OpenAI SDK is script-only and in `devDependencies`.
- Commands run:
  - `git status --short --branch`
  - `npm run typecheck`
  - `npm run test`
  - `npm run build`
  - `npm run report:content-coverage`
  - `npm run report:progression-gaps`
  - `npm run report:scenario-inventory`
  - local dev servers:
    - `npm run dev -- --host 127.0.0.1 --port 5174 --strictPort`
    - `npm run dev -- --host 127.0.0.1 --port 5175 --strictPort`
- Results:
  - `npm run typecheck`: passed.
  - `npm run test`: passed, 29 files / 148 tests.
  - `npm run build`: passed. Vite emitted the existing large chunk warning.
- Manual QA matrix:
  - Today:
    - Clean/new learner state checked on isolated `http://127.0.0.1:5175/`.
    - Existing learner state with completed mission progress checked after completing grammar work on the isolated origin.
    - Weak-point Today state checked after wrong grammar/output/reading attempts.
    - Review-return unresolved state checked after a mixed review batch; Today showed `Review pass done.` and did not show `Review clear.`.
    - Reinforce plan item checked via `/dev/today-qa/reinforce-plan`.
    - Bonus visible/no-bonus visible checked through `/dev/today-qa/one-bonus`, `/dev/today-qa/no-bonus`, `/dev/today-qa/completed-summary`, and `/dev/today-qa/completed-no-bonus`.
    - 3 AM rollover inspected through `dailySession.test.ts` coverage for `getCurrentStudyDayKey` and per-day completed plan keys.
  - Missions:
    - Core chapter checked on `/missions`.
    - Application/scenario lane checked by opening the Scenarios tab.
    - Reading lane checked by opening the Reading Path tab.
    - Locked mission copy visible on the mission library.
    - Finished vs clean-pass copy visible in mission/progress surfaces; clean-pass count can be zero without implying mastery.
  - Mission players:
    - Grammar wrong + correct checked on `mission-grammar-topic-desu`, including finish-to-Today return.
    - Listening support reveal checked on `mission-listening-place-de`.
    - Output wrong + correct checked on `mission-output-daily-lines`.
    - Reading wrong + correct checked on `mission-reading-starter-recognition`.
    - Reinforce session checked by opening completed grammar from the mission library as a short reinforce pass.
  - Review:
    - Weak points appeared in Review.
    - Correct retry cleared/decremented after batch completion.
    - Incorrect retry remained open after batch completion.
    - Today return copy was honest: review pass done, unresolved work not called clear.
  - Progress:
    - Finished mission progress visible.
    - Clean-pass metric visible.
    - Weak-point priority visible.
    - No misleading `mastered` copy appeared in the checked progress snapshot.
  - Settings:
    - Reading display preference changed successfully on the isolated origin.
    - Reset controls visible; destructive reset was not opened or confirmed.
    - AI fallback statuses visible and non-invasive.
    - Audio status visible.
  - Console/layout:
    - Browser console reported 0 errors on checked Today, mission, Review, Progress, Settings, and dev fixture routes.
    - Layout checked on the available in-app browser viewport. The current browser-control surface did not expose desktop-wide/laptop/mobile viewport resizing, so iPhone-like viewport verification remains unperformed in this environment.
- Reports run:
  - `report:content-coverage`: passed. Coverage summary: 50 packs, 206 missions, 361/361 listening audio refs matched, 0 missing listening audio assets, 10/10 capstone chapter coverage.
  - `report:progression-gaps`: passed. Progression issues found: 0. Registry metadata warnings: 0.
  - `report:scenario-inventory`: passed. Current planning warnings remain: scenario missions cover 13/50 packs with unsupported pack ranges `5-15`, `18-24`, `27-35`, `37`, `39-41`, `43`, and `46-50`.
- Remaining non-AI blockers:
  - No blocking non-AI regressions found.
  - Existing deferred copy issue remains: a mission card can render `passs` pluralization.
  - Existing Vite large chunk warning remains.
  - Mobile/iPhone-like manual viewport QA was not available through the current browser-control API.
- Ready for controlled micro-scenario planning: yes, with the above deferred non-blockers recorded.
- Recommended next patch:
  - Start a controlled micro-scenario planning/design patch only. Keep it scoped to scenario inventory/requirements and do not add AI/chat behavior until the micro-scenario plan is accepted.
