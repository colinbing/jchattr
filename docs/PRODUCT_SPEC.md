# Product Spec

## Summary

JCHATTR is a local-first Japanese learning app for short daily beginner practice. It combines a finite Today plan, mission players, weak-point review, progress signals, settings/reset controls, and a structured N5-oriented content set.

## Primary User And Problem

The primary user is an English-speaking beginner who responds well to systems, visible progress, practical feedback, and focused loops, but disengages from passive or vague study.

The product addresses:

- weak grammar foundation
- too much isolated recognition
- too little listening before certainty
- insufficient small-scale production
- fragmented progress signals

## Core Loop

1. Open Today.
2. Start or continue the finite daily lesson.
3. Complete short grammar, listening, reading, output, scenario, or capstone work.
4. Record completion, mastery, weak points, and review state locally.
5. Retry weak points in Review.
6. Use Progress and Settings to inspect or reset local study state.

## Major Surfaces

- Today: daily entry point, date-keyed finite plan, weekly tracker, urgent Review handoff, optional bonus practice, focus-mode affordance.
- Missions: chapter-based mission library, reading lane, capstones, optional scenario lane, locked/unlocked/completed state.
- Mission Player: grammar, listening, output, and reading players with immediate feedback and local completion semantics.
- Review: deterministic retry batch for open weak points, with compact explanations and item-level resolution.
- Progress: skill-area snapshot derived from completions, mastery, and weak-point pressure.
- Settings: local reset controls, study preferences, audio coverage information, disabled spike/boundary details as needed.

## Accepted Scope

- React + TypeScript single-page app.
- Browser localStorage persistence.
- Structured in-repo content.
- Deterministic recommendations, review, grading, and progress derivation.
- Optional dev-only or endpoint-gated AI helpers that cannot affect correctness.
- Static-host deployability for Vercel/Netlify-style SPA rewrites.

## Out Of Scope Unless Intentionally Added

- Accounts, auth, backend sync, or cloud save.
- General chatbot tutor behavior.
- Full speech scoring or realtime voice tutoring.
- Production AI grading.
- Admin CMS.
- Multi-user support.
- Broad architecture rewrites for speculative future needs.
