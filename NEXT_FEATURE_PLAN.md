# JCHATTR Next Feature Plan

## Purpose

This document is the active implementation plan for the next product phase after the finite Today loop and weekly tracker.

The goal is to add the eight agreed next features without drifting into a broad rewrite:

1. Chapter capstone stories
2. Mission replay variants
3. Mistake explainer drawer
4. Daily gold star plus weekly shape
5. Personal focus tuning
6. Scenario sim micro-missions
7. Known/seen text display
8. AI lesson coach, not AI tutor

This plan should be used by future Codex chats as the source of truth for sequencing, acceptance criteria, QA, and next-prompt handoff. It supplements `constitution.md`, `PRODUCT_SPEC.md`, `ROADMAP.md`, `BUILD_STATUS.md`, and `N5_CURRICULUM_PLAN.md`.

---

## Current Product Baseline

Before starting a slice, assume the current repo has:

- a local-first React + TypeScript app
- a finite date-keyed Today loop
- a compact Sunday-Saturday completion tracker
- grammar, listening, output, and reading mission players
- local mission progress, weak-point tracking, review batches, and skill-map tiers
- `50` grammar/listening/output packs
- `49` reading missions
- `100` grammar lessons
- `550` vocab items
- `731` example sentences
- `361` listening items with matched local audio assets

Verify this baseline with:

```bash
npm run report:build-status-summary
npm run report:content-coverage
npm run report:progression-gaps
```

If those reports disagree with this document, trust the repo reports and update this plan or `BUILD_STATUS.md` before implementing larger work.

---

## Operating Principles

1. Build vertical slices, not platforms.
2. Keep local-first behavior unless a slice explicitly says otherwise.
3. Keep mission completion deterministic.
4. Keep generated Japanese content small, reviewable, schema-validated, and tied to existing grammar/vocab.
5. Add AI only after deterministic surfaces can use it safely.
6. Preserve mobile-first single-focus mission screens.
7. Do not add dependencies unless the slice cannot be implemented well with existing tools.
8. After every slice, update this plan with status and the next best prompt.

---

## Source Of Truth Order

Use these documents in this order:

1. `constitution.md` for product and engineering rules
2. `BUILD_STATUS.md` for verified repo reality
3. `NEXT_FEATURE_PLAN.md` for this phase's sequence and prompts
4. `N5_CURRICULUM_PLAN.md` for content-quality rules
5. `Japanese_OS_feedback_plan.md` for mobile/user-test feedback
6. `PRODUCT_SPEC.md` and `ROADMAP.md` for broader product framing

When documents conflict, do not silently choose. State the conflict, inspect the repo, and make a narrow update.

---

## Standard Slice Workflow

Every implementation prompt should ask Codex to:

1. Inspect the relevant files first.
2. State the narrow implementation plan.
3. Make the smallest coherent patch.
4. Run the required QA commands.
5. Update docs only when repo reality changed.
6. End with:
   - changed files
   - verification performed
   - known limitations
   - the next best prompt

Use this validation ladder:

```bash
npm run typecheck
npm run build
npm run report:build-status-summary
npm run report:content-coverage
npm run report:progression-gaps
```

For content-heavy slices, also run:

```bash
npm run report:reading-reuse
npm run report:content-overlap
```

For listening-audio content changes, also run:

```bash
npm run sync:listening-audio-manifest
npm run report:build-status-summary
```

Only run `npm run generate:listening-audio` when a slice intentionally creates new audio-backed listening items and an API key is available.

---

## Content QA Rules

Any new Japanese content must pass a human-readable audit before it is treated as done.

Check:

- The grammar has already been introduced or is intentionally marked as a stretch.
- Vocab is mostly already known for the learner's current chapter.
- Sentences are beginner-clear, not artificially complex.
- Translations are faithful and not over-explained.
- Kana readings match the Japanese.
- Particles and verb forms match the target lesson.
- The content does not introduce hidden N4+ grammar unless explicitly scoped as recognition-only.
- Reading capstones recombine already-seen examples instead of becoming a separate content dump.
- AI-generated drafts are edited into production-quality content before landing.

