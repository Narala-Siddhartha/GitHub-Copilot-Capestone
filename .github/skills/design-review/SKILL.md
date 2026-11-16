---
name: design-review
description: 'SDLC phase 3: independently review a proposed architecture against requirements for completeness, security, scalability, simplicity, testability. Use when reviewing a design or producing 03-design-review.md.'
argument-hint: 'Story ID (e.g. US-001)'
---
# Design Review

## Purpose
Catch design defects before implementation by independently re-verifying requirements coverage and stress-testing the architecture; output graded findings and a verdict.

## Required inputs
- `01-requirements.md` (phase 1 `approved`), `02-architecture.md` (phase 2 produced)

## Procedure
1. Verify artifact preconditions; refuse if phase 1 isn't approved or the architecture is missing mandatory sections (that itself is a `reject`).
2. **Independent coverage check**: rebuild the REQ/NFR → component/ADR mapping yourself from scratch. Compare to the architect's coverage table. Every mismatch is a finding.
3. Review each checklist dimension (below); record each problem as `DRF-###` with: severity (blocker/major/minor), category, affected section + REQ/ADR IDs, evidence, recommendation (directional, not a full redesign).
4. Mandatory **security assessment**: trust boundaries, authn/z on every new surface, data protection at rest/in transit, injection and SSRF surfaces, secret handling.
5. Flag **over-engineering**: any component/ADR not justified by a requirement.
6. Decide verdict: **approve** (no blockers/majors), **approve-with-conditions** (majors with concrete conditions), **reject** (blockers or coverage holes).
7. Fill [review template](./assets/design-review-template.md) → `03-design-review.md`; set phase `3-design-review` to `awaiting_approval`; stop.

## Review dimensions
- **Completeness** — all REQ/NFR covered; interfaces fully specified; failure paths designed
- **Security** — mandatory section (step 4)
- **Scalability/Performance** — NFR strategies realistic and measured
- **Maintainability** — clear boundaries, low coupling, no cyclic dependencies
- **Simplicity** — simplest design that satisfies requirements; YAGNI violations flagged
- **Testability** — contracts mockable, side effects isolated, ACs verifiable against interfaces

## Output format
`03-design-review.md` per the template: frontmatter, independent coverage table, DRF findings table + details, security assessment, verdict with rationale.

## Quality checklist
- [ ] Coverage independently rebuilt (not copied from the architecture doc)
- [ ] Every finding has severity, category, evidence, affected IDs, recommendation
- [ ] Security section present even if all-clear (justify "no concerns")
- [ ] Verdict consistent with findings (no `approve` with open blockers)
- [ ] No design rework performed — findings only

## Failure handling
- Insufficient information to assess an area → finding of category `completeness`, severity by risk.
- Disagreement with a requirement itself → route as an Open Question to the human; requirements are not in scope to change here.

## Example finding
**DRF-002 (major, security)** — `02-architecture.md` §Interfaces: the reset-link endpoint (REQ-001) defines no rate limiting, enabling enumeration/flooding; NFR-002 requires abuse resistance. Recommendation: add a throttling decision (extend ADR-003 or add an ADR).
