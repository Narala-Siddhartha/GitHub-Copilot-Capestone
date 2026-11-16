---
name: "SDLC 4 — Implementation Plan"
description: "Phase 4: break the approved design into traceable tasks (04-implementation-plan.md)."
agent: implementation-planner
argument-hint: "Story ID (e.g. US-001)"
---
Execute SDLC phase 4 (Implementation Planning) for the story given as input, using the `implementation-planning` skill.

- Input documents: `01-requirements.md`, `02-architecture.md`, `03-design-review.md` — phases 1–3 must be `approved` (refuse and report if not). Incorporate every approve-with-conditions item.
- Produce only `04-implementation-plan.md` (ordered TASK-### list with REQ/NFR/ADR references, estimates, verification notes) and the TASK column of the traceability matrix. Do not write code.
- Before finishing, validate against the skill's quality checklist; every requirement must map to a task and every task to a requirement.
- Report Open Questions, Assumptions, and risks. If the architecture lacks detail for a concrete task, ask — never invent design decisions.
- Set phase `4-implementation-planning` to `awaiting_approval` and STOP. Do not begin implementation.
