---
story: US-XXX
phase: 7-verification-testing
status: draft
date: YYYY-MM-DD
author: test-engineer
---
# Verification Report — US-XXX

Status vocabulary (use exactly one per check): **PASSED** (executed and succeeded), **FAILED** (executed and failed), **BLOCKED** (could not run; state the cause), **NOT EXECUTED** (not run; state why).

## 1. Verification Summary
(Final status, counts per status, and the main reasons in 3-5 lines.)

## 2. Test Environment
| Item | Value |
|------|-------|
| OS | |
| Runtime / tool versions | |
| Branch and commit | |
| Test, lint, scan commands | |

## 3. Test Execution Details
| # | Command | Exit code | Status | Evidence (captured output, abbreviated) |
|---|---------|-----------|--------|------------------------------------------|

Regression run (full suite):

## 4. Unit Test Results
| TEST | Verifies (REQ/AC) | Scenario | Status | Evidence |
|------|-------------------|----------|--------|----------|

## 5. Integration Test Results
| TEST | Verifies (REQ/AC) | Boundary / API contract | Status | Evidence |
|------|-------------------|-------------------------|--------|----------|

## 6. Negative Test Results
Negative, not-found, missing-field, empty-input/repository, boundary and error-handling scenarios. Mark classes that do not apply as "not applicable" with the reason.
| TEST | Verifies (REQ/AC) | Scenario class | Status | Evidence |
|------|-------------------|----------------|--------|----------|

## 7. Security Scan Results
| Tool | Command | Status | Findings |
|------|---------|--------|----------|

## 8. Dependency Scan Results
| Tool | Command | Status | Findings |
|------|---------|--------|----------|

## 9. Documentation Quality Results
| Check | Status | Evidence / issues |
|-------|--------|-------------------|
| Required sections exist | | |
| Consistent with requirements | | |
| No unsupported functionality documented | | |
| Examples accurate | | |
| Links and references valid | | |
| Known limitations documented | | |

## 10. Requirement-to-Test Traceability Matrix
| REQ/NFR | AC | TEST | Status |
|---------|----|------|--------|

check-traceability.js output:

Coverage gaps:
| REQ/AC | Reason untested | Mitigation |
|--------|-----------------|------------|

## 11. Failed Tests
### DEF-001 — <title> (violates REQ-xxx / AC-xxx-x)
- **Expected:**
- **Actual:**
- **Repro:**
- **Evidence:**

## 12. Known Issues
| Issue | Related REQ | Severity | Status |
|-------|-------------|----------|--------|

Open blocking findings from `06-code-review.md`: none / (list)

## 13. Final Verification Status
**READY FOR PR | NOT READY FOR PR**

READY FOR PR only if all mandatory checks are PASSED and all blocking review findings are resolved. Reasons for NOT READY (if any):
1. 

Human approval is required before PR creation.

## Open Questions
- 

## Assumptions
- 

## Revision History
| Date | Change | Reason |
|------|--------|--------|
