---
name: "sdlc-4-implementation-plan"
description: "Phase 4: break the approved design into traceable tasks (04-implementation-plan.md)."
agent: implementation-planner
argument-hint: "Story ID (e.g. US-001)"
---
Execute SDLC phase 4 (Implementation Planning) for the story given as input, using the `implementation-planning` skill.

- Input documents: `01-requirements.md`, `02-architecture.md`, `03-design-review.md` — phases 1–3 must be `approved` and the design-review decision must be APPROVED (refuse and report if not). Reflect accepted risks in the plan.
- Produce only `04-implementation-plan.md` (workstreams; prioritized, dependency-ordered TASK-### list with REQ/NFR IDs, architecture components, S/M/L/XL complexity, dependencies, blocked-by, expected files, acceptance criteria, testing requirements, documentation changes and Definition of Done) and the TASK column of the traceability matrix. Write no code.
- Planning rules: unique task IDs; foundational tasks first; never schedule a task before its dependencies; identify parallelizable tasks; no unapproved scope.
- Validate: no circular dependencies, no missing tasks, no unallocated requirements; state each result.
- Report Open Questions, Assumptions, and risks. If the architecture lacks detail for a concrete task, ask — never invent design decisions.
- Set phase `4-implementation-planning` to `awaiting_approval` and STOP. Do not begin implementation.
