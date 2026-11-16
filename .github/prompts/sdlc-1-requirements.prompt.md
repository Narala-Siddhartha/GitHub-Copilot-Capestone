---
name: "SDLC 1 — Requirements"
description: "Phase 1: produce the requirements specification (01-requirements.md) for a story."
agent: requirements-analyst
argument-hint: "Story ID (e.g. US-001)"
---
Execute SDLC phase 1 (Requirements Engineering) for the story given as input, using the `requirements-engineering` skill.

- Input: the user story from pasted text, a repo file, or a Jira issue / Confluence page read through the Atlassian MCP server. If none is supplied or the MCP server is unavailable, stop and ask; never assume content. Also read `workflow-status.yml`.
- Produce only `docs/sdlc/stories/<story>/01-requirements.md` (14 sections, REQ/NFR/BR/AC IDs) and the initial traceability matrix rows. Do not design, plan, or implement.
- Clarification: before finalizing, ask grouped, specific questions with the reason for each, wait for answers, and record them. Never invent answers or silently resolve ambiguities.
- Validate unique IDs, testability, measurable ACs, no contradictions, and all unresolved questions documented; state each check's result.
- Report Open Questions and Assumptions explicitly.
- Set phase `1-requirements` to `awaiting_approval`, present for review, and STOP. Do not start phase 2 until the human explicitly approves.
