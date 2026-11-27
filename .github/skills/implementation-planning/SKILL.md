---
name: implementation-planning
description: 'SDLC phase 4: decompose an approved architecture into ordered TASK-### items with requirement references, estimates, and verification notes. Use when planning implementation or producing 04-implementation-plan.md.'
argument-hint: 'Story ID (e.g. US-001)'
---
# Implementation Planning

## Purpose
Turn the approved design into an executable contract: a dependency-ordered task list where every task is small, verifiable, and traceable to requirements.

## User-facing communication
- Explain the plan in plain words before showing technical task details.
- When asking for approval or clarification, say what decision is needed, why it matters, and what will happen for each option.
- Summarize the amount and order of work, along with risks and open questions, in everyday language.

## Required inputs
- `01-requirements.md`, `02-architecture.md`, `03-design-review.md` — phases 1–3 `approved`
- Current repository layout (plan file-level changes realistically)

## Procedure
1. Verify phases 1–3 approved and that the decision in `03-design-review.md` is APPROVED; refuse otherwise. Collect its accepted risks; each becomes a task or task constraint where it affects the work.
2. Identify **workstreams**, then walk the component model and break components into small tasks (`TASK-###`). Each task has: description, related REQ/NFR IDs, related architecture components/ADRs, priority, complexity (S/M/L/XL), dependencies, blocked-by, expected files, measurable acceptance criteria, testing requirements (unit and integration), documentation changes, new dependencies if any (name, purpose, license), and a Definition of Done.
3. Prioritize foundational tasks first. Order by dependency (scaffolding → core logic → integration → hardening); never schedule a task before its dependencies. Mark tasks that can run in parallel (shared parallel group) and tasks that are blocked (by an open question or external item).
4. Split any XL task, and any L task touching >5 files or mixing concerns. An XL task that cannot be split needs a recorded justification.
5. Build the **requirements allocation**: every REQ/NFR ↔ ≥1 task; every task ↔ ≥1 requirement. Tasks with no requirement are unapproved scope: delete or raise as a question.
6. **Validate**: no circular dependencies (walk the graph), no missing tasks for any component in the architecture, no unallocated requirements. Record the results in section 6 of the plan.
7. Fill [plan template](./assets/implementation-plan-template.md) → `04-implementation-plan.md`; update the TASK column of the traceability matrix.
8. Run the checklist; set phase `4-implementation-planning` to `awaiting_approval`; present for review and stop. Write no code.

## Output format
`04-implementation-plan.md` with the template sections: Implementation Overview, Workstreams, Task Summary, Task Details, Requirements Allocation, Dependency Graph and Validation, Design-review accepted risks, Risks, Open Questions, Assumptions.

## Quality checklist
- [ ] Every REQ/NFR covered by ≥1 task; no unapproved-scope tasks
- [ ] Every architecture component has tasks
- [ ] Every design-review accepted risk that affects the work mapped to a task or constraint
- [ ] Order respects dependencies; no cycles
- [ ] Parallelizable and blocked tasks clearly identified
- [ ] Every task has measurable acceptance criteria, testing requirements and a Definition of Done
- [ ] File-level impact listed per task (checked against the real repo tree)
- [ ] Unit and integration tests identified; documentation changes identified
- [ ] New dependencies justified

## Failure handling
- Architecture lacks detail needed for a concrete task → Open Question naming the missing decision; do not invent design.
- An accepted risk from the design review conflicts with an ADR → escalate; do not pick a side silently.

## Example task
**TASK-003 — Reset-token persistence (M, P0)**
Implements: REQ-002, ADR-001; component: token store. Dependencies: TASK-001. Parallel with: TASK-004. Files: `src/auth/tokenStore.*`, migration. Acceptance: a created token can be consumed once, and a second consume is rejected. Tests: unit for create/consume/expiry; integration against the store. Docs: none. Deps added: none.
