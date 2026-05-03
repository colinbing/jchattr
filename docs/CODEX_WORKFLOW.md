# Codex Workflow

## How To Prompt Codex

Give one narrow slice at a time. Include the relevant active docs, the desired behavior, constraints, acceptance criteria, and required validation commands.

Good prompts name a concrete change. Avoid broad prompts such as "refactor the app" or "improve everything."

## Standard Start

Ask Codex to inspect the repo before editing:

```text
Start by reading README.md, docs/README.md, docs/BUILD_STATUS.md, and the relevant source files. Verify current repo reality before changing code.
```

## Working Rules

- Work one slice at a time.
- Preserve local-first behavior.
- Preserve TypeScript-only implementation.
- Prefer current repo patterns over new abstractions.
- Avoid broad refactors unless the task is explicitly a bounded refactor.
- Do not update docs for every small patch; update active docs only when durable product, architecture, QA, content, or workflow knowledge changes.
- Do not treat archived patch plans as current truth.
- Run validation before reporting done.

## Validation Defaults

For code changes:

```bash
npm run typecheck
npm run test
npm run build
```

For content changes, also run:

```bash
npm run report:content-coverage
npm run report:reading-reuse
npm run report:progression-gaps
npm run report:content-overlap
npm run report:scenario-inventory
```

## When To Stop And Report

Stop and report when:

- the requested slice is implemented and verified
- validation fails for reasons outside the slice
- current repo reality contradicts the prompt in a way that would make implementation risky
- the task would require backend/auth/sync/AI correctness authority or another intentional architecture change
- useful next work is clear but outside the requested slice

## Next Prompt Shape

```text
Context:
This repo is JCHATTR, a local-first React + TypeScript Japanese learning app. Follow README.md and docs/README.md. Current repo reality beats archived patch docs.

Task:
Implement one narrow change: <specific task>.

Constraints:
- Preserve runtime behavior unless explicitly changing it.
- Keep local-first storage.
- Do not add backend/auth/sync/AI grading.
- Keep edits scoped.

Validation:
- npm run typecheck
- npm run test
- npm run build
- Add content reports if content changes.

Output:
Summarize changed files, validation results, risks, and the next best prompt.
```
