---
name: architecture-design
description: 'SDLC phase 2: design components, interfaces, data model, and ADRs from approved requirements. Use when designing architecture, making technology decisions, or producing 02-architecture.md for a story.'
argument-hint: 'Story ID (e.g. US-001)'
---
# Architecture Design

## Purpose
Produce an architecture that demonstrably satisfies every approved requirement, with each significant decision captured as an ADR with options and trade-offs.

## Required inputs
- `docs/sdlc/stories/US-###/01-requirements.md` (phase 1 `approved`)
- Existing codebase structure and `.github/instructions/source-code.instructions.md` (current stack, if any)

## Procedure
1. Verify phase 1 is `approved` in `workflow-status.yml`; refuse otherwise.
2. Restate the driving requirements: list the REQ/NFR IDs that most constrain the design.
3. Define the **component model**: components, responsibilities, dependencies (text diagram or Mermaid). Every component must be justified by ≥1 requirement.
4. Define **interfaces/contracts** between components and at system boundaries: operations, inputs, outputs, error behavior.
5. Define the **data model**: entities, fields, relationships, ownership, retention.
6. Address **cross-cutting concerns** explicitly: error handling, security (trust boundaries, authn/z, data protection), observability, configuration.
7. Write an **ADR** (`ADR-###`) per significant decision: context, ≥2 options with trade-offs, decision, consequences, linked REQ/NFR IDs. Stack-blocking decisions without a chosen stack → `ADR-### (proposed)` + Open Question.
8. Build the **coverage table**: every REQ/NFR → component(s)/ADR(s) that satisfy it. Unsatisfiable ones go under `## Blocked Requirements` with reasons.
9. Fill [architecture template](./assets/architecture-template.md) → `02-architecture.md`; update the ADR column of the traceability matrix.
10. Run the checklist; set phase `2-architecture` to `awaiting_approval`; stop.

## Output format
`02-architecture.md` per the template: frontmatter, driving requirements, component model, interfaces, data model, cross-cutting concerns, ADRs, coverage table, open questions, assumptions.

## Quality checklist
- [ ] Coverage table maps 100% of REQ/NFR IDs (or Blocked Requirements explains the gap)
- [ ] Every ADR has ≥2 options and explicit trade-offs
- [ ] Every component justified by a requirement (no speculative parts)
- [ ] Interfaces define error behavior, not just happy paths
- [ ] NFR strategies concrete and measurable
- [ ] Security subsection identifies trust boundaries
- [ ] No implementation-level detail (function bodies, exact file names)

## Failure handling
- Conflicting NFRs (e.g., latency vs. consistency) → present the conflict as an ADR with options, mark `(proposed)`, escalate.
- Requirement unclear → Open Question; never reinterpret requirements.
- Design rejected in phase 3 → address each DRF explicitly in a Revision History entry.

## Example ADR
**ADR-001 — Session storage (REQ-002, NFR-001)**
Context: reset tokens must be single-use and expire. Options: (a) DB table with TTL sweep — simple, +1 query/req; (b) signed stateless tokens — no storage, but revocation impossible. Decision: (a), because AC-002-2 requires invalidation on use. Consequence: scheduled cleanup job needed.
