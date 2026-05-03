# Content System

## Content Categories

Production content is TypeScript data under `src/content/`:

- grammar lessons
- vocab items
- example sentences
- listening items
- missions
- capstone stories, lines, and checks
- content pack registry/index data

Runtime types live in `src/lib/content/types.ts`. Zod schemas live in `src/lib/content/schemas.ts`.

## Validation

`src/lib/content/loader.ts` parses the full content collection, builds `byId` indexes, and validates relations at import time. It catches duplicate ids, missing referenced examples, missing grammar/vocab/listening refs, invalid mission unlock refs, capstone relation errors, and scenario contract violations.

Scenario-specific contracts live in `src/lib/content/scenarioContracts.ts`.

## Mission Types

- `grammar`: lesson intro, examples, common mistakes, and drills.
- `listening`: audio/transcript/reading/translation/focus-point checks.
- `output`: typed answer tasks with acceptable answers and optional token patterns.
- `reading`: comprehension checks linked to example sentences.

Scenario missions are output missions with structured scenario metadata. Capstones have their own story/line/check structures and route.

## Content Expansion Rules

- Add content in narrow reviewed batches.
- Keep ids consistent with existing naming.
- Wire refs explicitly; do not rely on loose string matching.
- Keep beginner scope honest and N5-oriented.
- Reuse existing examples, vocab, and grammar where possible before inventing new lanes.
- Preserve source traceability for capstones, scenarios, and AI-assisted drafts.
- Do not copy generated drafts into production content without human review.

## AI-Assisted Drafting

AI may create review-only drafts, but production content must still be manually promoted into `src/content/`. Drafts must include source examples, allowed grammar/vocab scope, readings, English, and audit notes. Generated drafts should stay outside production content and should not be imported by runtime code.

## Listening Audio

Generated listening audio assets live under `public/audio/listening/` and conventionally use:

```text
/audio/listening/<listening-item-id>.mp3
```

Useful commands:

```bash
npm run generate:listening-audio
npm run sync:listening-audio-manifest
```

Optional generation settings include `LISTENING_TTS_VOICE` and `LISTENING_TTS_MODEL`. If audio files are missing, the app falls back to non-audio listening flow.

## Content Reports

Run these after production content changes:

```bash
npm run report:content-coverage
npm run report:reading-reuse
npm run report:progression-gaps
npm run report:content-overlap
npm run report:scenario-inventory
```

Use `npm run report:build-status-summary` to refresh high-level counts before updating build-status docs.
