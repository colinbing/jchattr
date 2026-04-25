# Japanese OS Feedback Pass 2 — Recording 3 Live Mobile Use

## Purpose

This document converts the user's live, fragmented mobile-use feedback into a repo-aware Codex handoff.

Important handling rule:
- Do not only act on cleanly worded requests.
- Treat unclear fragments as investigation leads.
- Codex should run the app in a mobile viewport, reproduce the flow, and infer what UI element or state the user was likely reacting to.
- Do not overbuild.
- Preserve current architecture.
- Keep the app local-first.
- TypeScript only.
- Avoid broad refactors unless a defect clearly requires a local component split.

The user's core complaint in this pass:
> The app has real content and mission surfaces, but the Today loop does not yet feel like a finite, satisfying, cohesive daily lesson. It feels like an endless recommendation/feed where completed work gets replaced by more work, review competes with next missions, and the user is not always sure what to do next.

---

## Product-level diagnosis

The current app appears to have many of the intended pieces:
- Today recommendations
- core plan vs bonus lane
- mission completion
- review loop
- mission path
- grammar/listening/output/reading players

But the UX is still exposing too much internal structure:
- mission path
- skill signal
- review impact
- deterministic queue logic
- tracked weak points
- mission counts
- path details
- next/review/bonus links

The user wants the app to behave more like:
1. Open app.
2. See today's lesson.
3. Press one obvious Start button.
4. Move through a finite set of missions/reviews.
5. Get a clear “Today complete” moment.
6. Optionally continue with bonus/new learning.

Not:
1. Open app.
2. See several recommendation cards.
3. Complete one item.
4. Get multiple possible next actions.
5. See Today still showing the same total time.
6. Feel like the daily loop never ends.

---

## Confirmed / high-confidence bugs and defects

### 1. Today's plan time/count does not visibly decrement after completion

User repeatedly says Today still shows something like:
- `Core plan 2 items`
- `Bonus lane +8 minutes`
- `Time now 13 minutes`

Even after completing the listed core missions.

Expected behavior:
- If Today has 2 core items and user completes 1, the top plan should visually update to 1 remaining.
- If user completes both, Today should show a completed state.
- “Time now” should probably be renamed or removed.

Codex investigation:
- Verify whether Today computes total plan time from the original generated recommendations instead of remaining incomplete items.
- Verify whether completed missions are still included in the displayed plan.
- Verify whether “time now” means “estimated remaining time,” “total plan time,” or something else.

Likely fix:
- Today summary should separate:
  - `Today's plan: 2 missions`
  - `Remaining: 1 mission · ~6 min`
  - or after done: `Today complete`

---

### 2. Today loop has no satisfying completed state

User says there is no “gold star” / “you finished today” moment.

Expected behavior:
- Once the day's core plan is finished and any urgent review is cleared, Today should show:
  - clear completed-state card
  - recap of completed items
  - optional bonus section below
- Bonus should feel extra, not like more required Today work.

Codex investigation:
- Identify where Today decides which recommendations are core vs bonus.
- Determine whether support/review recommendations are being promoted into the core plan after the user already finished the original plan.
- Confirm whether there is currently any “core plan complete” derived state.

Likely fix:
- Add a derived `isTodayCoreComplete` state based on the visible daily plan IDs and urgent review status.
- Do not keep refilling the “Do this today” section after the core plan is complete.
- Move extra recommendations under “Bonus / keep studying.”

---

### 3. Review can reappear immediately after finishing review

User describes finishing review, returning to Today, then being sent back into review again.

Expected behavior:
- If the retry was cleared, review should not immediately remain the primary next action.
- If another weak point remains, the UI should say so clearly.
- If it is the same item, this is likely a bug.

Codex investigation:
- Reproduce: intentionally miss a listening/output answer, enter Review, complete retry, finish batch, return Today.
- Check whether weak point is decremented/cleared.
- Check whether Today recommendations are using stale weak-point state.
- Check whether `lastReviewBatch` or equivalent state affects recommendation priority.

Likely fix:
- Ensure successful retry updates weak-point state before Today recomputes recommendations.
- Ensure review recommendation is suppressed when no unresolved weak points remain.
- If weak points remain, copy should say `1 more weak point remains`, not generic retry language.

---

### 4. Listening answer options may still be predictable / insufficiently randomized

User reports many answers appearing as option C/bottom option, with only occasional variation.

