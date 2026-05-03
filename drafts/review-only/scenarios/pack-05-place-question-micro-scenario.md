# Review-Only Scenario Draft — Pack 05 Place Question Check

Status: human-approved and promoted to production content after review.

Promotion target: `src/content/missions.ts` / `mission-scenario-place-question-check`.

This draft remains outside `src/content` as source traceability for the promoted
deterministic scenario/application mission. Promotion did not add AI/chat behavior.

## Target

- Draft id: `draft-scenario-pack-05-place-question-check`
- Candidate mission id: `mission-scenario-place-question-check`
- Candidate scenario id: `scenario-place-question-check-01`
- Target uncovered range: Pack 5 from the scenario inventory report
- Target pack ids: `[5]`
- Candidate setting: `classroom`
- Candidate title: `Scenario: ask where things are`
- Candidate communicative goal: Handle three school-building place moves: ask where the reception desk is, answer where the elevator is, and ask where the stairs are.
- Candidate unlock requirement: `mission-output-where-answers`

## Source Packet

- Grammar lessons:
  - `grammar-where-doko-desu`
  - `grammar-location-answer-places`
- Vocab:
  - `vocab-uketsuke`
  - `vocab-erebeetaa`
  - `vocab-soko`
  - `vocab-kaidan`
  - `vocab-doko-desu`
- Source examples:
  - `ex-uketsuke-wa-doko-desu-ka`: `うけつけはどこですか。` / `うけつけはどこですか。` / Where is the reception desk?
  - `ex-erebeetaa-wa-soko-desu`: `エレベーターはそこです。` / `エレベーターはそこです。` / The elevator is there.
  - `ex-kaidan-wa-doko-desu-ka`: `かいだんはどこですか。` / `かいだんはどこですか。` / Where are the stairs?
- Existing output mission reference:
  - `mission-output-where-answers`

## Candidate Learner Moves

1. Ask where the reception desk is.
2. Answer that the elevator is there.
3. Ask where the stairs are.

## Draft Scenario Shape

