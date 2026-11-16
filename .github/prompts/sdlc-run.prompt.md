---
name: "SDLC Run"
description: "Run or resume the full gated SDLC pipeline for a user story via the SDLC Orchestrator."
agent: sdlc-orchestrator
argument-hint: "New user story text, or an existing story ID (e.g. US-001)"
---
Run the agentic SDLC pipeline for the story given as input.

1. If the input is free text, perform intake: assign the next `US-###`, write `user-story.md`, and initialize `workflow-status.yml` from `docs/sdlc/templates/workflow-status.template.yml`. If it is an existing `US-###`, load its `workflow-status.yml`.
2. Determine the current phase (first phase not `approved`) and verify all prerequisite artifacts exist and are approved.
3. Delegate exactly one phase to its phase agent, validate its output, and stop at the human approval gate.
4. Report: phase executed, artifact produced, open questions, assumptions, and what approval is needed to continue.

Rules: never execute more than one phase per run without explicit human approval in between; never mark a phase approved without an explicit human decision; if prerequisites are missing or rejected, stop and report instead of proceeding.
