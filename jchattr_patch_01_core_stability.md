# Patch 01 — jchattr Core Stability, Learning Semantics, and QA Hardening

> **Repo target:** `colinbing/jchattr`  
> **Patch type:** stabilization + learning-integrity patch  
> **Intended executor:** Codex / repo-aware coding agent  
> **Primary goal:** fix the current learning-state problems before adding AI scenario/chat features.  
> **Secondary goal:** create a safer foundation for later integrating `jp-immersion` as a controlled practice layer.

---

## 0. Why this patch exists

This patch addresses the highest-risk implementation issues discovered during a cold review of the current `jchattr` app.

The app already has a strong foundation:

- schema-driven content
- local-first progress
- mission players
- Today recommendations
- weak-point tracking
- review batches
- capstones
- optional scenario missions
- dev-gated voice spike

However, several core learning semantics are currently too loose:

1. **Mission completion currently behaves more like “attempted everything” than “understood everything.”**
2. **Incorrect answers can still count toward mission completion.**
3. **Review can resolve weak points too early.**
4. **Weak points are keyed only by item ID, which is collision-prone.**
5. **Continue state is too shallow.**
6. **Large mission/review components mix UI, scoring, persistence, and navigation.**
7. **There is no automated test suite for the deterministic logic that controls progression.**
8. **Scenario/application practice exists but is under-surfaced.**

This patch is intentionally **not** about adding AI chat yet.

The next major product direction is to integrate `jp-immersion` style scenario/chat practice into `jchattr`, but that should happen only after the deterministic learning loop is trustworthy.

---

## 1. Non-negotiable boundaries

### Keep

- Local-first architecture.
- TypeScript.
- Existing visual design direction unless a small UI copy/status fix is required.
- Existing curriculum content unless a content reference is provably broken.
- Existing mission path behavior where possible.
- Existing Today loop, Review loop, Missions page, Progress page, Settings page, and Capstone structure.
- Existing dev-gated voice coach spike.

### Do not add in this patch

- OpenAI API calls.
- AI chat.
- Backend.
- Accounts.
- Sync.
- Analytics.
- New large curriculum packs.
- Pronunciation scoring.
- Major redesign.
- Broad component rewrites that are not necessary for the semantic fixes.

### Important philosophy

This patch should distinguish:

- **attempted**
- **correct**
- **supported**
- **missed**
- **exposure complete**
- **mastery / cleared**

Unlocking may still use exposure completion if that keeps the learner moving, but the UI and data model must stop implying mastery when the learner only attempted items or used support.

---

## 2. Operating instructions for Codex

### Before editing code

1. Inspect the actual current repo state.
2. Do **not** assume prior chat memory is accurate.
3. Do **not** rely on roadmap docs as source of truth.
4. Confirm current scripts in `package.json`.
5. Confirm current storage keys and state shapes before changing persistence.
6. Confirm current mission players and review flow before editing.

### During implementation

- Work in small vertical slices.
- After each phase, run the required checks.
- Update this document in the **Patch Progress Log** section.
- If behavior differs from this document because repo reality changed, document the difference before proceeding.
- Prefer pure helper extraction over broad UI rewrites.
- Avoid breaking current localStorage data without migration.
- Do not delete old state fields unless migration and compatibility are implemented.
- Do not silently change curriculum progression rules without recording the decision.

### Mandatory stop behavior

Stop after each **STOP AND AUDIT** gate.

At every stop gate, write:

```md
### Gate N audit — YYYY-MM-DD HH:mm
- Completed:
- Files changed:
- Commands run:
- Results:
- Manual UI checks:
- Risks / questions:
- Recommended next action:
```

Do not proceed past a failed gate unless the failure is fixed or explicitly accepted by the user.

---

## 3. Suggested implementation order

This patch is split into phases. The phases are ordered to reduce risk.

1. **Baseline audit + test harness**
2. **Weak-point key migration**
3. **Transactional review resolution**
4. **Mission attempt/result semantics**
5. **Continue-state v2**
6. **Targeted component extraction**
7. **Scenario/application surfacing**
8. **Output evaluation guardrails**
9. **Voice spike containment check**
10. **Final QA + visual/user-flow audit**
11. **Next patch recommendation**

---

# Phase 1 — Baseline audit + test harness

## Goal

Add a test harness before changing core progression logic.

This app has deterministic business logic. It should not rely only on manual testing.

## Required repo inspection

Before installing anything, inspect:

