---
name: "SDLC 7 — Verify & Test"
description: "Phase 7: write and run requirement-mapped tests and produce the test report (07-test-report.md)."
agent: test-engineer
argument-hint: "Story ID (e.g. US-001)"
---
Execute SDLC phase 7 (Verification & Testing) for the story given as input, using the `verification-testing` skill.

- Input documents: `01-requirements.md` (the contract), `04-implementation-plan.md`, story-branch source — phases 1–6 must be `approved` (refuse and report if not).
- Write tests mapped to acceptance criteria (every test cites its REQ/AC), run the full suite, and record results verbatim. Run `node .github/skills/verification-testing/scripts/check-traceability.js <story>` and include its output.
- Produce test code commits plus `07-test-report.md` and the TEST column of the traceability matrix. Do not modify production code; report defects instead of fixing them.
- Before finishing, validate against the skill's quality checklist; every AC needs a TEST or a justified coverage gap.
- Set phase `7-verification-testing` to `awaiting_approval` and STOP. The human decides on defect routing.
