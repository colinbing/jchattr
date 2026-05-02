# Review-Only Scenario Draft — Pack 04 Preference Chat

Status: human-reviewed and promoted to production content on 2026-05-02.

Promotion target: `src/content/missions.ts` / `mission-scenario-preference-chat`.

This draft remains outside `src/content` as source traceability for the promoted deterministic scenario/application mission.

## Target

- Draft id: `draft-scenario-pack-04-preference-chat`
- Candidate mission id: `mission-scenario-preference-chat`
- Candidate scenario id: `scenario-preference-chat-01`
- Target uncovered range: Pack 4 from the scenario inventory report
- Target pack ids: `[4]`
- Candidate setting: `meetup`
- Candidate title: `Scenario: ask about simple preferences`
- Candidate communicative goal: Ask one preference question, answer with one liked drink, and ask one follow-up yes/no preference question.
- Candidate unlock requirement: `mission-output-preference-questions`

## Source Packet

- Grammar lessons:
  - `grammar-preference-suki-kirai`
  - `grammar-preference-questions`
- Vocab:
  - `vocab-suki`
  - `vocab-yakyuu`
  - `vocab-nomimono`
  - `vocab-cha`
- Source examples:
  - `ex-nomimono-nani-suki`: `のみものはなにがすきですか。` / `のみものはなにがすきですか。` / What drink do you like?
  - `ex-cha-suki`: `ちゃがすきです。` / `ちゃがすきです。` / I like tea.
  - `ex-yakyuu-ga-suki-desu-ka`: `やきゅうがすきですか。` / `やきゅうがすきですか。` / Do you like baseball?
- Existing output mission reference:
  - `mission-output-preference-questions`

## Draft Scenario Shape

```ts
{
  id: 'mission-scenario-preference-chat',
  type: 'output',
  title: 'Scenario: ask about simple preferences',
  targetSkill: 'output-confidence',
  contentRefs: {
    grammarLessonIds: ['grammar-preference-suki-kirai', 'grammar-preference-questions'],
    vocabIds: ['vocab-suki', 'vocab-yakyuu', 'vocab-nomimono', 'vocab-cha'],
    exampleIds: [
      'ex-nomimono-nani-suki',
      'ex-cha-suki',
      'ex-yakyuu-ga-suki-desu-ka',
    ],
  },
  estimatedMinutes: 5,
  unlockRules: {
    requiredMissionIds: ['mission-output-preference-questions'],
  },
  scenario: {
    kind: 'scenario',
    scenarioId: 'scenario-preference-chat-01',
    setting: 'meetup',
    communicativeGoal:
      'Ask one preference question, answer with one liked drink, and ask one follow-up yes/no preference question.',
    sourcePackIds: [4],
    grammarLessonIds: ['grammar-preference-suki-kirai', 'grammar-preference-questions'],
    vocabIds: ['vocab-suki', 'vocab-yakyuu', 'vocab-nomimono', 'vocab-cha'],
    exampleIds: [
      'ex-nomimono-nani-suki',
      'ex-cha-suki',
      'ex-yakyuu-ga-suki-desu-ka',
    ],
    steps: [
      {
        id: 'scenario-preference-drink-question',
        actor: 'learner',
        moveType: 'type',
        prompt: 'A classmate is choosing a drink. Ask what drink they like.',
        supportExampleIds: ['ex-nomimono-nani-suki'],
        acceptableAnswers: ['のみものはなにがすきですか。', 'のみものはなにがすきですか'],
        requiredTokenPatterns: ['のみもの', 'は', 'なに', 'が', 'すき', 'です', 'か'],
        weakPointItemId: 'scenario-preference-drink-question',
      },
      {
        id: 'scenario-preference-tea-answer',
        actor: 'learner',
        moveType: 'type',
        prompt: 'Answer with one simple line: "I like tea."',
        supportExampleIds: ['ex-cha-suki'],
        acceptableAnswers: ['ちゃがすきです。', 'ちゃがすきです'],
        requiredTokenPatterns: ['ちゃ', 'が', 'すき', 'です'],
        weakPointItemId: 'scenario-preference-tea-answer',
      },
      {
        id: 'scenario-preference-baseball-question',
        actor: 'learner',
        moveType: 'type',
        prompt: 'Ask if the other person likes baseball.',
        supportExampleIds: ['ex-yakyuu-ga-suki-desu-ka'],
        acceptableAnswers: ['やきゅうがすきですか。', 'やきゅうがすきですか'],
        requiredTokenPatterns: ['やきゅう', 'が', 'すき', 'です', 'か'],
        weakPointItemId: 'scenario-preference-baseball-question',
      },
    ],
  },
  outputTasks: [
    {
      id: 'scenario-preference-drink-question',
      prompt: 'Type the preference question: "What drink do you like?"',
      acceptableAnswers: ['のみものはなにがすきですか。', 'のみものはなにがすきですか'],
      hint: 'Start with のみものは, then ask なにがすきですか.',
      evaluation: {
        tokenPatterns: [['のみもの', 'は', 'なに', 'が', 'すき', 'です', 'か']],
      },
    },
    {
      id: 'scenario-preference-tea-answer',
      prompt: 'Type one preference answer: "I like tea."',
      acceptableAnswers: ['ちゃがすきです。', 'ちゃがすきです'],
      hint: 'Use the thing plus が plus すきです.',
      evaluation: {
        tokenPatterns: [['ちゃ', 'が', 'すき', 'です']],
      },
    },
    {
      id: 'scenario-preference-baseball-question',
      prompt: 'Type the yes/no question: "Do you like baseball?"',
      acceptableAnswers: ['やきゅうがすきですか。', 'やきゅうがすきですか'],
      hint: 'Use やきゅうがすきですか.',
      evaluation: {
        tokenPatterns: [['やきゅう', 'が', 'すき', 'です', 'か']],
      },
    },
  ],
}
```

## Human Review Checklist

- Confirm the `meetup` setting is acceptable for this food/hobby preference exchange.
- Confirm `ちゃがすきです。` is acceptable as a first-person answer in the app's current beginner style.
- Confirm no unapproved vocabulary is introduced.
- Confirm the scenario feels distinct enough from `mission-output-preference-questions` to be useful as optional application practice.
- Confirm the unlock point should be after `mission-output-preference-questions`, not only after `mission-grammar-preference-suki-kirai`.
- Confirm weak-point IDs are acceptable and unique before production promotion.

## Promotion Notes

- Human review approved in the Codex thread on 2026-05-02.
- Promoted as one Pack 4 scenario, not combined with Pack 5.
- Production validation and mobile QA results are tracked in `jchattr_patch_02_jp_immersion_stabilization.md`.
