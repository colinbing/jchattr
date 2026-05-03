# Roadmap

## Current Position

The repo is past the original app shell, persistence, review/progress, content expansion, capstone, scenario, preference, and optional AI-boundary slices. The current product is a working local-first beginner study app with a 50-pack content set, structured missions, review, progress, daily session tracking, capstones, and optional scenario/application lanes.

The next phase should focus on validating the new quality gate, deciding which remaining risks are worth product work, and keeping architecture cleanup small.

## Near-Term Priorities

1. Push the review branch and confirm pull request CI passes.
2. Decide whether the Vite large chunk warning warrants route-level code splitting.
3. Decide whether scenario/application coverage gaps should become a near-term content roadmap item.
4. Continue Today route/controller cleanup only through narrow, tested, behavior-preserving slices.
5. Extract additional Review/mission UI primitives only when one small duplication clearly justifies it.
6. Keep AI optional and advisory only; do not add browser keys, backend requirements, or AI correctness authority.

## Later Phase Ideas

- More replay variants for completed missions.
- Better scenario promotion path after review-only drafts are audited.
- Stronger content quality dashboards.
- A narrow pronunciation probe only if the existing voice spike proves useful.
- Teacher or lesson-prep helpers only after local-first core quality is stable.
- Cloud sync or accounts only with an explicit architecture decision.

## Not Now

- General AI tutor chat.
- Backend-first rebuild.
- Full speech scoring.
- Broad dependency churn.
- Full curriculum regeneration.
- Any source-code refactor whose only goal is neatness rather than a clear risk reduction.

## Source Of Truth Rule

Current repo reality wins over archived patch plans, old prompts, and historical audit logs. Use active docs first, then inspect current TypeScript, tests, and reports before editing.
