---
story: US-XXX
phase: 8-pull-request
status: draft
date: YYYY-MM-DD
author: release-manager
---
# Pull Request — US-XXX: <title>

**Head branch:** story/US-XXX-<slug>
**Base branch:** main
**PR URL / status:** (filled after creation: open, draft, checks pending)

## Pre-PR validation
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Requirements approved | | |
| 2 | Architecture approved | | |
| 3 | Design review approved (decision APPROVED) | | |
| 4 | Implementation tasks completed | | |
| 5 | No unresolved blocking code-review findings | | |
| 6 | Verification status READY FOR PR | | |
| 7 | Tests have actual execution evidence | | |
| 8 | No secrets or sensitive files in the diff | | |
| 9 | Changes limited to approved scope | | |

Gate audit:
| Phase | Status | Approved by | Approved at |
|-------|--------|-------------|-------------|
| 1-requirements | | | |
| 2-architecture | | | |
| 3-design-review | | | |
| 4-implementation-planning | | | |
| 5-implementation | | | |
| 6-code-review | | | |
| 7-verification-testing | | | |
| 8-pull-request | | | |

## Summary
(2-3 sentences: what was built and why.)

## Changes Made
| File | Change (added/modified/deleted) | Purpose | TASK / REQ |
|------|---------------------------------|---------|------------|

## Test Evidence
(Actual test output or CI results: command, exit code, pass/fail counts. Link `07-test-report.md`.)

## Known Limitations
- Known Not Found scenarios:
- Unresolved limitations:
- Out-of-scope functionality:

## Reviewer Checklist
- [ ] Requirements compliance
- [ ] Architecture compliance
- [ ] Security
- [ ] Error handling
- [ ] Test coverage
- [ ] Code quality
- [ ] Documentation
- [ ] Dependency safety

## Changelog entry
(The text added to CHANGELOG.md.)

## Traceability chain
US-XXX → REQ → ADR → TASK → code → TEST (link `traceability-matrix.md`; paste check-traceability.js output).

## Documentation
- [01-requirements.md](./01-requirements.md) · [02-architecture.md](./02-architecture.md) · [03-design-review.md](./03-design-review.md) · [04-implementation-plan.md](./04-implementation-plan.md) · [05-implementation-log.md](./05-implementation-log.md) · [06-code-review.md](./06-code-review.md) · [07-test-report.md](./07-test-report.md)

## Open Questions
- 

## Assumptions
- 

## Revision History
| Date | Change | Reason |
|------|--------|--------|
