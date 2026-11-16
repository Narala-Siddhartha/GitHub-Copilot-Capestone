# Approval Matrix

Every phase ends in a human approval gate. Agents may set `awaiting_approval`; only a human decision recorded in chat produces `approved` or `rejected` in `workflow-status.yml` (with `approved_by` and `approved_at`).

## Gates

| Gate (after phase) | Approver | Decision basis (evidence presented) | On rejection |
|--------------------|----------|-------------------------------------|--------------|
| 1 Requirements | Product owner / requester | REQ/NFR/AC completeness, open questions answered, scope correct | Analyst reworks; IDs preserved |
| 2 Architecture | Tech lead (informed by phase 3) | Coverage table, ADR trade-offs | Architect reworks ADRs/components |
| 3 Design Review | Tech lead | DRF findings vs decision; Critical/High findings resolved or recorded as accepted risks; only APPROVED proceeds to phase 4 | Back to phase 2; architecture updated, then re-reviewed |
| 4 Implementation Plan | Tech lead / dev team | Task coverage, order, estimates, verification notes | Planner reworks |
| 5 Implementation | Dev lead (informed by phase 6) | Implementation log: all tasks accounted for, deviations approved | Implementer fixes on the story branch |
| 6 Code Review | Dev lead | CRF findings vs decision; security section; dependency review | Implementer reworks; reviewer re-reviews delta |
| 7 Verification & Testing | QA owner / dev lead | Coverage table, run results, defects, gaps | Defects → phase 5 rework path; gaps → waive or fix |
| 8 Pull Request | Release owner | Gate audit (8/8), traceability check output, PR description | PR not created; gaps routed back |

## Decision language

Approvals must be explicit, e.g. **"approve phase 3 for US-001"**. Silence, "ok", or "continue" in an unrelated context must not be recorded as approval. Rejections should state reasons; the agent records them in the artifact's Revision History.

## Waivers

Traceability gaps or skipped coverage may be waived only by the gate approver, recorded in the story's `traceability-matrix.md` **Waivers** table (gap, waived by, date, reason).

## Escalation triggers (agent → human, outside normal gates)

| Trigger | Raised by |
|---------|-----------|
| Story too vague / contradictory | requirements-analyst |
| Unsatisfiable requirement | solution-architect |
| Blocker finding | design-reviewer, code-reviewer |
| Plan/reality deviation, unplanned dependency | implementer |
| Untestable AC, suite cannot run, defect found | test-engineer |
| Open gate or matrix gap at PR time, push failure | release-manager |
| Invalid phase output after 2 retries, inconsistent state | sdlc-orchestrator |

## Non-bypass guarantees

- Phase agents verify prerequisite approvals and refuse to run out of order.
- The Orchestrator re-verifies before delegating (belt and braces).
- The Release Manager re-audits all 8 gates before creating a PR — the last line of defense.
- Hooks deny `gh pr merge`, force-pushes, and edits to audit logs or hook configs.
- Merging the PR is always a human action.
