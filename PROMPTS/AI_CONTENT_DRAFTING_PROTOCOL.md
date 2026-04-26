# AI Content Drafting Protocol

## Purpose

This protocol defines how AI may help draft Japanese learning content for this repo without making runtime AI, unreviewed Japanese, or generated files part of production content by default.

Feature 8A is documentation-only. It does not add runtime AI, generation scripts, API calls, or shipped content.

## Non-Negotiables

- AI drafts are not production content.
- Drafts must stay outside `src/content/` until a human review is complete.
- Every drafted Japanese line must be traceable to existing source content.
- Local schemas, typecheck, build, and content reports remain the authority.
- AI must not decide mission completion, learner progress, correctness, sequencing, or review urgency.
- AI must not introduce unapproved grammar, unlinked vocabulary, or hidden N4+ patterns.
- A human must review Japanese naturalness, grammar scope, reading, English meaning, and source traceability before any draft is copied into production content.

## Allowed Drafting Targets

AI may draft review-only material for:

- capstone story variants
- alternate example sentences
- reading/capstone comprehension checks
- scenario support lines
- mistake explanation copy candidates
- class-prep drills based on existing content

AI may not directly edit:

- `src/content/*.ts`
- `src/lib/content/schemas.ts`
- runtime mission players
- progress, recommendation, or review logic

Those files may be edited only by Codex or the user after the draft has passed review.

## Draft Output Location

Generated drafts must be written to a review-only location such as:

- `/tmp/japanese-os-ai-drafts/`
- `drafts/ai-content/`
- pasted into the chat for manual review

Do not import draft files from runtime code. Do not treat a draft directory as shipped content.

`drafts/ai-content/` is gitignored so generated drafts do not enter commits by accident.

## Required Source Packet

Every AI drafting request must include a compact source packet. Do not ask AI to search or infer the curriculum.

Required fields:

```ts
type AiContentDraftSourcePacket = {
  task: 'capstone-story' | 'alternate-examples' | 'reading-checks' | 'scenario-support';
  targetChapterId?: string;
  targetPackIds: number[];
  allowedGrammarLessonIds: string[];
  allowedVocabIds: string[];
  sourceExampleIds: string[];
  sourceExamples: Array<{
    id: string;
    japanese: string;
    reading: string;
    english: string;
    grammarTags: string[];
    vocabTags: string[];
  }>;
  constraints: {
    maxLines?: number;
    maxChecks?: number;
    style: 'source-exact' | 'beginner-natural' | 'alternate-example';
    allowedTenseStyle: 'polite-only' | 'recognition-safe-plain-style';
    learnerLevel: 'N5-beginner';
  };
};
```

## Required Draft Shape

Drafts must be structured, source-auditable, and easy to reject.

Capstone line draft:

```ts
type AiCapstoneLineDraft = {
  draftId: string;
  japanese: string;
  reading: string;
  english: string;
  grammarTags: string[];
  vocabTags: string[];
  sourceExampleIds: string[];
  sourceLineIds?: string[];
  auditNotes: string[];
};
```

Alternate example draft:

```ts
type AiAlternateExampleDraft = {
  draftId: string;
  japanese: string;
  reading: string;
  english: string;
  grammarTags: string[];
  vocabTags: string[];
  sourceExampleIds: string[];
  changedFromSource: string;
  auditNotes: string[];
};
```

Reading check draft:

```ts
type AiReadingCheckDraft = {
  draftId: string;
  lineDraftId: string;
  prompt: string;
  choices: string[];
  answer: string;
  support: string;
  auditNotes: string[];
};
```

## Prompt Template: Capstone Or Story Variant

Use this when drafting a capstone story or naturalized capstone layer.

```text
You are drafting REVIEW-ONLY Japanese learning content for a local-first N5 app.

You must obey these constraints:
- Use only the provided source packet.
- Do not introduce grammar outside allowedGrammarLessonIds.
- Do not introduce vocabulary outside allowedVocabIds unless it already appears in sourceExamples.
- Keep Japanese beginner-natural and Genki-quality.
- Prefer short, clear lines over literary prose.
- Preserve source traceability with sourceExampleIds on every line.
- Include reading and English for every line.
- If uncertain, add an audit note instead of guessing.
- Output structured draft objects only. Do not write production code.

Source packet:
<paste AiContentDraftSourcePacket here>

Task:
Draft <N> capstone lines and <M> comprehension checks.

Return:
- line drafts using AiCapstoneLineDraft shape
- check drafts using AiReadingCheckDraft shape
- an audit summary listing any risk, possible hidden grammar, or non-source vocabulary
```

## Capstone Draft Script

Feature 8B adds a review-only local helper:

```bash
npm run draft:capstone -- --help
```

The script builds an `AiContentDraftSourcePacket` from existing content packs and explicit
`sourceExampleIds`. It writes only to:

- `drafts/ai-content/capstones/`
- `/tmp/japanese-os-ai-drafts/capstones/`

It refuses other output paths and never edits `src/content/`.

Dry-run the source packet without an API call:

