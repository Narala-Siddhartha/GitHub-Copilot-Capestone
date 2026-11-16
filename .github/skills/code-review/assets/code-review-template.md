---
story: US-XXX
phase: 6-code-review
status: draft
date: YYYY-MM-DD
author: code-reviewer
---
# Code Review — US-XXX

## 1. Review Summary
(Decision, finding counts by severity and type, the main concerns in 3-5 lines. Critical findings escalated to the human: yes/no.)

## 2. Scope
- **Reviewed range:** main...story/US-XXX-<slug> @ <head sha>
- **Inputs:** requirements, architecture, plan, implementation log, source, tests, dependency manifests and lockfiles
- **Not assessed, and why:**

## 3. File Inventory
| File | Disposition |
|------|-------------|
| | ok / CRF-xxx |

## 4. Plan and Architecture Conformance
| TASK | Diff present? | Follows architecture? | Notes |
|------|---------------|-----------------------|-------|

Diff hunks outside any task (unapproved scope): none / (list)

## 5. Findings
| ID | File:line | Severity | Type | Related TASK/REQ |
|----|-----------|----------|------|------------------|
| CRF-001 | path:line | Critical/High/Medium/Low | confirmed defect / potential risk | TASK-xxx, REQ-xxx |

### CRF-001 — <title>
- **Description:**
- **Evidence:** (the code, test output, or tool output; for a potential risk, the condition under which it matters)
- **Recommended fix:**

## 6. Checklist Results
| Area | Result (pass / findings / not assessed) | Findings |
|------|------------------------------------------|----------|
| Correctness | | |
| Security | | |
| Error handling | | |
| Test coverage | | |
| Code clarity | | |
| DRY and maintainability | | |
| Dependency safety | | |
| Architecture compliance | | |

## 7. Dependency Review
- Manifest/lockfile changes:
- Security tooling run: (command, exit code, output) or "none available"
- Unnecessary dependencies:

## 8. Security Assessment
(Mandatory. Secrets, input validation, authn/authz, injection and access control. Justify "no concerns" if clear.)

## 9. Decision
**APPROVED | APPROVED WITH CONDITIONS | CHANGES REQUIRED**

Rationale:

Conditions / required changes:
1. 

## Open Questions
- 

## Assumptions
- 

## Revision History
| Date | Change | Reason |
|------|--------|--------|
