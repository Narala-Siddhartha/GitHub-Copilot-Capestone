---
name: "SDLC 8 — Pull Request"
description: "Phase 8: audit all gates, complete traceability, and create the pull request (08-pull-request.md)."
agent: release-manager
argument-hint: "Story ID (e.g. US-001)"
---
Execute SDLC phase 8 (Pull Request Creation) for the story given as input, using the `pull-request-creation` skill.

- Inputs: all artifacts `01`–`07` and `workflow-status.yml` — phases 1–7 must ALL be `approved`. If any gate is open, abort and report exactly which; this gate cannot be bypassed.
- Audit traceability (`check-traceability.js` + completed matrix); any gap stops the run pending a human waiver.
- Produce `08-pull-request.md` from the PR template (gate audit, requirements, ADRs, tasks, test results, full US→REQ→ADR→TASK→code→TEST chain, artifact links).
- Present the PR description and gate audit, set phase `8-pull-request` to `awaiting_approval`, and STOP for human approval.
- Only after explicit approval: push the branch and create the PR (or, with no remote, record the exact manual commands). Record the PR URL. Never force-push; never merge.
