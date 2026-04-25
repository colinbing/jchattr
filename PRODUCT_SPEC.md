# Japanese OS Product Spec

## 1. Product Summary

Japanese OS is a local-first Japanese learning app for a single primary user. It is designed to replace low-transfer study loops with short, structured missions focused on beginner grammar, vocab in context, listening, and small-scale production.

The app is not a generic language app.
It is a personalized training environment.

---

## 2. Core Problem

Current learning issues:
- too much isolated kanji recognition
- weak grammar foundation
- minimal listening-before-answer
- low engagement with conventional study formats
- insufficient production
- fragmented progress signals

Desired outcome:
- a system the user actually returns to
- meaningful beginner Japanese progress
- readiness for beginner lessons
- a path toward N5-level competence

---

## 3. Target Outcome for MVP

The MVP should allow the user to:
- open the app daily
- see a small set of recommended missions
- complete a session in 10–20 minutes
- review weak areas
- feel visible progress
- use beginner Japanese in small but real ways
- the MVP should work well during short mobile sessions such as commuting, waiting, or quick daily review windows.

---

## 4. Primary User

Colin:
- motivated but easily disengaged by passive or low-feedback study
- likes systems, tools, visible progress, iteration, and practical utility
- comfortable using modern web apps
- open to AI assistance but wants structure and quality

---

## 5. MVP Feature Set

### 5.1 Today Screen
Purpose:
- provide a focused daily entry point

Must show:
- today’s recommended missions
- estimated total session time
- optional quick-start button
- brief progress snapshot
- streak or consistency marker only if it does not dominate the UX

### 5.2 Mission Player
Purpose:
- deliver one mission at a time with clean, fast interaction

Initial mission types:
- grammar mission
- listening mission
- output mission

Must support:
- step-by-step progression
- immediate feedback
- completion state
- next mission transition

Mission UX standard:
- keep the active task, needed hint, feedback, and next action in one focused mobile workspace whenever practical
- keep overview, metadata, and reference material secondary to the active task
- reveal support progressively and close to the task instead of placing large hint/reference blocks below the working area
- make modality-specific support actionable, especially playable support lines inside listening missions when an existing audio asset is available
- reserve recap, saved-progress detail, and skill-impact explanation for the end of the mission

### 5.3 Skill Map
Purpose:
- visualize learning areas in a meaningful way

Initial skill areas:
- particles
- verb forms
- sentence structure
- listening comprehension
- reading recognition
- output confidence

Display style:
- shaky / okay / solid
- or a similar simple tiered system

### 5.4 Review / Weak Points
Purpose:
- surface areas that need reinforcement

Must support:
- recently missed items
- recurring confusion points
- suggested follow-up missions

### 5.5 Local Progress Persistence
Purpose:
- make the app usable without an account

Must persist:
- completed missions
- skill ratings
- recent mistakes
- content exposure state
- preferences if applicable

---

## 6. Mission Design

### 6.1 Grammar Mission
Structure:
1. tiny concept intro
2. one or more worked examples
3. 5–10 active checks
4. one short synthesis or production item

Example task formats:
- choose correct particle
- reorder sentence chunks
- choose correct form
- fill missing word
- meaning discrimination
- translate a short prompt into Japanese with support

### 6.2 Listening Mission
Structure:
1. hear line
2. attempt meaning or identify key structure
3. reveal transcript
4. show gloss / explanation
5. optional second pass

Example task formats:
- choose gist
- select what a particle is doing
- identify verb tense
- match audio to transcript
- decide between two similar meanings

### 6.3 Output Mission
Structure:
1. prompt
2. user types or speaks
3. app evaluates against expected patterns
4. app gives narrow, useful feedback

Initial MVP scope:
- typed response first
- speaking can be added later

---

## 7. Content Model

The app content will be schema-driven.

Initial content categories:
- grammar lessons
- vocab items
- example sentences
- listening lines
- mission definitions
- scenario packs

Content should live in the repo and be easy to inspect and edit.

---

## 8. Suggested Data Shapes

### Grammar Lesson
- id
- title
- objective
- explanation
- prerequisites
- tags
- examples
- commonMistakes
- drills

### Vocab Item
- id
- kana
- kanji
- meaning
- partOfSpeech
- tags
- exampleIds

### Example Sentence
- id
- japanese
- reading
- english
- grammarTags
- vocabTags
- audioRef optional

### Listening Item
- id
- audioRef or text seed
- transcript
- reading
- translation
- focusPoint
- difficulty

### Mission
- id
- type
- title
- targetSkill
- contentRefs
- estimatedMinutes
- unlockRules

### Progress Record
- contentId
- lastSeen
- attempts
- correctCount
- incorrectCount
- confidence
- needsReview

---

## 9. Information Architecture

Primary navigation:
- Today
- Missions
- Progress
- Review
- Settings

Initial route concept:
- `/`
- `/mission/:id`
- `/progress`
- `/review`
- `/settings`

---

## 10. UX Principles

1. Fast entry
2. Low clutter
3. Strong interaction feedback
4. Small steps
5. Clear completion states
6. No overwhelming dashboards
7. No fake productivity bloat
8. Mobile-first interaction
9. Portrait-first design
10. One-handed usability where practical
11. Large tap targets and low-friction inputs

---

## 11. Design Direction

The app should feel:
- clean
- modern
- focused
- lightweight
- motivating without being childish

Avoid:
- mascot-heavy gamification
- noisy gradients everywhere
- fake currency overload
- excessive text density

Mobile navigation should be the primary design target.
Preferred MVP pattern:
- bottom navigation on mobile
- wider nav layout on desktop if useful

Mission screens should prioritize:
- single-column layout
- strong readability
- large touch targets
- fast transitions
- minimal typing burden on phone

---

## 12. Technical Direction

Stack:
- Vite
- React
- TypeScript

Suggested additions:
- Tailwind CSS
- Zod
- Zustand if needed
- React Router
- simple local persistence first

Avoid early use of:
- backend
- auth
- database
- CMS
- large UI dependency stacks unless necessary

---

## 13. Out of Scope for MVP

- accounts
- cloud sync
- collaborative features
- generalized AI tutor chat
- full pronunciation scoring
- teacher dashboard
- mobile app build
- marketplace / community content

---

## 14. Acceptance Criteria for MVP v1

The MVP is acceptable when:
- the app boots cleanly
- the Today screen works
- at least one full daily loop is possible
- local progress is saved and restored
- at least 1 grammar mission type works
- at least 1 listening mission type works
- at least 1 output mission type works
- a skill map exists
- starter content is real and usable
- the codebase is clean enough for further iteration
- Core flows are usable on mobile widths
- Navigation is clean on phone screens
- Mission interactions are touch-friendly

---

## 15. Success Signal

The strongest success signal is not a streak count.

It is:
> “I want to open this tomorrow, and I can feel it is teaching me Japanese better than my old loop.”