- `package.json`
- `src/lib/outputEvaluation.ts`
- `src/lib/progress/weakPoints.ts`
- `src/lib/progress/missionProgress.ts`
- `src/lib/progress/continueState.ts`
- `src/features/review/lib/reviewBatch.ts`
- `src/features/today/lib/todayRecommendations.ts`
- `src/features/missions/lib/useMissionAutoComplete.ts`
- mission player components:
  - `GrammarMissionPlayer.tsx`
  - `ListeningMissionPlayer.tsx`
  - `OutputMissionPlayer.tsx`
  - `ReadingMissionPlayer.tsx`

Record current findings in the Patch Progress Log.

## Add test tooling

Add Vitest.

Recommended dependency:

```bash
npm install -D vitest
```

Update `package.json` scripts:

```json
{
  "test": "vitest run",
  "test:watch": "vitest"
}
```

Keep existing scripts intact.

## Test file locations

Preferred structure:

```txt
src/lib/outputEvaluation.test.ts
src/lib/progress/weakPoints.test.ts
src/features/review/lib/reviewBatch.test.ts
src/features/today/lib/todayRecommendations.test.ts
src/features/missions/lib/missionCompletion.test.ts
src/lib/progress/continueState.test.ts
```

If repo conventions differ, follow existing conventions.

## Initial tests to add before behavior changes

### `outputEvaluation`

Cover current behavior:

- exact accepted answer passes
- accepted answer without punctuation passes if included in acceptable answers
- token pattern exact match passes
- missing particle returns close/incorrect according to current logic
- particle swap returns close
- wrong order returns close
- unrelated answer returns incorrect

### `weakPoints`

Before migration, document current behavior with tests or notes:

- record miss creates weak point
- repeat miss increments `missCount`
- success decrements or removes
- invalid item/mission IDs are ignored
- corrupted localStorage falls back safely

### `reviewBatch`

- higher `missCount` sorts first
- recency breaks ties
- missing referenced content is skipped
- batch size is respected

### `todayRecommendations`

- review appears when weak points exist
- next unlocked mission appears
- locked mission does not appear
- completed mission may appear as reinforcement only according to current logic
- capstone recommendation appears only when prerequisites are met

### `mission completion helper`

If no helper exists, create a small pure helper first.

Do **not** test React hook internals directly if avoidable. Extract the decision logic into a pure function.

Candidate helper:

```ts
export type MissionItemOutcome = 'correct' | 'incorrect' | 'supported';

export function summarizeMissionItemOutcomes(
  outcomes: Record<string, MissionItemOutcome>,
  totalCount: number,
) {
  // returns attemptedCount, correctCount, supportedCount, missedCount,
  // isExposureComplete, isMasteryComplete
}
```

This helper can be introduced in Phase 4 if not needed immediately.

## Required commands

After test harness is added:

```bash
npm run typecheck
npm run test
npm run build
```

## STOP AND AUDIT — Gate 1

Stop after Phase 1.

Required audit:

- Which test files were added?
- Are tests passing?
- Did adding Vitest affect build?
- Are any current behaviors surprising?
- Is any behavior too difficult to test because logic is trapped in components?

Do not proceed until the user has reviewed or accepted Gate 1.

---

# Phase 2 — Weak-point key migration

## Goal

Fix weak-point storage so weak points are not keyed only by `itemId`.

Current risk:

```ts
weakPointsByItemId[itemId]
```

This assumes all item IDs are globally unique across grammar drills, listening checks, output tasks, reading checks, future micro-scenarios, phrase-bank items, and AI chat corrections.

That is fragile.

## Target behavior

Weak points should be keyed by a stable compound key:

```ts
type WeakPointKey = `${WeakPointItemType}:${string}:${string}`;
```

Where the parts are:

```txt
itemType:missionId:itemId
```

For example:

```txt
grammar-drill:mission-grammar-topic-desu:drill-topic-wa-desu-01
output-task:mission-output-daily-lines:output-self-intro
listening-check:mission-listening-place-de:listening-home-study
reading-check:mission-reading-basic-lines:reading-check-001
```

Keep `itemId`, `itemType`, and `missionId` as fields on the weak-point object.

## Required implementation

### Add key helper

Add a helper in `weakPoints.ts` or a tiny adjacent module:

```ts
export function getWeakPointKey(params: {
  itemType: WeakPointItemType;
  missionId: string;
  itemId: string;
}) {
  return `${params.itemType}:${params.missionId}:${params.itemId}`;
}
```

### New storage shape

Preferred new shape:

