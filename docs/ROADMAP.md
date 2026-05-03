# Roadmap

## Current Position

The repo is past the original app shell, persistence, review/progress, content expansion, capstone, scenario, preference, and optional AI-boundary slices. The current product is a working local-first beginner study app with a 50-pack content set, structured missions, review, progress, daily session tracking, capstones, and optional scenario/application lanes.

The next phase should focus on verified quality gates and targeted architecture cleanup, not new product sprawl.

## Near-Term Priorities

1. Add CI or an equivalent verified quality gate for typecheck, test, build, and content reports.
2. Re-audit listening hint/scoring semantics so supported exposure remains distinct from mastery.
3. Extract grammar focus/highlight rules out of `GrammarMissionPlayer` if they remain embedded there.
4. Reduce `TodayPage` route/controller complexity while preserving deterministic recommendation behavior.
5. Add guardrails around skill-map/content mapping so new grammar, missions, and weak-point item types cannot silently fall outside progress signals.
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
