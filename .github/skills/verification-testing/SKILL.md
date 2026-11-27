---
name: verification-testing
description: 'SDLC phase 7: write and run tests mapped to acceptance criteria, verify every requirement, produce the test report. Use when verifying a story, writing tests, or producing 07-test-report.md.'
argument-hint: 'Story ID (e.g. US-001)'
---
# Verification & Testing

## Purpose
Verify the complete implementation against the approved requirements, with executable evidence, and identify regressions. Surface every defect rather than fixing it, and never report a result that was not actually obtained.

## User-facing communication
- Explain test results in everyday words. Say what works, what failed, and what the failure means; do not rely on test names, exit codes, or acronyms alone.
- If something could not be checked, say what was not checked and why.
- End with a clear result: ready to continue, not ready, or blocked, followed by the reason and next step.

## Required inputs
- `01-requirements.md` (the verification contract), `02-architecture.md` (API contracts), `04-implementation-plan.md`, `06-code-review.md`, story-branch source and existing tests — phases 1–6 `approved`
- `.github/instructions/testing.instructions.md`

## Procedure
1. Verify phases 1–6 approved; refuse otherwise. Note any open conditions or findings from `06-code-review.md`; they feed the final decision.
2. Record the **test environment**: OS, runtime and tool versions, and the commands used. Check that a test harness exists; if not, see Failure handling.
3. Build the **coverage plan**: one row per AC (and per verifiable NFR): `TEST-###` → REQ/AC, type (unit/integration/e2e), scenario class (positive, negative, not found, missing field, empty input/repository, error handling, boundary), approach. Include only scenario classes the requirements make relevant; mark any class that does not apply as "not applicable" with the reason.
4. **Generate missing unit tests and integration tests** on the story branch. Every test carries its IDs in the name or adjacent comment: `// TEST-004 verifies AC-002-1`. Follow Arrange–Act–Assert; deterministic only. Verify **API contracts** against `02-architecture.md`.
5. Confirm each test can fail: reason through (or spot-check by temporary mutation, reverted afterwards) that the assertion detects the broken behavior.
6. **Run**, capturing the exact command, exit code and output of each: the full test suite (this includes regression tests), formatting and lint checks, and available security and dependency scans (for example `npm audit`, `pip-audit`). Hooks also capture test runs to `docs/sdlc/audit/test-runs.jsonl`.
7. **Verify documentation**: required sections exist; content matches the requirements; nothing unsupported is documented; examples are accurate (run them if runnable); links and references resolve; known limitations are documented.
8. Classify every check with exactly one status: **PASSED** (executed and succeeded), **FAILED** (executed and failed), **BLOCKED** (could not run because of a dependency, environment or defect; state the cause), **NOT EXECUTED** (not run; state why). Never write PASSED for anything that was not executed successfully.
9. For each failure: write a **defect** (expected per REQ/AC, actual, repro, evidence), and do NOT fix production code. For each AC you cannot test, record a **coverage gap** with reason and mitigation.
10. Run `node .github/skills/verification-testing/scripts/check-traceability.js US-###` and include its output.
11. Commit tests (`test: <summary> (TEST-###, AC-###-#)`). Fill [report template](./assets/test-report-template.md) → `07-test-report.md`; update the TEST column of the traceability matrix.
12. **Final status**: READY FOR PR only if every mandatory check is PASSED (tests, lint/format, traceability) and all blocking findings from phase 6 are resolved. Otherwise NOT READY FOR PR, listing each reason. Set phase `7-verification-testing` to `awaiting_approval`; stop. Human approval is required before PR creation.

## Output format
`07-test-report.md` with the template sections: Verification Summary, Test Environment, Test Execution Details, Unit Test Results, Integration Test Results, Negative Test Results, Security Scan Results, Dependency Scan Results, Documentation Quality Results, Requirement-to-Test Traceability Matrix, Failed Tests, Known Issues, Final Verification Status.

## Quality checklist
- [ ] Every AC has ≥1 TEST or a justified coverage gap
- [ ] Every TEST cites REQ/AC in code
- [ ] Every result has a status of PASSED, FAILED, BLOCKED or NOT EXECUTED, with the captured command output as evidence
- [ ] No PASSED without a successful execution; unrun checks are NOT EXECUTED
- [ ] Regression suite, lint/format, security and dependency scans each run or explicitly marked BLOCKED/NOT EXECUTED with the reason
- [ ] Documentation verification completed and recorded
- [ ] Defects reference the violated REQ/AC; none silently fixed
- [ ] No production code modified
- [ ] check-traceability.js output included
- [ ] READY FOR PR only if all mandatory checks pass and phase 6 blocking findings are resolved

## Failure handling
- No test harness exists (stack not set up) → mark the affected checks BLOCKED, record a coverage gap for every AC, and escalate. The human must approve adding a harness via a plan amendment. The final status is NOT READY FOR PR.
- Flaky test → investigate determinism first; if the product is nondeterministic, that is a defect against the relevant REQ.
- Suite or scanner can't run (environment/tooling) → record the exact error, mark BLOCKED, escalate; never report untested as passed.

## Example coverage row
| TEST-004 | AC-002-1 | unit | negative | expired token rejected with specific error | PASSED (`npm test`, exit 0) |