```ts
export interface WeakPointStore {
  version: number;
  weakPointsByKey: Record<string, WeakPoint>;
}
```

### Migration requirement

Must support old stored shape:

```ts
{
  version: 1,
  weakPointsByItemId: Record<string, WeakPoint>
}
```

When parsing old data:

1. read each legacy weak point,
2. generate compound key from the weak point fields,
3. store it in `weakPointsByKey`,
4. if collision occurs, preserve the higher `missCount` and most recent `lastMissedAt`, or merge counts if that is simpler and documented.

Do **not** break existing local users.

### Public API compatibility

Try to keep callers simple:

- `recordWeakPoint(...)` should not require callers to manually compute keys.
- `resolveWeakPointSuccess(...)` can be updated to accept either:
  - a weak-point object,
  - a compound key,
  - or `{ itemType, missionId, itemId }`.

Preferred API:

```ts
resolveWeakPointSuccess({
  itemType,
  missionId,
  itemId,
});
```

But support legacy `resolveWeakPointSuccess(itemId: string)` only if needed during incremental migration. If retained, mark as legacy and avoid new usages.

### Update all callers

Search for:

```txt
recordWeakPoint
resolveWeakPointSuccess
weakPointsByItemId
itemId]
```

Update all usages.

## Tests

Add or update tests for:

- compound key generation
- record two weak points with same `itemId` but different `missionId`; they must not collide
- record two weak points with same `itemId` but different `itemType`; they must not collide
- legacy `weakPointsByItemId` migration
- `getWeakPointList` still sorts by recency
- success resolves only the intended compound key

## Required commands

```bash
npm run typecheck
npm run test
npm run build
```

## Manual QA

In local app:

1. Trigger an incorrect grammar drill.
2. Trigger an incorrect output task.
3. Open Review.
4. Confirm both weak points appear.
5. Confirm displayed mission titles still resolve.

## STOP AND AUDIT — Gate 2

Stop after Phase 2.

Required audit:

- What is the new weak-point store shape?
- How does legacy migration work?
- Which files were updated?
- Which tests prove no collisions?
- Any direct `weakPointsByItemId` references left?

Do not proceed until accepted.

---

# Phase 3 — Transactional review resolution

## Goal

Prevent Review from clearing weak points before the review batch is actually completed.

Current risk:

- `ReviewBatchPlayer` calls `onSuccessfulRetry` as soon as a card is answered correctly.
- `ReviewPage` immediately calls `resolveWeakPointSuccess`.
- The user can then edit/reset and submit incorrectly before finishing.
- Final batch state can be incorrect while weak point was already removed or decremented.

## Target behavior

The review player should keep draft results locally.

Weak points should mutate only once, when the user completes the batch.

Final result per item controls mutation:

- `correct` → resolve/decrement/remove weak point
- `incorrect` → keep weak point open
- `supported` if introduced → keep weak point open

## Required implementation

### Review result model

Define a shared type:

```ts
export type ReviewResult = 'correct' | 'incorrect';
```

If supported reveal exists and is semantically distinct, use:

```ts
export type ReviewResult = 'correct' | 'incorrect' | 'supported';
```

But if current Review treats reveal as incorrect, keep it simple.

### Remove immediate mutation

Remove or deprecate:

```tsx
onSuccessfulRetry={(itemId) => {
  resolveWeakPointSuccess(itemId);
}}
```

`ReviewBatchPlayer` should only call:

```ts
onComplete(itemResults)
```

Where `itemResults` includes enough identity to resolve the exact weak point:

```ts
type ReviewBatchCompletionResult = {
  weakPointKey: string;
  itemId: string;
  itemType: WeakPointItemType;
  missionId: string;
  result: ReviewResult;
};
```

If adding `weakPointKey` in Phase 2, use it here.

### Apply transaction in `ReviewPage`

In `onComplete`:

1. loop through final results,
2. resolve only correct items,
3. read latest weak-point store after mutation,
4. compute remaining weak points,
5. compute next batch,
6. navigate or show summary.

### Guard against stale batch items

If an item was already removed in another tab or previous action:

- resolving should be no-op, not crash.
- next batch should be computed from latest store.

## Tests

Add tests for pure helper if extracted:

```ts
applyReviewBatchResults(currentWeakPoints, results)
```

Cases:

- correct removes/decrements weak point
- incorrect leaves weak point
- correct then edited to incorrect final result leaves weak point
- missing weak point does not crash
- mixed batch works

