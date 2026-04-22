# BUILD STATUS

## Project

- Name: Japanese OS
- Repo: local-first Japanese learning MVP for short daily beginner study loops

## Current Phase / Status

- Phase: late Phase 2, approaching Phase 3
- Status: the core MVP loop is working end-to-end with starter content, a real mission library, local progress, weak-point tracking, and a deterministic review/recommendation loop
- Interpretation: this now feels like a usable local MVP with repeatable mission flow; the biggest gaps are content breadth and deeper review/personalization, not missing core study surfaces

## Completed Major Slices

- App shell with mobile-first route structure: Today, Missions, Progress, Review, Settings, Mission detail
- Typed content model with Zod validation and relation checks at load time
- Starter content pack wired through a loader and `byId` indexes
- Today screen with deterministic recommendations and continue-mission resume
- Missions page with real library state for recommended, unlocked, locked, completed, and weak-point pressure
- Settings page with local study-data reset controls and listening-audio coverage status
- Grammar mission player
- Listening mission player with staged reveal and optional audio playback
- Output mission player with local rule-based answer checking and short diagnostic feedback
- Reading mission player v1 with Japanese-first comprehension checks and compact reveal
- Reading slice v2 with a second beginner reading mission for simple questions and answers
- Reading slice v3 with a third beginner reading mission for location questions and answers
- Reading slice v4 with a fourth beginner reading mission for preferences and simple opinion questions
- Reading slice v5 with a fifth beginner reading mission for identity and daily routine lines
- Local mission completion persistence
- Weak-point tracking from incorrect answers
- Review page with focused retry batches
- Progress page with simple skill-map tiers derived from completions and misses
- Content expansion pack 3 around existence and room/object locations
- Content expansion pack 4 around likes, dislikes, and simple preference questions
- Content expansion pack 5 around where-questions with `どこですか` and simple location answers
- Content expansion pack 6 around possession and family/object identification with `の`
- Listening-audio manifest workflow with checked-in asset coverage and sync script support

## Current App Capabilities

- User can open Today and get up to 3 recommendations:
  - review first if weak points exist
  - next unlocked incomplete mission
  - one reinforcement / light-pass mission
- User can open Missions and see all current missions with:
  - recommended-today membership
  - unlocked / locked state
  - completed state
  - weak-point pressure by mission
  - plain-language unlock requirements
- User can open Settings and:
  - reset mission progress, weak points, review loop, or continue state independently
  - reset all local study data with explicit confirmation
  - see listening-audio coverage based on a checked-in manifest
- User can resume the last active mission from local continue state
- User can complete 23 starter missions across 4 mission types:
  - 6 grammar
  - 6 listening
  - 6 output
  - 5 reading
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
  - local evaluation with normalization, explicit accepted answers, and token-pattern diagnostics for close answers
- Reading missions currently include:
  - Japanese text shown first
  - one local multiple-choice comprehension decision per line before reveal
  - compact reveal of reading, meaning, and a short support note after submission
- Review loop currently:
  - selects top weak points by miss count, then recency
  - caps batch size at 3
  - decrements or clears weak points on successful retry
  - supports grammar drills, listening checks, output tasks, and reading checks
- Progress screen currently shows:
  - mission completion totals
  - weak-point totals
  - skill tiers for particles, sentence structure, listening comprehension, reading recognition, and output confidence
  - verb forms is still explicitly marked as not yet instrumented
- Current content themes now include:
  - topic statements with `は` / `です`
  - place of action with `で`
  - `なんですか` classroom questions
  - destination with `に` + `いきます`
  - existence with `あります` / `います`
  - room/object position with `の + うえ / した / なか + に`
  - likes and dislikes with `が すきです / きらいです`
  - simple preference questions like `なにがすきですか`
  - where-questions with `どこですか`
  - possession and family/object lines like `これはわたしのほんです` and `それはあねのかばんです`
  - short location answers with `ここ / そこ / あそこ` and existing location phrases
  - simple reading questions and answers like `これはなんですか`, `これはほんです`, and `たべものはなにがすきですか`
  - location-focused reading prompts like `かぎはどこですか`, `トイレはあそこです`, and `せんせいはじむしょにいます`
  - preference-focused reading prompts like `えいががすきですか`, `アニメがすきです`, and `わたしはコーヒーがきらいです`
  - identity and daily-routine reading prompts like `わたしはがくせいです`, `うちでにほんごをべんきょうします`, and `まいにちがっこうにいきます`

