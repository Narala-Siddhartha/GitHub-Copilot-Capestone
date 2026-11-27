---
name: "sdlc-run"
description: "Run or resume the full gated SDLC pipeline for a user story via the SDLC Orchestrator."
agent: sdlc-orchestrator
argument-hint: "New user story text, or an existing story ID (e.g. US-001)"
---
Run the agentic SDLC pipeline for the story given as input.

Use simple, everyday words for all questions, choices, progress updates, and approval requests. Briefly explain technical terms, and clearly state what each choice will do.

1. For new story text or missing story input, follow the shared `story-flow-selection` skill before intake. List incomplete stories with `node tools/new-story.js --list-incomplete` and ask the user to resume one or start new by replacing one specifically selected incomplete story. On resume, discard new story text and resume the selected flow. On new, use `node tools/new-story.js` with `--replace-incomplete <selected-US-ID>` only after explicit user selection. If the input is an explicit existing `US-###` or a phase approval such as "approve phase 2 for US-001", do not show a redundant new-story prompt; load the workflow or record the decision.
2. Determine the current phase (first phase not `approved`) and verify all prerequisite artifacts exist and are approved. If the current phase is `awaiting_approval`, validate and re-present its existing artifact at the gate without rerunning the agent. If `in_progress` has a valid artifact, return it to `awaiting_approval`; if missing/invalid, resume that agent. Report completion if every phase is approved.
3. Otherwise, delegate exactly one eligible phase to its agent, validate its output, and stop at the human approval gate.
4. Report: phase executed, artifact produced, open questions, assumptions, and what approval is needed to continue.

Flow: after you approve a phase in chat, the orchestrator records it and automatically runs the next phase in the same turn, stopping at that phase's gate. You approve each phase explicitly; there is no way to approve phases you have not seen.

Rules: never mark a phase approved without an explicit human decision naming that phase; if prerequisites are missing or rejected, stop and report instead of proceeding. Never delete story folders directly; replacement is restricted to the selected incomplete story through `tools/new-story.js`.
