# AI Agentic SDLC Pipeline

## Pipeline overview

This repository contains a human-gated, eight-phase software development lifecycle (SDLC) implemented with GitHub Copilot custom agents, prompts, skills, instructions, and hooks. The Orchestrator coordinates the phases, while each specialist agent owns its phase artifact and responsibilities.

The workflow is:

1. **Story intake and flow selection** — `/sdlc-run` or direct Phase 1 checks for incomplete stories before creating a new one. You can resume a listed story from its recorded workflow state or provide a new story and choose which incomplete story to replace. Resuming discards the newly supplied story text. Replacement removes only the specifically selected incomplete story folder; completed stories, other stories, shared framework files, templates, and audit logs are preserved. Cleanup errors stop intake.
2. **Requirements Engineering** — the Requirements Analyst creates `01-requirements.md` and the initial traceability matrix.
3. **Architecture Design** — the Solution Architect creates `02-architecture.md`.
4. **Design Review** — the Design Reviewer produces `03-design-review.md`. Phase 4 proceeds only when the design review decision is APPROVED.
5. **Implementation Planning** — the Implementation Planner creates `04-implementation-plan.md`.
6. **Implementation** — the Implementer follows the approved plan, changes the code and tests, and records `05-implementation-log.md`.
7. **Code Review** — the Code Reviewer records findings and a decision in `06-code-review.md`.
8. **Verification and Testing** — the Test Engineer runs and reports verification in `07-test-report.md`. Phase 8 proceeds only when the verification result is READY FOR PR.
9. **Pull Request Creation** — the Release Manager audits the gates and traceability, prepares `08-pull-request.md`, and presents the proposed PR/MR for approval. It creates the PR/MR only after explicit approval and never merges it.

Each story lives in `docs/sdlc/stories/US-###/` and has a `workflow-status.yml` tracking phase status and approvals. Phases move through `pending`, `in_progress`, `awaiting_approval`, and then `approved` or `rejected`. A human must explicitly approve or reject each phase; approval applies only to the named phase. After approval, `/sdlc-run` continues to the next eligible phase and stops at its approval gate. If resumed at `awaiting_approval`, the Orchestrator returns to that gate without rerunning the agent.

The architecture separates **coordination** (the Orchestrator), **phase work** (eight specialist agents), and **policy/procedure** (Copilot instructions, phase prompts, and skills). Hooks provide deterministic defense-in-depth for command restrictions, secret handling, audit logging, artifact checks, and test-run capture. A traceability matrix links the user story and requirements through architecture decisions, implementation tasks, code, tests, and the final PR/MR. See [the detailed workflow](docs/sdlc-workflow.md), [agent responsibilities](docs/agent-responsibilities.md), and [approval gates](docs/approval-matrix.md).

For Jira or Confluence story sources, Phase 1 uses the authenticated Atlassian MCP when suitable, or the corresponding Jira/Confluence MCP. In Phase 8, the Release Manager uses the available authenticated GitHub or GitLab MCP that supports PR/MR creation. If both are available, it asks you to choose; provider selection is separate from PR/MR approval.

## Setup and prerequisites

- **VS Code and GitHub Copilot:** Open this repository in a VS Code version that supports custom agents, prompt files, skills, repository instructions, and hooks. Sign in to Copilot and enable the repository customizations in your Copilot chat/agent settings.
- **Node.js:** Install Node.js to run story intake, framework validation, hooks, and focused tests. Git is required for story branches and repository operations. The application-specific build/test stack is not defined in this framework repository.
- **Copilot customization files:** Keep `.github/agents/`, `.github/prompts/`, `.github/skills/`, `.github/instructions/`, `.github/copilot-instructions.md`, and `.github/hooks/` in the workspace. The hook registrations are in `.github/hooks/sdlc-hooks.json`; hooks should be enabled for the Copilot surface you use.
- **MCP integrations (only for the corresponding sources/actions):**
  - For Jira or Confluence intake, configure and authenticate an Atlassian MCP, or the relevant source-specific MCP. The default agent tool aliases are `atlassian/*`, `jira/*`, and `confluence/*`; if your MCP server IDs differ, update the Requirements Analyst's `tools:` list in `.github/agents/requirements-analyst.agent.md`.
  - For Phase 8 PR/MR creation, configure and authenticate a GitHub MCP (`github/*`) or GitLab MCP (`gitlab/*`) with access to the target repository and usable PR/MR creation and status tools. If both are available, the Release Manager asks which provider to use. If neither is available, a configured provider CLI may be used as a fallback; otherwise the pipeline records manual commands and reports that creation could not be performed.
  - Do not put credentials in the repository or chat. Configure MCP authentication through the supported VS Code/MCP settings for your environment.

**Start a new flow:** In Copilot Chat, run `/sdlc-run <your user story>`. If an incomplete flow exists, choose whether to resume it or start new by replacing one selected incomplete story. Direct Phase 1 intake is also available with `/sdlc-1-requirements <your user story>` and uses the same flow-selection behavior.

**Resume a flow:** Run `/sdlc-run US-###` or choose resume when prompted. The pipeline continues from the workflow status; an existing approval gate is presented again without repeating that phase's work.

**After a phase:** Review its artifact, then reply with an explicit decision such as `approve phase 1 for US-001` or `reject phase 1 for US-001: <reason>`. Answer any open questions before approval. Do not approve phases that have not been presented.

To validate the framework and its intake safety tests, run:

```powershell
node tools\validate-framework.js
node --test tools\new-story.test.js tools\pre-tool-guard.test.js
```