## Known Limitations / Gaps

- Content is still small starter content only:
  - 12 grammar lessons
  - 57 example sentences
  - 69 vocab items
  - 29 listening items
  - 23 missions
- Mission completion is manual; there is no auto-complete logic
- Continue state restores mission/step only, not in-progress answers
- Output evaluation is still intentionally narrow; it now supports explicit token-pattern checks and close-answer feedback, but it still does not do broad semantic grading or AI feedback
- Listening checks are translation-choice only after reveal; no pre-reveal comprehension scoring
- Reading slice is still intentionally small: 5 reading missions with 25 total multiple-choice checks, all built from existing example sentences
- Pack 6 listening items are audio-ready in content, but their matching MP3 files are not generated yet
- Review loop is deterministic but simple; no spaced repetition, scheduling, or recommendation weighting beyond current heuristics
- Skill map heuristics are intentionally rough and based only on completions + recorded misses
- No speech input or pronunciation scoring
- Settings is intentionally small; there is still no broader preferences system beyond reset controls and audio status
- No account, sync, backend, analytics, or CMS
- No automated tests are present in the inspected slice

## Next Recommended Slices

1. Generate MP3 files for the 5 new pack-6 listening items so Settings regains full audio coverage for current content.
2. Expand starter content in the current schema before adding new systems, especially more grammar/listening/output packs for repeated daily use.
3. Deepen the review loop with better retry coverage and review-aware Today recommendations, while keeping heuristics explicit.
4. Expand output content using the current token-pattern evaluation path rather than broadening into AI grading.
5. Add verb-form-specific content and checks if Progress needs that skill area to become instrumented.
6. Keep BUILD_STATUS and the listening-audio manifest updated whenever content or generated assets change.

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

- Mission types: `grammar`, `listening`, `output`, `reading`
- Target skills: `particles`, `verb-forms`, `sentence-structure`, `listening-comprehension`, `reading-recognition`, `output-confidence`
- Grammar drills support `multiple-choice`, `reorder`, and `fill-in`
- Missions reference content through explicit `contentRefs`
- Output prompts are embedded directly in mission records as `outputTasks`
- Reading checks are embedded directly in mission records as `readingChecks`
- Output tasks may include optional local evaluation token patterns for more forgiving rule-based checking
- Unlock rules currently support `requiredMissionIds`
- Current starter content is beginner/N5-oriented and centered on:
  - topic statements with `は` / `です`
  - place of action with `で`
  - `なんですか` classroom questions
  - destination with `に` + `いきます`
  - existence with `あります` / `います`
  - position words with `の + うえ / した / なか + に`
  - possession with `noun + の + noun`
  - preferences with `が すきです / きらいです`
  - category questions like `たべものはなにがすきですか`
  - where-questions like `トイレはどこですか`
  - location answers like `トイレはあそこです` and `かぎはつくえのうえにあります`
  - family/object ownership like `これはちちのカメラです` and `それはははのかさです`
  - five reading-recognition missions that reuse existing example sentences for Japanese-first comprehension checks

## Audio / TTS Notes

- Listening items may include `audioRef`; all 29 current listening items point to static files under `public/audio/listening`
- Matching MP3 files currently exist for 24 listening items
- The 5 pack-6 listening items are audio-ready in content but their matching MP3 files are not yet present in `public/audio/listening`
- Settings now reports manifest-backed listening coverage from the current generated asset list, so pack-6 audio will appear as missing until files are generated and the manifest is synced
- Settings derives audio coverage from a checked-in manifest in `src/lib/audio/listeningAudioAssets.ts`, not from runtime filesystem checks
- Listening audio generation script exists at `scripts/generate-listening-audio.ts`
- Manifest sync script exists at `scripts/sync-listening-audio-manifest.ts`
- `npm run generate:listening-audio` now syncs the manifest after a generation run
- `npm run sync:listening-audio-manifest` rewrites the manifest from the current `public/audio/listening` folder
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
- For audio work, check `public/audio/listening` before assuming a referenced `audioRef` file already exists