Expected behavior:
- Correct answer position should be randomized per attempt/session.
- User should not be able to memorize option position.

Codex investigation:
- Inspect listening multiple-choice generation.
- Confirm whether answer option order is static in content.
- Confirm whether randomization happens once at build/load time, once per mission, or not at all.
- Use stable randomness if needed for React hydration/local state, but make attempts feel varied.

Likely fix:
- Shuffle listening choices at task render/attempt initialization.
- Store order in local component state for that attempt so it does not reshuffle while the user is deciding.

---

### 5. Reorder drills may show the answer in the prompt

User noticed a reorder task that displayed chunks in correct order in the heading:
- `kyo / toshokan ni / ikimas`
Then the task asked the user to reorder those same chunks.

Expected behavior:
- Prompt should be in English or task instruction only.
- Chunks should be shuffled.
- The correct Japanese order should not be shown above the task.

Codex investigation:
- Inspect grammar reorder drill rendering.
- Identify whether the heading uses the correct answer string.
- Identify whether chunks are stored pre-ordered in content.
- Confirm whether chunks are shuffled before rendering.

Likely fix:
- For reorder drills:
  - show English meaning/prompt
  - show shuffled chips only
  - do not display canonical Japanese chunk order until feedback/reveal.

---

### 6. Reorder drills bundle target particle with noun chunk

Example:
- `toshokan ni` is one chunk in a `に` lesson.

User's concern:
- If the mission is teaching `に`, bundling `に` with the destination means the user never has to decide where `に` goes.

Expected behavior:
- If the particle is the learning target, make it its own chip when pedagogically useful.
- Example chips: `きょう` / `としょかん` / `に` / `いきます`

Codex investigation:
- Check current content schema for reorder chunks.
- Determine whether chunks are authored manually or generated.
- Identify whether splitting particles would break existing answer checking.

Likely fix:
- For relevant reorder drills, support particle-as-own-chip.
- Do not globally split every particle blindly; apply to lessons where particle placement is the actual target.

---

### 7. Output mission asks for production before enough input/scaffolding

User struggled with:
- “I study Japanese at home.”

Concern:
- A beginner has not necessarily been taught:
  - うち
  - にほんご
  - べんきょうします
  - object marker を
  - place marker で
- The app asks for full sentence production without enough prior building-block exposure.

Expected behavior:
- Output missions should be the culmination of prior exposure, not a leap.
- If asking production, provide scaffold or word bank.
- Do not expect full recall of new vocab + grammar simultaneously unless already taught.

Codex investigation:
- Check unlock prerequisites for output missions.
- Check whether output mission content refs point to prior grammar/vocab/listening examples.
- Check whether the user has seen all required vocabulary before this mission appears in Today.
- Check whether hints expose enough information.

Likely fixes:
- For early output missions, add a word bank/chunk bank.
- Or make first output pass recognition/reordering before free typing.
- Or require prior completion of related grammar/listening/vocab before output unlocks.
- Improve hint from abstract grammar wording to concrete scaffold.

Do not build a full new vocab lesson system in this slice unless already supported.

---

### 8. Output feedback copy is too technical

Current-ish copy:
- `Not quite`
- `Expected one of the accepted answer patterns`

User says this is bad when they typed nonsense.

Expected behavior:
- Use learner-facing language:
  - `Incorrect`
  - `Correct answer: ...`
  - `You were missing: を`
  - `Try this pattern: うちで にほんごを べんきょうします`

Codex investigation:
- Inspect output answer-check feedback component.
- Find all technical/internal phrasing.

Likely fix:
- Replace “expected one of the accepted answer patterns” with plain language.
- Keep pattern diagnostics only if actionable.

---

### 9. Hint container has awkward vertical spacing

User describes output hint box:
- visible blank/invisible line
- too tall before and after revealing hint
- feels like 2–4 line heights for little content

Expected behavior:
- Compact hint UI.
- Hint reveal should not create a tall awkward empty area.

Codex investigation:
- Inspect hint component styling.
- Test on mobile viewport.
- Check min-height, padding, line-height, pseudo-elements, empty block rendering.

Likely fix:
- Remove unnecessary min-height.
- Only render hint body after reveal.
- Use compact inline button/accordion style.

---

### 10. Green progress bar touches intro/examples buttons

User says the green bar above intro/examples in mission top container is touching the buttons and looks weird.

Expected behavior:
- Adequate spacing between progress indicator and tab/step buttons.

