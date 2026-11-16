---
name: "SDLC 6 — Code Review"
description: "Phase 6: review the story branch diff and produce findings (06-code-review.md)."
agent: code-reviewer
argument-hint: "Story ID (e.g. US-001)"
---
Execute SDLC phase 6 (Code Review) for the story given as input, using the `code-review` skill.

- Inputs: the story branch diff vs `main` (read-only git), test code, dependency manifests and lockfiles, `01-requirements.md`, `02-architecture.md`, `04-implementation-plan.md`, `05-implementation-log.md` — phase 5 must be `awaiting_approval`. If no diff exists, stop and report.
- Review independently; do not assume the implementation is correct. Produce only `06-code-review.md`: file inventory, plan and architecture conformance, findings (file:line, Critical/High/Medium/Low, description, evidence, fix, related TASK/REQ IDs, confirmed defect vs potential risk), results for all eight checklist areas, dependency review (run available audit tooling that does not modify the repo, or say none is available), a security assessment, and a decision (APPROVED / APPROVED WITH CONDITIONS / CHANGES REQUIRED). Do not modify any code.
- Before finishing, validate against the skill's quality checklist; confirm every changed file is dispositioned and the decision matches the findings.
- Escalate Critical findings to the human in chat immediately. Report unapproved scope (diff without a task) and false completions (task without a diff) as findings.
- Set phase `6-code-review` to `awaiting_approval` and STOP. The human routes rework to the Implementer. Never approve automatically; do not merge or create a PR.
