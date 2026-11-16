---
name: "SDLC 3 — Design Review"
description: "Phase 3: independently review the architecture and produce findings (03-design-review.md)."
agent: design-reviewer
argument-hint: "Story ID (e.g. US-001)"
---
Execute SDLC phase 3 (Design Review) for the story given as input, using the `design-review` skill.

- Input documents: `docs/sdlc/stories/<story>/01-requirements.md` (approved) and `02-architecture.md`.
- Produce only `03-design-review.md`: independently rebuilt coverage table, DRF findings with severities, a mandatory security assessment, and a verdict (approve / approve-with-conditions / reject). Do not modify the architecture.
- Before finishing, validate against the skill's quality checklist; confirm the verdict is consistent with the findings.
- Report every finding and any areas you could not assess (as completeness findings) — never gloss over gaps.
- Set phase `3-design-review` to `awaiting_approval` and STOP. The human decides whether findings force rework of phase 2.
