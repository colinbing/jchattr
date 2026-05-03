# JCHATTR

JCHATTR is a local-first Japanese learning app for short beginner study loops. It runs as a React + TypeScript Vite app, stores study state in the browser, and uses structured in-repo content for grammar, listening, reading, output, review, progress, and capstone practice.

## Run Locally

```bash
npm install
npm run dev
```

## Validate

```bash
npm run typecheck
npm run test
npm run build
```

Useful content reports:

```bash
npm run report:content-coverage
npm run report:reading-reuse
npm run report:progression-gaps
npm run report:content-overlap
npm run report:scenario-inventory
```

## Documentation

Start with [docs/README.md](docs/README.md). It links the current product, architecture, content, QA, AI boundary, and Codex workflow docs.

Historical patch plans, audits, prompt drafts, and completed implementation notes live in [docs/archive/](docs/archive/). They are not current source of truth.
