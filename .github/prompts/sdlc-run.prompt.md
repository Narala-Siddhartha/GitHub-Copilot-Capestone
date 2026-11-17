---
name: "SDLC Run"
description: "Run or resume the full gated SDLC pipeline for a user story via the SDLC Orchestrator."
agent: sdlc-orchestrator
argument-hint: "New user story text, or an existing story ID (e.g. US-001)"
---
Run the agentic SDLC pipeline for the story given as input.

1. If the input is free text, perform intake with `node tools/new-story.js` (see the orchestrator's procedure) and confirm it succeeded before anything else. If it is an existing `US-###`, load its `workflow-status.yml`. If the input is an approval such as "approve phase 2 for US-001", record it and continue.
2. Determine the current phase (first phase not `approved`) and verify all prerequisite artifacts exist and are approved.
3. Delegate exactly one phase to its phase agent, validate its output, and stop at the human approval gate.
4. Report: phase executed, artifact produced, open questions, assumptions, and what approval is needed to continue.

Flow: after you approve a phase in chat, the orchestrator records it and automatically runs the next phase in the same turn, stopping at that phase's gate. You approve each phase explicitly; there is no way to approve phases you have not seen.

Rules: never mark a phase approved without an explicit human decision naming that phase; if prerequisites are missing or rejected, stop and report instead of proceeding.