If not extracting a helper, extract one. This is exactly the kind of logic that should not live only in React callbacks.

## Manual QA

In local app:

1. Create a weak point.
2. Open Review.
3. Answer correctly.
4. Click edit/reset if available.
5. Change final answer to incorrect.
6. Finish batch.
7. Confirm weak point remains.

Then:

1. Open Review again.
2. Answer correctly.
3. Finish batch.
4. Confirm weak point is removed/decremented.
5. Confirm Today no longer requires Review if queue is clear.

## Required commands

```bash
npm run typecheck
npm run test
npm run build
```

## STOP AND AUDIT — Gate 3

Required audit:

- Was `onSuccessfulRetry` removed?
- Where are final review results applied?
- What tests prove transactional behavior?
- Did Review → Today completion state still work?

---

# Phase 4 — Mission attempt/result semantics

## Goal

Separate “attempted” from “correct/mastered.”

Current risk:

Mission players call their local “cleared” handlers even when an item is incorrect or supported. Then `useMissionAutoComplete` marks a mission complete when `clearedCount >= totalCount`.

This makes a mission look completed even if every answer was wrong.

## Product decision for this patch

Use these semantics:

### Attempted / exposure complete

A mission can be **finished** or **exposure complete** when every required item has been attempted or explicitly supported.

This can continue to unlock the next mission if that is the current desired pacing.

### Correct / mastery complete

A mission is **cleared** or **mastered** only when every required item is correct without support.

### Review pressure

If a mission is exposure-complete but has missed/supported items:

- it should show as finished with review needed,
- Today should recommend Review before pushing too far,
- Progress should distinguish it from clean mastery.

## Required implementation

### Add pure item result model

Create a reusable model, likely in:

```txt
src/features/missions/lib/missionAttempt.ts
```

Suggested types:

```ts
export type MissionItemOutcome = 'correct' | 'incorrect' | 'supported';

export type MissionItemResult = {
  itemId: string;
  outcome: MissionItemOutcome;
};

export type MissionAttemptSummary = {
  attemptedCount: number;
  correctCount: number;
  incorrectCount: number;
  supportedCount: number;
  totalCount: number;
  isExposureComplete: boolean;
  isMasteryComplete: boolean;
};
```

Suggested helper:

```ts
export function summarizeMissionAttempt(
  resultsByItemId: Record<string, MissionItemOutcome>,
  totalCount: number,
): MissionAttemptSummary
```

### Rename UI concepts where necessary

Avoid using “cleared” for an incorrect/supported item.

Preferred language:

- `attempted`
- `done`
- `finished`
- `correct`
- `needs review`
- `mastered`

Examples:

Bad:

```txt
3/3 drills cleared
```

If one was wrong, use:

```txt
3/3 attempted · 2 correct · 1 review item
```

or

```txt
Finished with 1 review item
```

### Update mission players

For each player:

- `GrammarMissionPlayer`
- `ListeningMissionPlayer`
- `OutputMissionPlayer`
- `ReadingMissionPlayer`

Replace local `clearedIds` semantics with result tracking.

Suggested state:

```ts
const [resultsByItemId, setResultsByItemId] =
  useState<Record<string, MissionItemOutcome>>({});
```

Then derive:

```ts
const attemptSummary = summarizeMissionAttempt(resultsByItemId, totalCount);
```

### Grammar mission

Current behavior: incorrect records weak point and still calls `onCleared`.

New behavior:

- correct → outcome `correct`
- incorrect → outcome `incorrect`, record weak point
- support-only if no support path exists → not applicable
- mission exposure complete when all drills have an outcome
- mission mastery complete when all outcomes are `correct`

### Listening mission

Current behavior includes supported reveal.

New behavior:

- correct answer before reveal → `correct`
- incorrect answer → `incorrect`, record weak point
- reveal answer → `supported`, record weak point
- if transcript/pattern hints are revealed but final answer is correct:
  - either keep `correct` but mark a lighter signal,
  - or use `supported` if answer reveal was used.
- Do not overcomplicate hint tiers in this patch unless already easy.

Minimum rule:

```txt
translation reveal = supported
wrong answer = incorrect
correct answer = correct
```

### Output mission

- accepted output → `correct`
- rejected output → `incorrect`, record weak point
- moving on after incorrect is allowed but counts as attempted, not cleared

### Reading mission

- correct choice → `correct`
- incorrect choice → `incorrect`, record weak point
- reveal after submit is not support; it is feedback
- moving on after incorrect is allowed but counts as attempted, not cleared

