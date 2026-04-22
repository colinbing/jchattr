# Japanese OS Roadmap

## Phase 0 — Foundation

Goal:
- lock scope, stack, and workflow

Deliverables:
- Constitution
- Product Spec
- Roadmap
- Prompt workflow doc
- repo scaffold decision
- initial folder structure

Exit criteria:
- stack is locked
- docs are in repo
- first Codex handoff is ready

---

## Phase 1 — App Shell + One Complete Loop

Goal:
- create a usable skeleton with one working daily path

Deliverables:
- Vite + React + TypeScript app scaffold
- base layout
- navigation shell
- Today screen
- Mission player shell
- local persistence
- first content schema
- first content pack
- one grammar mission type
- one listening mission type
- one output mission type
- responsive app shell
- mobile-first navigation
- portrait-friendly mission layouts
- touch-friendly controls

Exit criteria:
- user can complete one session end-to-end
- state persists locally
- content is loaded from structured files

---

## Phase 2 — Progress + Review

Goal:
- turn isolated missions into a learning system

Deliverables:
- skill map
- weak-point tracking
- review surface
- mission completion history
- simple recommendation logic

Exit criteria:
- app can identify what was missed
- app can show what to revisit
- user sees a meaningful sense of growth

---

## Phase 3 — Content Expansion

Goal:
- make the app truly usable for repeated sessions

Deliverables:
- expanded grammar packs
- expanded vocab packs
- expanded listening lines
- more mission templates
- scenario content
- class-prep content
- N5-aligned roadmap coverage plan

Exit criteria:
- user can use app consistently for multiple weeks
- content feels coherent, not random
- major beginner gaps are meaningfully addressed

---

## Phase 4 — Personalization Layer

Goal:
- adapt the app to the user’s strengths, weaknesses, and engagement patterns

Deliverables:
- adaptive mission selection
- confusion pair tracking
- preferred mode weighting
- user interest tagging
- optional custom mission recommendations

Exit criteria:
- app feels increasingly personalized
- recommendation logic improves session relevance

---

## Phase 5 — Optional AI Layer

Goal:
- use AI only where it adds real value

Possible deliverables:
- AI-generated explanation support
- controlled content drafting pipeline
- typed-response evaluation
- optional speaking evaluation
- lesson-prep helper

Exit criteria:
- AI features are additive, not foundational
- app still works without always-on AI dependency

---

## Priority Order

1. Useable product loop
2. Clean architecture
3. Reliable content structure
4. Progress visibility
5. Personalization
6. AI enhancement

---

## Phase 1 Detailed Slice Order

### Slice 1
- scaffold app
- create route structure
- build base layout

### Slice 2
- define content schemas
- add starter content files
- render content in app

### Slice 3
- build Today screen
- build simple daily mission list

### Slice 4
- build grammar mission player

### Slice 5
- build listening mission player

### Slice 6
- build output mission player

### Slice 7
- persist progress locally

### Slice 8
- build progress screen
- build skill map v1

---

## MVP Success Metrics

Qualitative:
- user wants to return daily
- missions feel short and useful
- app feels more effective than isolated Anki study

Product:
- user can finish a session in 10–20 minutes
- progress survives refresh
- weak points are surfaced
- at least a week of content is usable

Engineering:
- repo remains understandable
- new content can be added without code changes
- features are modular enough for further extension

---

## Scope Warnings

These are attractive but dangerous too early:
- full speech scoring
- giant curriculum generation
- backend-first architecture
- overengineered spaced repetition model
- generalized AI tutor chat
- trying to support every learner profile

If one of these appears, ask:
> “Does this directly improve the first serious daily loop?”

If not, it waits.

---

## Decision Gates

### Gate A — After Phase 1
Question:
- is this already usable?

If yes:
- continue iterating

If no:
- fix UX or loop quality before adding more features

### Gate B — After Phase 2
Question:
- does the app feel like a system rather than a demo?

If yes:
- expand content

If no:
- improve review and progress logic

### Gate C — After Phase 3
Question:
- do we need AI now, or do we just need more good content?

Choose based on actual bottlenecks, not novelty.

---

## Long-Term Direction

Long term, Japanese OS may include:
- speech input
- teacher mode
- lesson sync
- cloud save
- broader curriculum coverage
- more advanced personalization

But none of that is required for the MVP to be a success.