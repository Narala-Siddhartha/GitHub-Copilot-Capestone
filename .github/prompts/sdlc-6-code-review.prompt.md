---
name: "SDLC 6 — Code Review"
description: "Phase 6: review the story branch diff and produce findings (06-code-review.md)."
agent: code-reviewer
argument-hint: "Story ID (e.g. US-001)"
---
Execute SDLC phase 6 (Code Review) for the story given as input, using the `code-review` skill.

- Inputs: the story branch diff vs `main` (read-only git), `04-implementation-plan.md`, `05-implementation-log.md`, `02-architecture.md` — phase 5 must be `awaiting_approval`.
- Produce only `06-code-review.md`: full file inventory, hunk↔TASK conformance mapping, CRF findings with severities and file:line evidence, mandatory security assessment, and a verdict (approve / request-changes). Do not modify any code.
- Before finishing, validate against the skill's quality checklist; confirm every changed file is dispositioned and the verdict matches the findings.
- Report scope creep (diff without a task) and false completions (task without a diff) as blockers.
- Set phase `6-code-review` to `awaiting_approval` and STOP. The human routes rework to the Implementer.
