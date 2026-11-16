---
name: "SDLC 5 — Implement"
description: "Phase 5: execute the approved implementation plan on a story branch (05-implementation-log.md)."
agent: implementer
argument-hint: "Story ID (e.g. US-001)"
---
Execute SDLC phase 5 (Implementation) for the story given as input, using the `guided-implementation` skill.

- Input documents: `04-implementation-plan.md` — phases 1–4 must be `approved` (refuse and report if not); `02-architecture.md` for contracts.
- Work only on branch `story/<story>-<slug>`; execute tasks in plan order; commit per task with `(TASK-###, REQ-###)` references; verify each task per its verification note.
- Produce source code changes plus `05-implementation-log.md` and the Code column of the traceability matrix.
- If the plan conflicts with reality, STOP that task, record a deviation proposal, and ask — never improvise architecture or add unplanned dependencies.
- Before finishing, validate against the skill's quality checklist; account for every task (done / deferred / blocked).
- Set phase `5-implementation` to `awaiting_approval` and STOP. Do not review your own code.