### Mission progress persistence

Existing mission progress tracks completed mission IDs and counts.

Add a field for mastery/quality without breaking existing data.

Possible extension:

```ts
export interface MissionProgressRecord {
  version: number;
  completedMissionIds: string[];
  completionCountsByMissionId: Record<string, number>;
  lastCompletedAtByMissionId: Record<string, string>;

  masteredMissionIds?: string[];
  masteryCountsByMissionId?: Record<string, number>;
  lastMasteredAtByMissionId?: Record<string, string>;

  lastAttemptSummaryByMissionId?: Record<string, MissionAttemptSummary>;
}
```

Decision:

- `completedMissionIds` continues to mean exposure complete / finished.
- `masteredMissionIds` means all correct.
- UI labels should reflect this.

If you bump version, include migration.

### Rename or wrap `markMissionComplete`

To avoid confusion, consider adding:

```ts
markMissionExposureComplete(missionId, summary)
markMissionMasteryComplete(missionId, summary)
```

Keep `markMissionComplete` as compatibility wrapper only if needed.

### Update `useMissionAutoComplete`

Current name may be misleading.

Possible replacement:

```ts
useMissionAttemptCompletion({
  missionId,
  summary,
});
```

Behavior:

- when `summary.isExposureComplete`, mark exposure complete
- when `summary.isMasteryComplete`, mark mastery complete
- clear continue state on exposure complete
- only run once per mission session

### Update completion route state

Current route state contains:

```ts
clearedCount
totalCount
```

Replace or extend:

```ts
attemptedCount
correctCount
incorrectCount
supportedCount
totalCount
isExposureComplete
isMasteryComplete
```

Keep old fields only if required for compatibility, but UI should use new fields.

### Update Today completion recap

Today should say:

- “Mission finished”
- “2/3 correct”
- “1 item saved for Review”
- “Clean pass” if mastery complete

Avoid saying “3/3 cleared” if not all correct.

## Tests

Add tests for:

- all correct → exposure complete and mastery complete
- one incorrect → exposure complete but not mastery complete
- one supported → exposure complete but not mastery complete
- no results → incomplete
- result count greater than total does not produce invalid summary
- duplicate item result does not inflate counts
- mission progress migration preserves old completed missions

## Manual QA

Run local app.

### Flow A: all wrong grammar mission

1. Reset local app state.
2. Start first grammar mission.
3. Intentionally answer every drill wrong.
4. Finish mission.
5. Confirm:
   - mission does **not** say cleanly cleared/mastered,
   - weak points are saved,
   - Today recommends review,
   - next mission unlock behavior matches chosen exposure policy,
   - Progress does not imply mastery.

### Flow B: all correct grammar mission

1. Reset or use another mission.
2. Answer all correctly.
3. Confirm:
   - mission shows clean pass/mastered,
   - no weak points saved,
   - completion recap is positive and honest.

### Flow C: listening support

1. Start listening mission.
2. Reveal answer.
3. Confirm:
   - item counts as supported/attempted,
   - weak point saved,
   - not mastery.

### Flow D: output wrong then move on

1. Start output mission.
2. Type wrong response.
3. Continue.
4. Confirm:
   - output item attempted but not correct,
   - weak point saved,
   - recap shows review pressure.

## Required commands

```bash
npm run typecheck
npm run test
npm run build
```

## STOP AND AUDIT — Gate 4

Required audit:

- What is the final terminology?
- Does completion still unlock next missions? If yes, explain why.
- How is mastery represented?
- Which UI labels changed?
- Which old state is migrated?
- Manual QA screenshots or notes for wrong-answer flow and clean-answer flow.

---

# Phase 5 — Continue-state v2

## Goal

Make resume behavior more precise than one generic `stepIndex`.

Current state stores:

```ts
{
  missionId,
  missionType,
  lastVisitedAt,
  stepIndex
}
```

That is too shallow, especially for grammar missions where a step can contain multiple examples or drills.

## Target shape

Add a richer continue-state model.

Suggested:

```ts
export interface ContinueStateRecord {
  version: number;
  lastActiveMissionId: string | null;
  missionType: MissionType | null;
  lastVisitedAt: string | null;

  // legacy
  stepIndex: number | null;

  // v2
  sectionId?: string | null;
  itemIndex?: number | null;
  subItemIndex?: number | null;
}
```

Or:

```ts
export interface ContinuePosition {
  sectionId: string;
  itemIndex?: number;
  subItemIndex?: number;
}
```

Then:

