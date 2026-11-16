---
name: "SDLC 2 — Architecture"
description: "Phase 2: design the architecture (02-architecture.md) from approved requirements."
agent: solution-architect
argument-hint: "Story ID (e.g. US-001)"
---
Execute SDLC phase 2 (Architecture Design) for the story given as input, using the `architecture-design` skill.

- Input documents: `docs/sdlc/stories/<story>/01-requirements.md` (must be `approved` in `workflow-status.yml` — refuse and report if not), the existing repository structure, and existing technology and infrastructure constraints.
- Produce only `02-architecture.md` (14 sections, including Mermaid diagrams, ADRs and a requirements traceability matrix) and the ADR column of the story's traceability matrix. Produce no production code.
- Do not introduce unnecessary technologies or microservices. Map every major component and every technology decision to requirement IDs.
- Before finishing, validate that every major component supports ≥1 requirement and that all critical NFRs are addressed; state each check's result.
- Report Open Questions, Assumptions, and any proposed (undecided) ADRs. Never invent missing requirements or silently drop unsatisfiable ones.
- Set phase `2-architecture` to `awaiting_approval`, present for review, and STOP. Do not start the design review.
