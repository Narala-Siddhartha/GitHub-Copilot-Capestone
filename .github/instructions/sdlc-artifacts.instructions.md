---
description: "Use when creating or editing SDLC phase artifacts under docs/sdlc (requirements, architecture, design review, implementation plan, code review, test report, PR documents, workflow status)."
applyTo: "docs/sdlc/**"
---
# SDLC Artifact Rules

## All artifacts

- Markdown with YAML frontmatter containing at minimum:

  ```yaml
  ---
  story: US-001
  phase: 1-requirements        # matches workflow-status.yml key
  status: draft                # draft | awaiting_approval | approved | rejected
  date: 2026-01-01
  author: requirements-analyst # agent name
  ---
  ```

- Every artifact ends with two sections, even if empty: `## Open Questions` and `## Assumptions`. Assumptions must each have an ID (`ASM-###`) and a risk note.
- Never delete a prior phase's artifact. Revisions append a `## Revision History` entry.
- Do not renumber existing IDs; new items get the next free number.

## workflow-status.yml

- One file per story at `docs/sdlc/stories/US-###/workflow-status.yml`.
- Only these status values: `pending`, `in_progress`, `awaiting_approval`, `approved`, `rejected`.
- `approved`/`rejected` may only be written after an explicit human decision in chat; record `approved_by` (the human's words/handle) and `approved_at` (ISO date).
- Never set a phase to `in_progress` while any earlier phase is not `approved`.

## Audit directory

- `docs/sdlc/audit/` is written by hooks only. Agents must never edit or delete files there.