```ts
position?: ContinuePosition | null;
```

Choose whichever is less disruptive.

## Compatibility

`resolveContinueStepIndex` should continue to work for old data.

Add a new resolver:

```ts
resolveContinuePosition(...)
```

If v2 position is absent, derive from legacy `stepIndex`.

## Update players

### Grammar

Save:

- current section ID: `intro`, `examples`, `drills`
- current example index if section is examples
- current drill index if section is drills

On resume:

- go to last section
- restore example/drill index if valid

### Listening

Save:

- section: `prep` or `checks`
- item index
- whether prep completed if applicable

Do not overcomplicate if not stable. At minimum restore current listening item.

### Output

Save:

- item index

### Reading

Save:

- item index

## Tests

- parse legacy continue state
- parse v2 continue state
- invalid indices are rejected
- clearContinueState still respects mission ID
- grammar continue position with section and item index resolves properly

## Manual QA

1. Start grammar mission.
2. Navigate to drill 2.
3. Leave to Today.
4. Continue mission.
5. Confirm drill 2 restores.
6. Complete mission.
7. Confirm continue state clears.

Repeat quick checks for output/listening/reading if feasible.

## Required commands

```bash
npm run typecheck
npm run test
npm run build
```

## STOP AND AUDIT — Gate 5

Required audit:

- What is the new continue-state shape?
- What legacy behavior is preserved?
- Which flows were manually checked?
- Any player left on legacy step-only resume?

---

# Phase 6 — Targeted component extraction

## Goal

Reduce hidden logic inside large components without broad refactoring.

This phase should be surgical.

Do not rewrite UI just to make it prettier.

## Extraction priorities

### Extract pure mission attempt logic

If not already done in Phase 4:

```txt
src/features/missions/lib/missionAttempt.ts
```

### Extract review transaction logic

If not already done in Phase 3:

```txt
src/features/review/lib/reviewResolution.ts
```

### Extract weak-point identity logic

If not already done in Phase 2:

```txt
src/lib/progress/weakPointKeys.ts
```

or keep in `weakPoints.ts` if smaller.

### Extract Today plan helpers only if needed

`TodayPage` is large. Do not fully rewrite it in this patch. But if you touched completion summary logic, move formatting helpers into:

```txt
src/features/today/lib/todayPlanFormatting.ts
```

Only do this if it reduces risk.

## Do not do

- Full reducer rewrite for every mission player.
- Global state library.
- CSS redesign.
- New architecture folder layout.
- New mission content.

## Tests

All extracted pure logic should have tests.

## Required commands

```bash
npm run typecheck
npm run test
npm run build
```

## STOP AND AUDIT — Gate 6

Required audit:

- What logic was extracted?
- Which large files got smaller?
- Which files were intentionally not refactored?
- Any new TODOs?

---

# Phase 7 — Scenario/application surfacing

## Goal

Surface existing scenario/application practice without turning it into core required work.

Current issue:

Scenario missions exist, but Today excludes scenario missions from recommendations. This may be intentional, but if scenario/application practice is too buried, the app loses one of its differentiators.

## Boundary

Do **not** add AI chat in this phase.

This phase only surfaces existing deterministic scenario/application missions.

## Target UX

Scenario/application practice should appear as optional, contextual practice after relevant prerequisites.

Possible places:

### Missions page

Add or improve an “Application practice” lane/card in the relevant chapter section.

Copy direction:

```txt
Application practice
Try these after the core missions. They reuse what you have already learned in a short practical situation.
```

### Today page

Only show scenario/application recommendation when:

- Today core work is complete, or
- Review pressure is low, or
- the scenario is directly tied to the just-completed chapter/pack.

It should be optional/bonus, not part of the core plan unless explicitly designed later.

### Recommendation label

Use:

- “Try it in context”
- “Application practice”
- “Optional scenario”
- “Real-use pass”

Avoid:

- “Required”
- “Core”
- “Mastery test”

## Implementation options

Option A — low risk:

- Keep Today excluding scenarios.
- Improve Missions page surfacing only.

Option B — moderate risk:

- Today can show one optional scenario in bonus practice after main plan is complete.

Preferred for this patch:

**Option A first. Option B only if low-risk and clean.**

## Tests

If recommendation logic changes:

- scenario does not appear before prerequisites
- scenario appears in optional lane when prerequisites met
- urgent Review still takes priority
- core Today plan does not get polluted by optional scenario

## Manual QA