For each content slice, include a short audit note in the final answer or update doc:

```text
Content audit:
- Grammar scope:
- Vocab scope:
- New/old sentence ratio:
- Known risks:
```

---

## Feature 1: Chapter Capstone Stories

### Product Goal

After a five-pack chapter, give the learner a satisfying wrap-up: a short story, dialogue, or message thread that uses the chapter's practiced grammar and vocab in context.

This steals the best part of graded readers without turning the app into Satori Reader. The capstone is a reward, a transfer check, and a chapter bow.

### Desired UX

- Capstone appears at the end of each five-pack chapter in Missions.
- It is optional but strongly suggested after the chapter's core missions are complete.
- It uses a focused reading/listening workspace:
  - Japanese line first
  - optional audio if available
  - reveal reading
  - reveal meaning
  - tap grammar/vocab chips for short notes
  - answer 2-4 comprehension checks
- Completion counts as chapter reinforcement, not as a new required daily burden unless Today recommends it.

### Data Direction

Add explicit schema instead of overloading current reading checks too much.

Candidate model:

```ts
type CapstoneStory = {
  id: string;
  chapterId: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  sourcePackIds: number[];
  lineIds: string[];
  checkIds: string[];
};

type CapstoneLine = {
  id: string;
  japanese: string;
  reading: string;
  english: string;
  grammarTags: string[];
  vocabTags: string[];
  sourceExampleIds: string[];
  audioRef?: string;
};
```

Keep it separate from `ExampleSentence` if the line is a recombination. Use `sourceExampleIds` to keep it auditable.

### Patch Batches

#### 1A. Capstone Data Model And Loader

Files likely touched:

- `src/lib/content/types.ts`
- `src/lib/content/schemas.ts`
- `src/lib/content/loader.ts`
- `src/content/index.ts`
- new `src/content/capstoneStories.ts`

Acceptance criteria:

- Content loader validates capstone stories and lines.
- No UI uses them yet.
- Reports still pass.
- At least one tiny fixture capstone can be loaded if needed, but do not add the full content set yet.

Next best prompt:

```text
Implement Feature 1A from NEXT_FEATURE_PLAN.md: add the capstone story data model, schema validation, loader wiring, and a minimal hand-reviewed fixture if needed. Do not build UI yet. Keep the patch narrow and run typecheck/build/content reports.
```

#### 1B. Capstone Player V1

Files likely touched:

- `src/features/missions/components/CapstoneStoryPlayer.tsx`
- `src/features/missions/routes/MissionDetailPage.tsx` or a new route if cleaner
- `src/features/missions/routes/MissionsPage.tsx`
- `src/features/missions/lib/missionLibraryStructure.ts`
- `src/styles/global.css`

Acceptance criteria:

- User can open one capstone from Missions.
- Mobile view presents one line/check at a time.
- Reveal flow is progressive.
- Completion persists locally or maps cleanly to existing mission progress if represented as a mission.
- No duplicate navigation or bottom-nav friction is introduced.

Next best prompt:

```text
Implement Feature 1B from NEXT_FEATURE_PLAN.md: build the first capstone story player using the new capstone content model. Keep it mobile-first and single-focus. Wire one capstone into Missions without changing Today recommendations yet. Run typecheck/build and content reports.
```

#### 1C. First Chapter Capstone Content

Scope:

- Add capstone content for packs 1-5 only.
- Use mostly existing examples and vocab.
- Add no new grammar.

Acceptance criteria:

- One capstone story/dialogue for chapter 1.
- 8-12 short lines.
- 3-4 comprehension checks.
- Every new line has source example references.
- Content audit is documented in the final response.

Next best prompt:

```text
Implement Feature 1C from NEXT_FEATURE_PLAN.md: create the first chapter capstone story for packs 1-5 only. Use existing grammar/vocab, sourceExampleIds, and 3-4 checks. Run typecheck/build plus content coverage, reading reuse, progression gaps, and content overlap reports. Include a content audit.
```

#### 1D. Capstone Recommendation Integration

Acceptance criteria:

- Today can recommend a capstone when the relevant chapter is cleared and the capstone is incomplete.
- It should not interrupt urgent Review.
- It should feel like a chapter closeout, not more endless work.

