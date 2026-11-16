---
name: "SDLC 1 — Requirements"
description: "Phase 1: produce the requirements specification (01-requirements.md) for a story."
agent: requirements-analyst
argument-hint: "Story ID (e.g. US-001)"
---
Execute SDLC phase 1 (Requirements Engineering) for the story given as input, using the `requirements-engineering` skill.

- Input documents: `docs/sdlc/stories/<story>/user-story.md`, `workflow-status.yml`.
- Produce only `01-requirements.md` and the initial traceability matrix rows. Do not design, plan, or implement.
- Before finishing, validate the output against the skill's quality checklist and state the result of each check.
- Report all Open Questions and Assumptions explicitly in your summary. If the story lacks information, ask — never invent requirements.
- Set phase `1-requirements` to `awaiting_approval` and STOP. Do not start phase 2.
