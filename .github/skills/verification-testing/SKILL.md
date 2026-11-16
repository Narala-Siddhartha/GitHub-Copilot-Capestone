---
name: verification-testing
description: 'SDLC phase 7: write and run tests mapped to acceptance criteria, verify every requirement, produce the test report. Use when verifying a story, writing tests, or producing 07-test-report.md.'
argument-hint: 'Story ID (e.g. US-001)'
---
# Verification & Testing

## Purpose
Prove, with executable evidence, that the implementation satisfies every requirement and acceptance criterion — and surface every defect rather than fixing it.

## Required inputs
- `01-requirements.md` (the verification contract), `04-implementation-plan.md`, story-branch source — phases 1–6 `approved`
- `.github/instructions/testing.instructions.md`

## Procedure
1. Verify phases 1–6 approved; refuse otherwise.
2. Build the **coverage plan**: one row per AC (and per NFR that is verifiable): `TEST-###` → REQ/AC, type (unit/integration/e2e), approach.
3. Write tests on the story branch. Every test carries its IDs in the name or adjacent comment: `// TEST-004 verifies AC-002-1`. Follow Arrange–Act–Assert; deterministic only.
4. Confirm each test can fail: reason through (or spot-check by temporary mutation) that the assertion detects the broken behavior.
5. Run the full suite; record command, exit code, and summary verbatim. Hooks capture runs to `docs/sdlc/audit/test-runs.jsonl` automatically.
6. For each failure: write a **defect** (expected per REQ/AC, actual, repro) — do NOT fix production code.
7. For each AC you cannot test (missing harness, untestable NFR): record a **coverage gap** with reason and suggested mitigation.
8. Run [check-traceability.js](./scripts/check-traceability.js) with `node .github/skills/verification-testing/scripts/check-traceability.js US-###` and include its output in the report.
9. Commit tests (`test: <summary> (TEST-###, AC-###-#)`). Fill [report template](./assets/test-report-template.md) → `07-test-report.md`; update the TEST column of the traceability matrix; set phase `7-verification-testing` to `awaiting_approval`; stop.

## Output format
`07-test-report.md` per the template: frontmatter, coverage table, run results, defects, coverage gaps, traceability-check output.

## Quality checklist
- [ ] Every AC has ≥1 TEST or a justified coverage gap
- [ ] Every TEST cites REQ/AC in code
- [ ] Full-suite results recorded verbatim (no summarizing away failures)
- [ ] Defects reference the violated REQ/AC — none silently fixed
- [ ] No production code modified
- [ ] check-traceability.js output included

## Failure handling
- No test harness exists (stack not set up) → coverage gap for every AC + escalate: the human must approve adding a harness via a plan amendment.
- Flaky test → investigate determinism first; if the product is nondeterministic, that's a defect against the relevant REQ.
- Suite can't run (env/tooling) → record the exact error, escalate; never report untested as passed.

## Example coverage row
| TEST-004 | AC-002-1 | unit | expired token rejected with specific error | PASS |