Next best prompt:

```text
Implement Feature 1D from NEXT_FEATURE_PLAN.md: add capstone recommendation logic after a chapter is complete. Preserve Review-first behavior and the finite Today lesson shell. Run typecheck/build and the standard reports.
```

---

## Feature 2: Mission Replay Variants

### Product Goal

Make reinforcement feel fresh. First pass teaches; later passes should use alternate examples, smaller subsets, and recombinations instead of replaying the exact same mission.

### Desired UX

- First clear: normal mission.
- Reinforce pass: shorter, alternate examples/checks where available.
- Later pass: mixed recall or recombination.
- Today explains why the pass is useful.

### Data Direction

Prefer deriving variants from existing content before adding schema. If explicit schema is needed, add it after one derivation experiment.

Candidate variant modes:

- `first-pass`
- `reinforce-alt-examples`
- `weak-point-targeted`
- `chapter-recombination`

### Patch Batches

#### 2A. Replay Variant Audit

Acceptance criteria:

- Inspect mission players and current `reinforce` mode behavior.
- Identify what can be derived without content changes.
- Produce a short implementation note in this file or `BUILD_STATUS.md`.
- No app behavior change required.

Next best prompt:

```text
Implement Feature 2A from NEXT_FEATURE_PLAN.md: audit current reinforce-mode behavior across grammar, listening, output, and reading mission players. Identify the smallest derived replay-variant implementation that avoids schema changes. Update NEXT_FEATURE_PLAN.md with the chosen implementation notes. No behavior change unless trivial.
```

#### 2B. Grammar And Listening Alternate Subsets

Acceptance criteria:

- Reinforce grammar missions use a different deterministic drill subset when possible.
- Reinforce listening missions use a different deterministic listening subset when possible.
- First-pass missions remain unchanged.
- Review weak-point behavior remains unchanged.

Next best prompt:

```text
Implement Feature 2B from NEXT_FEATURE_PLAN.md: add deterministic alternate-subset behavior for reinforce-mode grammar and listening missions. Preserve first-pass and Review behavior. Run typecheck/build and standard content reports.
```

#### 2C. Output And Reading Alternate Subsets

Acceptance criteria:

- Reinforce output missions rotate task subsets where possible.
- Reinforce reading missions rotate checks where possible.
- Today's copy accurately describes short reinforcement.

Next best prompt:

```text
Implement Feature 2C from NEXT_FEATURE_PLAN.md: extend deterministic alternate-subset reinforce behavior to output and reading missions, then audit Today reinforcement copy. Run typecheck/build and standard reports.
```

#### 2D. Chapter Recombination Pass

Acceptance criteria:

- After capstones exist, completed chapter missions can recommend a recombination pass.
- This should reuse capstone/review surfaces when practical.

Next best prompt:

```text
Implement Feature 2D from NEXT_FEATURE_PLAN.md only after Feature 1 and Feature 2B/2C are complete: add a chapter recombination reinforce pass that reuses existing capstone or reading-check surfaces. Keep it optional and Today-friendly.
```

---

## Feature 3: Mistake Explainer Drawer

### Product Goal

Turn wrong answers into narrow useful feedback. The learner should know what they confused, not just that they failed.

### Desired UX

After an incorrect answer:

- show concise feedback near the task
- offer `Why?` or `Explain mistake`
- drawer includes:
  - what the correct answer is doing
  - why the user's answer is wrong or incomplete when detectable
  - one confusion pair or minimal contrast
  - one quick retry suggestion

### Patch Batches

#### 3A. Feedback Taxonomy

Acceptance criteria:

- Define a small typed feedback shape shared by mission and review flows.
- Do not change all mission players yet.

Candidate model:

```ts
type MistakeExplanation = {
  title: string;
  correctPattern: string;
  likelyConfusion?: string;
  explanation: string;
  retryHint: string;
};
```

Next best prompt:

```text
Implement Feature 3A from NEXT_FEATURE_PLAN.md: define a typed mistake-explanation model and local helper utilities for deterministic explanations, starting with particles and common grammar drill types. Do not wire all UI yet. Run typecheck/build.
```

