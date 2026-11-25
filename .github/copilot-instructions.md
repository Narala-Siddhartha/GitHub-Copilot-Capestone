# Agentic SDLC Framework — Project Instructions

This repository implements a multi-agent, gated Software Development Lifecycle (SDLC) driven by GitHub Copilot custom agents. These rules apply to **every** chat request in this workspace.

## Non-negotiable rules

1. **Never invent requirements.** If information is missing or ambiguous, record it under *Open Questions* in the current phase artifact and stop for human input. Do not silently assume.
2. **Respect approval gates.** Every SDLC phase ends with a human approval gate. Never begin a phase whose prerequisite phase is not `approved` in the story's `workflow-status.yml`. Never mark a phase `approved` yourself — only a human decision stated in chat may be recorded as approval.
3. **Stay in phase.** A phase agent executes only its own phase. If asked to do more, decline and refer to the SDLC Orchestrator (`sdlc-orchestrator`).
4. **Traceability is mandatory.** Every artifact element carries a stable ID (see `.github/instructions/traceability.instructions.md`). Code, tests, and PRs must reference the IDs they implement or verify.
5. **No production changes** outside the scope of an approved implementation plan.

## Story entry and resume

Before `/sdlc-run` or direct Phase 1 starts a new story from free text (or is invoked without a story), use the shared `story-flow-selection` skill. It checks for incomplete story flows and asks the user to resume one or start new. Resuming discards newly supplied story text and continues from recorded workflow state; an `awaiting_approval` phase returns to its existing gate without rerunning its agent. Starting new can replace only the specific incomplete story folder explicitly selected by the user; completed stories, unselected stories, shared framework files, templates, and audit logs are preserved. Never delete story folders directly; replacement must use the validated `tools/new-story.js --replace-incomplete` path.

## Where things live

| Thing | Location |
|---|---|
| Per-story SDLC artifacts | `docs/sdlc/stories/US-###/` |
| Workflow state (per story) | `docs/sdlc/stories/US-###/workflow-status.yml` |
| Traceability matrix (per story) | `docs/sdlc/stories/US-###/traceability-matrix.md` |
| Audit logs (hook-written, append-only) | `docs/sdlc/audit/` |
| Framework docs | `docs/sdlc-workflow.md`, `docs/agent-responsibilities.md`, `docs/approval-matrix.md`, `docs/copilot-customization-guide.md` |

## SDLC phases, agents, and artifacts

| # | Phase | Agent | Output artifact |
|---|---|---|---|
| 1 | Requirements Engineering | `requirements-analyst` | `01-requirements.md` |
| 2 | Architecture Design | `solution-architect` | `02-architecture.md` |
| 3 | Design Review | `design-reviewer` | `03-design-review.md` |
| 4 | Implementation Planning | `implementation-planner` | `04-implementation-plan.md` |
| 5 | Implementation | `implementer` | source code + `05-implementation-log.md` |
| 6 | Code Review | `code-reviewer` | `06-code-review.md` |
| 7 | Verification & Testing | `test-engineer` | tests + `07-test-report.md` |
| 8 | Pull Request Creation | `release-manager` | `08-pull-request.md` + PR |

## Build and test

The application stack is not yet chosen. When a stack is added, record install/build/test commands in `.github/instructions/source-code.instructions.md` and wire them into `.github/hooks/scripts/post-tool-validate.js`. Until then, treat build/lint/test hooks as informational no-ops.

## Conventions

- Artifacts are Markdown with YAML frontmatter (`story`, `phase`, `status`, `date`).
- Workflow status values: `pending` → `in_progress` → `awaiting_approval` → `approved` | `rejected`.
- Work on a story happens on branch `story/US-###-short-slug`.
- Git commits follow Conventional Commits and reference task IDs, e.g. `feat: add login endpoint (TASK-003, REQ-002)`.
