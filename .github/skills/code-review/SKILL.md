---
name: code-review
description: 'SDLC phase 6: review the story branch diff against plan, architecture, and standards; produce CRF findings and a verdict without changing code. Use when reviewing implemented code or producing 06-code-review.md.'
argument-hint: 'Story ID (e.g. US-001)'
---
# Code Review

## Purpose
Independently verify that the implementation is correct, secure, standards-compliant, and exactly matches the approved plan — producing actionable findings, not fixes.

## Required inputs
- Story branch diff: `git diff main...story/US-###-<slug>` (read-only git only)
- `04-implementation-plan.md`, `05-implementation-log.md`, `02-architecture.md` — phase 5 `awaiting_approval`

## Procedure
1. Verify preconditions. Get the full diff and the commit list (`git log main..story/... --oneline`).
2. **File inventory**: list every changed file; assign each a disposition (`ok` or finding IDs). Review the whole diff — no sampling.
3. **Plan conformance**: map each diff hunk to a TASK; map each done-TASK to its diff. Unmapped hunks = scope creep (blocker). Missing changes for a "done" task = false completion (blocker).
4. **Correctness**: logic errors, boundary conditions, error handling, concurrency, resource leaks.
5. **Security (mandatory section)**: input validation at boundaries, parameterized queries, secrets in code/diff, authz on new surfaces, unsafe deserialization/eval.
6. **Standards**: `.github/instructions/source-code.instructions.md` conventions; commit messages carry TASK/REQ IDs; doc comments on public surfaces. Skip pure formatting nitpicks.
7. Record findings as `CRF-###`: severity (blocker/major/minor), category, `file:line`, evidence, recommendation.
8. Verdict: **approve** (no blockers/majors) or **request-changes**. Fill [review template](./assets/code-review-template.md) → `06-code-review.md`; set phase `6-code-review` to `awaiting_approval`; stop.
9. On re-review after rework: review the delta, re-check prior CRFs, mark each resolved/open.

## Output format
`06-code-review.md` per the template: frontmatter, file inventory, plan-conformance table, findings, security assessment, verdict.

## Quality checklist
- [ ] Every changed file dispositioned
- [ ] Hunk↔TASK mapping complete in both directions
- [ ] Security section present (justify "no concerns" if clear)
- [ ] Every finding: severity, category, file:line, evidence, recommendation
- [ ] Verdict consistent with findings; no approve with open blockers
- [ ] Zero code modifications made

## Failure handling
- Secrets or dangerous patterns in the diff → blocker + immediate human flag.
- Diff too entangled to map to tasks → blocker finding (traceability failure); request-changes.
- Cannot judge correctness without running code → note the limit; recommend specific tests for phase 7 rather than guessing.

## Example finding
**CRF-004 (major, correctness)** — `src/auth/reset.ts:58`: token comparison uses `==` on user input vs stored hash without constant-time compare; timing side channel on REQ-002 surface. Recommend `crypto.timingSafeEqual`.