#### 3B. Grammar Mistake Drawer

Acceptance criteria:

- Grammar mission wrong answers can open an explanation drawer.
- Drawer remains compact on mobile.
- Existing feedback and weak-point recording still work.

Next best prompt:

```text
Implement Feature 3B from NEXT_FEATURE_PLAN.md: add the mistake explainer drawer to grammar missions using deterministic explanations where available. Keep it progressive and mobile-first. Run typecheck/build and manually inspect grammar mission flow.
```

#### 3C. Review Mistake Drawer

Acceptance criteria:

- Review retries show the same explanation drawer for grammar misses.
- State resets correctly between retry items.

Next best prompt:

```text
Implement Feature 3C from NEXT_FEATURE_PLAN.md: add the grammar mistake explainer drawer to Review retries without changing Review queue semantics. Run typecheck/build and manually verify item-to-item state reset.
```

#### 3D. Listening, Reading, Output Explanations

Acceptance criteria:

- Listening explains the missed gist/focus point.
- Reading explains the line/check relation.
- Output explains missing token patterns and acceptable variants.
- Keep AI out until deterministic coverage is useful.

Next best prompt:

```text
Implement Feature 3D from NEXT_FEATURE_PLAN.md: expand deterministic mistake explanations to listening, reading, and output surfaces. Keep the drawer compact and reuse the same typed model. Run typecheck/build and standard reports.
```

---

## Feature 4: Daily Gold Star Plus Weekly Shape

### Product Goal

Make daily completion emotionally satisfying without turning the app into empty gamification.

The current weekly tracker exists. This feature makes the reward clearer and more memorable.

### Desired UX

- Today Complete earns a visible gold star for the study day.
- Weekly tracker shows shape:
  - `1 day`: started
  - `3 days`: rhythm
  - `5 days`: strong week
  - `7 days`: perfect week
- Bonus practice does not affect the core gold star.
- No shame copy for missed days.

### Patch Batches

#### 4A. Gold Star Visual Pass

Acceptance criteria:

- Today Complete state clearly shows today's gold star.
- Weekly tracker uses the same completion source as `dailySession`.
- No new progress store unless needed.

Next best prompt:

```text
Implement Feature 4A from NEXT_FEATURE_PLAN.md: polish the Today Complete state and weekly tracker into a clearer gold-star reward using the existing dailySession data. Do not change completion semantics. Run typecheck/build.
```

#### 4B. Weekly Shape Copy And Milestones

Acceptance criteria:

- Weekly tracker summarizes the current week in one short line.
- Milestones are based on completed study days only.
- Copy is encouraging but not noisy.

Next best prompt:

```text
Implement Feature 4B from NEXT_FEATURE_PLAN.md: add compact weekly-shape copy for 1/3/5/7 completed study days using existing daily session data. Keep Today mobile density tight. Run typecheck/build.
```

---

## Feature 5: Personal Focus Tuning

### Product Goal

Let the learner steer the daily loop without breaking the curriculum.

This is personalization before AI: transparent, deterministic, and local.

### Desired UX

Settings or Today offers simple modes:

- Balanced
- More listening
- More output
- Light day
- Class prep
- Weak points first

The mode affects Today recommendation weighting and copy, not mission completion.

### Patch Batches

#### 5A. Preference Store

Acceptance criteria:

- Add a typed local settings store for study preferences.
- Settings page can read/write the preferred focus mode.
- No recommendation behavior change yet.

Next best prompt:

```text
Implement Feature 5A from NEXT_FEATURE_PLAN.md: add a typed local study-preferences store and a compact Settings control for focus mode. Do not change Today recommendations yet. Run typecheck/build.
```

#### 5B. Today Recommendation Weighting

Acceptance criteria:

- Today uses focus mode as a light tie-breaker.
- Review-first stays intact.
- Next unlocked path mission stays protected.
- Support/bonus slot shifts toward the chosen mode.

Next best prompt:

```text
Implement Feature 5B from NEXT_FEATURE_PLAN.md: use study focus mode as a light deterministic tie-breaker in Today recommendations. Preserve Review-first and next-path behavior. Run typecheck/build and inspect Today recommendation states.
```