1. Reset local state.
2. Confirm no scenario is prematurely pushed as core.
3. Complete prerequisite missions.
4. Open Missions.
5. Confirm scenario/application lane is visible and clearly optional.
6. If Today bonus was added, confirm it appears only after core plan is complete or in bonus area.

## Required commands

```bash
npm run typecheck
npm run test
npm run build
```

## STOP AND AUDIT — Gate 7

Required audit:

- Did scenario surfacing change Today core behavior?
- Where do scenarios appear now?
- Are they clearly optional?
- Any product copy concerns?

---

# Phase 8 — Output evaluation guardrails

## Goal

Clarify and harden deterministic output evaluation without pretending it handles open-ended Japanese.

The current evaluator is useful for controlled prompts, but limited.

This phase is mostly tests, comments, and small UX/copy guardrails.

## Required changes

### Tests

Add or expand tests for:

- exact accepted answer
- accepted answer with/without punctuation
- tokenized pattern accepted
- missing particle
- swapped particle
- wrong order
- unknown extra text
- kanji/kana accepted only if content provides it as acceptable or pattern supports it

### Code comments

Add comments near `evaluateOutputResponse` explaining:

- it is deterministic,
- it is for controlled beginner prompts,
- it is not an open-ended Japanese grammar judge,
- future AI-assisted feedback should be advisory only.

### Optional small UX copy

If any screen implies open-ended correctness, soften it.

Preferred language:

```txt
Check against this mission pattern
```

Instead of:

```txt
Grade my Japanese
```

## Required commands

```bash
npm run typecheck
npm run test
npm run build
```

## STOP AND AUDIT — Gate 8

Required audit:

- What evaluator cases are now covered?
- Did user-facing copy change?
- Any known limitations documented?

---

# Phase 9 — Voice spike containment check

## Goal

Confirm voice coach remains isolated and cannot affect production learner flow.

The existing dev-gated voice coach route should remain disabled unless explicitly enabled.

## Required checks

- Confirm route remains gated by:
  - `import.meta.env.DEV`
  - `VITE_VOICE_COACH_SPIKE_ENABLED === 'true'`
- Confirm no mission/progress state depends on the voice spike.
- Confirm no upload/scoring was added.
- Confirm TTS generation remains script/server-side and not exposed to client key usage.

## Required commands

```bash
npm run typecheck
npm run test
npm run build
```

## STOP AND AUDIT — Gate 9

Required audit:

- Was voice code changed?
- Is route still dev-gated?
- Any risk of accidental production exposure?

---

# Phase 10 — Full visual and user-flow QA

## Goal

Verify the app still works as a learner-facing product.

This is mandatory.

## Setup

Run:

```bash
npm install
npm run typecheck
npm run test
npm run build
npm run dev
```

Open the app locally.

Record:

- local URL
- browser used
- whether localStorage was reset
- any console errors

## Visual QA checklist

### Global

- [ ] App loads without console errors.
- [ ] Sidebar/mobile nav still works.
- [ ] Today page layout still looks clean.
- [ ] Missions page layout still looks clean.
- [ ] Mission detail layout still looks clean.
- [ ] Review page layout still looks clean.
- [ ] Progress page still loads.
- [ ] Settings page still loads.
- [ ] Mobile-width layout is not obviously broken.

### Today page

- [ ] New user sees sensible core plan.
- [ ] Review appears when weak points exist.
- [ ] Optional/bonus practice remains tucked away.
- [ ] Completion recap distinguishes correct vs needs-review.
- [ ] No copy says “cleared” when answers were wrong.

### Grammar mission

- [ ] Correct flow works.
- [ ] Incorrect flow saves weak point.
- [ ] Incorrect flow can continue but is not labeled mastered.
- [ ] Resume returns to correct section/item.

### Listening mission

- [ ] Audio controls render.
- [ ] Correct answer counts as correct.
- [ ] Wrong answer saves weak point.
- [ ] Revealing answer counts as supported/not mastery.
- [ ] Continue/resume works enough for current implementation.

### Output mission

- [ ] Correct answer passes.
- [ ] Wrong answer saves weak point.
- [ ] Feedback text is clear.
- [ ] “Keep moving” does not imply mastery.

### Reading mission

- [ ] Correct answer passes.
- [ ] Wrong answer saves weak point.
- [ ] Reveal support works.
- [ ] Vocab support still renders.

### Review

- [ ] Queue shows weak points.
- [ ] Correct final review resolves weak point.
- [ ] Incorrect final review keeps weak point.
- [ ] Correct-then-edit-to-incorrect final state does **not** incorrectly clear weak point.
- [ ] Returning to Today after Review still works.

