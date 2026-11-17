---
name: sdlc-run
description: 'Run or resume the gated agentic SDLC pipeline for a user story. Use when starting a story, running the SDLC, moving to the next phase, resuming US-001, or approving a phase. Delegates each phase to its specialist agent and stops at every human approval gate.'
argument-hint: 'New user story text, a story ID (e.g. US-001), or an approval such as "approve phase 2 for US-001"'
---
# SDLC Run (pipeline entry point)

## Purpose
Single slash-command entry point for the eight-phase pipeline. It acts as the SDLC Orchestrator: it does not write phase artifacts or code itself, it routes work to the phase agents and enforces the human approval gates.

## Required inputs
- A new user story (free text), an existing story ID (`US-###`), or an explicit approval/rejection of a phase.

## Procedure
1. Follow the full procedure, constraints and failure handling in `.github/agents/sdlc-orchestrator.agent.md`. Read that file first; it is the single source of truth, so do not improvise a different flow.
2. Intake for a new story: write the story text verbatim to `docs/sdlc/stories/.intake.md`, then run `node tools/new-story.js --file docs/sdlc/stories/.intake.md --title "<short title>"`. Confirm it exited 0 and the story folder exists before doing anything else.
3. Delegate each phase to its agent as a subagent, one phase at a time, with the story ID and prerequisite artifact paths:
   `requirements-analyst` (1), `solution-architect` (2), `design-reviewer` (3), `implementation-planner` (4), `implementer` (5), `code-reviewer` (6), `test-engineer` (7), `release-manager` (8).
4. After each phase, set `awaiting_approval`, summarize the artifact, open questions and assumptions, and STOP for the human.
5. On an explicit approval naming a phase (for example "approve phase 2 for US-001"), record it in `workflow-status.yml` and continue with the next phase only.

## Output format
A status report per run: phase executed, artifact path, open questions, assumptions, and the approval needed to continue.

## Quality checklist
- [ ] Intake succeeded before any delegation
- [ ] Exactly one phase delegated per step; phases run strictly in order
- [ ] No phase marked approved without an explicit human decision naming it
- [ ] Phase 3 continues to phase 4 only on an APPROVED design review; phase 7 continues to phase 8 only on READY FOR PR
- [ ] Run stopped at the next approval gate

## Failure handling
- Intake script fails or no shell is available: report the exact command for the human to run, and do not delegate.
- Prerequisite missing, rejected, or inconsistent state: stop and report; never skip ahead or guess.
- Phase agent output invalid twice: stop and escalate with options.