Codex investigation:
- Inspect grammar mission header/stepper CSS.
- Reproduce on mobile.
- Add margin/gap if needed.

Likely fix:
- Add vertical gap or restructure compact mission header.

---

## UX friction / product flow issues

### A. Today page should be the plan, not a feed

User wants:
- One top card above the fold.
- “Today's lesson”
- Big Start button.
- Clear list of included missions/review.
- Core items visible inside the plan card.

Current feel:
- `Today's plan`, `Do this today`, `Next up`, `Bonus lane`, `More context`, `Path details` all compete.
- The user feels the same information is repeated in multiple sections.

Recommended direction:
- Merge “Do this today” into the top Today's Plan card.
- Remove or demote explanatory copy.
- Show only:
  - Today title
  - remaining time/items
  - mission list
  - big primary CTA
  - completion state when done
- Put bonus below, visually distinct.

Potential structure:

```text
Today's lesson
2 missions · about 13 min

1. Grammar — Introduce yourself with は / です
2. Listening — Hear where the action happens

[Start today's lesson]
```

After one completed:

```text
Today's lesson
1 of 2 complete · about 6 min left

✓ Grammar — Introduce yourself with は / です
2. Listening — Hear where the action happens

[Continue]
```

After all complete:

```text
Today complete
You finished 2 missions and cleared 1 review item.

[Do bonus practice]
```

---

### B. `Path details` dropdown feels useless on Today

User specifically calls out:
- `11 chapters and 199 missions are available...`
as useless in the Today context.

Recommendation:
- Remove from Today.
- Keep path/library info on Missions page only.
- Today should not advertise the full archive unless the user asks.

---

### C. Post-mission completion screen offers too many next actions

User sees:
- Done / mission complete
- Next mission
- Open Review
- Open Mission
- Mission Path

Concern:
- This creates confusion right after a mission.
- The app should keep the user in the Today's Lesson flow.

Expected:
- One primary next action.
- Maybe one secondary “Back to Today.”
- No Mission Path button inside the daily loop.

Recommendation:
- If user is in Today flow:
  - primary CTA = `Next in today's lesson`
  - secondary = `Back to Today`
- If core plan complete:
  - primary CTA = `Finish today's lesson` / `View recap`
- Only expose Mission Path from Missions tab or a low-priority link.

Codex investigation:
- Determine whether Mission Player knows entry context (`from=today`, continue state, route state, query param).
- If not, implement minimal context via URL search param or local session state, not global architecture rewrite.

---

### D. Today state is lost/confusing after visiting Mission Path

User says they clicked Mission Path, returned to Today, and lost the intermediary Today plan flow.

Recommendation:
- Do not route users to Mission Path from post-mission completion in the daily loop.
- Preserve Today flow context until completed or user explicitly exits.
- If user leaves and returns, Today should still show same daily plan progress.

---

### E. Bonus feels like more required work instead of optional extra

User wants:
- Today finite.
- Bonus visually separate.
- Bonus appears after core completion or below the core plan.
- Bonus should say “extra” clearly.

Potential design:
- Core plan card = green/primary.
- Bonus card = yellow/subtle secondary.
- Bonus only gets a small CTA:
  - `Keep studying`
  - `Optional bonus practice`

---

### F. Review should be always available, but not hijack the core flow

User says review feels like it can interrupt the learning loop too aggressively.

Interpretation:
- Review should exist as a persistent option.
- Urgent review can be part of Today.
- But after Today core is complete, review should not make Today feel unfinished forever.
- Review should not repeatedly send the learner back into the exact mission they just failed unless framed as a retry.

Recommendation:
- Define review states:
  1. urgent review included in today core
  2. optional review available
  3. review complete
- Avoid repeated same-session review loops unless item is still wrong.

---

### G. Review page is too verbose

User says top review page has redundant copy:
- `Take one short retry batch...`
- `one ready`
- `review queue`
- `keep review short...`

Recommendation:
- Collapse intro copy.
- Show one clear status and one button:
  - `1 retry ready`
  - `[Start review]`
- Move details below or remove.

Also remove/demote:
- `Tracked items` area at bottom unless it becomes useful later.

---

### H. Review loop still has bottom nav / route chrome

User says nav was removed from missions but remains in review loop.

Recommendation:
- Treat active review like active mission:
  - hide or compact global bottom nav
  - focus on the task
  - restore nav after review batch ends

Codex investigation:
- Check route/layout conditions for hiding nav.
- Apply same focused-mode rule to review loop.

---

### I. Listening mission mostly works, but hint buttons need redesign

User likes the one-screen listening check, but after checking/reveal:
- feedback box pushes Next below fold
- three hint buttons take too much space
- hint levels could be one progressive button

Recommendation:
- Replace three horizontal/stacked hint buttons with one progressive hint control:
  - `Reveal transcript`
  - then `Reveal pattern`
  - then `Reveal answer`
- Show hint level indicator if useful:
  - `Hint 1 of 3`
- Keep Next visible or make feedback compact.

Do not overbuild; this is a UI simplification.

---

### J. Listening distractors are too easy

User says options are often obviously wrong because only one contains the keyword:
- heard `coffee`, only one answer says coffee
- heard `computer`, only one answer says computer
- heard `sensei desu ka`, only one teacher option

Expected:
- Distractors should be near-misses:
  - same noun, different verb
  - same place, different action
  - same action, different place
  - statement vs question contrast
  - likes coffee vs drinks coffee
  - yesterday drank coffee vs drinks coffee now

Recommendation:
- Add or generate better distractors from same pack/context.
- Do this content/schema-locally, not via AI at runtime.
- If there is an existing distractor field, improve content.
- If distractors are auto-selected, update selection heuristic to prefer overlapping vocab/focus tags.

Investigation prompt:
- Identify how listening choices are generated.
- Determine whether choices are authored or assembled from other listening lines.
- Improve the smallest mechanism that gives near-miss distractors.

---

### K. Common mistakes should be moved from pre-drill lesson page into feedback

User strongly questions showing `Common mistakes` before the user has done anything.

Concern:
- It is abstract and out of context.
- The user has not made the mistake yet.
- It may be better as targeted feedback when they choose a wrong option.

Recommendation:
- Do not delete common mistake data from content.
- Stop emphasizing it as its own required step in the first-run mission flow.
- Use common mistakes as:
  - distractor rationale
  - wrong-answer feedback
  - optional “Watch out for...” reveal after attempt
  - review explanation when that mistake is made

Potential minimal slice:
- Hide/collapse Common Mistakes step by default.
- Show it after drills or as optional `Common traps` accordion.
- Larger later slice: map wrong answers to common mistake explanations.

---

### L. Mission detail metadata is too visible

User asks whether mission screens need:
- estimated time
- target skill
- number of examples
- number of drills
- mission details
all visible at top.

Recommendation:
- In active mission, prioritize the actual task.
- Collapse mission metadata.
- Keep a compact title/subtitle/progress indicator.
- Move details to optional accordion or remove.

---

### M. Personalization issue: remove Colin-specific content

User says no mission should be based around “Colin,” even if he is the primary user/developer.

Interpretation:
- The app is personalized, but content should not literally use the developer's name in generic beginner examples.
- Use Japanese placeholder names or neutral names.

Recommendation:
- Replace `Colin` examples with Japanese/common placeholder names:
  - 田中
  - 山田
  - さくら
  - たけし
- If app later supports user profile/name, personalize intentionally via setting, not hardcoded content.

Investigation:
- Search content for `Colin`, `コリン`, or variants.
- Replace in production content unless it is intentionally personal/demo-only.

---

## Questions / uncertainties Codex should investigate

These are not clean requirements, but should not be dropped.

### 1. What exactly is “Today” right now?

Questions:
- Is Today a stable daily plan generated once per day?
- Or is it a live recommendation feed recalculated after every completion?
- Is there a date-based daily session ID?
- Are Today plan items persisted for the day?
- Does bonus get mixed into core?

User expectation:
- Today should feel like a stable finite plan, not a live infinite feed.

Investigation:
- Inspect Today recommendation code.
- Determine whether recommendations are derived live only, or saved.
- Recommend minimal change to make Today feel finite.

---

### 2. Should review be part of the daily plan, or separate?

User is unsure but suggests:
- review should always be available
- urgent review may be included
- review should not endlessly refill Today
- review after a fresh mistake may be okay, but same-day reinforcement should be smarter

Codex should propose:
- current behavior summary
- minimal refinement
- what should wait for a later SRS/review-system slice

---

### 3. Are mission estimated times inflated?

User thinks 7 minutes for the first grammar mission is too high if it only has intro/examples/2 drills.

Codex should:
- Review estimatedMinutes for early missions.
- Compare actual screen/task count.
- Recommend whether to update content estimates or wait until mission flow is redesigned.

Likely:
- Early 2-drill missions should be estimated 3–4 minutes, not 7, unless expanded.

---

### 4. Are output missions unlocked too early?

Codex should:
- Audit the first 5–10 mission sequence.
- Identify whether output tasks require vocabulary/grammar not previously introduced.
- Recommend either:
  - gating changes
  - scaffolding changes
  - content changes
  - or a combination.

---

### 5. What is the right relationship between examples, drills, mistakes, and review?

User is implicitly asking for a better instructional flow:
- examples first
- active attempts
- mistakes as targeted feedback
- review of actual mistakes later

Codex should inspect current grammar mission model and propose a minimal path toward that without rewriting all content.

---

## Priority order

### P0 — Fix trust-breaking or obviously broken behavior
1. Today remaining count/time does not decrement or does not show completion clearly.
2. Review can reappear immediately after being cleared.
3. Listening answer order is predictable/static.
4. Reorder tasks reveal answer or show chunks in correct order.
5. Review/mission state and navigation flow create obvious confusion.

### P1 — Fix mobile daily-loop UX
6. Merge Today plan and Do This Today into one clear top plan card.
7. Add Today Complete state and move bonus below it.
8. Reduce post-mission completion choices to one primary next action.
9. Remove Mission Path CTA from daily loop.
10. Hide/compact nav in active review, same as mission focus mode.

### P2 — Improve mission pedagogy without broad architecture changes
11. Move Common Mistakes out of required pre-drill flow or collapse them.
12. Improve listening distractors to be near-misses.
13. Add scaffolding/word bank for early output tasks.
14. Improve output hints and feedback copy.
15. Replace Colin-specific content.

### P3 — Later product strategy
16. True daily session model persisted by date.
17. Smarter SRS intervals.
18. Better proficiency-based review spacing.
19. Larger content densification and additional prerequisite lessons.
20. Richer skill signal reporting.

---

## Recommended next Codex prompt — investigation-first

Use this before implementation.

```md
Context:
This repo is Japanese OS, a local-first React + TypeScript Japanese learning MVP.
Follow `constitution.md`, `PRODUCT_SPEC.md`, `ROADMAP.md`, and `BUILD_STATUS.md`.
Preserve the current architecture. Do not implement yet.

Task:
Run a mobile-first audit focused on the Today loop, review loop, and early mission flow using the user's latest live-feedback notes below.

Important:
The notes are a transcript of live mobile use. Some fragments are unclear. Do not discard unclear fragments. Instead, investigate the likely UI/state/code they refer to and report your best guess.

User feedback themes to investigate:
1. Today does not feel like a finite daily lesson.
2. Today's remaining time/count appears not to decrement after completing core missions.
3. There is no clear “Today complete” state.
4. Today page repeats the same ideas across `Today's plan`, `Do this today`, `Bonus`, `More context`, and `Path details`.
5. `Path details` on Today feels useless/noisy.
6. Post-mission completion offers too many actions, including Mission Path, and can pull the user out of the daily flow.
7. Review may reappear immediately after finishing review.
8. Review page is too verbose and still shows route/nav chrome during active review.
9. Listening checks mostly fit well on one mobile screen, but feedback/hint UI pushes `Next line` below the fold.
10. Listening hint buttons may be better as one progressive reveal button.
11. Listening answer choices may be predictable and distractors are too easy.
12. Common mistakes shown before drills feel premature; they may work better as feedback after wrong answers.
13. Output missions may ask for production before enough vocabulary/scaffolding has been introduced.
14. Output feedback says internal-sounding things like accepted answer patterns.
15. Output hint box has awkward vertical spacing.
16. Grammar mission progress/header green bar appears to touch intro/example buttons.
17. Reorder drills may reveal the answer in the prompt and may bundle target particles with nouns.
18. Hardcoded Colin examples should be replaced with generic/Japanese placeholder names.

Audit requirements:
- Use a mobile viewport.
- Reset local progress.
- Complete the first grammar mission.
- Complete the first listening mission.
- Intentionally miss at least one listening item.
- Complete review.
- Complete the first output mission or inspect why it is hard.
- Inspect the destination-with-に grammar mission reorder drill.
- Note route scroll/entry behavior.
- Note console errors if any.

