---
name: "sdlc-1-requirements"
description: "Phase 1: produce the requirements specification (01-requirements.md) for a story."
agent: requirements-analyst
argument-hint: "New story text, a source, or an existing story ID (e.g. US-001)"
---
Execute SDLC phase 1 (Requirements Engineering) for the story given as input, using the `requirements-engineering` skill.

Ask all questions in simple, everyday words. Explain why each answer is needed, and briefly explain technical terms that cannot be avoided.

- Before Phase 1, use the shared `story-flow-selection` skill for new story text or missing story ID. List incomplete flows and ask the user to resume one or start new by replacing one specifically selected incomplete story. On resume, discard new story text and hand the selected ID to `sdlc-orchestrator`; do not run Phase 1 out of order. For an explicit existing story ID, run Phase 1 directly only if it is pending and the first unapproved phase; otherwise hand off to the Orchestrator to resume the correct state/gate without duplicating work.
- If the user chooses a new story, intake the user story with `node tools/new-story.js`; use `--replace-incomplete <selected-US-ID>` only after explicit user selection. Never delete folders directly.
- Input: the user story from pasted text, a repo file, or a Jira issue / Confluence page fetched through the available authenticated Atlassian MCP or source-specific Jira/Confluence MCP. If no suitable MCP is available for a Jira/Confluence source, stop and ask the user to paste its content. If no story is supplied and there is no incomplete flow, stop and ask for the story; never assume content. Also read `workflow-status.yml`.
- Produce only `docs/sdlc/stories/<story>/01-requirements.md` (14 sections, REQ/NFR/BR/AC IDs) and the initial traceability matrix rows. Do not design, plan, or implement.
- Clarification: before finalizing, ask grouped, specific questions with the reason for each, wait for answers, and record them. Never invent answers or silently resolve ambiguities.
- Validate unique IDs, testability, measurable ACs, no contradictions, and all unresolved questions documented; state each check's result.
- Report Open Questions and Assumptions explicitly.
- Set phase `1-requirements` to `awaiting_approval`, present for review, and STOP. Do not start phase 2 until the human explicitly approves.
