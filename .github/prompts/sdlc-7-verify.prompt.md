---
name: "SDLC 7 — Verify & Test"
description: "Phase 7: write and run requirement-mapped tests and produce the test report (07-test-report.md)."
agent: test-engineer
argument-hint: "Story ID (e.g. US-001)"
---
Execute SDLC phase 7 (Verification & Testing) for the story given as input, using the `verification-testing` skill.

- Input documents: `01-requirements.md` (the contract), `02-architecture.md`, `04-implementation-plan.md`, `06-code-review.md`, source code and existing tests — phases 1–6 must be `approved` (refuse and report if not).
- Generate missing unit and integration tests (each cites its REQ/AC). Verify positive, negative, not-found, missing-field, empty-input/repository (where relevant), error-handling and API-contract scenarios, and run regression tests, linting and formatting, and available security and dependency scans. Verify the documentation (sections, consistency, no unsupported functionality, accurate examples, valid links, known limitations).
- Capture the actual command output as evidence. Classify every check as PASSED, FAILED, BLOCKED or NOT EXECUTED. Never claim a test passed unless it was executed successfully.
- Run `node .github/skills/verification-testing/scripts/check-traceability.js <story>` and include its output.
- Produce test code commits plus `07-test-report.md` (the verification report, 13 sections) and the TEST column of the traceability matrix. Do not modify production code; report defects instead of fixing them.
- Final decision: READY FOR PR only if all mandatory checks pass and all blocking review findings are resolved; otherwise NOT READY FOR PR with the reasons.
- Set phase `7-verification-testing` to `awaiting_approval` and STOP. Human approval is required before PR creation; do not create the PR.
