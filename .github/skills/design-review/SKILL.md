---
name: design-review
description: 'SDLC phase 3: independently review a proposed architecture against requirements for completeness, security, scalability, simplicity, testability. Use when reviewing a design or producing 03-design-review.md.'
argument-hint: 'Story ID (e.g. US-001)'
---
# Design Review

## Purpose
Challenge the architecture rather than rubber-stamp it: independently re-verify requirements coverage and stress-test the design; output graded findings and a decision.

## User-facing communication
- Explain each important finding in plain words: what may go wrong, who or what is affected, and what should happen next.
- Avoid unexplained severity labels or acronyms in the summary; explain them briefly when they must be included.
- Start the review summary with the overall result and the most important practical effects.

## Required inputs
- `01-requirements.md` (phase 1 `approved`), `02-architecture.md` (phase 2 produced)

## Procedure
1. Verify artifact preconditions; refuse if phase 1 isn't approved or the architecture is missing mandatory sections (that itself is a REJECTED decision).
2. **Independent coverage check**: rebuild the REQ/NFR → component/ADR mapping yourself from scratch. Compare to the architect's traceability matrix. Every mismatch is a finding.
3. Review each area listed below. Record each problem as `DRF-###` with: description, related requirement or component, severity (Critical/High/Medium/Low), business or technical impact, recommended resolution, and whether an architecture change is required.
4. Mandatory **security assessment**: trust boundaries, authn/z on every new surface, data protection at rest/in transit, injection and SSRF surfaces, secret handling.
5. Flag **over-engineering**: any component/ADR or technology not justified by a requirement.
6. **Evidence rule:** do not fabricate vulnerabilities. Report only what the documents support, citing the section. Anything hypothetical is labelled "potential risk" with the condition under which it would matter; never present it as a confirmed defect.
7. Decide: **APPROVED** (no Critical/High findings open), **APPROVED WITH CONDITIONS** (open findings that need architecture changes), **REJECTED** (Critical findings or requirement coverage holes).
8. Fill [review template](./assets/design-review-template.md) → `03-design-review.md`; set phase `3-design-review` to `awaiting_approval`; stop.

## Remediation
- When findings need architecture changes, propose specific changes in "Recommended Changes" and mark which are significant decisions.
- Wait for human agreement on significant decisions. You do not edit `02-architecture.md`: after agreement, the Solution Architect updates it and records the rationale in its Revision History.
- The updated architecture is re-reviewed; the decision becomes APPROVED only once the conditions are resolved or the human records an accepted risk.
- **Only an APPROVED design can proceed to implementation planning.**

## Review areas
1. Requirements completeness
2. Component responsibilities
3. Scalability
4. Performance bottlenecks
5. Security vulnerabilities
6. Authentication and authorization
7. Data integrity and consistency
8. Error handling and resilience
9. API design
10. Integration dependencies
11. Deployment and operational readiness
12. Maintainability and technical debt
13. Cost and technology complexity

## Output format
`03-design-review.md` with the template sections: Review Summary, Review Scope, Findings, Risk Assessment, Recommended Changes, Accepted Risks, Open Questions, Final Review Decision.

## Quality checklist
- [ ] Coverage independently rebuilt (not copied from the architecture doc)
- [ ] Every finding has all seven required fields
- [ ] No hypothetical issue is reported as confirmed
- [ ] Security assessment present even if all-clear (justify "no concerns")
- [ ] Decision consistent with findings (no APPROVED with open Critical/High findings)
- [ ] No design rework performed; findings and proposals only

## Failure handling
- Insufficient information to assess an area → a "completeness" finding, with severity by risk.
- Disagreement with a requirement itself → route as an Open Question to the human; requirements are not in scope to change here.

## Example finding
**DRF-002 (High, security)** — `02-architecture.md` §7: the reset-link endpoint (REQ-001) defines no rate limiting, enabling enumeration/flooding; NFR-002 requires abuse resistance. Impact: account takeover attempts are unthrottled. Resolution: add a throttling decision (extend ADR-003 or add an ADR). Architecture change required: yes.

