---
name: code-review
description: 'SDLC phase 6: review the story branch diff against plan, architecture, and standards; produce CRF findings and a verdict without changing code. Use when reviewing implemented code or producing 06-code-review.md.'
argument-hint: 'Story ID (e.g. US-001)'
---
# Code Review

## Purpose
Independently verify that the implementation is correct, secure, tested, maintainable, dependency-safe and compliant with the architecture and plan, without assuming the implementer is right. Produce actionable findings, not fixes.

## User-facing communication
- Explain findings in plain words: what is wrong or might go wrong, how it affects the user or project, and the next step.
- Do not show unexplained severity labels, file paths, or acronyms as the whole explanation. Include technical details as supporting evidence after the plain-language summary.
- State clearly whether the work can move forward and why.

## Required inputs
- Story branch diff: `git diff main...story/US-###-<slug>` (read-only git only), plus the test code
- `01-requirements.md`, `02-architecture.md`, `04-implementation-plan.md`, `05-implementation-log.md` — phase 5 `awaiting_approval`
- Dependency manifests and lockfiles

## Procedure
1. Verify preconditions. Get the full diff and the commit list (`git log main..story/... --oneline`).
2. **File inventory**: list every changed file; assign each a disposition (`ok` or finding IDs). Review the whole diff, with no sampling.
3. **Plan and architecture conformance**: map each diff hunk to a TASK; map each done-TASK to its diff. Unmapped hunks are unapproved scope (Critical or High). Missing changes for a "done" task are a false completion. Check the code follows `02-architecture.md`, and flag any unapproved design change.
4. Work through the **review checklist** below.
5. **Dependency safety**: review the manifest and lockfile changes. Run available security tooling that does not modify the repository (for example `npm audit`, `pip-audit`, `dotnet list package --vulnerable`) and record the command and output. If no tooling is available, say so; do not claim the dependencies are safe.
6. Record each finding as `CRF-###` with: file and line, severity (Critical/High/Medium/Low), description, evidence, recommended fix, related TASK and requirement IDs, and a type: **confirmed defect** (you can point to the evidence or reproduce it) or **potential risk** (state the condition under which it matters). Never present a potential risk as a confirmed defect.
7. **Decision**: APPROVED (no Critical/High findings open), APPROVED WITH CONDITIONS (specific findings to resolve first), or CHANGES REQUIRED (Critical/High findings, unmet acceptance criteria, or unapproved scope). Never approve on the implementer's say-so.
8. **Escalate Critical findings** (and any secrets found) to the human immediately in chat, not only in the document.
9. Fill [review template](./assets/code-review-template.md) → `06-code-review.md`; set phase `6-code-review` to `awaiting_approval`; stop. Do not merge or create a PR.
10. On re-review after rework: review the delta, re-check prior CRFs, mark each resolved/open.

## Review checklist
1. **Correctness**: requirements met, acceptance criteria satisfied, edge cases handled
2. **Security**: secrets excluded from code and output; user input validated; authentication and authorization correct; injection and access-control risks addressed
3. **Error handling**: API failures, missing files and empty inputs/repositories handled where applicable; useful error messages
4. **Test coverage**: happy paths, not-found cases, missing-field scenarios, boundary cases
5. **Code clarity**: meaningful names, maintainable and understandable logic
6. **DRY and maintainability**: duplicated logic, reusable common functions, unnecessary complexity
7. **Dependency safety**: maintained, no known vulnerabilities found by available tooling, none unnecessary
8. **Architecture compliance**: follows `02-architecture.md`, no unapproved design changes

## Output format
`06-code-review.md` with the template sections: Review Summary, Scope, File inventory, Plan conformance, Findings, Checklist results, Dependency review, Security assessment, Decision.

## Quality checklist
- [ ] Every changed file dispositioned
- [ ] Hunk↔TASK mapping complete in both directions
- [ ] All eight checklist areas assessed, with a result for each
- [ ] Every finding has file:line, severity, description, evidence, fix, related TASK/REQ IDs, and a confirmed/potential type
- [ ] Dependency review states the tooling run and output, or that none was available
- [ ] Decision consistent with findings; no APPROVED with open Critical/High findings
- [ ] Critical findings escalated to the human
- [ ] Zero code modifications made

## Failure handling
- Secrets or dangerous patterns in the diff → Critical finding + immediate human flag.
- Diff too entangled to map to tasks → traceability finding; decision CHANGES REQUIRED.
- Cannot judge correctness without running code → note the limit; recommend specific tests for phase 7 rather than guessing.
- No diff or branch exists → stop and report; do not review from the log alone.

## Example finding
**CRF-004 (High, confirmed defect, security)** — `src/auth/reset.ts:58`: token comparison uses `==` on user input vs stored hash, so it is not constant-time (timing side channel on the REQ-002 surface). Evidence: the line itself. Fix: `crypto.timingSafeEqual`. Related: TASK-003, REQ-002.
