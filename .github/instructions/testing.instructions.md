---
description: "Use when writing, modifying, or running tests, or producing the test report. Covers test naming, structure, coverage expectations, and traceability annotations."
---
# Testing Rules

- Every test maps to a `REQ` or `AC` ID. Put the reference in the test name or an adjacent comment/annotation, e.g. `test_login_rejects_bad_password  # TEST-004 verifies AC-002-1`.
- Test types expected per story (skip only with a justified note in the test report):
  - Unit tests for each `TASK` touching logic.
  - Integration tests for each component boundary introduced in the architecture.
  - At least one test per acceptance criterion (happy path + the stated failure modes).
- Tests must be deterministic: no reliance on wall-clock timing, network, or ordering unless explicitly mocked/controlled.
- Arrange–Act–Assert structure; one behavior per test; descriptive names stating expected behavior.
- Never weaken or delete a failing test to make a suite pass. A failing test is a finding — record it in `07-test-report.md` and escalate.
- Record every test run's command, exit code, and summary in `07-test-report.md`. Hooks additionally capture runs to `docs/sdlc/audit/test-runs.jsonl`.
- When the tech stack is chosen, document the canonical test command here and keep it current.
