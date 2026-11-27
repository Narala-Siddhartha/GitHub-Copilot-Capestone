---
name: requirements-engineering
description: 'SDLC phase 1: transform a user story into testable requirements with REQ/NFR/AC IDs. Use when analyzing requirements, writing acceptance criteria, or producing 01-requirements.md for a story.'
argument-hint: 'Story ID (e.g. US-001)'
---
# Requirements Engineering

## Purpose
Convert a raw user story into a precise, testable, traceable requirements specification that downstream phases can design, plan, implement, and verify against.

## User-facing communication
- Ask questions in short, everyday words. Ask one clear question at a time or group closely related questions under plain headings.
- Explain why an answer is needed and what may happen depending on the answer. Offer simple choices where practical.
- Avoid unexplained technical terms and acronyms. Keep requirement IDs, but explain the meaning in the surrounding text.
- When presenting the finished requirements, give a short plain-language summary before pointing to the detailed artifact.

## Required inputs
- `docs/sdlc/stories/US-###/user-story.md`, created at intake from one of: pasted text, a repo file, a Jira issue, or a Confluence page. Read Jira/Confluence sources through the matching available MCP server (Atlassian, Jira, or Confluence).
- `docs/sdlc/stories/US-###/workflow-status.yml`
- `.github/instructions/traceability.instructions.md` (ID scheme)

## Story-flow preflight
- When Phase 1 is invoked with new story text or no story ID, follow the shared `story-flow-selection` skill before creating or editing story artifacts.
- On a resume choice, do not produce Phase 1 artifacts. Hand the selected story ID to `sdlc-orchestrator` so it resumes at the first unapproved phase.
- On a new-story choice, use `node tools/new-story.js` for intake. If replacing an incomplete story, include `--replace-incomplete <selected-US-ID>` only after the user explicitly selected that story.
- When an existing story ID is explicitly supplied, inspect its workflow status. Run Phase 1 directly only when `1-requirements` is `pending` and is the first unapproved phase. Otherwise hand off to `sdlc-orchestrator` to resume the correct state/gate; never duplicate an awaiting artifact or bypass a gate.

## Source intake
- **Pasted text or repo file:** copy verbatim into `user-story.md`.
- **Jira / Confluence:** use the authenticated Atlassian MCP when available for that source; otherwise use the matching Jira or Confluence MCP. Fetch the issue/page and relevant details (summary, description, acceptance criteria, comments, linked issues), copy the source content verbatim into `user-story.md`, and record its key/URL. If no suitable MCP is configured or authenticated, stop and ask the human to paste the content. Never guess content.
- **Word documents:** not readable directly; ask the human to paste the text or export to Markdown.
- If no story is supplied and there are no incomplete flows, ask the human for a story and stop. If incomplete flows exist, ask whether to resume one or provide a new story as described by the shared preflight; do not invent story content.

## Procedure
1. Read the complete user story. Identify the business problem, expected outcome, actors, stakeholders, system boundary, triggers, and stated constraints. Quote the story verbatim in the artifact (section 3).
2. Extract **functional requirements**: one atomic, testable statement per `REQ-###`, phrased "The system shall …". Link each to the story (`US-###`).
3. Extract **non-functional requirements** (`NFR-###`): performance, security, availability, usability, compliance. Quantify each (number, limit, percentile). If the story gives no measure, add an Open Question — do not invent one.
4. Extract **business rules** (`BR-###`) and **dependencies**. Each BR must be enforced by at least one REQ/NFR/AC.
5. Write **acceptance criteria** per functional requirement (`AC-<req>-<n>`), Given/When/Then and measurable, with positive, negative, and boundary scenarios. Record other edge cases in section 9.
6. Cover **security, privacy, performance, and reliability** where relevant. If the story says nothing about one, ask whether it applies; do not skip silently or invent targets.
7. Identify **ambiguous, incomplete, or conflicting** statements.
8. **Clarification loop (mandatory before finalizing):**
   a. Draft the artifact with every gap listed in section 12 (Open Questions).
   b. Ask the human the questions, grouped by theme, each with a short reason it matters. Use the interactive question tool where available.
   c. STOP and wait. Do not answer on the human's behalf.
   d. Record each answer in section 12 (with who answered) and update the requirements. Anything still unanswered stays open and blocks approval unless the human explicitly accepts it as an assumption (`ASM-###` with a risk note).
9. Write the **Out of Scope** section: everything a reader might assume is included but is not.
10. Fill the artifact using [requirements template](./assets/requirements-template.md) → `docs/sdlc/stories/US-###/01-requirements.md`.
11. Create/update `traceability-matrix.md`: one row per REQ/NFR/BR with the AC column filled.
12. Run the quality checklist; set phase `1-requirements` to `awaiting_approval`; present for human review and stop.

## Output format
`01-requirements.md` with the 14 template sections: Project Overview, Business Objective, User Story, Actors and Stakeholders, Functional Requirements, Non-Functional Requirements, Business Rules, Acceptance Criteria, Edge Cases, Dependencies, Assumptions, Open Questions, Out-of-Scope Items, Requirement Traceability Matrix.

## Quality checklist
- [ ] Every requirement has a unique ID (REQ/NFR/BR/AC); no duplicates
- [ ] No two requirements contradict each other
- [ ] Clarification loop completed; every answer recorded with its author
- [ ] No assumption presented as fact
- [ ] Every REQ atomic (no "and/or" bundling), testable, unambiguous
- [ ] Every REQ has ≥1 AC in Given/When/Then form
- [ ] Every NFR quantified
- [ ] Every REQ/NFR links to US-###
- [ ] Out of Scope present and non-trivial
- [ ] No design/implementation decisions leaked in
- [ ] Open Questions capture all gaps; nothing invented
- [ ] Traceability matrix row per REQ/NFR

## Failure handling
- No story supplied, or no suitable Jira/Confluence MCP available/authenticated for a linked source → stop and ask the human; produce nothing.
- Story too vague for even one testable REQ → write only Open Questions, keep status `in_progress`, escalate.
- Internal contradictions → one Open Question per contradiction showing both readings.
- On human rejection → revise, append Revision History, never renumber surviving IDs.

## Example
Story: "As a user I want to reset my password so I can regain access."
- `REQ-001`: The system shall allow a registered user to request a password reset via their registered email. (US-001)
- `AC-001-1`: Given a registered email, When reset is requested, Then a single-use, time-limited reset link is emailed.
- `AC-001-2`: Given an unregistered email, When reset is requested, Then the response is identical to the registered case (no account enumeration).
- `NFR-001`: Reset links shall expire within 30 minutes. *(If the story names no window → Open Question, not 30 as a guess.)*
