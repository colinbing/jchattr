# jchattr controlled micro-scenario planning patch

## Source baseline

This planning patch starts after the final non-AI hardening pass recorded in
`jchattr_patch_final_non_ai_hardening_before_micro_scenarios.md`.

Phase 6 readiness summary:

- Today plan completion is per-day and per-plan-item.
- Historical mission progress remains separate from Today item completion.
- Review pass copy avoids claiming queue clearance when weak points remain.
- Continue/resume copy matches current grammar/listening/output/reading section IDs.
- Mission players still use deterministic local checks after shared helper extraction.
- Today recommendation tests still protect review, capstone, reinforcement, scenario exclusion, and duplicate-prevention policies.
- Dev fixtures remain dev-only.
- OpenAI SDK use is script-only; browser runtime AI paths are optional endpoint-based advisory surfaces.

Current scenario inventory from `npm run report:scenario-inventory`:

- Scenario missions: 7.
- Covered packs: 13/50.
- Covered settings: classroom 2, meetup 2, health 1, store 1, travel 1.
- Uncovered pack ranges: 5-15, 18-24, 27-35, 37, 39-41, 43, 46-50.

Existing scenario architecture:

- A scenario mission is an `output` mission with `scenario.kind === 'scenario'`.
- Scenario steps are typed learner moves.
- Scenario steps must mirror `outputTasks` exactly for ids, acceptable answers, token patterns, and weak-point ids.
- Runtime evaluation uses the existing deterministic output evaluator through `evaluateScenarioStep`.
- The current `deriveTodayRecommendations(...)` policy intentionally excludes scenario missions from Today recommendations.

## Non-goals

- Do not add AI, chat, agentic tutoring, free-form conversation, or micro-scenario generation.
- Do not add a new scenario player.
- Do not add a new recommendation type.
- Do not change daily-session, review, mission-completion, weak-point, or Today recommendation semantics.
- Do not broaden curriculum content in production before the scenario candidate is reviewed.
- Do not add dependencies.

## Smallest non-AI micro-scenario scope

The smallest safe scope is one review-only design packet for a single missing early pack:

- Target gap: Pack 5.
- Candidate setting: `classroom`.
- Candidate communicative goal: ask and answer one simple place question using already-shipped Pack 5 grammar/vocab/examples.
- Candidate mission shape: 3 typed learner moves, matching the current scenario contract.
- Candidate runtime surface: none in the first slice.

Why Pack 5:

- It is the first uncovered pack after existing scenario coverage for Packs 1-4.
- It can reuse the current output-mission scenario shape without expanding mechanics.
- It keeps the first controlled micro-scenario close to beginner-safe place-question material.
- It avoids touching later travel/store/health packs where content scope is broader.

## Acceptance criteria

Planning acceptance:

- The first slice changes only review/planning files, not `src/` runtime files.
- The selected scenario scope names exact source pack(s), setting, communicative goal, and learner moves.
- The packet lists source grammar, vocab, and example ids to audit before production promotion.
- The packet states unlock expectations but does not wire them into production.
- The packet includes a promotion checklist tied to existing scenario contracts.

Future implementation acceptance, when explicitly requested:

- Add at most one production scenario mission.
- Use only existing schema fields and the existing `OutputMissionPlayer` scenario branch.
- Keep every scenario step mirrored by an output task.
- Use deterministic local output evaluation only.
- Preserve Today recommendation scenario exclusion.
- Preserve daily-session storage and mission completion semantics.
- Add or update focused content/contract tests only.
- Run:
  - `npm run typecheck`
  - `npm run test`
  - `npm run build`
  - `npm run report:scenario-inventory`

Manual QA for future implementation:

- Mission library shows the scenario in the existing Scenarios lane.
- Locked/unlocked copy is coherent.
- Scenario brief renders with setting, goal, move count, and pack range.
- Wrong typed answer stays open for review.
- Correct typed answer advances deterministically.
- Finish-to-Today behavior matches regular output missions.
- Today recommendations do not include the scenario.
- Browser console has no errors.

## First implementation slice

Slice 1 should be review-only and behavior-neutral:

1. Create `drafts/review-only/scenarios/pack-05-place-question-micro-scenario.md`.
2. Fill it with:
   - source pack and source ids,
   - three learner moves,
   - acceptable answer candidates,
   - required token-pattern candidates,
   - weak-point id candidates,
   - unlock candidate,
   - manual promotion checklist.
3. Run `npm run report:scenario-inventory` to confirm current baseline remains unchanged.

Slice 1 must not edit:

- `src/content/missions.ts`
- `src/lib/content/types.ts`
- `src/lib/content/schemas.ts`
- mission players
- Today recommendation modules
- daily-session or progress storage

## Deferred questions

- Which exact Pack 5 examples should be the source of truth for the learner moves?
- Should the scenario be one-pack only, or should a future patch intentionally cover Packs 5-6 as a bridge?
- Should scenario inventory warnings remain informational, or should future CI distinguish planned gaps from accidental gaps?
- Should the existing deferred `passs` pluralization copy issue be fixed before adding more scenario cards?

## Next best prompt

Create the review-only Pack 5 micro-scenario design packet at
`drafts/review-only/scenarios/pack-05-place-question-micro-scenario.md`.
Do not edit runtime code or production content. Use existing Pack 5 grammar,
vocab, and examples only. Include candidate learner moves, acceptable answers,
token patterns, weak-point ids, an unlock candidate, and a promotion checklist.
Run `npm run report:scenario-inventory` and confirm the production scenario
inventory is unchanged.