#### 5C. Focus Mode Today Control

Acceptance criteria:

- Today exposes a small focus-mode control only if it does not crowd the core plan.
- Settings remains the durable configuration surface.

Next best prompt:

```text
Implement Feature 5C from NEXT_FEATURE_PLAN.md: add a compact Today focus-mode affordance that writes to the existing study-preferences store without crowding the finite daily plan. Run typecheck/build and verify mobile layout.
```

---

## Feature 6: Scenario Sim Micro-Missions

### Product Goal

Make the learner use Japanese as action in tiny practical loops.

These are not open chatbots. They are controlled scenario drills built from known grammar/vocab.

### Candidate Scenarios

- introduce yourself in class
- ask where something is
- buy one item
- make a plan
- say you are late
- choose between two options
- explain a simple reason
- say what you want

### Data Direction

Add a new mission type only if it meaningfully differs from output/reading. Otherwise, create scenario missions as structured output missions first.

Candidate scenario model:

```ts
type ScenarioStep = {
  id: string;
  prompt: string;
  expectedMove: 'choose' | 'type' | 'listen' | 'build';
  supportExampleIds: string[];
  acceptableAnswers?: string[];
};
```

### Patch Batches

#### 6A. Scenario Model Decision

Acceptance criteria:

- Decide whether scenario sims are a new mission type or output mission subtype.
- Document the decision in this plan.
- No large implementation yet.

Next best prompt:

```text
Implement Feature 6A from NEXT_FEATURE_PLAN.md: inspect output, reading, and mission type architecture, then decide whether scenario sims should be a new mission type or a structured output subtype. Update NEXT_FEATURE_PLAN.md with the decision and first-slice file targets. No broad implementation yet.
```

#### 6B. First Scenario Sim

Scope:

- One scenario only, likely class self-introduction or convenience-store item request.
- Use existing grammar/vocab.

Acceptance criteria:

- One mobile-first scenario sim can be completed.
- Steps are controlled and short.
- Weak points can be recorded or gracefully skipped with a documented reason.

Next best prompt:

```text
Implement Feature 6B from NEXT_FEATURE_PLAN.md: build one controlled scenario sim using the architecture decision from 6A. Use existing grammar/vocab only. Keep it mobile-first and deterministic. Run typecheck/build and content reports; include a content audit.
```

#### 6C. Scenario Pack Set

Acceptance criteria:

- Add 4-6 small scenario sims across already-covered N5 lanes.
- They should appear as optional chapter/application practice.
- No hidden new grammar.

Next best prompt:

```text
Implement Feature 6C from NEXT_FEATURE_PLAN.md: add a small scenario-sim pack across existing N5 lanes, using only covered grammar/vocab. Wire them into Missions as application practice. Run the full content QA suite and include a content audit.
```

---

## Feature 7: Known/Seen Text Display

### Product Goal

Make reading feel personalized and transparent: the app should know what the learner has seen and adjust display support accordingly.

### Desired UX

Display modes:

- kana support always
- kanji with reading support
- hide readings for seen words
- show grammar/vocab chips for unfamiliar items

Start simple. Do not build a full lexical parser before proving value.

### Patch Batches

#### 7A. Seen Vocab Derivation

Acceptance criteria:

- Derive seen vocab from completed missions and content refs.
- Expose a helper that answers whether a vocab id is seen.
- No UI change yet.

Next best prompt:

```text
Implement Feature 7A from NEXT_FEATURE_PLAN.md: add a deterministic helper that derives seen vocab ids from completed missions and content refs. Do not change UI yet. Run typecheck/build.
```

#### 7B. Reading Support Display Mode

Acceptance criteria:

- Add a local display preference.
- Reading/capstone line component can use it.
- Default behavior preserves current clarity.

Next best prompt:

```text
Implement Feature 7B from NEXT_FEATURE_PLAN.md: add a local reading-display preference and apply it to reading/capstone text rendering in a backwards-compatible way. Preserve default readability. Run typecheck/build and inspect mobile reading flow.
```

