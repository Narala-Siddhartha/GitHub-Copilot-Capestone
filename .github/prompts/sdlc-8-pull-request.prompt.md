---
name: "SDLC 8 — Pull Request"
description: "Phase 8: audit all gates, complete traceability, and create the pull request (08-pull-request.md)."
agent: release-manager
argument-hint: "Story ID (e.g. US-001)"
---
Execute SDLC phase 8 (Pull Request Creation) for the story given as input, using the `pull-request-creation` skill.

- Inputs: all artifacts `01`–`07`, `workflow-status.yml`, the source diff and `CHANGELOG.md` — phases 1–7 must ALL be `approved`, the design review APPROVED, and the verification status READY FOR PR. If any mandatory pre-PR check fails (requirements, architecture and design review approved; tasks complete; no unresolved blocking review findings; READY FOR PR; real test execution evidence; no secrets or sensitive files; changes within approved scope), stop and report the reason; this gate cannot be bypassed.
- Audit traceability (`check-traceability.js` + completed matrix); any gap stops the run pending a human waiver.
- Prepare: identify the current and base branches, review the complete diff, write a meaningful title, update `CHANGELOG.md`, and produce `08-pull-request.md` from the PR template with the mandatory sections Summary, Changes Made, Test Evidence, Known Limitations and Reviewer Checklist, plus documentation links.
- Present the proposed PR details (title, branches, description, changelog entry, gate audit), set phase `8-pull-request` to `awaiting_approval`, and STOP for human approval.
- Only after explicit approval: push the branch and create the PR (or, with no remote, record the exact manual commands). Report the PR URL and its status. Never force-push; never merge.