### Missions page

- [ ] Locked missions are locked.
- [ ] Unlocked missions are unlocked.
- [ ] Completed/exposure/mastery status is honest.
- [ ] Scenario/application practice, if surfaced, is clearly optional.

### Capstone

- [ ] Capstone route loads when unlocked.
- [ ] Reading/reveal/check flow still works.
- [ ] Completion still records capstone progress.

## Required final commands

```bash
npm run typecheck
npm run test
npm run build
```

## STOP AND AUDIT — Gate 10

Required audit:

- All commands and results.
- Visual QA notes.
- User-flow QA notes.
- Known remaining issues.
- Screenshots if available.
- Recommendation: merge, continue, or stop.

---

# Patch completion criteria

This patch is complete only when:

- [ ] Test harness exists.
- [ ] `npm run test` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.
- [ ] Weak points use compound keys or have an equivalent collision-safe identity.
- [ ] Legacy weak-point data migrates safely.
- [ ] Review resolution is transactional.
- [ ] Mission state distinguishes attempted/exposure from correct/mastery.
- [ ] UI copy no longer implies mastery after wrong/supported answers.
- [ ] Continue state is more precise or a documented partial v2 migration is complete.
- [ ] Output evaluator has meaningful tests and documented limits.
- [ ] Voice spike remains isolated.
- [ ] Manual local visual QA is complete.
- [ ] This patch document is updated with final status.
- [ ] Codex recommends the next best patch.

---

# Known expected follow-up patches

Do not implement these in Patch 01 unless explicitly instructed.

## Patch 02 — `jp-immersion` stabilization

Expected goals:

- hide OpenAI API key behind backend/proxy,
- structured outputs,
- split giant session state,
- attach corrections to message IDs,
- scenario completion milestones,
- SRS/phrase bank cleanup,
- tests.

## Patch 03 — Unified AI practice architecture

Expected goals:

- define controlled micro-scenario schema in `jchattr`,
- add backend endpoints,
- add one mission-level micro-scenario,
- structured AI evaluation,
- save AI mistakes into `jchattr` Review,
- phrase bank integration,
- optional scenario library.

## Patch 04 — Full scenario library + open practice

Expected goals:

- port best `jp-immersion` scenario-library UX,
- add optional full scenario chat,
- add open chat practice room,
- connect chat corrections to Review,
- connect useful phrases to Phrase Bank,
- keep core curriculum separate.

---

# Patch Progress Log

Codex must update this section as work is completed.

## Gate 0 audit — not started

- Date/time:
- Repo branch:
- Current package scripts:
- Current failing commands, if any:
- Initial code inspection notes:
- Risks identified before edits:

---

## Gate 1 audit — pending

- Completed:
- Files changed:
- Commands run:
- Results:
- Manual UI checks:
- Risks / questions:
- Recommended next action:

---

## Gate 2 audit — pending

- Completed:
- Files changed:
- Commands run:
- Results:
- Manual UI checks:
- Risks / questions:
- Recommended next action:

---

## Gate 3 audit — pending

- Completed:
- Files changed:
- Commands run:
- Results:
- Manual UI checks:
- Risks / questions:
- Recommended next action:

---

## Gate 4 audit — pending

- Completed:
- Files changed:
- Commands run:
- Results:
- Manual UI checks:
- Risks / questions:
- Recommended next action:

---

## Gate 5 audit — pending

- Completed:
- Files changed:
- Commands run:
- Results:
- Manual UI checks:
- Risks / questions:
- Recommended next action:

---

## Gate 6 audit — pending

- Completed:
- Files changed:
- Commands run:
- Results:
- Manual UI checks:
- Risks / questions:
- Recommended next action:

---

## Gate 7 audit — pending

- Completed:
- Files changed:
- Commands run:
- Results:
- Manual UI checks:
- Risks / questions:
- Recommended next action:

---

## Gate 8 audit — pending

- Completed:
- Files changed:
- Commands run:
- Results:
- Manual UI checks:
- Risks / questions:
- Recommended next action:

---

## Gate 9 audit — pending

- Completed:
- Files changed:
- Commands run:
- Results:
- Manual UI checks:
- Risks / questions:
- Recommended next action:

---

## Gate 10 final audit — pending

- Completed:
- Files changed:
- Commands run:
- Results:
- Manual UI checks:
- Remaining issues:
- Recommended next patch:
- Merge readiness:
