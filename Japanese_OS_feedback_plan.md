# Japanese OS — Voice Feedback Triage and Implementation Plan

## Source

This plan is distilled from a ~50-minute mobile user-testing narration of Japanese OS used as an iPhone home-screen web app.

Primary goal: preserve the existing local-first React + TypeScript architecture while turning the current Phase 4 app from “functionally complete but noisy” into a cleaner daily-use learning loop.

---

## Executive Summary

The app is not fundamentally broken. The content coverage, mission types, persistence, review, progress, and recommendation surfaces already exist. The main problem is UX density and flow friction on mobile.

The highest-value next move is a narrow mobile-first polish slice:

1. Fix obvious bugs and bad answer patterns.
2. Reduce persistent chrome and repeated explanatory text.
3. Make Today feel like a simple daily plan, not a dashboard dump.
4. Make mission drills feel like one focused task at a time.
5. Delay bigger strategy changes, like true SRS reinforcement logic and richer skill-map explanations, until after the core loop feels good.

---

## Phase 4 Operating Loop

This plan is the intake and triage source for user-test feedback during Phase 4. It should capture new observations without forcing every observation into the active implementation slice.

Document roles:
- `Japanese_OS_feedback_plan.md` owns feedback intake, triage state, priority, and intended ordering.
- `BUILD_STATUS.md` owns verified repo reality, completed slices, current constraints, and the next implementation queue.
- `constitution.md` and `PRODUCT_SPEC.md` own durable product principles; only update them when feedback changes the product standard, not for every bug.
- `ROADMAP.md` owns broad phase direction and should not churn for small UX slices unless the phase sequence changes.

Triage states:
- `Observed`: seen in user testing or visual QA, but not yet accepted as a planned change.
- `Accepted`: fits the product principles and should be fixed when ordered.
- `Next slice`: narrow enough and important enough to implement soon.
- `Deferred`: valid, but blocked by larger design semantics, local progress-model implications, or lower priority.
- `Addressed`: implemented and verified in the repo.

Slice discipline:
- Keep the active implementation slice narrow, mobile-first, local-first, and TypeScript-only.
- Do not broaden recommendation logic, schemas, or progress semantics unless the slice explicitly requires it.
- When user testing surfaces a detour, log it here first unless it is a clear bug in the active slice.
- Prefer one source-of-truth update per pass: this plan for feedback state, `BUILD_STATUS.md` for verified build reality.
- After implementation slices, run the required validation suite and update `BUILD_STATUS.md` in the same pass.

Current ordering:
1. Addressed from the mobile loop sanity pass: starting a Review batch now moves the active retry into view instead of leaving the learner on the queue card.
2. Addressed from the Missions chapter-surface density cleanup: the active chapter panel now reaches the next mission faster and distinguishes locked chapters from cleared chapters.
3. Addressed in the first narrow personalization slice: Today mission cards now explain personal fit using existing local progress, weak points, target skills, and linked grammar tags.
4. Addressed from the Today personalization-copy sanity pass: incomplete support missions are no longer described as `Light pass` / `short pass` reinforcement.
5. Active intake: `Japanese_OS_feedback_pass_2_recording_3_plan.md` captures the next concrete mobile-use findings. V2.0 through V2.6 plus the listening prep audio coverage detour are addressed; larger model changes remain deferred until more real-use feedback justifies them.

Pass 2 working order:
1. `V2.0 mobile audit and code-path confirmation` — Addressed. The audit confirmed the finite-Today/feed problem, duplicate Today sections, post-completion Mission Path distraction, Review-loop containment risk, and early trust/pedagogy issues for later slices.
2. `V2.1 finite Today lesson shell` — Addressed. Today now snapshots the current core lesson for the browser session, shows remaining item count/time in the top card, marks completed core items, adds a Today Complete state after urgent Review clears, moves live recommendations into optional bonus, and removes Mission Path from Today-flow handoffs without date-keyed persistence.
3. `V2.2 review loop containment` — Addressed. Review now separates queue landing, active retry, and post-batch states; active retries hide mobile bottom nav and keep local Today navigation; cleared Review copy explicitly says Today will not require Review again unless a new miss is saved.
4. `V2.3 early trust fixes` — Addressed. Listening choices now shuffle with deterministic per-item/context seeds and prefer closer distractors, reorder drills hide canonical chunk order and split target particles for the relevant `に` lessons, output feedback uses learner-facing copy, and the narrow output-hint/progress spacing defects are tightened.
5. `V2.4 early output and grammar pedagogy` — Addressed. Early output tasks now show task-local answer pieces derived from existing token patterns and linked vocab, the first output mission links the existing `にほんご` vocab support it already requires, and Common Mistakes is no longer a required grammar section before drills; it remains available as an optional collapsed drawer inside Drills.
6. `V2.5 content cleanup` — Addressed. The first self-introduction grammar/output/listening text now uses Tanaka as a neutral Japanese placeholder instead of Colin, early first-loop estimates are tightened, and Today hydrates session-plan mission items from current local content so stale estimate copy does not survive a content update.
7. `Listening prep audio coverage` — Addressed. The 12 listening prep/model support lines that lacked Listen buttons now have matching local listening items and generated checked-in audio assets, the Tanaka self-introduction audio was regenerated, and the manifest/status now tracks the full current audio set.
8. `V2.6 date-keyed daily session and weekly tracker` — Addressed. Today now stores its finite core lesson in localStorage by local study-day date, rolls over at 3 AM America/New_York using the device clock, shows the JCHATTR brand and current study date, renders a compact Sunday-Saturday completion tracker, and keeps optional in-progress bonus work from reopening the completed daily core count without adding backend, sync, accounts, analytics, or online clock validation.
9. `V2.7+ model follow-ups` — Deferred by size. Keep larger SRS/content-model decisions as separate slices only after more real-use feedback justifies them.

---

## 1. Confirmed Bugs / Likely Bugs

### B1 — Bottom navigation labels truncate badly on mobile

Observed: bottom nav shows shortened labels like `TOD...`, `MIS...`, and sublabels also truncate.

Impact: high. It makes the app look unfinished immediately on phone.

Fix direction:
- Simplify mobile nav labels.
- Remove secondary subtitles from bottom nav on small screens.
- Use icon + short label, or label-only with no subtitle.
- Ensure each item fits at iPhone width.

Priority: P0.

---

### B2 — Example/support Japanese appears duplicated

Observed in grammar/listening support examples: the Japanese line appears twice, once bold and once not bold, with the English below.

Possible intended behavior: second line may have been meant to be reading/furigana/kana support.

Fix direction:
- If `japanese === reading`, do not render both.
- If reading differs, label it subtly as reading/kana support.
- Apply consistently to grammar examples, listening support, output support, and reading reveals.

Priority: P0.

---

### B3 — Listening multiple-choice options repeat and correct answer appears consistently last

Observed: options like “I am Colin” and “Are you a teacher?” repeat across listening items, and the correct answer appears as option 3 repeatedly.

Impact: high. This breaks the learning value because the user can answer by pattern instead of comprehension.

Fix direction:
- Shuffle choices per item deterministically or per render.
- Ensure the correct answer is not always in the same position.
- Avoid repeating the exact same distractors across consecutive items when possible.
- Prefer close distractors where available.

Priority: P0.

---

### B4 — Review retry carries previous selected answer into the next item

Observed: after clicking “Next retry,” the next retry appeared with the previous answer still selected.

Impact: high. It corrupts the retry experience.

Fix direction:
- Reset selected choice / typed answer state when review item changes.
- Key local state by review item id + attempt index, not only by mission/type.

Priority: P0.

---

### B5 — Some buttons start the user scrolled near the bottom

Observed: opening review/reinforce sometimes starts at the bottom of the destination page/mission.

Impact: medium-high. It makes the flow feel broken on mobile.

Fix direction:
- Scroll to top on route changes into Today, Mission, Review, and Missions chapter views.
- Consider a small `ScrollToTopOnRouteChange` component if one does not already exist.
- Avoid scroll restoration from prior mission state unless explicitly resuming an unfinished active mission.

Priority: P0/P1.

---

### B6 — Reorder drill may render in already-correct order

Observed: reorder chunks appeared already in the right order.

Impact: medium. It weakens the exercise.

Fix direction:
- Ensure reorder chunks are shuffled and not identical to correct order.
- If random shuffle returns the correct order, rotate or reshuffle.

Priority: P1.

---

## 2. UX Friction

### U1 — Today page is too dense and repetitive on mobile

Observed themes:
- The user repeatedly described Today as too much text and “bleh.”
- The main action starts too far down.
- “How the loop works” feels like help content, not primary page content.
- “Recommended because unlocked and incomplete” feels internal and unhelpful.

Fix direction:
- Put the first actionable mission above the fold.
- Collapse or remove instructional copy.
- Replace internal reasoning with learner-facing context: chapter, mission number, skill, why it matters.
- Move “How the loop works” into a small help affordance or collapsed details block.

Priority: P0/P1.

---

### U2 — Bottom nav stays visible inside missions and consumes precious space

Observed: while doing missions, the persistent bottom nav takes up screen height and distracts from the task.

Fix direction:
- Hide the main bottom nav on mission detail routes, or make it much smaller.
- Provide mission-local navigation instead: back to Today, progress indicator, maybe exit.
- Keep one clear escape route.

Priority: P1.

---

### U3 — Mission overview/header remains too large throughout missions

Observed: estimated time, target skill, examples/drills metadata, mission overview, and step controls consume too much vertical space.

Fix direction:
- Keep a compact sticky or top header with title + progress only.
- Move metadata into collapsed details.
- On active drill/check screens, dedicate most space to the task.

Priority: P1.

---

### U4 — Grammar mission flow feels more like a long page than an app task

Observed:
- Intro, examples, mistakes, drills are separate sections.
- Drills appear on the same long page.
- Correct feedback appears below the answer, forcing scrolling.
- Completion is not satisfying.

Fix direction:
- Move toward one active step/task at a time.
- After checking an answer, primary button should become “Next.”
- Feedback should appear close to the answer.
- Consider making common mistakes contextual: wrong example → corrected example → short explanation.

Priority: P1/P2.

---

### U5 — Listening reveal area is too tall and out of order

Observed:
- Transcript hint, meaning hint, pattern hint occupy too much space.
- Meaning hint is effectively the answer and should not be shown too early.
- User has to scroll too much after checking.
- The active listening task, hint controls, reveal content, and next/previous controls are split vertically, so the learner has to manage the page instead of staying in the drill.
- Pattern support is useful, but when it is presented as listening support it should be actionable in the listening modality, including playback when an existing audio asset matches the support line.

Fix direction:
- Use a staged reveal order: transcript → pattern/focus → meaning.
- After answer check, show compact feedback and a primary “Next line” action.
- Keep hints collapsed unless requested.
- Redesign listening around a focused active workspace: compact progress, audio, choices, progressive hint slot, feedback, and next action should live together.
- Move prep/reference examples into an optional support surface, and make matched examples playable without changing content schemas.

Priority: P1.

---

### U5a — Listening retry should remain audio-first

Observed:
- When a listening item is missed and later appears in Review, the retry surface shows the transcript first and does not offer the original audio.
- This weakens the purpose of a listening retry because the learner is no longer retrying the same modality.

Fix direction:
- Short term: show the listening audio in the Review retry card when the item has an audio asset, with transcript hidden behind reveal.
- Longer term: audit Review with the same single-focus mission-screen standard so listening retry, transcript reveal, focus support, choices, feedback, and next action sit in one intentional flow.

Priority: P1.

---

### U5b — Listening may enter the path too early

Question raised:
- Listening is currently introduced as the second core mission, before a new learner has much pattern familiarity.
- The content is technically beginner-safe, but the experience may feel like guessing if the learner has not first heard or practiced a few supported lines.

Fix direction:
- Keep the current local-first mission architecture for now.
- Evaluate whether early listening should begin with a short "hear the pattern" prep step before graded checks.
- Consider whether the first listening mission should be recommended after one more grammar/output exposure, or whether the listening mission itself should include a mandatory listen/practice screen before the quiz screen.

Priority: P2.

Triage:
- Addressed for the current Phase 4 slice.
- Chosen direction: keep listening in the early path, but add a short hear-the-pattern prep screen before the first check using existing support examples and audio where available. This avoids changing unlock/recommendation semantics while making beginner listening less cold.
- Follow-up audit: no delayed placement is needed yet. The current first-run listening prep gives enough audio-first runway after the first grammar mission, but prep copy should stay learner-facing and focused on hear → notice → try rather than layout mechanics.

---

### U8 — Mission screens need a stronger design north star

Observed:
- Several mission types still feel like long documents with drills embedded inside them.
- Rich support content can become clutter when every explanation, status, and action is visible at once.
- The intended learning rhythm should be learn → try → feedback → recap, but some screens still mix those states together.

Fix direction:
- Treat one focused mobile workspace as the default mission design target.
- Keep one primary action visible at a time.
- Put hints and support close to the active task, progressively revealed as the learner needs them.
- Move recap, saved-progress detail, and skill-impact explanation to completion states.
- Keep support content actionable in the modality being trained.

Priority: P1/P2.

---

### U9 — Mission completion actions still duplicate inside grammar

Observed:
- The grammar completion state can show task-local actions like `Back to today` / `Edit answer`, section navigation like `Previous` / `Finish to Today`, and a separate `Ready for Today` completion card below.
- This creates three competing exit surfaces after the learner has already finished the active drill.

Fix direction:
- Apply the single-focus mission-screen standard to grammar completion states.
- Keep one primary completion CTA and at most one secondary action.
- Move detailed completion/history information into a final recap surface only if it adds learner value.

Priority: P1.

Status:
- Addressed in the Phase 4 grammar completion cleanup slice. Final grammar drill feedback now owns the completion moment with one primary `Finish to Today` action and one secondary `Edit answer` path; the competing section-level finish row and extra `Ready for Today` completion card no longer appear in the drills step.

---

### U10 — Grammar examples should spotlight the target grammar

Observed:
- In grammar lessons, examples show useful Japanese lines but do not visually call out the grammar being trained.
- A new learner should not have to infer that `は`, `です`, `か`, or a target pattern chunk is the thing to watch.

Fix direction:
- Highlight target grammar inside example Japanese lines where practical.
- Prefer deriving highlights from existing lesson tags, mission target skill, or narrow pattern metadata before hand-marking every content line.
- Keep the highlight subtle and readable; it should guide attention, not turn examples into noisy annotated text.

Priority: P1/P2.

Triage:
- Addressed.
- Implemented in the Phase 4 grammar-focus highlighting slice using existing lesson titles/ids to derive subtle inline example highlights without changing content schemas. The follow-up cleanup removed the redundant focus-chip row so the highlight itself owns the cue.
- Follow-up audit: addressed in the grammar-highlight coverage cleanup. The issue was sparse coverage and one over-broad derived match, not noisy per-example highlighting, so the fix stayed in the existing derived-rule table and did not add schema metadata.

---

### U11 — Listening final hints should not award mastery

Observed:
- The final meaning hint effectively reveals the answer.
- If the learner uses that hint, the app should not still present the same `Correct` moment or imply full mastery.

Fix direction:
- Treat early success without hints as the clearest mastery signal.
- Treat transcript/focus support as supported completion or partial confidence.
- Treat final meaning reveal as answer-revealed exposure: complete the item for flow, route onward with `Next line`, and consider recording it as lower confidence or review-worthy.
- Preserve local-first progress; do not introduce backend analytics or broad scheduling.

Priority: P1.

Triage:
- Addressed.
- Implemented in the Phase 4 listening hint/scoring semantics slice. Revealing the final answer now counts as supported exposure for flow, records or preserves review pressure, and does not present the result as full mastery.
- Follow-up audit: addressed in the supported-exposure wording cleanup. Mission and Review retry feedback now says the learner saw the answer, can keep the pass moving, and the item remains open in Review instead of using mastery-like or implementation-facing wording.

---

### U12 — Continue mission should outrank and dedupe Today plan cards

Observed:
- If a learner leaves a mission in progress, `Pick up where you stopped` can appear below `Do this today`.
- The same mission can also remain in the main Today recommendation stack, creating duplicate action paths.

Fix direction:
- If an active continue mission exists, place it above the main Today plan.
- Remove or suppress that same mission from the lower recommendation list for that render.
- Keep recommendation logic intact; this is presentation precedence and deduping, not a new scheduler.

Priority: P1.

Triage:
- Addressed.
- Implemented in the Phase 4 Today resume precedence/deduping slice by promoting the active continue card above the daily plan and suppressing that same mission from lower recommendation cards for the current render.

---

### U13 — Completion needs useful recap without becoming a dashboard

Observed:
- Completion should confirm what the learner practiced and whether it affected weak-point or skill signals.
- The recap must stay lightweight; completion should not become a second Progress page.

Fix direction:
- Add a compact recap to Today mission/review return states.
- Use existing local mission progress, skill-map heuristics, and weak-point state.
- Keep it to practiced work, current local skill/queue signal, and weak-point impact.
- Do not add new schemas, backend analytics, or scheduling.

Priority: P1.

Triage:
- Addressed.
- Implemented in the Phase 4 compact completion-recap cleanup slice.

---

### U14 — Starting Review should land on the active retry

Observed:
- On iPhone-width audit, tapping `Start review` activated the batch but left the old queue card in view.
- The learner had to scroll before seeing the actual retry task, which worked against the single-focus Review standard.

Fix direction:
- When a batch starts, move the active `Review batch` workspace into view.
- Keep the existing Review queue semantics and local-first retry logic unchanged.

Priority: P1.

Triage:
- Addressed.
- Implemented in the mobile loop sanity pass by scrolling the active batch anchor into view when `activeBatch` starts.

---

### U15 — Missions chapter surface still repeats context before the next action

Observed:
- The selected chapter tab, active chapter summary, and chapter detail card repeat similar chapter title/progress information.
- On a narrow iPhone viewport, this pushes the next required mission below the fold even though the page copy says to start the next required mission fast.

Fix direction:
- Keep the single-active-chapter model.
- Reduce repeated chapter framing before the next-mission card.
- Preserve the chapter switcher and mission-library semantics.

Priority: P2.

Triage:
- Addressed.
- Implemented in the Missions chapter-surface density cleanup by removing the duplicate chapter header/stat block before the next-mission card, shortening the active chapter toolbar, moving chapter description/pack details behind `Chapter details`, and correcting no-ready locked chapters from `Chapter cleared` to `Locked for now`.

---

### U6 — Review completion should probably return to Today

Observed: finishing review batch returns to Review page, which then shows a lot of zeros.

Fix direction:
- After completing a review batch from Today, return to Today or show a compact completion state with “Back to Today.”
- Avoid dumping the user onto an empty stats page.

Priority: P1.

---

### U7 — Completion/status copy feels too implementation-facing

Observed phrases like:
- “Completion saves automatically after you clear every drill or check.”
- “Cleared 0 of 2 drills in this pass.”
- “Completed one time.”

Fix direction:
- Keep save mechanics implicit unless necessary.
- Replace with learner-facing progress: `2/5 checks`, `Mission complete`, `Added to review`, `Nice — next line`.

Priority: P1.

---

## 3. Feature Ideas / Product Improvements

### F1 — Today should feel like “daily missions,” not just “next up”

Current tension: “Next up” is not the same as “Do this today.”

Potential model:
- Core today: 2–3 planned missions.
- Review: appears first only when weak points exist.
- Bonus: optional reinforce/stabilize/reading.
- Mission library: browsing and power-user continuation.

Do not overbuild yet. For the next slice, only improve presentation language and layout. Deeper scheduling logic can wait.

Priority: P2.

---

### F2 — Reinforce should not immediately repeat the exact same mission

Observed: reinforcing a mission on the same day repeated the same lesson and same drills.

Possible future model:
- First exposure: full lesson + examples + mistakes + drills.
- Same-day reinforce: short alternate examples/checks only.
- Later review: SRS-like resurfacing after time delay.
- Related future missions can reinforce old grammar naturally.

Priority: P2/P3. Important, but not first slice unless the current logic is actively annoying every session.

---

### F3 — Reading lane timing needs clearer logic

Question raised: when should reading missions enter the daily loop?

Likely answer:
- Reading missions should unlock after the user has encountered the underlying grammar/examples.
- Today can occasionally include reading as bonus or reinforcement once relevant prerequisites are met.
- Avoid asking the user to read content that depends on knowledge not yet introduced.

Priority: P2.

---

### F4 — Listening recognition lane could mirror reading recognition

Idea: if reading recognition exists, listening recognition may deserve a similar lane: hear a line, choose close interpretation, then reveal transcript/support.

Priority: P3. Valuable, but not before existing listening flow is fixed.

---

### F5 — Skill map needs more explainable detail

Observed questions:
- Why am I solid on sentence structure?
- What particles am I shaky on?
- Does one correct completion make me solid?

Possible improvement:
- Show per-skill “why this rating” in compact terms.
- For particles, identify specific particles studied/missed: は, で, に, が, を, の, etc.
- Avoid fake precision; keep tiering simple but inspectable.

Priority: P3.

---

### F6 — Guided Today lesson track could turn daily work into a cohesive run

Idea:
- Today could offer a single guided entry point for a small planned lesson run rather than asking the learner to interpret separate cards.
- A run might sequence two or three coherent missions, show a compact recap after each mission, then route into review at the end if weak points are waiting.
- Completion recaps could become the handoff moment: `Next mission`, `Start review`, or `Back to Today`.

Candid read:
- This is directionally strong for engagement because it answers “what do I do now?” and reduces decision fatigue.
- It should not be implemented as a broad scheduler rewrite yet. It introduces session-run semantics, daily chunk sizing, and review-routing behavior that need a narrow design pass.
- The safest path is incremental: keep current recommendations, then later add a Today-run presentation layer that chains the already-selected visible actions.

Priority: P2.

Triage:
- Addressed for the current Phase 4 slice.
- Implemented as a narrow presentation layer: Today completion return cards now show an ordered Today-track handoff using the already-visible continue/recommendation actions. This intentionally avoids backend scheduling, schema changes, or recommendation-logic changes.
- Follow-up audit addressed: the completion handoff now stays to Done/Next only, trims unresolved-review repetition, and removes duplicate Review secondary actions.

---

## 4. Questions / Uncertainties

1. Does the app currently distinguish first exposure, retry, reinforce, stabilize, and review modes internally, or are they all rendering the same mission player?
2. Are multiple-choice distractors stored in content, generated from nearby content, or hardcoded/fallback-generated?
3. Is the duplicate Japanese line a rendering issue or a data issue where `reading` duplicates `japanese`?
4. Should mission detail routes hide global bottom navigation entirely, or only on small screens?
5. Should review completion always return to Today, or only when launched from Today?
6. Should Today’s time estimate decrement after completed core missions, or is it intended to show the original plan estimate?
7. Is reading lane intended to be parallel enrichment, delayed reinforcement, or part of the core daily path?

---

## 5. Priority Order

### P0 — Fix broken-feeling mobile issues

1. Bottom nav truncation.
2. Duplicate Japanese/support lines.
3. Listening choice order/distractor repetition.
4. Review selection state not resetting.
5. Scroll position starting at the bottom on new flows.

### P1 — Make the core loop feel better on phone

6. Simplify Today above the fold.
7. Hide/reduce global nav during missions.
8. Compact mission header/overview.
9. Reduce drill/check scrolling.
10. Improve review completion route.

### P2 — Clarify learning system logic

11. Better Today vs Bonus vs Library model.
12. Smarter reinforce behavior.
13. Reading lane placement in recommendations.
14. Mission mode distinctions: first-run vs reinforce vs review.

### P3 — Deeper progress/personalization

15. Skill-map detail by sub-skill.
16. Particle-specific tracking.
17. Listening recognition lane.
18. SRS-like scheduling.
19. Today recommendation copy that explains why a mission fits the learner's actual local progress.

Triage:
- Item 19 is Addressed for the current Phase 4 slice. Today keeps the same local deterministic recommendation model, but mission cards now include a compact `Personal focus` line based on same-skill completions, direct or related weak-point pressure, target skills, and linked grammar tags. No schemas, backend, sync, accounts, analytics, or AI behavior were added.

20. Incomplete Today support missions should not be called light/short passes.

Triage:
- Item 20 is Addressed. The sanity pass across empty, in-progress, weak-point, and recently-reviewed states found one narrow copy mismatch: an unlocked incomplete support mission could be labeled `Light pass` and explained as a short pass even though it opened as a normal first-run mission. The fix preserves deterministic selection but reserves `Light pass` / `short pass` wording for completed reinforcement missions.

---

## 6. Current Phase 4 Queue State

### Status

Pass 2 is now the active feedback source. V2.0, V2.1, V2.2, V2.3, V2.4, V2.5, V2.6, and the listening prep audio coverage detour are addressed.

The next step should be another real-use feedback pass or a regression audit, not a new implementation slice by default.

### Scope for the next accepted slice

Include:
- Start from `Japanese_OS_feedback_pass_2_recording_3_plan.md`.
- Run a V2.6 mobile rollover/tracker acceptance audit in a narrow viewport.
- Confirm Today, first grammar, first listening, first output, Review, Progress, and Missions still work together after the finite-shell, review-containment, trust, pedagogy, content cleanup, prep-audio coverage, and daily-session slices.
- Confirm Today shows JCHATTR, the local study date, 3 AM ET rollover copy, a current-day highlight, and a completed-day check after the finite lesson is done.
- Confirm optional in-progress bonus work remains resumable below the completed lesson state instead of changing Today back to required work.
- Log any new findings without implementing unless a high-confidence regression appears.
- Keep deterministic recommendation selection readable and local-first.
- Prefer content/copy clarity before adding new stored semantics.

Exclude:
- Full Today redesign or SRS scheduler.
- New runtime AI distractor generation.
- New SRS scheduling.
- New mission types unless a later explicit decision accepts the model change.
- AI features.
- Backend/cloud sync.
- Broad content rewrite.
- Large visual redesign.

### Next prompt

```md
Context:
This repo is Japanese OS, a local-first React + TypeScript Japanese learning MVP.
Follow `constitution.md`, `PRODUCT_SPEC.md`, `ROADMAP.md`, `BUILD_STATUS.md`, `Japanese_OS_feedback_plan.md`, and `Japanese_OS_feedback_pass_2_recording_3_plan.md`.
Preserve the current architecture, local-first storage, TypeScript-only code, mission schemas, mission types, and deterministic recommendation/review selection.

Task:
Run a V2.6 mobile rollover/tracker acceptance audit. Preserve app behavior unless the audit finds a narrow high-confidence regression.

Scope:
1. Use a narrow iPhone-like viewport.
2. Audit Today through one recommended grammar mission, one listening mission, the first output mission, one Review retry if weak points exist, Progress, and Missions.
3. Confirm no Colin-specific learner-facing content remains in the early loop.
4. Confirm Today estimates and completed session items use current content values.
5. Confirm Today shows JCHATTR, the current local study date, 3 AM ET rollover copy, and a compact Sunday-Saturday tracker with the current day highlighted.
6. Complete the finite Today lesson and confirm the current day receives a completion check without refilling required work.
7. Do not implement unless there is a clear narrow regression; if edits are needed, update BUILD_STATUS.md and Japanese_OS_feedback_plan.md in the same pass.

Manual flow:
- Open Today.
- Open the first grammar, listening, and output missions from Today or Missions.
- Confirm the first output mission still has task-local pieces and neutral placeholder content.
- Attempt one wrong output answer and one supported/correct answer.
- Return to Today and confirm the finite Today shell still behaves as expected, including the completed-day tracker state.
- Open Progress and Missions.
- Check console errors.

Output:
Return confirmed regressions, UX friction, suspected issues, and whether the product is clean enough to keep gathering real feedback. If no code changes are made, say so explicitly.
```

---

## 7. Phase 4 Acceptance Audit After Features 1-8

Date: 2026-04-26.

Scope:
- Today finite lesson shell, weekly gold-star tracker, optional focus control.
- Grammar mission miss flow and deterministic mistake drawer.
- Review retry start, miss flow, mistake drawer, and post-batch handoff.
- Missions library chapter surface, completed-mission `Open again` reinforce state, capstone entry, and scenarios lane.
- Capstone exact-source/recombination player, naturalized story gate, and vocab support chips.
- Reading mission reveal and known/new vocab support chips.
- Settings focus and reading-display preferences plus disabled AI status cards.

Result:
- No P0 breakage found in the tested local state.
- The app is clean enough to continue gathering real feedback.
- The next work should be a narrow polish/tuning slice before broader naturalized capstone or AI proxy work.

Verified working:
- Today rendered the finite daily shell with the current study day, weekly gold-star line, lesson count, bonus area, and focus control. At `Sun Apr 26 01:08 EDT`, the app correctly still showed the Saturday, April 25 study day because the local rollover is 3 AM America/New_York.
- Grammar mission miss flow showed expected-answer feedback plus an `Explain mistake` drawer.
- Review started from a newly created weak point and showed an active retry workspace.
- Missions `Open again` launched a short reinforce pass with `Short reinforce pass` copy.
- Capstone recombination opened at `/capstone/capstone-story-ch01-first-day?mode=recombination`, revealed meaning/support, and showed collapsed vocab support chips.
- Naturalized capstone route remained locked until the exact-source closeout is complete.
- Reading mission reveal showed meaning/support and collapsed known/new vocab chips.
- Settings focus preference wrote and restored successfully; AI fallback/output coach cards remained off.
- Scenario sim route opened as a structured output mission and showed scenario brief, prompt, answer pieces, and output miss explanation.
- `npm run typecheck` passed during the audit.

### A1 — Review can end a batch after a miss with `0/1 retries cleared`

State: Addressed.
Priority: P2.

Observed:
- In Review, after choosing an incorrect answer, the `Finish review batch` button became available.
- Finishing produced a clear but slightly odd handoff: `This batch is done`, `0/1 retries cleared`, and `1 weak point still needs review`.

Why it matters:
- The behavior is internally consistent with supported exposure and unresolved weak points, but the button label makes a failed retry feel like successful batch completion.

Fix direction:
- Keep Review semantics unchanged.
- After an incorrect retry, change the primary action copy to something like `End batch for now` or keep `Try again` / `Edit answer` visually stronger than finishing.
- Ensure the post-batch state distinguishes `batch ended` from `retry cleared`.

Recommended slice:
- Completed in the Phase 4 acceptance-audit polish slice. Missed retry batches now use `End batch for now`, unresolved post-batch copy says the pass ended with open items, and expected-answer feedback says the item stays open without changing Review queue semantics.

### A2 — Review explanation can be too generic for the selected wrong option

State: Addressed.
Priority: P2.

Observed:
- In a Review retry for `わたしはたなかです。`, selecting `たなかはわたしか。` opened an explanation whose likely confusion said `Dropping は when the sentence needs a clear topic`.
- The selected wrong answer did include `は`; the real problem was closer to malformed question/copula/topic order.

Why it matters:
- The drawer system works, but some deterministic fallbacks are too broad when the wrong option is a specific distractor.

Fix direction:
- Keep deterministic explanations local and authoritative.
- Add more targeted explanation rules for common grammar distractor patterns, especially:
  - malformed `か` question endings
  - topic/comment reversal
  - particle mismatch versus particle omission
  - output token-pattern misses

Recommended slice:
- Completed in the Phase 4 acceptance-audit polish slice. The observed `たなかはわたしか。` distractor now gets a specific `か` question-ending explanation instead of the older broad `は` omission fallback.

### A3 — Capstone support exposes raw/stale source IDs to learners

State: Addressed.
Priority: P2.

Observed:
- In the chapter 1 capstone support reveal, the learner-facing source line says `Built from ex-colin-desu` even though the visible Japanese is `わたしはたなかです。`.

Why it matters:
- Source traceability is valuable for audits, but raw IDs are implementation-facing and can be confusing when historical IDs survive content cleanup.

Fix direction:
- Keep source traceability in content.
- Hide raw source IDs from learner-facing support, or replace them with neutral copy such as `Built from a source example in this chapter`.
- If source IDs remain visible in any dev/audit mode later, label them as audit metadata rather than lesson support.

Recommended slice:
- Completed in the Phase 4 acceptance-audit polish slice. Capstone support keeps traceability in the content model but shows learner-facing source copy such as `Built from source examples in this chapter` instead of raw source IDs.

### A4 — Scenario/output miss flow works, but incorrect answers can still advance

State: Addressed for copy; scoring semantics unchanged.
Priority: P3.

Observed:
- Scenario output miss feedback was helpful and the explanation correctly identified missing pieces.
- The flow still offered `Next task` after a miss, preserving pass movement while leaving review pressure.

Why it matters:
- This may be intentional for momentum, but it should be evaluated in real use: learners may interpret `Next task` as success unless the feedback is visually clear enough.

Fix direction:
- Do not change scoring semantics without a dedicated Review/weak-point decision.
- In a future copy pass, consider making incorrect-but-advance states read as `Keep moving` / `Try later in Review` instead of success-like progression.

Recommended slice:
- Completed for the current copy pass. Output misses now say the item stays open for later review and use `Keep moving` / `Finish for now` instead of success-like `Next task` language when the answer was not accepted.

### Recommended Next Slice

```text
Implement the next naturalized capstone expansion slice: add beginner-natural bonus capstones for chapters 2-4 only, preserving exact-source capstones as the default first-pass version. Keep every line source-auditable, avoid hidden N4+ grammar, run typecheck/build plus standard content reports, and include a content audit.
```

---

## 8. Desktop UX Visual Audit And Polish Plan

Date: 2026-04-26.

Scope:
- Desktop-like in-app browser viewport after the simulated window was enlarged and zoomed out.
- Main pages: Today, Missions, Progress, Review, Settings.
- Mission/player routes: grammar, listening, output, reading, scenario, capstone closeout, capstone recombination, naturalized capstone locked state.
- Stateful surfaces: Review active batch, capstone support reveal, reading post-answer reveal, lower Settings/reset area.

Result:
- No desktop-only P0 functional blocker was found.
- The desktop version is usable, but it still reads as a mobile-first app stretched into a desktop frame.
- The next desktop work should be a presentation/layout polish slice, not a learning-model or content change.

### D1 — Wide viewport framing leaves too much dead space

State: Next slice.
Priority: P1.

Observed:
- On the desktop-like viewport, the app content stays constrained to the left/middle while a large unused right-side area remains visually dominant.
- The shell can show a clipped duplicate edge of the app at extreme zoom/window combinations.

Why it matters:
- The desktop app feels less intentional than the mobile app, even though the core surfaces work.
- The learner's attention is pulled toward empty framing instead of the current task.

Fix direction:
- Keep mobile shell behavior unchanged.
- At desktop breakpoints, make the app frame feel intentionally centered and bounded.
- Audit `.app-frame`, `.app-shell`, `--shell-max-width`, and background/overflow behavior.
- Prefer a calm full-page desktop workspace over decorative side duplication or large dead zones.

Acceptance checks:
- Today, Missions, Progress, Review, Settings, and mission routes render without horizontal overflow at desktop widths.
- No clipped duplicate app column appears at desktop zoom/window sizes.
- Mobile viewport screenshots remain visually equivalent to the current mobile baseline.

### D2 — Left brand rail is too dominant during study

State: Planned.
Priority: P2.

Observed:
- The persistent `Short daily loops, built to stick` rail is polished, but it competes with active learning tasks on every route.
- In mission and Review routes, it feels more like a marketing panel than task chrome.

Why it matters:
- Desktop has more room, but the active task should still own attention.
- The current rail uses a lot of high-contrast visual mass for static copy.

Fix direction:
- Keep the rail on desktop, but compact it after the landing context:
  - smaller brand card,
  - less prominent headline,
  - or mission-mode variant focused on navigation/status rather than product pitch.
- Do not remove the existing mobile bottom navigation behavior.

Acceptance checks:
- Mission, Review, and capstone routes place visual emphasis on the active card, not the brand rail.
- Navigation remains obvious.
- Today can retain more brand/context than mission routes if that feels better.

### D3 — Mission workspaces underuse desktop width

State: Planned.
Priority: P2.

Observed:
- Grammar, output, scenario, reading, and capstone players remain largely single-column.
- This preserves focus, but on desktop it creates avoidable empty space and long vertical stacks.

Why it matters:
- Desktop can improve task ergonomics without making the UI busier.
- Support details, progress, answer pieces, and feedback can sit beside the active task where it helps.

Fix direction:
- Add desktop-only workspace layouts with narrow support rails where useful.
- Good candidates:
  - Grammar: lesson/task card plus compact progress/support rail.
  - Output/scenario: prompt/input primary column plus answer pieces/support rail.
  - Reading/capstone: line/check primary column plus reveal/support/progress rail after support is opened.
- Avoid making desktop cards nested or dashboard-like.
- Preserve the current single-column mobile mission players.

Acceptance checks:
- Desktop mission players feel intentionally spacious but still single-focus.
- No mission task requires more scrolling than before for its primary action.
- Mobile screenshots remain unchanged aside from any intentionally shared copy fixes.

### D4 — Review active batch is too narrow on desktop

State: Planned.
Priority: P2.

Observed:
- Review landing uses a good two-card desktop layout.
- Once a batch starts, the active retry workspace becomes narrow, with answer choices wrapping more tightly than necessary.

Why it matters:
- Review is a high-friction moment; desktop should make it feel controlled and easy to scan.

Fix direction:
- Give active Review batch a desktop-specific max width or two-column task/support layout.
- Keep the local Today navigation and no-global-mobile-nav semantics intact.
- Do not change Review queue, scoring, weak-point clearing, or batch sizing.

Acceptance checks:
- Active Review retries have enough width for choices and typed output.
- Miss feedback and mistake drawer remain close to the answer.
- Review mobile active-batch layout remains unchanged.

### D5 — Reading post-answer action order invites skipping support

State: Planned.
Priority: P2.

Observed:
- After a reading answer, `Next check` appears before the feedback, meaning, notice text, and vocab support.

Why it matters:
- The flow technically works, but it invites the learner to advance before reading the explanatory payoff.

Fix direction:
- Move the primary next action after the revealed feedback/support on reading routes.
- Consider the same action-order audit for capstones if needed.
- Do not change reading scoring, Review pressure, or answer persistence.

Acceptance checks:
- After answering, the learner sees result and support before the next-step CTA.
- Keyboard/click flow still supports fast movement.
- Mobile remains readable and does not push the next action excessively far down.

### D6 — Missions chapter switcher still feels mobile-born on desktop

State: Deferred.
Priority: P3.

Observed:
- The horizontal chapter switcher works on desktop, but it behaves like a mobile carousel.

Why it matters:
- The Missions page is usable now, and changing the chapter browser risks larger layout churn.

Fix direction:
- Defer until after D1-D5.
- If revisited, consider a denser desktop chapter grid or left-side chapter list while keeping the next mission and Review-first behavior prominent.

### Recommended Desktop Polish Sequence

1. Shell/framing plus mission-mode rail compacting.
2. Active Review desktop width.
3. Desktop mission workspace support rails for output/scenario and reading/capstone first.
4. Reading post-answer action order.
5. Optional Missions desktop chapter browser revision.

### Recommended Next Slice

```text
Implement Desktop Polish 1 from Japanese_OS_feedback_plan.md: fix desktop shell/framing and compact the desktop brand rail on mission/review/capstone routes while preserving mobile behavior. Do not change learning semantics, recommendations, content, or scoring. Run typecheck/build and manually inspect desktop and mobile-like viewports across Today, Missions, Review, one mission route, and one capstone route.
```

---

## 9. Historical Launch Prompt

This prompt launched the first mobile core-loop friction cleanup.
It is preserved for traceability, but it is not the current recommended next prompt.

```md

Context:
This repo is Japanese OS, a local-first Japanese learning MVP. Follow `constitution.md`, `PRODUCT_SPEC.md`, `ROADMAP.md`, and `BUILD_STATUS.md`. Preserve the current architecture. The repo is already in Phase 4 with a working local-first mission loop, content library, review loop, progress screen, and recommendation logic. This task is a narrow mobile UX/friction cleanup based on a real iPhone home-screen user test.

Task:
Implement a focused “mobile core-loop friction cleanup v1” pass. Fix the obvious broken-feeling mobile issues without redesigning the whole app or changing the learning architecture.

Specific fixes:
1. Fix the mobile bottom navigation so labels do not truncate into `TOD...`, `MIS...`, etc. On small screens, remove/hide secondary nav subtitles if needed and keep labels short/readable.
2. On mission detail routes, hide or significantly compact the global bottom nav so the mission task gets more vertical space. Keep a clear mission-local way back to Today or the previous surface.
3. Suppress duplicate Japanese/support rendering when a sentence’s `reading` is identical to `japanese`. If they differ, render both with clear lightweight labels.
4. Fix listening multiple-choice checks so the correct answer is not consistently last. Shuffle choices per check, and avoid repeating the same static distractors across consecutive checks when practical using existing content/data.
5. Fix review retry state so selected choices or typed answers from the previous retry do not carry into the next retry item.
6. Ensure opening review, reinforce, and mission routes starts at the top of the relevant screen unless intentionally resuming an active in-progress task.
7. Lightly reduce implementation-facing copy on Today mission cards. Replace text like “recommended because this unlocked mission is still incomplete” with learner-facing context such as mission type, chapter/path position, target skill, or why it helps.

Constraints:
- TypeScript only.
- Local-first only.
- Do not add dependencies unless there is a strong reason.
- Do not change schemas unless required for one of the fixes.
- Do not rewrite recommendation logic beyond copy/presentation needed for item 7.
- Do not introduce backend, auth, sync, analytics, or AI behavior.
- Keep changes small and file-local where possible.
- Preserve existing mission/content architecture.
- Mobile-first: verify at narrow phone widths.

Acceptance criteria:
- Bottom nav labels are readable on iPhone-width screens.
- Mission screens no longer permanently lose major vertical space to the full global nav.
- Identical `japanese` and `reading` values are not shown as duplicate lines.
- Listening answer choices vary position; the correct answer is not always option 3.
- Review retry items start clean with no prior selected answer/typed draft accidentally carried over.
- Review/reinforce/mission entry does not land the user at the bottom of the page.
- Today mission cards use clearer learner-facing context and less internal implementation wording.
- `npm run typecheck` passes.
- `npm run build` passes.
- Update `BUILD_STATUS.md` with a concise note if this slice lands successfully.

Output:
Summarize changed files, explain any tradeoffs, list verification commands run, and call out one recommended follow-up slice.
```

---

## 10. Historical Follow-Up Slice

This follow-up slice was completed through later Phase 4 mobile mission-flow cleanup work.
It is preserved as historical planning context, not as the active queue.

Mission task-flow compacting v2

Goal:
- Make grammar, listening, and reading missions feel more like one focused app task at a time.

Likely work:
- Compact mission overview into a smaller header.
- Convert grammar drills to one-at-a-time flow.
- Make post-check primary button become “Next.”
- Move common mistakes into contextual examples.
- Reduce tall hint/reveal blocks in listening.

Do this only after the P0 cleanup lands, because the current bugs/friction will distort feedback on any deeper redesign.
