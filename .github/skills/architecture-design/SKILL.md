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
- Existing codebase structure, existing technology and infrastructure constraints, and `.github/instructions/source-code.instructions.md` (current stack, if any)

## Procedure
1. Verify phase 1 is `approved` in `workflow-status.yml`; refuse otherwise. Never design against unapproved or invented requirements.
2. Restate the driving requirements: list the REQ/NFR/BR IDs that most constrain the design.
3. Define the **component model** and responsibilities, and how components communicate. Every component must be justified by ≥1 requirement. Do not add technologies or microservices the requirements don't need; prefer the simplest design (a modular monolith unless an NFR demands otherwise).
4. Define **APIs and integration points**: operations, inputs, outputs, error behavior.
5. Define the **data model** and storage requirements: entities, fields, relationships, ownership, retention.
6. Define **authentication and authorization**, the **deployment architecture**, and the scalability, availability, observability and security considerations.
7. Evaluate **technology choices**. Write an **ADR** (`ADR-###`) per major choice: why it is required, ≥2 alternatives, advantages and disadvantages, trade-offs, decision, consequences, linked REQ/NFR IDs. Stack-blocking decisions without a chosen stack → `ADR-### (proposed)` + Open Question for the human.
8. Build the **traceability matrix** (section 14): every REQ/NFR → component(s)/ADR(s). Every component must appear in it at least once. Unsatisfiable requirements go under Risks and Constraints → blocked requirements, with reasons.
9. Fill [architecture template](./assets/architecture-template.md) → `02-architecture.md`; update the ADR column of the story's `traceability-matrix.md`.
10. Run the checklist; set phase `2-architecture` to `awaiting_approval`; stop. Produce no production code.

## Output format
`02-architecture.md` with the 14 template sections: Architecture Overview, Architecture Principles, High-Level Architecture Diagram (Mermaid), Component Diagram, Component Responsibilities, Data Flow Diagram, API and Integration Design, Data Model, Security Architecture, Deployment Architecture, Technology Stack, Architecture Decision Records, Risks and Constraints, Requirements Traceability Matrix.

## Quality checklist
- [ ] Every major component supports ≥1 requirement (no speculative parts)
- [ ] Traceability matrix maps 100% of REQ/NFR IDs (or blocked requirements are explained)
- [ ] All critical NFRs addressed with concrete, measurable strategies
- [ ] Every ADR has ≥2 alternatives and explicit trade-offs
- [ ] Mermaid diagrams present and consistent with the component list
- [ ] Interfaces define error behavior, not just happy paths
- [ ] Security architecture identifies trust boundaries, authn/z, and data protection
- [ ] No unnecessary technologies or microservices
- [ ] No production code

## Failure handling
- Conflicting NFRs (e.g., latency vs. consistency) → present the conflict as an ADR with options, mark `(proposed)`, escalate.
- Requirement unclear → Open Question; never reinterpret requirements.
- Design rejected in phase 3 → address each DRF explicitly in a Revision History entry.

## Example ADR
**ADR-001 — Session storage (REQ-002, NFR-001)**
Context: reset tokens must be single-use and expire. Options: (a) DB table with TTL sweep — simple, +1 query/req; (b) signed stateless tokens — no storage, but revocation impossible. Decision: (a), because AC-002-2 requires invalidation on use. Consequence: scheduled cleanup job needed.
