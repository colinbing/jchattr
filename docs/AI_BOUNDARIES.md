# AI Boundaries

## Runtime Authority

Deterministic local grading is authoritative. AI output cannot mark an answer correct or incorrect, override local evaluation, complete a mission, clear a weak point, change review urgency, or mutate study state.

## Optional Helpers

The repo has optional helper contracts for:

- mistake explanation fallback
- typed output coaching
- review-only content drafting
- disabled dev-only voice coach spike

These are advisory only. The app must still work without them.

## Browser Safety

- No OpenAI API keys in browser code.
- No checked-in provider secrets.
- Browser runtime AI calls must go through an explicitly configured local/backend proxy endpoint.
- Endpoint responses must be schema-validated before display.
- AI helpers are disabled unless env flags and endpoint vars are configured.

## Current Env-Gated Behavior

Mistake explanations:

```text
VITE_AI_MISTAKE_EXPLANATIONS_ENABLED=true
VITE_AI_MISTAKE_EXPLANATION_ENDPOINT=<local-or-backend-proxy-url>
```

Typed output coaching:

```text
VITE_AI_OUTPUT_COACH_ENABLED=true
VITE_AI_OUTPUT_COACH_ENDPOINT=<local-or-backend-proxy-url>
```

Voice coach spike:

```text
VITE_VOICE_COACH_SPIKE_ENABLED=true
```

The voice route is local-dev only, unlinked, and should not upload, transcribe, score, store audio, or affect study state.

## Drafting Boundary

AI may draft review-only content from a constrained source packet. Drafts must remain outside production content until a human reviews Japanese naturalness, reading accuracy, English meaning, grammar scope, vocabulary scope, source traceability, and distractor quality.

Production content remains governed by TypeScript schemas, relation validation, reports, tests, and human review.

## No Backend By Default

Do not introduce a backend only to enable AI. Add backend/proxy infrastructure only after an explicit architecture decision that preserves local-first behavior for the core app.
