---
name: "sdlc-8-pull-request"
description: "Phase 8: audit all gates, complete traceability, and create the pull request (08-pull-request.md)."
agent: release-manager
argument-hint: "Story ID (e.g. US-001)"
---
Execute SDLC phase 8 (Pull Request Creation) for the story given as input, using the `pull-request-creation` skill.

- Inputs: all artifacts `01`–`07`, `workflow-status.yml`, the source diff and `CHANGELOG.md` — phases 1–7 must ALL be `approved`, the design review APPROVED, and the verification status READY FOR PR. If any mandatory pre-PR check fails (requirements, architecture and design review approved; tasks complete; no unresolved blocking review findings; READY FOR PR; real test execution evidence; no secrets or sensitive files; changes within approved scope), stop and report the reason; this gate cannot be bypassed.
- Audit traceability (`check-traceability.js` + completed matrix); any gap stops the run pending a human waiver.
- Prepare: identify the current and base branches, review the complete diff, write a meaningful title, update `CHANGELOG.md`, and produce `08-pull-request.md` from the PR template with the mandatory sections Summary, Changes Made, Test Evidence, Known Limitations and Reviewer Checklist, plus documentation links.
- Select the available authenticated GitHub or GitLab MCP for this repository. If both are available, ask the user to choose one and wait; provider selection alone does not approve PR creation. If one is available, use it. If neither is available, document that and use a configured CLI only as fallback, otherwise record manual commands.
- Record the selected provider in `08-pull-request.md`. Present the proposed PR/MR details (provider, title, branches, description, changelog entry, gate audit), set phase `8-pull-request` to `awaiting_approval`, and STOP for human approval.
- Only after explicit PR-detail approval: push the branch using the configured Git transport and create the PR/MR through the selected MCP. Never switch providers silently after failure. Report the URL and status. Never force-push; never merge.
