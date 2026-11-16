---
name: "SDLC 5 — Implement"
description: "Phase 5: execute the approved implementation plan on a story branch (05-implementation-log.md)."
agent: implementer
argument-hint: "Story ID (e.g. US-001)"
---
Execute SDLC phase 5 (Implementation) for the story given as input, using the `guided-implementation` skill.

- Input documents: `01-requirements.md`, `02-architecture.md`, `03-design-review.md` (APPROVED), `04-implementation-plan.md`, and `.github/copilot-instructions.md`. Phases 1–4 must be `approved` (refuse and report if not).
- Work only on branch `story/<story>-<slug>`. Pick the next eligible task (dependencies complete); stop if a dependency is blocked. Propose the approach and obtain human approval before significant or irreversible changes.
- Implement the smallest logical change following repository conventions, with error handling, input validation and secure coding; never hardcode secrets; avoid unnecessary dependencies; keep backward compatibility unless approved. Write unit tests, update docs where necessary, and run formatting, linting and tests.
- Every change references its TASK and requirement IDs (`(TASK-###, REQ-###)` in commits). A task is complete only when its tests pass, standards are met, no critical security issue is introduced, and its acceptance criteria are satisfied.
- Produce source code, unit tests, documentation, the task status in `04-implementation-plan.md` (status field only), `05-implementation-log.md` with a change summary, and the Code column of the traceability matrix.
- If the plan conflicts with reality, STOP that task, record a deviation proposal, and ask. Never improvise architecture, silently change requirements or add unplanned dependencies.
- Before finishing, validate against the skill's quality checklist; account for every task (done / deferred / blocked).
- Set phase `5-implementation` to `awaiting_approval` and STOP. Do not review your own code and do not create the PR.
