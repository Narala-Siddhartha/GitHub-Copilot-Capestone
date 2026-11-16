---
description: "Use when assigning requirement IDs, linking tasks/tests/code to requirements, or updating the traceability matrix. Covers the US/REQ/NFR/AC/ADR/TASK/TEST ID scheme."
---
# Traceability Rules

## ID scheme

| Artifact | ID format | Assigned by | Example |
|---|---|---|---|
| User story | `US-###` | Orchestrator (intake) | `US-001` |
| Functional requirement | `REQ-###` | requirements-analyst | `REQ-003` |
| Non-functional requirement | `NFR-###` | requirements-analyst | `NFR-001` |
| Acceptance criterion | `AC-<req>-<n>` | requirements-analyst | `AC-003-2` |
| Architecture decision | `ADR-###` | solution-architect | `ADR-002` |
| Design review finding | `DRF-###` | design-reviewer | `DRF-001` |
| Implementation task | `TASK-###` | implementation-planner | `TASK-007` |
| Test case | `TEST-###` | test-engineer | `TEST-012` |
| Assumption | `ASM-###` | any agent | `ASM-004` |

IDs are scoped per story, stable, and never reused or renumbered.

## Required links (the traceability chain)

User Story → Requirements → Architecture → Design Decisions → Implementation Tasks → Source Code → Tests → PR.

- Every `REQ`/`NFR` cites the `US` it derives from.
- Every `ADR` lists the `REQ`/`NFR` IDs it addresses.
- Every `TASK` lists the `REQ`/`NFR`/`ADR` IDs it implements. A task with no requirement reference is invalid.
- Source files/commits reference `TASK` IDs (commit messages and/or code comments at the change site).
- Every `TEST` lists the `REQ` or `AC` it verifies. A test with no reference is invalid.
- The PR description lists the full chain for the story.

## Traceability matrix

Maintain `docs/sdlc/stories/US-###/traceability-matrix.md` as a table:

| REQ/NFR | AC | ADR | TASK | Code (files) | TEST | Status |

Each phase agent updates the columns it owns after producing its artifact. Any requirement with an empty downstream cell at PR time blocks the PR (coverage gap).
