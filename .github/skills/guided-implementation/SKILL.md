---
name: guided-implementation
description: 'SDLC phase 5: execute an approved implementation plan task by task on a story branch with traceable commits and an implementation log. Use when implementing a planned story or producing 05-implementation-log.md.'
argument-hint: 'Story ID (e.g. US-001)'
---
# Guided Implementation

## Purpose
Execute the approved plan faithfully: working code on a story branch, one task at a time, each verified and committed with traceability, with every deviation recorded and escalated.

## Required inputs
- `04-implementation-plan.md` — phases 1–4 `approved`; `01-requirements.md`, `02-architecture.md`, `03-design-review.md` (decision APPROVED)
- `.github/copilot-instructions.md`, `.github/instructions/source-code.instructions.md` (standards), and existing repository conventions

## Procedure
1. Verify phases 1–4 approved; refuse otherwise.
2. `git switch -c story/US-###-<slug>` (or switch to it if it exists). Never work on `main`.
3. Mirror the task list into a todo list. Then, per task:
   a. **Select** the next eligible task: priority order, with every dependency complete. If its dependency is blocked, or it is itself blocked, STOP and report.
   b. **Read** the related requirements and architecture components, and identify the relevant source files.
   c. **Propose** the implementation approach (files, design within the architecture's contracts). Obtain human approval before significant or irreversible changes (schema or data migrations, public API changes, deletions, new dependencies, anything that breaks backward compatibility).
   d. **Implement** the smallest logical change, following existing project conventions, with appropriate error handling, validation of all user inputs, and secure coding practices. Never hardcode secrets. Keep to DRY, SOLID and clean code where applicable. Do not touch unrelated functionality.
   e. **Test**: write unit tests (each cites the REQ/AC it covers). Update technical documentation where necessary. Run the relevant formatting, linting and tests; all must pass. Never weaken a test to get green.
   f. If reality contradicts the plan or architecture → STOP the task, write a deviation proposal in the log, escalate (see Failure handling).
   g. **Commit**: `feat: <summary> (TASK-###, REQ-###)`, one task (or coherent sub-step) per commit.
   h. **Update status**: set the task's status in `04-implementation-plan.md` (the status field only; nothing else in the plan), append a log entry, and update the Code column of the traceability matrix.
4. A task is complete only when: implementation is complete, relevant tests pass, code follows repository standards, no critical security issue is introduced, and its acceptance criteria are satisfied.
5. After the last task: confirm every task is done / deferred (human-approved) / blocked-with-reason; write the change summary; set phase `5-implementation` to `awaiting_approval`; stop. Do not create the PR.

## Output format
Source code, unit tests, relevant documentation, task status in `04-implementation-plan.md`, and `05-implementation-log.md` ([template](./assets/implementation-log-template.md)): per-task entries (status, files, commits, verification evidence, deviations), an implementation change summary, open questions, assumptions.

## Mandatory rules
- Never modify unrelated functionality, silently change requirements, or introduce unapproved architectural changes.
- Avoid unnecessary dependencies; any addition needs a plan amendment (name, purpose, license).
- Maintain backward compatibility unless explicitly approved.

## Quality checklist
- [ ] All work on the story branch; `main` untouched
- [ ] Every commit references TASK + REQ IDs
- [ ] Every task entry has verification evidence (command output, manual check description)
- [ ] Unit tests written for each task's logic; relevant tests, lint and formatting pass
- [ ] Every acceptance criterion of the task is satisfied
- [ ] Inputs validated, errors handled, no secrets in code, no critical security issue
- [ ] No file changed outside any task's declared scope (or deviation recorded)
- [ ] No new component absent from the architecture
- [ ] Deviations: proposed → human-decided → recorded; never silent

## Failure handling
- **Plan wrong about the codebase** → deviation proposal: what the plan says, what reality is, proposed minimal adjustment. Escalate; proceed only on approval.
- **Needs an unplanned dependency** → stop; dependency additions require plan amendment (name, purpose, license).
- **Build/tests broken beyond the task's scope** → mark task blocked with evidence; never weaken tests or disable checks to get green.

## Log entry example
**TASK-003 — done** · files: `src/auth/tokenStore.ts`, `migrations/002_tokens.sql` · commit `a1b2c3d feat: reset-token store (TASK-003, REQ-002)` · verified: unit round-trip create/consume passes; double-consume rejected. Deviations: none.
