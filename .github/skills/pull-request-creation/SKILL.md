---
name: pull-request-creation
description: 'SDLC phase 8: audit all approval gates, complete the traceability matrix, assemble the PR description, and create the pull request. Use when shipping a story or producing 08-pull-request.md.'
argument-hint: 'Story ID (e.g. US-001)'
---
# Pull Request Creation

## Purpose
Package the fully approved story into a reviewable pull request with a complete, auditable traceability chain — and act as the final gate that refuses to ship anything unapproved.

## Required inputs
- All artifacts `01`–`07` with phases 1–7 `approved` in `workflow-status.yml`
- Story branch with all commits; clean working tree

## Procedure
1. **Gate audit**: read `workflow-status.yml`; build a table of all 8 phases with status, approved_by, approved_at. ANY phase (1–7) not `approved` → abort and report which gate is open.
2. **Traceability audit**: run `node .github/skills/verification-testing/scripts/check-traceability.js US-###`; complete `traceability-matrix.md` (Code column from `git log --name-only`, TEST column from the test report). Gaps → stop; request human waiver or route back.
3. **Branch hygiene**: `git status` clean; branch contains all artifact files; check divergence from `main` (`git log main..HEAD`, `git log HEAD..main`); surface conflicts — never auto-resolve silently.
4. Assemble the PR description from [PR template](./assets/pr-template.md) → `08-pull-request.md`: story summary, requirements list, ADR summary, task list with commits, test results summary, full chain US→REQ→ADR→TASK→code→TEST, artifact links, reviewer checklist.
5. Set phase `8-pull-request` to `awaiting_approval`; present the PR description + gate audit to the human; STOP.
6. **Only after explicit approval**: commit `08-pull-request.md`, push the branch (`git push -u origin story/...`), create the PR (`gh pr create --title "US-###: <title>" --body-file docs/sdlc/stories/US-###/08-pull-request.md`). No remote/`gh`? Record the exact commands in the artifact and report.
7. Record the PR URL in the artifact and `workflow-status.yml`; mark phase 8 `approved` (with the human decision metadata).

## Output format
`08-pull-request.md` per the template.

## Quality checklist
- [ ] Gate audit table shows 8/8 phases with approval metadata (or aborted)
- [ ] check-traceability.js exits 0 or every gap has a recorded human waiver
- [ ] Matrix has no empty cells for any REQ row
- [ ] Working tree clean; artifacts committed; no force-push used
- [ ] PR body links every artifact
- [ ] PR created only after explicit human approval

## Failure handling
- Open gate or matrix gap → abort with a precise list; options: waive (human), or route back via the Orchestrator.
- Push/auth failure → record error + manual commands; never embed credentials or alter remotes to work around it.
- `main` moved with conflicts → report files in conflict; rebase/merge strategy is a human decision.