```ts
{
  id: 'mission-scenario-place-question-check',
  type: 'output',
  title: 'Scenario: ask where things are',
  targetSkill: 'output-confidence',
  contentRefs: {
    grammarLessonIds: ['grammar-where-doko-desu', 'grammar-location-answer-places'],
    vocabIds: [
      'vocab-uketsuke',
      'vocab-erebeetaa',
      'vocab-soko',
      'vocab-kaidan',
      'vocab-doko-desu',
    ],
    exampleIds: [
      'ex-uketsuke-wa-doko-desu-ka',
      'ex-erebeetaa-wa-soko-desu',
      'ex-kaidan-wa-doko-desu-ka',
    ],
  },
  estimatedMinutes: 5,
  unlockRules: {
    requiredMissionIds: ['mission-output-where-answers'],
  },
  scenario: {
    kind: 'scenario',
    scenarioId: 'scenario-place-question-check-01',
    setting: 'classroom',
    communicativeGoal:
      'Handle three school-building place moves: ask where the reception desk is, answer where the elevator is, and ask where the stairs are.',
    sourcePackIds: [5],
    grammarLessonIds: ['grammar-where-doko-desu', 'grammar-location-answer-places'],
    vocabIds: [
      'vocab-uketsuke',
      'vocab-erebeetaa',
      'vocab-soko',
      'vocab-kaidan',
      'vocab-doko-desu',
    ],
    exampleIds: [
      'ex-uketsuke-wa-doko-desu-ka',
      'ex-erebeetaa-wa-soko-desu',
      'ex-kaidan-wa-doko-desu-ka',
    ],
    steps: [
      {
        id: 'scenario-place-ask-reception',
        actor: 'learner',
        moveType: 'type',
        prompt: 'You arrive at a school building. Ask where the reception desk is.',
        supportExampleIds: ['ex-uketsuke-wa-doko-desu-ka'],
        acceptableAnswers: ['うけつけはどこですか。', 'うけつけはどこですか'],
        requiredTokenPatterns: ['うけつけ', 'は', 'どこ', 'です', 'か'],
        weakPointItemId: 'scenario-place-ask-reception',
      },
      {
        id: 'scenario-place-answer-elevator',
        actor: 'learner',
        moveType: 'type',
        prompt: 'Someone asks about the elevator. Answer that the elevator is there.',
        supportExampleIds: ['ex-erebeetaa-wa-soko-desu'],
        acceptableAnswers: ['エレベーターはそこです。', 'エレベーターはそこです'],
        requiredTokenPatterns: ['エレベーター', 'は', 'そこ', 'です'],
        weakPointItemId: 'scenario-place-answer-elevator',
      },
      {
        id: 'scenario-place-ask-stairs',
        actor: 'learner',
        moveType: 'type',
        prompt: 'Before going upstairs, ask where the stairs are.',
        supportExampleIds: ['ex-kaidan-wa-doko-desu-ka'],
        acceptableAnswers: ['かいだんはどこですか。', 'かいだんはどこですか'],
        requiredTokenPatterns: ['かいだん', 'は', 'どこ', 'です', 'か'],
        weakPointItemId: 'scenario-place-ask-stairs',
      },
    ],
  },
  outputTasks: [
    {
      id: 'scenario-place-ask-reception',
      prompt: 'Type the building question: "Where is the reception desk?"',
      acceptableAnswers: ['うけつけはどこですか。', 'うけつけはどこですか'],
      hint: 'Use うけつけは first, then どこですか.',
      evaluation: {
        tokenPatterns: [['うけつけ', 'は', 'どこ', 'です', 'か']],
      },
    },
    {
      id: 'scenario-place-answer-elevator',
      prompt: 'Type the place answer: "The elevator is there."',
      acceptableAnswers: ['エレベーターはそこです。', 'エレベーターはそこです'],
      hint: 'Use エレベーターは first, then そこです.',
      evaluation: {
        tokenPatterns: [['エレベーター', 'は', 'そこ', 'です']],
      },
    },
    {
      id: 'scenario-place-ask-stairs',
      prompt: 'Type the building question: "Where are the stairs?"',
      acceptableAnswers: ['かいだんはどこですか。', 'かいだんはどこですか'],
      hint: 'Use かいだんは first, then どこですか.',
      evaluation: {
        tokenPatterns: [['かいだん', 'は', 'どこ', 'です', 'か']],
      },
    },
  ],
}
```

## Promotion Checklist

- Confirm `classroom` is the right existing enum setting for a school-building place-check scenario.
- Confirm the draft uses only existing Pack 5 grammar, vocab, and example ids.
- Confirm `vocab-soko` should be included even though `mission-output-where-answers` does not currently list it.
- Confirm `mission-output-where-answers` is the right unlock point.
- Confirm the scenario feels distinct enough from `mission-output-where-answers` to be useful as optional application practice.
- Confirm all scenario step ids match output task ids before promotion.
- Confirm acceptable answers and token patterns mirror exactly between `scenario.steps` and `outputTasks`.
- Confirm weak-point ids are unique and match the mirrored output task ids.
- Confirm Today recommendation scenario exclusion remains unchanged after any future production promotion.
- Run promotion validation if this draft is later moved into production:
  - `npm run typecheck`
  - `npm run test`
  - `npm run build`
  - `npm run report:scenario-inventory`

## Current Inventory Check

After promotion, production scenario inventory should report:

- Scenario missions: 8.
- Covered packs: 14/50.
- Pack 5: `mission-scenario-place-question-check`.
- Remaining uncovered pack ranges begin at Pack 6.

## Promotion Notes

- Human approval recorded in the Codex thread before promotion.
- Promoted as one Pack 5 scenario, not combined with later uncovered packs.
- Promotion intentionally reused the existing deterministic output/scenario mission shape.
- No Today recommendation, daily-session storage, mission-player, runtime dependency, or AI/chat behavior was changed.
