---
name: pull-request-creation
description: 'SDLC phase 8: audit all approval gates, complete the traceability matrix, assemble the PR description, and create the pull request. Use when shipping a story or producing 08-pull-request.md.'
argument-hint: 'Story ID (e.g. US-001)'
---
# Pull Request Creation

## Purpose
Package the fully approved story into a reviewable pull request with a complete, auditable traceability chain — and act as the final gate that refuses to ship anything unapproved.

## Required inputs
- All artifacts `01`–`07` with phases 1–7 `approved` in `workflow-status.yml`, plus `CHANGELOG.md` (create it if absent) and the source changes
- Story branch with all commits; clean working tree

## Procedure
1. **Pre-PR validation** (stop and report the reason if any mandatory condition fails; record each result, with evidence, in the gate audit):
   1. Requirements approved (phase 1 `approved`).
   2. Architecture approved (phase 2 `approved`).
   3. Design review approved (phase 3 `approved` and decision APPROVED).
   4. Implementation tasks completed (every task in `04-implementation-plan.md` done, or deferred with human approval).
   5. Code review has no unresolved blocking findings (phase 6 `approved`; no open Critical/High CRF).
   6. Verification status is READY FOR PR (`07-test-report.md`; phase 7 `approved`).
   7. Tests have actual execution evidence (captured command output in the report, and entries in `docs/sdlc/audit/test-runs.jsonl`); a report that lacks evidence fails.
   8. No secrets or sensitive files in the diff: check the changed file names against `.env*`, `*.pem`, `*.key`, `*.pfx`, `*credentials*`, and scan the diff for credential patterns. Any hit is a blocking finding for the human.
   9. Changes are limited to approved scope: every changed file maps to a TASK's expected files. Unmapped files fail the check.
2. **Traceability audit**: run `node .github/skills/verification-testing/scripts/check-traceability.js US-###`; complete `traceability-matrix.md` (Code column from `git log --name-only`, TEST column from the test report). Gaps → stop; request human waiver or route back.
3. **PR preparation**: identify the current branch and the target base branch (default `main`; confirm with the human if unclear); review the complete diff (`git diff <base>...HEAD`); check divergence from the base (`git log <base>..HEAD`, `git log HEAD..<base>`) and surface conflicts, never auto-resolving silently; confirm `git status` is clean.
4. **Changelog**: add an entry for this story to `CHANGELOG.md` (Keep a Changelog style: Added/Changed/Fixed), referencing the story ID and requirement IDs. Commit it as `docs: update changelog (US-###)`.
5. Prepare a meaningful PR title (`US-###: <outcome>`) and assemble the PR description from [PR template](./assets/pr-template.md) → `08-pull-request.md`, with the mandatory sections Summary, Changes Made, Test Evidence, Known Limitations and Reviewer Checklist, plus the gate audit, traceability chain and links to the documentation.
6. Set phase `8-pull-request` to `awaiting_approval`; present the proposed PR details (title, base and head branches, description, changelog entry, gate audit) to the human; STOP.
7. **Only after explicit approval**: commit `08-pull-request.md`, push the branch (`git push -u origin story/...`), and create the PR (`gh pr create --base <base> --title "US-###: <title>" --body-file docs/sdlc/stories/US-###/08-pull-request.md`, or the GitHub MCP tools if configured). No remote and no `gh`/MCP? Record the exact commands in the artifact and report.
8. Do not merge the PR. Report the PR URL and its status (open, draft, checks pending). Record the URL in the artifact and `workflow-status.yml`; mark phase 8 `approved` only with the human's recorded decision.

## Output format
`08-pull-request.md` per the template, with these mandatory PR description sections:
- **Summary**: 2-3 sentences on what was built and why.
- **Changes Made**: every added or modified file and its purpose.
- **Test Evidence**: actual test output or CI results (never a claim without output).
- **Known Limitations**: all known Not Found scenarios, unresolved limitations and out-of-scope functionality.
- **Reviewer Checklist**: requirements compliance, architecture compliance, security, error handling, test coverage, code quality, documentation, dependency safety.

## Quality checklist
- [ ] All nine pre-PR checks recorded with evidence; any failure stopped the run
- [ ] check-traceability.js exits 0 or every gap has a recorded human waiver
- [ ] Matrix has no empty cells for any REQ row
- [ ] Every file in the diff is listed under Changes Made, and is in approved scope
- [ ] Test Evidence contains real captured output
- [ ] CHANGELOG.md updated
- [ ] Working tree clean; artifacts committed; no force-push used
- [ ] PR body links the relevant documentation
- [ ] PR created only after explicit human approval; not merged

## Failure handling
- Open gate or matrix gap → abort with a precise list; options: waive (human), or route back via the Orchestrator.
- Push/auth failure → record error + manual commands; never embed credentials or alter remotes to work around it.
- `main` moved with conflicts → report files in conflict; rebase/merge strategy is a human decision.