```bash
npm run draft:capstone -- --chapter=ch01 --packs=1-5 --examples=ex-colin-desu,ex-student-desu --print-source-packet
```

Generate a review-only draft when ready:

```bash
OPENAI_API_KEY=... npm run draft:capstone -- --chapter=ch01 --packs=1-5 --examples=ex-colin-desu,ex-student-desu --max-lines=6 --max-checks=3
```

If `OPENAI_API_KEY` is absent, the script exits before writing a draft. Generated output remains
unreviewed until the human review checklist and promotion path below are complete.

## Prompt Template: Alternate Examples

Use this when drafting extra examples for practice, reinforcement, or future mission variants.

```text
You are drafting REVIEW-ONLY alternate examples for a local-first N5 app.

You must obey these constraints:
- Use only the provided source packet.
- Preserve the target grammar point.
- Recombine only known vocabulary from allowedVocabIds and sourceExamples.
- Keep each sentence short and beginner-natural.
- Include sourceExampleIds for every draft.
- Do not add kanji beyond the style already present in the source examples.
- Output structured draft objects only. Do not write production code.

Source packet:
<paste AiContentDraftSourcePacket here>

Task:
Draft <N> alternate examples for <grammarLessonId or missionId>.

Return:
- examples using AiAlternateExampleDraft shape
- an audit summary listing any risk, possible hidden grammar, or non-source vocabulary
```

## Human Review Checklist

Before any draft is copied into production content:

- Confirm every `sourceExampleIds` entry exists in `src/content/exampleSentences.ts`.
- Confirm every referenced grammar lesson exists and is appropriate for the target pack/chapter.
- Confirm every referenced vocab item exists or is already present in the source example text.
- Confirm Japanese grammar is correct and N5-safe.
- Confirm Japanese sounds beginner-natural enough for the content purpose.
- Confirm the reading matches the Japanese exactly.
- Confirm the English is faithful, not over-explained.
- Confirm no hidden grammar was introduced by naturalization.
- Confirm no new kanji style was introduced unexpectedly.
- Confirm distractor choices are plausible but unambiguous.
- Confirm support copy explains the intended clue without giving unrelated grammar lessons.
- Confirm IDs follow existing repo naming style.
- Run schema validation through the normal app import path.
- Run typecheck/build when production content or code changes.
- Run standard content reports for production content changes.

## Rejection Rules

Reject or rewrite a draft if:

- any line lacks source traceability
- a line needs grammar not in the allowed list
- a line uses vocabulary not linked to source content
- reading and Japanese do not match
- English meaning is loose or misleading
- the line is only technically correct but unnatural for beginner Japanese
- the draft adds broad content instead of a narrow requested slice
- the draft requires schema changes that were not explicitly planned

## Promotion Path

1. Generate or paste draft output into a review-only location.
2. Run the human review checklist.
3. Manually copy accepted items into production content.
4. Preserve `sourceExampleIds` and audit notes in the implementation summary.
5. Run typecheck/build and the relevant content reports.
6. Update `NEXT_FEATURE_PLAN.md` and `BUILD_STATUS.md`.

## Runtime AI Boundary

Runtime AI is out of scope for Features 8A and 8B.

Feature 8C adds a guarded mistake-explanation fallback contract, but it is disabled by default
and does not call OpenAI directly from the browser. If enabled later, the browser must call a
local/backend proxy endpoint; the OpenAI API key must not be exposed in repo files, browser code,
or checked-in environment files.

Feature 8D adds the same guarded pattern for typed-output coaching after local evaluation.

The frontend configuration for mistake explanations is:

- `VITE_AI_MISTAKE_EXPLANATIONS_ENABLED=true`
- `VITE_AI_MISTAKE_EXPLANATION_ENDPOINT=<local-or-backend-proxy-url>`

The frontend configuration for typed-output coaching is:

- `VITE_AI_OUTPUT_COACH_ENABLED=true`
- `VITE_AI_OUTPUT_COACH_ENDPOINT=<local-or-backend-proxy-url>`

The proxy endpoint should use OpenAI Structured Outputs or equivalent schema validation. OpenAI's
current guidance recommends Structured Outputs over JSON mode when schema adherence matters; JSON
mode only guarantees valid JSON and still requires application validation.

Runtime AI mistake explanations must follow these rules:

- deterministic checks remain authoritative
- AI can run only when no deterministic explanation is available
- AI feedback cannot mark correctness or change review/weak-point state
- AI is disabled unless explicitly configured
- prompts are narrow and beginner-safe
- request payloads include only the current missed item, learner answer, correct answer, allowed
  grammar/vocab scope, and small source/support text
- no broad private local progress data is sent unless the user has explicitly approved that scope
- response shape is validated before display

Typed-output coaching has two extra constraints:

- the request must include the local `OutputEvaluationResult`
- the response may suggest one next retry, but it must not override `isAccepted`, `tone`, weak-point
  recording, mission completion, or review state

Voice coach work is separately scoped as a spike in `PROMPTS/VOICE_COACH_SPIKE.md`. The current
prototype captures local microphone audio only after a user click and does not upload, transcribe,
score, or store speech.
