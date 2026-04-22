# BUILD STATUS

## Project

- Name: Japanese OS
- Repo: local-first Japanese learning MVP for short daily beginner study loops

## Current Phase / Status

- Phase: late Phase 2, approaching Phase 3
- Status: the core MVP loop is working end-to-end with starter content, local progress, weak-point tracking, and a deterministic review/recommendation loop
- Interpretation: this feels more like a usable internal MVP than a broad content product; content breadth, mission-library depth, and settings/personalization are still thin

## Completed Major Slices

- App shell with mobile-first route structure: Today, Missions, Progress, Review, Settings, Mission detail
- Typed content model with Zod validation and relation checks at load time
- Starter content pack wired through a loader and `byId` indexes
- Today screen with deterministic recommendations and continue-mission resume
- Grammar mission player
- Listening mission player with staged reveal and optional audio playback
- Output mission player with narrow typed-answer checking
- Local mission completion persistence
- Weak-point tracking from incorrect answers
- Review page with focused retry batches
- Progress page with simple skill-map tiers derived from completions and misses

## Current App Capabilities

- User can open Today and get up to 3 recommendations:
  - review first if weak points exist
  - next unlocked incomplete mission
  - one reinforcement / light-pass mission
- User can resume the last active mission from local continue state
- User can complete 6 starter missions across 3 mission types:
  - 2 grammar
  - 2 listening
  - 2 output
- Grammar missions currently include:
  - lesson intro
  - example sentences
  - common mistakes
  - interactive drills
- Listening missions currently include:
  - optional audio player if static file exists
  - staged reveal for transcript, reading, translation, focus point
  - one multiple-choice meaning check per listening item
- Output missions currently include:
  - short prompt
  - optional hint
  - textarea response
  - exact-match evaluation against explicit accepted answers after normalization
- Review loop currently:
  - selects top weak points by miss count, then recency
  - caps batch size at 3
  - decrements or clears weak points on successful retry
- Progress screen currently shows:
  - mission completion totals
  - weak-point totals
  - skill tiers for particles, sentence structure, listening comprehension, output confidence
  - verb forms and reading recognition are explicitly marked as not yet instrumented

## Known Limitations / Gaps

- Content is still small starter content only:
  - 4 grammar lessons
  - 18 example sentences
  - 25 vocab items
  - 9 listening items
  - 6 missions
- Missions page is still a placeholder shell, not a real library/queue
- Settings page is still a placeholder shell; no preference persistence yet
- Mission completion is manual; there is no auto-complete logic
- Continue state restores mission/step only, not in-progress answers
- Output evaluation is strict and narrow; no pattern scoring, partial credit, or AI feedback
- Listening checks are translation-choice only after reveal; no pre-reveal comprehension scoring
- Review loop is deterministic but simple; no spaced repetition, scheduling, or recommendation weighting beyond current heuristics
- Skill map heuristics are intentionally rough and based only on completions + recorded misses
- No dedicated reading mission type or reading-specific checks yet
- No speech input or pronunciation scoring
- No account, sync, backend, analytics, or CMS
- No automated tests are present in the inspected slice

## Next Recommended Slices

1. Turn `/missions` into a real mission library with unlocked/completed/recommended states using existing progress and unlock data.
2. Expand starter content in the current schema before adding new systems, especially more grammar/listening/output packs for repeated daily use.
3. Improve output evaluation without adding broad AI scope: support multiple acceptable patterns, light token/order checking, and clearer local feedback.
4. Deepen the review loop with better retry coverage and review-aware Today recommendations, while keeping heuristics explicit.
5. Add a first real Settings slice for local data reset, audio preferences, and visible content/store version info.
6. Add reading-specific content and instrumentation only after the mission library and content expansion are in place.

## Important Architecture Constraints

- Preserve local-first MVP architecture; there is no backend dependency in the current app loop
- Keep TypeScript-only and avoid adding dependencies without a narrow reason
- Keep content schema-driven and hand-editable
- Content currently lives in TypeScript modules under `src/content`, not JSON or a CMS
- `src/lib/content/loader.ts` validates schema shape, duplicate IDs, and cross-reference integrity at load time
- Progress stores use `useSyncExternalStore` + `localStorage`, not hidden global state
- Recommendation/review logic is intentionally deterministic and readable; avoid opaque adaptive logic unless explicitly requested
- Thin vertical slices fit the repo better than broad refactors

## Local Persistence Keys In Use

- `japanese-os.mission-progress.v1`
- `japanese-os.weak-points.v1`
- `japanese-os.review-loop.v1`
- `japanese-os.continue-state.v1`

## Content-Model Notes

- Mission types: `grammar`, `listening`, `output`
- Target skills: `particles`, `verb-forms`, `sentence-structure`, `listening-comprehension`, `reading-recognition`, `output-confidence`
- Grammar drills support `multiple-choice`, `reorder`, and `fill-in`
- Missions reference content through explicit `contentRefs`
- Output prompts are embedded directly in mission records as `outputTasks`
- Unlock rules currently support `requiredMissionIds`
- Current starter content is beginner/N5-oriented and centered on:
  - topic statements with `は` / `です`
  - place of action with `で`
  - `なんですか` classroom questions
  - destination with `に` + `いきます`

## Audio / TTS Notes

- Listening items may include `audioRef`; current starter listening items all point to static files under `public/audio/listening`
- Matching MP3 files currently exist for all 9 starter listening items
- Listening audio generation script exists at `scripts/generate-listening-audio.ts`
- Current generator uses the OpenAI Speech API with defaults:
  - model `gpt-4o-mini-tts`
  - voice `marin`
  - format `mp3`
- If audio is missing or fails to load, the app falls back to the transcript-first listening flow
- There is no in-app TTS generation or audio preference UI yet

## How To Continue Safely In Codex

- Re-read `constitution.md`, `PRODUCT_SPEC.md`, `ROADMAP.md`, and `PROMPTS/README.md` before changing implementation
- Prefer one thin slice at a time; do not broaden scope into backend, AI tutor, or major architecture changes
- Use repo reality over roadmap assumptions; inspect the current route/component/content files first
- Preserve the existing typed content and local-store patterns unless the task explicitly calls for change
- Avoid unrelated refactors while expanding missions, progress, or review behavior
- When extending content, keep IDs explicit and let the existing loader/schema checks enforce integrity