#### 7C. Known/Unknown Chips

Acceptance criteria:

- Reading/capstone support can show known/unknown vocabulary chips.
- Chips do not crowd the active task.
- No heavy parsing; rely on explicit content refs where possible.

Next best prompt:

```text
Implement Feature 7C from NEXT_FEATURE_PLAN.md: show compact known/unknown vocab support chips in reading or capstone flows using existing content refs and seen-vocab derivation. Keep the UI tucked behind support where needed. Run typecheck/build.
```

---

## Feature 8: AI Lesson Coach, Not AI Tutor

### Product Goal

Use AI to improve personalization and content quality without making the product an uncontrolled chatbot.

AI should help with:

- drafting capstone stories from known content
- drafting alternate examples
- explaining mistakes
- evaluating typed output beyond token patterns
- optionally evaluating spoken output
- generating class-prep drills

AI should not own:

- mission completion
- curriculum sequencing
- local progress truth
- unreviewed production Japanese content

### Architecture Direction

Start with offline or developer-run scripts before runtime AI.

Preferred order:

1. prompt templates for content drafting
2. local scripts that generate draft JSON/TS in a temporary output
3. human review and schema validation
4. optional runtime coach for explanations/evaluation after deterministic coverage exists

### Patch Batches

#### 8A. AI Content Drafting Protocol

Acceptance criteria:

- Add prompt templates and review checklist for AI-drafted Japanese content.
- Generated drafts must land outside production content until reviewed.
- No runtime AI.

Next best prompt:

```text
Implement Feature 8A from NEXT_FEATURE_PLAN.md: create an AI content drafting protocol under PROMPTS/ that supports capstone stories and alternate examples, including required sourceExampleIds, grammar/vocab constraints, and human review checklist. No runtime AI or production content generation yet.
```

#### 8B. Capstone Draft Script

Acceptance criteria:

- Script can draft a capstone from selected source examples into a review-only file.
- Script does not write directly to production content.
- Requires explicit API key if using OpenAI.
- Fails safely when no key is present.

Next best prompt:

```text
Implement Feature 8B from NEXT_FEATURE_PLAN.md: add a review-only capstone draft script that uses selected source examples and writes draft output outside production content. It must not modify shipped content automatically. Run typecheck/build and document usage.
```

#### 8C. Deterministic-To-AI Mistake Explanation Fallback

Acceptance criteria:

- Runtime AI can explain only when deterministic explanation is unavailable.
- It receives the target grammar, user answer, correct answer, and allowed scope.
- AI output is not used to mark correctness.
- Feature is optional and disabled by default unless API configuration exists.

Next best prompt:

```text
Implement Feature 8C from NEXT_FEATURE_PLAN.md only after deterministic mistake explanations are useful: add an optional AI explanation fallback that never marks correctness and is disabled unless configured. Use official OpenAI docs before coding API details. Run typecheck/build.
```

#### 8D. Typed Output Coach

Acceptance criteria:

- AI can offer feedback on typed output after local evaluation.
- Local token-pattern correctness remains authoritative.
- Feedback is narrow and beginner-safe.

Next best prompt:

```text
Implement Feature 8D from NEXT_FEATURE_PLAN.md only after 8C: add optional AI feedback for typed output responses after local evaluation. Local correctness must remain authoritative. Use official OpenAI docs before coding API details. Run typecheck/build.
```

#### 8E. Voice Coach Spike

Acceptance criteria:

- Research and prototype only.
- Do not add to main daily loop until the UX is proven.
- Evaluate browser microphone permissions, transcription quality, latency, and feedback usefulness.

Next best prompt:

```text
Implement Feature 8E from NEXT_FEATURE_PLAN.md as a spike only: research the smallest browser voice-coach prototype path using current official OpenAI audio docs. Do not wire it into the main app. Produce a recommendation and, if safe, an isolated prototype behind a disabled route or dev-only surface.
```

---

## Recommended Implementation Order

This order maximizes learner value while reducing architecture risk:

