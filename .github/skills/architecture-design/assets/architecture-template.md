---
story: US-XXX
phase: 2-architecture
status: draft
date: YYYY-MM-DD
author: solution-architect
---
# Architecture — US-XXX

## 1. Architecture Overview
(Scope and approach, driven by the approved requirements. List the REQ/NFR IDs that most constrain the design.)

## 2. Architecture Principles
| Principle | Rationale | Requirements |
|-----------|-----------|--------------|

## 3. High-Level Architecture Diagram
```mermaid
flowchart LR
  %% actors, system boundary, external systems
```

## 4. Component Diagram
```mermaid
flowchart TB
  %% components and dependencies
```

## 5. Component Responsibilities
| Component | Responsibility | Depends on | Supports (REQ/NFR) |
|-----------|----------------|------------|--------------------|

## 6. Data Flow Diagram
```mermaid
sequenceDiagram
  %% key flows, including failure paths
```

## 7. API and Integration Design
| Interface | Operation | Input | Output | Errors | Auth |
|-----------|-----------|-------|--------|--------|------|

External integration points and their failure behavior:

## 8. Data Model
(Entities, fields, relationships, ownership, storage choice, retention, privacy classification.)

## 9. Security Architecture
(Authentication, authorization, trust boundaries, data protection at rest and in transit, secrets handling, input validation, audit.)

## 10. Deployment Architecture
(Environments, hosting, scaling, availability, observability: logging, metrics, tracing, alerting.)

## 11. Technology Stack
| Layer | Choice | Justification | ADR |
|-------|--------|---------------|-----|
Choices pending a human decision are marked "proposed".

## 12. Architecture Decision Records
### ADR-001 — <title> (REQ-xxx, NFR-xxx)
- **Why required:**
- **Alternatives:** (at least two)
- **Advantages / disadvantages:**
- **Trade-offs:**
- **Decision:** (or "proposed" with the open question)
- **Consequences:**

## 13. Risks and Constraints
| ID | Risk / constraint | Likelihood | Impact | Mitigation | Related REQ/NFR |
|----|-------------------|------------|--------|------------|-----------------|

Blocked requirements (cannot be satisfied as stated), with reasons and alternatives:

## 14. Requirements Traceability Matrix
| REQ/NFR | Component(s) | ADR(s) | Notes |
|---------|--------------|--------|-------|
Every component in section 5 must appear here at least once.

## Open Questions
- 

## Assumptions
- **ASM-001** — … Risk: …

## Revision History
| Date | Change | Reason |
|------|--------|--------|
