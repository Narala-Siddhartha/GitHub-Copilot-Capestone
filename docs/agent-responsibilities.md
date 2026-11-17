# Agent Responsibilities

Nine custom agents live in `.github/agents/`. Each phase agent owns exactly one artifact and stops at its approval gate.

## SDLC Orchestrator (`sdlc-orchestrator`)
- **Role:** pipeline coordinator — intake, phase detection, prerequisite checks, delegation, gate enforcement, status upkeep.
- **Inputs:** user story text or `US-###`; `workflow-status.yml`.
- **Outputs:** `user-story.md`, `workflow-status.yml` updates; delegation reports.
- **Tools:** read, search, edit (status files only), execute (only `tools/new-story.js` and read-only checks), agent (restricted to the 8 phase agents), todo.
- **Must not:** produce phase artifacts or code; approve phases; delegate before intake has succeeded; run phases in parallel or out of order. After an explicit human approval it auto-continues with the next phase only, never beyond.
- **Escalates:** invalid phase output after 2 retries; inconsistent workflow state; rejection cascades.

## Requirements Analyst (`requirements-analyst`) — phase 1
- **Inputs:** `user-story.md`. **Outputs:** `01-requirements.md`, matrix REQ/AC columns.
- **Tools:** read, search, edit. **Must not:** design solutions; invent missing requirements.
- **Escalates:** vague or contradictory stories (as Open Questions).

## Solution Architect (`solution-architect`) — phase 2
- **Inputs:** approved `01-requirements.md`; existing codebase. **Outputs:** `02-architecture.md` (components, interfaces, data model, ADRs, coverage table), matrix ADR column.
- **Tools:** read, search, edit, web. **Must not:** write code; modify requirements.
- **Escalates:** unsatisfiable requirements (`Blocked Requirements`); stack decisions pending human choice.

## Design Reviewer (`design-reviewer`) — phase 3
- **Inputs:** approved requirements + proposed architecture. **Outputs:** `03-design-review.md` (DRF findings, security assessment, verdict).
- **Tools:** read, search, edit (review doc only). **Must not:** modify the architecture; soften findings.
- **Escalates:** missing mandatory sections (verdict `reject`); unassessable areas (completeness findings).

## Implementation Planner (`implementation-planner`) — phase 4
- **Inputs:** approved phases 1–3. **Outputs:** `04-implementation-plan.md` (ordered TASK list), matrix TASK column.
- **Tools:** read, search, edit. **Must not:** write code; re-architect.
- **Escalates:** insufficient design detail; accepted design-review risks conflicting with ADRs.

## Implementer (`implementer`) — phase 5
- **Inputs:** approved plan + architecture contracts. **Outputs:** code and unit tests on `story/US-###-*` branch, doc updates, task status in the plan (status field only), `05-implementation-log.md`, matrix Code column.
- **Tools:** read, edit, search, execute, todo. **Must not:** work without a TASK; touch `main`; weaken tests; add unplanned dependencies; create the PR.
- **Escalates:** plan/reality conflicts (deviation proposals); blocked dependencies; significant or irreversible changes needing human approval.

## Code Reviewer (`code-reviewer`) — phase 6
- **Inputs:** story branch diff, plan, log, architecture. **Outputs:** `06-code-review.md` (CRF findings, security assessment, verdict).
- **Tools:** read, search, edit (review doc only), execute (read-only git and non-modifying dependency-audit tooling only). **Must not:** change code; approve with open Critical/High findings; approve automatically; merge or create a PR.
- **Escalates:** Critical findings (immediately, in chat), unapproved scope, false completions, secrets in diff.

## Test Engineer (`test-engineer`) — phase 7
- **Inputs:** approved phases 1–6; requirements as the verification contract. **Outputs:** tests on the branch, `07-test-report.md`, matrix TEST column, traceability-check output.
- **Tools:** read, edit, search, execute. **Must not:** modify production code; fake or skip coverage.
- **Escalates:** untestable ACs (coverage gaps); defects (documented, not fixed).

## Release Manager (`release-manager`) — phase 8
- **Inputs:** all artifacts, all phases 1–7 approved, verification status READY FOR PR. **Outputs:** `08-pull-request.md` (Summary, Changes Made, Test Evidence, Known Limitations, Reviewer Checklist), `CHANGELOG.md` entry, completed matrix, the PR and its URL/status.
- **Tools:** read, search, edit, execute (git push / gh pr create after approval only). **Must not:** ship with open gates, failed pre-PR checks or unwaived gaps; force-push; merge.
- **Escalates:** failed pre-PR checks, secrets in the diff, matrix gaps, push/auth failures, merge conflicts.

## Shared rules (all agents)
Defined in `.github/copilot-instructions.md`: never invent requirements; respect gates; stay in phase; maintain traceability; artifacts carry Open Questions + Assumptions; failures are reported, never papered over.