1. `1A` capstone data model
2. `1B` capstone player
3. `1C` first chapter capstone
4. `1D` capstone recommendation
5. `2A` replay variant audit
6. `2B` grammar/listening replay variants
7. `2C` output/reading replay variants
8. `3A` feedback taxonomy
9. `3B` grammar mistake drawer
10. `3C` review mistake drawer
11. `3D` other modality explanations
12. `4A` gold star visual pass
13. `4B` weekly shape copy
14. `5A` preference store
15. `5B` Today focus weighting
16. `5C` Today focus control
17. `6A` scenario model decision
18. `6B` first scenario sim
19. `6C` scenario pack set
20. `7A` seen vocab derivation
21. `7B` reading display mode
22. `7C` known/unknown chips
23. `8A` AI content drafting protocol
24. `8B` capstone draft script
25. `8C` optional AI explanation fallback
26. `8D` optional typed output coach
27. `8E` voice coach spike

Gold-star work can move earlier if motivation polish becomes the priority. AI work should not move earlier than deterministic capstones and mistake explanations.

---

## Status Tracker

Use these states:

- `Not started`
- `In progress`
- `Implemented`
- `Verified`
- `Deferred`

| Slice | Status | Notes |
| --- | --- | --- |
| 1A Capstone data model | Not started |  |
| 1B Capstone player V1 | Not started |  |
| 1C First chapter capstone content | Not started |  |
| 1D Capstone recommendation | Not started |  |
| 2A Replay variant audit | Not started |  |
| 2B Grammar/listening replay variants | Not started |  |
| 2C Output/reading replay variants | Not started |  |
| 2D Chapter recombination pass | Not started | Depends on capstones |
| 3A Feedback taxonomy | Not started |  |
| 3B Grammar mistake drawer | Not started |  |
| 3C Review mistake drawer | Not started |  |
| 3D Other modality explanations | Not started |  |
| 4A Gold star visual pass | Not started |  |
| 4B Weekly shape copy | Not started |  |
| 5A Preference store | Not started |  |
| 5B Today focus weighting | Not started |  |
| 5C Today focus control | Not started |  |
| 6A Scenario model decision | Not started |  |
| 6B First scenario sim | Not started |  |
| 6C Scenario pack set | Not started |  |
| 7A Seen vocab derivation | Not started |  |
| 7B Reading support display mode | Not started |  |
| 7C Known/unknown chips | Not started |  |
| 8A AI content drafting protocol | Not started |  |
| 8B Capstone draft script | Not started |  |
| 8C Optional AI explanation fallback | Not started |  |
| 8D Optional typed output coach | Not started |  |
| 8E Voice coach spike | Not started |  |

---

## Generic Continuation Prompt

Use this when starting a new Codex chat:

```text
Context:
This repo is JCHATTR / Japanese OS. Follow constitution.md, PRODUCT_SPEC.md, ROADMAP.md, BUILD_STATUS.md, N5_CURRICULUM_PLAN.md, and NEXT_FEATURE_PLAN.md. Preserve the local-first React + TypeScript architecture. Keep work mobile-first, schema-driven, and narrow.

Task:
Implement the next not-started slice from NEXT_FEATURE_PLAN.md: <slice id and name>.

Constraints:
- Inspect the relevant files first.
- Do not modify unrelated files.
- Do not add dependencies unless necessary and justified.
- Keep mission completion deterministic.
- For Japanese content, use existing grammar/vocab where possible and include a content audit.
- Update NEXT_FEATURE_PLAN.md status only after the slice is implemented and verified.

Acceptance Criteria:
- The slice-specific acceptance criteria in NEXT_FEATURE_PLAN.md are met.
- Existing Today, Missions, Review, Progress, and Settings flows are not broken.
- Required QA commands are run, or any command that cannot run is explicitly reported.

Output:
Summarize changed files, verification, known limitations, and the next best prompt.
```

---

## Stop Conditions

Pause and ask for product direction if:

- a slice requires a backend, auth, sync, or accounts
- a slice would make AI required for normal daily use
- Japanese content needs grammar not yet covered by the curriculum
- recommendation logic would demote urgent Review or hide the next unlocked path mission
- the UI becomes noticeably denser on mobile
- the implementation requires a broad content schema rewrite
- QA reports expose a content or progression regression

