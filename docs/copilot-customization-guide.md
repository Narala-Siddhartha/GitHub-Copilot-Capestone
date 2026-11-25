# Copilot Customization Guide

How this repository's GitHub Copilot customizations fit together, and how to extend them.

## Layout

```
.github/
├── copilot-instructions.md      # Always-on project rules (every chat request)
├── instructions/                # Scoped rules, loaded on demand or by file glob
│   ├── sdlc-artifacts.instructions.md   (applyTo: docs/sdlc/**)
│   ├── traceability.instructions.md
│   ├── security.instructions.md
│   ├── testing.instructions.md
│   └── source-code.instructions.md      ← update when a stack is chosen
├── agents/                      # 9 custom agents (*.agent.md)
├── prompts/                     # 9 slash prompts (*.prompt.md)
├── skills/                      # Phase skills and shared story-flow selection skill
└── hooks/
    ├── sdlc-hooks.json          # Hook registration (supported events only)
    └── scripts/*.js             # Node.js hook implementations
docs/
├── sdlc-workflow.md             # How a story flows through the pipeline
├── agent-responsibilities.md    # Per-agent contract
├── approval-matrix.md           # Who approves what
└── sdlc/
    ├── templates/               # workflow-status + traceability templates
    ├── stories/US-###/          # Per-story artifacts (created at intake)
    └── audit/                   # Hook-written JSONL logs (append-only)
```

## How each surface is used

| Surface | Role here | Invocation |
|---------|-----------|------------|
| `copilot-instructions.md` | Gate law, traceability mandate, artifact map | Automatic, every request |
| `*.instructions.md` | Phase-area rules (artifacts, security, testing, code, IDs) | Auto via `applyTo` glob or description match |
| `*.agent.md` | One persona per SDLC role with minimal tools | Agent picker, or as subagents of the Orchestrator |
| `*.prompt.md` | One slash command per phase + `/sdlc-run` | Type `/` in chat |
| `SKILL.md` | Phase procedure + artifact template + scripts | Loaded automatically by the phase agent; also `/` commands |
| Hooks | Deterministic enforcement: deny dangerous commands, block secrets, audit, validate artifacts, capture test runs | Automatic at lifecycle events |
| `story-flow-selection` skill | Shared resume-or-replace preflight for `/sdlc-run` and direct Phase 1 | Loaded by the Orchestrator and Requirements Analyst |

## Invoking the pipeline

- Full pipeline: `/sdlc-run <user story>` then `/sdlc-run US-###` after each approval. Before fresh intake, the Orchestrator offers to resume an incomplete flow or replace one selected incomplete flow.
- Single phase: `/sdlc-1-requirements US-001` … `/sdlc-8-pull-request US-001`.
- Direct Phase 1 with new story text uses the same resume-or-replace preflight. Choosing resume routes to the Orchestrator at that story's current phase.
- Direct agent chat: pick e.g. *Design Reviewer* in the agent selector and give it a story ID.
- Story discovery uses `node tools/new-story.js --list-incomplete`. Folder replacement is permitted only through `--replace-incomplete <US-ID>` after explicit user selection; shared files and audit logs are never removed.
- Validate the intake and deletion guard with `node --test tools/new-story.test.js tools/pre-tool-guard.test.js`.

## Extending the framework

**Choosing a tech stack** (first real change you'll make):
1. Rewrite the Stack section of `.github/instructions/source-code.instructions.md` (versions, layout, commands).
2. Set `LINT_COMMAND` (and adjust `SOURCE_FILE` / `TEST_COMMAND` if needed) in `.github/hooks/scripts/post-tool-validate.js`.
3. Record the canonical test command in `.github/instructions/testing.instructions.md`.
4. Update the Build and Test section of `.github/copilot-instructions.md`.

**Adding an instruction file:** one concern per file; keyword-rich `description:` ("Use when …"); prefer a narrow `applyTo` glob; never `applyTo: "**"` unless truly universal.

**Adding/altering an agent:** keep one role per agent and the minimal tool set; update `docs/agent-responsibilities.md` and, if orchestrated, the Orchestrator's `agents:` allow-list.

**Adding a hook:** use only supported events (`SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `PreCompact`, `SubagentStart`, `SubagentStop`, `Stop`); keep scripts fast (timeouts are set per hook) and non-throwing; log decisions to `docs/sdlc/audit/`. Note that not every event fires on every Copilot surface (VS Code vs CLI vs cloud) — treat hooks as defense in depth, not the only gate.

**MCP integrations:**
- Phase 1 grants the Requirements Analyst read-only `atlassian/*`, `jira/*`, and `confluence/*` tools. Use the authenticated Atlassian MCP when it supports the source; otherwise use the matching Jira or Confluence MCP. Register servers under these names or update the agent's `tools:` entries to match your MCP server IDs.
- Phase 8 grants the Release Manager `github/*` and `gitlab/*`. Use the sole authenticated provider MCP that exposes PR/MR creation and status tools. If both are usable, the Release Manager must ask the human to choose before proceeding. If neither is usable, it follows the documented CLI/manual fallback.
- Authenticate MCP servers before the relevant phase. Keep MCP access role-scoped; do not grant integrations to every agent.

## Known surface limitations

- Hook event availability varies by Copilot surface; the gates therefore never rely on hooks alone (agents + Orchestrator + Release Manager re-verify approvals in `workflow-status.yml`).
- Skills may also be stored in `.agents/skills/` or `.claude/skills/`; this repo standardizes on `.github/skills/`.
- Use either `copilot-instructions.md` **or** `AGENTS.md`, never both — this repo uses the former.