Output:
Return a structured report with:
1. Confirmed bugs
2. UX friction
3. Pedagogy/content issues
4. Unclear transcript fragments and your best guess
5. Relevant files/components likely involved
6. Top 5 fixes
7. A proposed one-slice implementation plan

Do not edit files yet.
```

---

## Recommended implementation slice after audit

Only after the audit confirms the behavior:

```md
Context:
This repo is Japanese OS, a local-first React + TypeScript Japanese learning MVP.
Follow `constitution.md`, `PRODUCT_SPEC.md`, `ROADMAP.md`, and `BUILD_STATUS.md`.
Preserve the current architecture. Keep changes small and typed. Do not add dependencies.

Task:
Implement Mobile Daily Loop Cleanup v2.

Goals:
1. Make Today feel like a finite daily lesson.
2. Reduce confusion after missions/reviews.
3. Fix high-confidence early-flow bugs from the audit.

Scope:
- Update Today so the top plan card contains the actual core missions, remaining item count, and remaining estimated time.
- Add a clear Today Complete state when core plan and urgent review are done.
- Move optional/bonus recommendations below the completed or active core plan, visually secondary.
- Remove or demote `Path details` from Today.
- Reduce post-mission completion actions during Today flow to one primary next action plus a low-priority Back to Today.
- Ensure review does not immediately reappear after a successful retry unless unresolved weak points remain, and copy clearly says when more remain.
- Hide or compact global bottom nav during active review, matching focused mission behavior.
- Randomize listening answer order per attempt without reshuffling mid-attempt.
- Fix reorder drills so the prompt does not reveal the correct chunk order and target particles can be separate chips where authored that way.
- Replace internal output feedback language like “accepted answer patterns” with learner-facing feedback.
- Fix obvious mobile spacing issues: output hint box height and grammar stepper/progress-bar gap.

Constraints:
- Do not build a full SRS system.
- Do not redesign the entire app.
- Do not add backend, accounts, sync, analytics, or AI grading.
- Do not add dependencies unless absolutely necessary.
- Keep content schema-driven and hand-editable.
- If changing content examples from Colin to placeholder names, do it narrowly and safely.
- If a requested item requires a larger content-model change, document it as a follow-up instead of forcing it into this slice.

Acceptance criteria:
- After reset, Today shows a clear finite plan and a primary Start/Continue button.
- Completing one core mission reduces the remaining count/time or marks that mission complete inside the Today plan.
- Completing all core items produces a clear Today Complete state.
- Bonus practice is visibly optional and not mixed into required Today work.
- Review does not loop back immediately after successful clearance unless another unresolved weak point remains.
- Active review has focused mobile layout without unnecessary nav clutter.
- Listening correct answer position varies across attempts/sessions and does not change while choosing.
- Listening distractors/order no longer make the answer obviously always the bottom choice.
- Reorder prompt does not display the correct Japanese order above the chips.
- Output feedback is learner-facing and non-technical.
- Typecheck and build pass.

Output:
Summarize changed files.
List any tradeoffs.
List follow-up items that were intentionally deferred.
Update `BUILD_STATUS.md` only if the behavior meaningfully changed.
```

---

## Follow-up slice ideas after v2

### Slice A — Common mistakes as feedback, not a required pre-drill page

Goal:
- Use `commonMistakes` data more naturally.

Possible implementation:
- Collapse Common Mistakes by default.
- Add targeted feedback on wrong multiple-choice answers if the wrong answer maps to a mistake.
- Use “Common traps” after first attempt, not before.

### Slice B — Early output scaffolding

Goal:
- Make output feel earned rather than abrupt.

Possible implementation:
- Add word/chunk bank to early output missions.
- Gate output missions behind completion of relevant grammar/listening examples.
- Add concrete hints:
  - `home = うち`
  - `Japanese = にほんご`
  - `study = べんきょうします`
  - pattern: `[place]で [thing]を [verb]`

### Slice C — Listening near-miss distractors

Goal:
- Make listening comprehension real, not keyword matching.

Possible implementation:
- Add distractor metadata or selection heuristic based on shared vocab/focus tags.
- Prefer same noun/different action or same action/different place.

### Slice D — Stable date-based daily session

Goal:
- Prevent Today from behaving like an infinite live feed.

Possible implementation:
- Persist a daily plan ID/list in localStorage keyed by date.
- Recompute only when date changes or user resets progress.
- Keep bonus recommendations live but separate.

This may be Phase 4+, not first cleanup.
