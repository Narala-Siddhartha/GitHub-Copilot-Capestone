---
name: "sdlc-3-design-review"
description: "Phase 3: independently review the architecture and produce findings (03-design-review.md)."
agent: design-reviewer
argument-hint: "Story ID (e.g. US-001)"
---
Execute SDLC phase 3 (Design Review) for the story given as input, using the `design-review` skill.

- Input documents: `docs/sdlc/stories/<story>/01-requirements.md` (approved) and `02-architecture.md`.
- Act as an independent reviewer who challenges the design. Produce only `03-design-review.md`: findings (Critical/High/Medium/Low, with impact, resolution and whether an architecture change is required), risk assessment, recommended changes, accepted risks, open questions, and a final decision (APPROVED / APPROVED WITH CONDITIONS / REJECTED). Do not modify the architecture.
- Do not fabricate vulnerabilities; label hypothetical issues as potential risks.
- Before finishing, validate against the skill's quality checklist; confirm the decision is consistent with the findings.
- Remediation: propose specific changes, wait for human agreement on significant decisions, and let the Solution Architect update `02-architecture.md` with the rationale recorded.
- Set phase `3-design-review` to `awaiting_approval` and STOP. Only an APPROVED design can proceed to implementation planning.
