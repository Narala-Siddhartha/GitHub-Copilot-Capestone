---
name: requirements-engineering
description: 'SDLC phase 1: transform a user story into testable requirements with REQ/NFR/AC IDs. Use when analyzing requirements, writing acceptance criteria, or producing 01-requirements.md for a story.'
argument-hint: 'Story ID (e.g. US-001)'
---
# Requirements Engineering

## Purpose
Convert a raw user story into a precise, testable, traceable requirements specification that downstream phases can design, plan, implement, and verify against.

## Required inputs
- `docs/sdlc/stories/US-###/user-story.md`
- `docs/sdlc/stories/US-###/workflow-status.yml`
- `.github/instructions/traceability.instructions.md` (ID scheme)

## Procedure
1. Read the user story. Identify actors, goals, triggers, and stated constraints. Quote the story verbatim in the artifact header.
2. Extract **functional requirements**: one atomic, testable statement per `REQ-###`, phrased "The system shall …". Link each to the story (`US-###`).
3. Extract **non-functional requirements** (`NFR-###`): performance, security, availability, usability, compliance. Quantify each (number, limit, percentile). If the story gives no measure, add an Open Question — do not invent one.
4. Write **acceptance criteria** per functional requirement (`AC-<req>-<n>`), Given/When/Then, covering the happy path and every stated failure/edge case.
5. Write the **Out of Scope** section: everything a reader might assume is included but is not.
6. List **Open Questions** (anything not derivable from the story) and **Assumptions** (`ASM-###`, each with a risk note). Prefer a question over an assumption.
7. Fill the artifact using [requirements template](./assets/requirements-template.md) → `docs/sdlc/stories/US-###/01-requirements.md`.
8. Create/update `traceability-matrix.md`: one row per REQ/NFR with the AC column filled.
9. Run the quality checklist; set phase `1-requirements` to `awaiting_approval`; stop for human approval.

## Output format
`01-requirements.md` per the template: frontmatter, story quote, REQ table, NFR table, AC blocks, out-of-scope, open questions, assumptions.

## Quality checklist
- [ ] Every REQ atomic (no "and/or" bundling), testable, unambiguous
- [ ] Every REQ has ≥1 AC in Given/When/Then form
- [ ] Every NFR quantified
- [ ] Every REQ/NFR links to US-###
- [ ] Out of Scope present and non-trivial
- [ ] No design/implementation decisions leaked in
- [ ] Open Questions capture all gaps; nothing invented
- [ ] Traceability matrix row per REQ/NFR

## Failure handling
- Story too vague for even one testable REQ → write only Open Questions, keep status `in_progress`, escalate.
- Internal contradictions → one Open Question per contradiction showing both readings.
- On human rejection → revise, append Revision History, never renumber surviving IDs.

## Example
Story: "As a user I want to reset my password so I can regain access."
- `REQ-001`: The system shall allow a registered user to request a password reset via their registered email. (US-001)
- `AC-001-1`: Given a registered email, When reset is requested, Then a single-use, time-limited reset link is emailed.
- `AC-001-2`: Given an unregistered email, When reset is requested, Then the response is identical to the registered case (no account enumeration).
- `NFR-001`: Reset links shall expire within 30 minutes. *(If the story names no window → Open Question, not 30 as a guess.)*
