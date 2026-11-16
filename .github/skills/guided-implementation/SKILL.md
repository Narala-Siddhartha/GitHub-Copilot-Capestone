---
name: guided-implementation
description: 'SDLC phase 5: execute an approved implementation plan task by task on a story branch with traceable commits and an implementation log. Use when implementing a planned story or producing 05-implementation-log.md.'
argument-hint: 'Story ID (e.g. US-001)'
---
# Guided Implementation

## Purpose
Execute the approved plan faithfully: working code on a story branch, one task at a time, each verified and committed with traceability, with every deviation recorded and escalated.

## Required inputs
- `04-implementation-plan.md` — phases 1–4 `approved`
- `02-architecture.md` (contracts), `.github/instructions/source-code.instructions.md` (standards)

## Procedure
1. Verify phases 1–4 approved; refuse otherwise.
2. `git switch -c story/US-###-<slug>` (or switch to it if it exists). Never work on `main`.
3. Mirror the task list into a todo list. Then per task, in plan order:
   a. Re-read the task's goal, files, IDs, and verification note.
   b. Implement within the architecture's contracts. If reality contradicts the plan → STOP the task, write a deviation proposal in the log, escalate (see Failure handling).
   c. Verify per the task's verification note; run build/lint/existing tests if a stack exists.
   d. Commit: `feat: <summary> (TASK-###, REQ-###)` — one task (or coherent sub-step) per commit.
   e. Append a log entry (template below) and update the Code column of the traceability matrix.
4. After the last task: confirm every task is done / deferred (human-approved) / blocked-with-reason; write the summary section; set phase `5-implementation` to `awaiting_approval`; stop.

## Output format
`05-implementation-log.md` ([template](./assets/implementation-log-template.md)): frontmatter, per-task entries (status, files, commits, verification evidence, deviations), summary, open questions, assumptions.

## Quality checklist
- [ ] All work on the story branch; `main` untouched
- [ ] Every commit references TASK + REQ IDs
- [ ] Every task entry has verification evidence (command output, manual check description)
- [ ] No file changed outside any task's declared scope (or deviation recorded)
- [ ] No new component absent from the architecture
- [ ] Deviations: proposed → human-decided → recorded; never silent

## Failure handling
- **Plan wrong about the codebase** → deviation proposal: what the plan says, what reality is, proposed minimal adjustment. Escalate; proceed only on approval.
- **Needs an unplanned dependency** → stop; dependency additions require plan amendment (name, purpose, license).
- **Build/tests broken beyond the task's scope** → mark task blocked with evidence; never weaken tests or disable checks to get green.

## Log entry example
**TASK-003 — done** · files: `src/auth/tokenStore.ts`, `migrations/002_tokens.sql` · commit `a1b2c3d feat: reset-token store (TASK-003, REQ-002)` · verified: unit round-trip create/consume passes; double-consume rejected. Deviations: none.
