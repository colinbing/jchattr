# Japanese OS Constitution

## 1. Purpose

Japanese OS is a personalized, mission-based Japanese learning app designed for one primary user: Colin.

The product exists to solve one specific problem:

> Traditional Japanese study has produced fragmented recognition, low engagement, weak grammar intuition, and poor transfer into actual listening, reading, and speaking.

Japanese OS must turn Japanese study into short, high-feedback, repeatable training loops that feel closer to solving a system than grinding a textbook.

The MVP goal is not to be a complete language platform.
The MVP goal is to produce a daily-use tool that meaningfully improves beginner Japanese ability and supports a path toward N5-level competence.

---

## 2. Product Principles

1. **Action over passive consumption**
   - The user should predict, build, choose, type, or speak before the answer is revealed.
   - Retrieval is preferred over passive review.

2. **Short loops**
   - Sessions should be broken into small, winnable missions.
   - The user should be able to complete a meaningful session in 10–20 minutes.

3. **Useful beginner Japanese**
   - Content should prioritize practical, comprehensible beginner Japanese.
   - Avoid fake textbook stiffness when more natural beginner phrasing exists.

4. **Grammar is the engine**
   - Japanese is not to be taught as isolated kanji accumulation.
   - Grammar, sentence patterns, and comprehension come first.

5. **Words in context**
   - Vocab should usually appear in phrases or sentences, not as naked dictionary entries.
   - Kanji can be included, but must remain attached to usable language.

6. **Listening before certainty**
   - The app should create moments where the user attempts comprehension before seeing the transcript or answer.

7. **Personal relevance matters**
   - Whenever possible, content should connect to the user’s real interests, routines, and motivations.

8. **Boring engineering, high-quality UX**
   - Prefer simple, reliable architecture over clever complexity.
   - Prefer polished interaction over feature sprawl.

9. **Mobile-first, desktop-capable**
    - The app must feel excellent on a phone first.
    - Desktop support is required, but mobile usability takes priority in MVP decisions.
    - Core flows should be easy to use one-handed, in short sessions, and in portrait orientation.

10. **Single-focus learning screens**
    - A mission screen should have one clear job at a time: learn, try, get feedback, or recap.
    - The active task, its needed hint, and the next action should fit in one focused mobile workspace whenever practical.
    - Support content should be progressive, actionable, and close to the task rather than a long reference block below it.
    - Completion and skill-impact copy belongs after the task, not mixed into the working screen.
    - Every visible line of text should earn its place by helping the learner act, understand feedback, or choose the next step.

---

## 3. Target User

Primary user:
- Colin
- English-speaking beginner Japanese learner
- strong tolerance for system-building and iteration
- low tolerance for vague, passive, textbook-heavy study
- responds well to visible progress, fast feedback, and practical structure
- wants an N5-aligned system that feels engaging enough to return to daily

This product does not need to optimize for all learners in v1.

---

## 4. MVP Promise

The MVP must do the following well:

- present a daily learning loop
- deliver short grammar, listening, and output missions
- save local progress
- track weak points
- use structured content
- feel polished enough to use every day

The MVP does **not** need:
- multiplayer
- community
- social features
- accounts
- cloud sync
- full speech scoring
- full curriculum coverage on day one
- generalized support for every learner type

---

## 5. Non-Negotiable Engineering Rules

1. **TypeScript only**
2. **No broad rewrites without cause**
3. **No adding dependencies without justification**
4. **No hidden magic state**
5. **Components should be small and purposeful**
6. **Data models must be explicit**
7. **Content must be schema-driven**
8. **AI-generated code must remain human-readable**
9. **Local-first architecture for MVP**
10. **Preserve momentum: prefer shippable slices over big-bang implementations**
11. **Responsive by default**
    - No desktop-only layouts in MVP.
    - Touch targets, spacing, and typography must be usable on small screens.

---

## 6. Content Rules

1. Content must be stored in structured formats.
2. Content should be versionable and editable by hand.
3. Grammar content must include:
   - objective
   - explanation
   - examples
   - common mistakes
   - drills
4. Listening content must be beginner-appropriate and intentionally leveled.
5. Example sentences must prefer clarity over novelty.
6. Avoid unnatural “textbook Japanese” unless explicitly being taught as a fixed beginner pattern.
7. Content should be N5-aligned, not “N5 claimed” without structure.
8. No large unreviewed AI dumps directly into production content.

---

## 7. AI Usage Rules

AI is a tool for:
- drafting
- scaffolding
- content generation in small batches
- explaining
- code generation within clear constraints

AI is not trusted by default for:
- large refactors
- full-curriculum generation in one pass
- architecture changes without review
- silently changing scope

All AI work should be bounded by:
- explicit acceptance criteria
- clear file targets
- minimal unrelated edits

---

## 8. Workflow Rules

1. Work in thin vertical slices.
2. Keep a written roadmap.
3. Use prewritten prompts where possible.
4. Preserve the repo’s architecture unless a change is intentional and documented.
5. Creative pivots are allowed, but architecture pivots require a written rationale.
6. Finish the current slice before expanding scope whenever possible.

---

## 9. Definition of Done

A feature is done when:
- it works
- it is typed
- it fits the existing architecture
- it does not introduce obvious regressions
- its UX is coherent
- its content shape is valid
- the next step remains clear

A feature is not done just because code exists.

---

## 10. Initial MVP Boundaries

Included:
- Today screen
- mission player
- grammar mission type
- listening mission type
- output mission type
- local progress tracking
- skill map
- structured starter content

Excluded for now:
- accounts
- cloud sync
- admin CMS
- advanced analytics
- generalized LLM chat tutor
- full pronunciation scoring
- full JLPT coverage beyond initial target packs

---

## 11. Primary Success Criteria

The MVP succeeds if:
- the user wants to come back daily
- the user can complete missions quickly
- the user feels concrete progress in beginner Japanese
- grammar, listening, and output are all represented
- the repo remains easy to extend

---

## 12. Failure Conditions

The MVP is failing if:
- it becomes mostly flashcards
- it becomes mostly chatbot
- it becomes mostly content dumping
- it becomes too broad to finish
- the architecture becomes hard to reason about
- the user stops wanting to use it

---

## 13. Build Philosophy

Make the smallest serious thing.
Then improve it.
Do not try to build the final platform first.
