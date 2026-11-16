---
name: implementation-planning
description: 'SDLC phase 4: decompose an approved architecture into ordered TASK-### items with requirement references, estimates, and verification notes. Use when planning implementation or producing 04-implementation-plan.md.'
argument-hint: 'Story ID (e.g. US-001)'
---
# Implementation Planning

## Purpose
Turn the approved design into an executable contract: a dependency-ordered task list where every task is small, verifiable, and traceable to requirements.

## Required inputs
- `01-requirements.md`, `02-architecture.md`, `03-design-review.md` — phases 1–3 `approved`
- Current repository layout (plan file-level changes realistically)

## Procedure
1. Verify phases 1–3 approved; collect any approve-with-conditions items from `03-design-review.md` — each becomes a task or task constraint.
2. Walk the component model; derive tasks (`TASK-###`) per component/change. Each task: goal, affected files/modules, referenced REQ/NFR/ADR IDs, prerequisite tasks, estimate (S/M/L), verification note ("done when …"), dependency additions (name, purpose, license) if any.
3. Order tasks by dependency; scaffolding → core logic → integration → hardening. No circular prerequisites.
4. Split any task touching >5 files or mixing concerns.
5. Build the **coverage check**: every REQ/NFR ↔ ≥1 task; every task ↔ ≥1 requirement. Orphan tasks are scope creep — delete or raise as a question.
6. Fill [plan template](./assets/implementation-plan-template.md) → `04-implementation-plan.md`; update the TASK column of the traceability matrix.
7. Run the checklist; set phase `4-implementation-planning` to `awaiting_approval`; stop.

## Output format
`04-implementation-plan.md` per the template: frontmatter, task table, per-task details, coverage table, dependency additions, risks, open questions, assumptions.

## Quality checklist
- [ ] Every REQ/NFR covered by ≥1 task; no orphan tasks
- [ ] Every design-review condition mapped to a task
- [ ] Order respects prerequisites; no cycles
- [ ] Every task has a concrete verification note
- [ ] File-level impact listed per task (checked against the real repo tree)
- [ ] New dependencies justified

## Failure handling
- Architecture lacks detail needed for a concrete task → Open Question naming the missing decision; do not invent design.
- Review conditions conflict with an ADR → escalate; do not pick a side silently.

## Example task
**TASK-003 — Reset-token persistence (M)**
Implements: REQ-002, ADR-001. Prereq: TASK-001. Files: `src/auth/tokenStore.*`, migration. Done when: token create/consume round-trip works and consuming twice fails (manual or unit check). Deps added: none.
