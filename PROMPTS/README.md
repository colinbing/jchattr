# Codex Prompt Workflow

## Purpose

This folder exists to keep AI-assisted development controlled, repeatable, and aligned with the repo’s goals.

Codex should be used as a constrained repo-aware engineer, not as an open-ended co-author of the entire product.

---

## Core Rules

1. Always point Codex back to:
   - `constitution.md`
   - `PRODUCT_SPEC.md`
   - `ROADMAP.md`
   - `BUILD_STATUS.md`
   - `NEXT_FEATURE_PLAN.md` for the active next-feature implementation sequence
   - `Japanese_OS_feedback_plan.md` for active Phase 4 feedback triage
   - `N5_CURRICULUM_PLAN.md` only when reopening curriculum/content expansion work

2. Prompts should request:
   - one slice at a time
   - minimal unrelated edits
   - clear acceptance criteria
   - preservation of existing architecture

3. Avoid prompts like:
   - “refactor the app”
   - “improve everything”
   - “make this better”
   - “build the full product”

4. Prefer prompts like:
   - “Implement the Today screen using the existing routing and content structure.”
   - “Add a grammar mission player for the current content schema.”
   - “Persist mission completion state in local storage.”

---

## Standing Rules

- Default to mobile-first responsive implementation unless explicitly told otherwise.
- Design for phone widths first, then scale up for desktop.
- Avoid desktop-only assumptions in layout and interaction design.

---

## Standard Prompt Template

Use this structure:

### Context
- This repo is for Japanese OS, a local-first Japanese learning MVP.
- Follow `constitution.md`, `PRODUCT_SPEC.md`, `ROADMAP.md`, and `BUILD_STATUS.md`.
- For active Phase 4 UX or personalization work, also follow `Japanese_OS_feedback_plan.md`.
- For capstones, replay variants, mistake explanations, gold-star polish, focus tuning, scenario sims, known-content display, or AI coaching work, also follow `NEXT_FEATURE_PLAN.md`.
- For curriculum/content expansion work, also follow `N5_CURRICULUM_PLAN.md`.
- Preserve the current architecture unless the request explicitly says otherwise.

### Task
- Describe one narrow feature or change.

### Constraints
- List specific files or folders to touch if known.
- Do not modify unrelated files.
- Keep code typed and readable.
- Do not add dependencies unless necessary.
- Implement mobile-first responsive UI.
- Ensure the feature works well on small screens in portrait orientation.

### Acceptance Criteria
- List what must be true when the work is done.

### Output Request
- Ask for a summary of what changed.
- Ask for any tradeoffs or follow-up suggestions.



---

## Example Prompt Shape

Context:
This repo is Japanese OS. Follow the repo docs. Preserve the architecture and avoid unrelated edits.

Task:
Implement the initial app shell with a top-level layout and routes for Today, Progress, Review, and Settings.

Constraints:
- Use React + TypeScript.
- Keep the layout simple and modern.
- Do not implement business logic yet.
- Do not add new dependencies unless needed for routing.

Acceptance Criteria:
- App has a shared layout.
- Routes exist and render placeholder pages.
- Navigation works.
- Code is clean and easy to extend.

Output:
Summarize changed files and note any assumptions.

---

## Historical Starter Prompt Sequence

This sequence reflects the original foundation-build path.
It is no longer the active project plan because the app shell, mission loop, persistence, review, progress, content expansion, and current Phase 4 mobile cleanup baseline already exist.

For current work, start from verified repo reality in `BUILD_STATUS.md`.
For Phase 4 feedback cleanup, only choose a new slice from a concrete user-test, mobile-loop audit, or copy/layout finding.
For the next feature phase, choose one slice at a time from `NEXT_FEATURE_PLAN.md`.

### 01
Scaffold the Vite + React + TypeScript app and set up the initial folder structure.

### 02
Add routing and shared app layout.

### 03
Define content schemas and create starter content files.

### 04
Create a content loader layer.

### 05
Build the Today screen using starter content.

### 06
Build grammar mission player v1.

### 07
Build listening mission player v1.

### 08
Build output mission player v1.

### 09
Add local progress persistence.

### 10
Build Progress and Review surfaces.

---

## When to Switch From ChatGPT to Codex

Switch to Codex when:
- the repo exists
- the four foundation docs are in place
- the stack is locked
- you are ready to create or edit actual files

Stay in ChatGPT when:
- shaping the product
- resolving scope
- redefining architecture
- designing content systems
- writing or revising prompts
- deciding whether to pivot

Use both together:
- ChatGPT for planning and prompt design
- Codex for repo-aware implementation

---

## Safe Pivot Policy

If a creative idea appears mid-build:
1. do not immediately rewrite the architecture
2. write the idea down
3. decide whether it is:
   - UX-level
   - content-level
   - system-level
4. only system-level pivots should alter the roadmap

---

## Repo Hygiene Reminders

- Keep features modular.
- Keep content schema-driven.
- Avoid large unreviewed AI patches.
- Prefer vertical slices.
- Finish the current slice before widening scope.

## AI Content Drafting

For any AI-assisted Japanese content drafting, follow
`PROMPTS/AI_CONTENT_DRAFTING_PROTOCOL.md`.

Key boundary:
- AI may draft review-only content.
- AI drafts must stay outside `src/content/` until human review is complete.
- Production Japanese requires source traceability, schema validation, and content QA.
- Runtime AI is not allowed unless a later feature explicitly implements it behind the documented safeguards.
- Runtime mistake-explanation fallback is disabled by default and must use a proxy endpoint, not a browser-exposed OpenAI key.
- Runtime typed-output coaching is also disabled by default and can only offer post-check advice after local evaluation.
- Voice coach work is a spike only. See `PROMPTS/VOICE_COACH_SPIKE.md`; the local prototype route is disabled unless `VITE_VOICE_COACH_SPIKE_ENABLED=true`.

Current review-only helper:

```bash
npm run draft:capstone -- --chapter=ch01 --packs=1-5 --examples=ex-colin-desu,ex-student-desu --print-source-packet
```

Set `OPENAI_API_KEY` only when intentionally generating a draft. Draft files are written under
`drafts/ai-content/capstones/` or `/tmp/japanese-os-ai-drafts/capstones/`, never production content.

---

## Definition of a Good Codex Session

A good Codex session:
- has one narrow goal
- preserves prior work
- ends with a functioning increment, a verified no-change audit, or a clear docs-only reality sync
- makes the next prompt obvious when there is real evidence for one
- does not invent micro-work just to keep the queue moving

That is the standard.
