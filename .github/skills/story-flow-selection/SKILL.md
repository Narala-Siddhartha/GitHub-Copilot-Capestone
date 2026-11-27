---
name: story-flow-selection
description: 'Shared preflight for new SDLC story input: offer resume or replace choices for incomplete story flows before /sdlc-run or direct Phase 1 intake.'
argument-hint: 'Used by sdlc-run and Phase 1 entry points'
---
# Story Flow Selection

## Purpose
Use one consistent resume-or-replace decision before creating a new story through `/sdlc-run` or direct Phase 1 invocation.

## How to speak to the user
- Use simple, everyday words in every question, choice, explanation, error, and update. Do not expect the user to know SDLC terms.
- Explain “unfinished story” as work that has not gone through all review steps yet. Avoid terms such as “workflow state” or “first unapproved phase” in the question.
- List each story in a readable way: its name, where work stopped (for example, “Design review”), and its ID for reference.
- Clearly say that “continue” keeps working on that story, while “start a new story” removes the selected unfinished story’s files and starts over. Explain that other stories and shared project files are kept.
- Ask one clear question with simple options. If the user does not answer clearly, explain what is unclear and ask again without taking action.

## Procedure
1. For a new story input, or when no story was supplied, run `node tools/new-story.js --list-incomplete`. Parse its JSON output. If it exits non-zero, report the error and stop without intake or cleanup.
2. If no incomplete stories are listed:
   - With story text, continue with ordinary intake.
   - Without story text, ask the user to provide a story and stop.
3. If one or more unfinished stories are listed, show each story's name, where work stopped (for example, “Design review”), and ID. Ask in simple words:
   - **Continue this story** — choose a story to carry on with. Any new story text you sent will not be used.
   - **Start a new story instead** — choose one unfinished story to remove, then provide the new story. Only the chosen story's files are removed. Completed stories and shared project files are kept.
   For multiple stories, every option must identify the exact story ID. Never choose a story implicitly.
4. If no story text was supplied, ask: “Would you like to continue one of these stories, or send a new story to start? If you start new, choose which unfinished story to replace.” If they choose a new story, wait for that story text before intake.
5. If the user chose new but has not provided the story yet, retain the selected story ID in conversation context. When the story arrives, honor that prior choice without asking again, but let the script revalidate the selected flow. If context is unavailable, ask again.
6. On resume, discard any newly supplied story text and hand the selected ID to `sdlc-orchestrator`. Continue from the recorded state: an `awaiting_approval` phase returns to its existing gate without rerunning its agent; a valid artifact left `in_progress` returns to the gate; a missing/invalid in-progress artifact resumes that phase agent. Do not run Phase 1 out of order.
7. On new, write the provided story text verbatim to `docs/sdlc/stories/.intake.md`, then run `node tools/new-story.js --file docs/sdlc/stories/.intake.md --title "<short title>" --replace-incomplete <selected-US-ID>`. This script is the only permitted deletion path. It revalidates the selected folder and its incomplete status before replacing it.
8. Confirm exit code 0 and that the newly reported story folder contains `user-story.md` and `workflow-status.yml` before delegating Phase 1. Do not delegate in the intake step.
9. For no answer or an invalid choice, report the issue and ask again; do not proceed with intake or cleanup until the user supplies a valid choice. If a selected story is unavailable, report it, refresh the incomplete-story list, and ask again. If cleanup fails, report the script error and any recovery errors and stop; never claim success.

## Safety rules
- A story is incomplete when at least one phase status in `workflow-status.yml` is not `approved`.
- A user's explicit choice to replace one listed incomplete story authorizes deletion of only that story's folder.
- Never remove completed story folders, unselected incomplete story folders, shared templates, framework files, or audit logs.
- Never run a shell deletion command for a story folder. Use only `tools/new-story.js --replace-incomplete` after the user's explicit choice.
- Existing story IDs and phase-approval gates remain authoritative; a resume choice does not approve any phase.
