# SDLC Workflow

How a user story moves through the eight-phase, human-gated, agent-driven lifecycle in this repository.

## Overview

```
user story
   │  /sdlc-run or direct Phase 1
   ▼
[Incomplete-flow check — resume or replace]
   ▼
[1 Requirements] → gate → [2 Architecture] → [3 Design Review] → gate
   → [4 Implementation Plan] → gate → [5 Implementation] → [6 Code Review] → gate
   → [7 Verification & Testing] → gate → [8 Pull Request] → gate → PR
```

Every phase: an agent produces one artifact, validates it against its skill's quality checklist, sets its phase to `awaiting_approval`, and **stops**. A human approves or rejects in chat; the decision is recorded in `workflow-status.yml`. No phase starts until all earlier phases are `approved`.

## Phases, agents, artifacts

| # | Phase | Agent | Prompt | Artifact (in `docs/sdlc/stories/US-###/`) |
|---|-------|-------|--------|-------------------------------------------|
| – | Intake | `sdlc-orchestrator` | `/sdlc-run` | `user-story.md`, `workflow-status.yml` |
| 1 | Requirements Engineering | `requirements-analyst` | `/sdlc-1-requirements` | `01-requirements.md` |
| 2 | Architecture Design | `solution-architect` | `/sdlc-2-architecture` | `02-architecture.md` |
| 3 | Design Review | `design-reviewer` | `/sdlc-3-design-review` | `03-design-review.md` |
| 4 | Implementation Planning | `implementation-planner` | `/sdlc-4-implementation-plan` | `04-implementation-plan.md` |
| 5 | Implementation | `implementer` | `/sdlc-5-implement` | source code + `05-implementation-log.md` |
| 6 | Code Review | `code-reviewer` | `/sdlc-6-code-review` | `06-code-review.md` |
| 7 | Verification & Testing | `test-engineer` | `/sdlc-7-verify` | tests + `07-test-report.md` |
| 8 | Pull Request Creation | `release-manager` | `/sdlc-8-pull-request` | `08-pull-request.md` + PR |

## How to run it

**Orchestrated (recommended):**
1. In Copilot chat, run `/sdlc-run As a user, I want … so that …`.
2. Before intake, the Orchestrator lists incomplete story flows. Choose a listed flow to resume, or provide a new story and choose which incomplete flow it replaces. If there are no incomplete flows, a supplied story proceeds to intake; without a story, the Orchestrator asks for one.
3. Resume continues from the recorded state and discards any newly supplied story text. If a phase is already `awaiting_approval`, the Orchestrator returns to that gate without rerunning its agent. Choosing new authorizes deletion of only the selected incomplete story folder. Completed stories, other incomplete stories, shared framework files, templates, and audit logs are preserved. Cleanup failure aborts intake and reports the error.
4. The Orchestrator runs intake through `node tools/new-story.js` (assigns the next `US-###`, creates `user-story.md` and `workflow-status.yml`), verifies success, runs phase 1 via the Requirements Analyst, and stops at the gate.
5. Review the artifact and reply with an explicit decision: *"approve phase 1 for US-001"*, *"reject: <reasons>"*, or answer the open questions.
6. On approval the Orchestrator records it and **automatically runs the next phase in the same turn**, stopping at that phase's gate. Repeat through phase 8. If you reply in a new chat or turn, run `/sdlc-run US-001`.

Each approval authorizes exactly the phase named. There is no "approve everything" shortcut, so every phase still needs your explicit decision after you have seen its artifact. Phase 3 continues to phase 4 only when the design review decision is APPROVED, and phase 7 continues to phase 8 only when the verification status is READY FOR PR.

**Direct phase invocation:** run the phase prompt (e.g. `/sdlc-3-design-review US-001`) or pick the agent in the agent selector. When starting a story through `/sdlc-1-requirements` with new text or no story ID, the same incomplete-flow prompt applies. Choosing resume routes through the Orchestrator so the flow continues at its actual phase; choosing new runs Phase 1 only after the selected-folder cleanup and fresh intake succeed. Phase agents still verify prerequisites and refuse to run out of order.

**External source and PR integrations:** Phase 1 reads Jira or Confluence through an authenticated Atlassian MCP, or the corresponding Jira/Confluence-specific MCP when needed. Phase 8 uses the authenticated GitHub or GitLab MCP that exposes PR/MR creation. If both are available, the Release Manager asks the human which provider to use before preparing provider-specific execution. If neither is available, the documented CLI/manual fallback applies.

## Status model

`pending → in_progress → awaiting_approval → approved | rejected`

- Only a human decision in chat can produce `approved` or `rejected` (recorded with `approved_by`, `approved_at`).
- On **rejection**, the same phase agent reworks the artifact (revision history appended), then returns to `awaiting_approval`.
- **Rejection cascade:** rejecting phase N after later phases ran resets phases > N to `pending`; the Orchestrator reports the cascade before rework starts.

## Design-change path

If implementation (phase 5+) discovers the architecture or plan is wrong, the agent stops and files a deviation. Material changes route back: requirements change → phase 1; design change → phase 2 (then 3, 4 re-run); plan-only change → phase 4. Minor deviations may be approved in place by the human and recorded in the implementation log.

## Traceability

The chain `US → REQ/NFR → ADR → TASK → code → TEST → PR` is maintained in each story's `traceability-matrix.md` and verified by `node .github/skills/verification-testing/scripts/check-traceability.js US-###` (phase 7 and 8 run it; gaps block the PR). See `.github/instructions/traceability.instructions.md` for the ID scheme.

## Enforcement layers

| Layer | Mechanism |
|-------|-----------|
| Guidance | `.github/copilot-instructions.md`, `.github/instructions/*` |
| Role limits | Agent tool permissions (reviewers can't edit code; orchestrator can't code) |
| Deterministic | Hooks (`.github/hooks/`): dangerous-command denial, secret blocking, audit logging, artifact validation, test capture |
| Human | Approval gates per phase (see `docs/approval-matrix.md`) |
