# Constitution

## Purpose

JCHATTR is a personalized, mission-based Japanese learning app for one primary beginner learner. It exists to turn fragmented Japanese study into short, high-feedback loops that build grammar intuition, listening comprehension, reading recognition, and small-scale production.

The MVP is not a complete language platform. It is a daily-use local tool that supports practical N5-oriented progress.

## Product Principles

- Action beats passive exposure: the learner should choose, build, type, listen, or recall before answers are revealed.
- Short loops matter: a useful session should fit into 10 to 20 minutes.
- Grammar is the engine: sentence patterns and comprehension come before isolated kanji accumulation.
- Words belong in context: vocab should connect to usable phrases, examples, listening lines, and missions.
- Listening should preserve uncertainty: the learner should hear and try before transcript or meaning reveal when practical.
- Output stays small and honest: typed production should be narrow, supported, and locally evaluated.
- Review should be useful, not punitive: weak points drive focused retry loops and Today pressure.
- The app should be mobile-first and desktop-capable.
- Boring architecture beats clever architecture.
- UX quality matters more than feature count.

## Engineering Principles

- TypeScript only.
- Local-first for the MVP: no backend, account, auth, sync, cloud analytics, or online clock dependency unless intentionally introduced.
- Content is schema-driven, versionable, and inspectable in the repo.
- State models must be explicit and resilient to malformed localStorage data.
- Prefer thin vertical slices over broad rewrites.
- Avoid new dependencies unless they remove real complexity.
- Keep components and feature modules purposeful.
- Preserve current behavior unless the task explicitly changes product behavior.

## Content Principles

- Beginner Japanese should be practical, comprehensible, and natural enough for the task.
- New content must fit the existing grammar/vocab/content refs and validation rules.
- No large unreviewed AI dumps into production content.
- Capstones, scenarios, and reading support must remain source-auditable.
- Listening, grammar, reading, and output should reinforce each other instead of becoming isolated lanes.

## AI Principles

- Deterministic local grading is authoritative.
- AI may draft, explain, or coach only inside clear boundaries.
- AI may not mark answers correct or incorrect, mutate study state, decide mission completion, or override review urgency.
- No OpenAI or other provider API keys in browser code.
- Runtime AI remains optional, disabled by default, and endpoint-gated.

## Definition Of Done

A change is done when it works, is typed, fits the existing architecture, preserves local-first behavior, has appropriate tests or reports for its risk, and leaves the next step clear.
