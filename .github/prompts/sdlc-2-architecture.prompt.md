---
name: "SDLC 2 — Architecture"
description: "Phase 2: design the architecture (02-architecture.md) from approved requirements."
agent: solution-architect
argument-hint: "Story ID (e.g. US-001)"
---
Execute SDLC phase 2 (Architecture Design) for the story given as input, using the `architecture-design` skill.

- Input documents: `docs/sdlc/stories/<story>/01-requirements.md` (must be `approved` in `workflow-status.yml` — refuse and report if not).
- Produce only `02-architecture.md` (components, interfaces, data model, cross-cutting concerns, ADRs, coverage table) and the ADR column of the traceability matrix.
- Before finishing, validate against the skill's quality checklist; the coverage table must map 100% of REQ/NFR IDs or list them under Blocked Requirements.
- Report Open Questions, Assumptions, and any proposed (undecided) ADRs. Never invent missing requirements or silently drop unsatisfiable ones.
- Set phase `2-architecture` to `awaiting_approval` and STOP. Do not start the design review.
