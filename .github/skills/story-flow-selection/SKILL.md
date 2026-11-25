---
name: story-flow-selection
description: 'Shared preflight for new SDLC story input: offer resume or replace choices for incomplete story flows before /sdlc-run or direct Phase 1 intake.'
argument-hint: 'Used by sdlc-run and Phase 1 entry points'
---
# Story Flow Selection

## Purpose
Use one consistent resume-or-replace decision before creating a new story through `/sdlc-run` or direct Phase 1 invocation.

## Procedure
1. For a new story input, or when no story was supplied, run `node tools/new-story.js --list-incomplete`. Parse its JSON output. If it exits non-zero, report the error and stop without intake or cleanup.
2. If no incomplete stories are listed:
   - With story text, continue with ordinary intake.
   - Without story text, ask the user to provide a story and stop.
3. If one or more incomplete stories are listed, show each story ID, title, first unapproved phase, and status. Ask the user to choose:
   - Resume one listed story; or
   - Start a new story by replacing one specifically selected incomplete story.
   For multiple stories, every option must identify the exact story ID. Never choose a story implicitly.
4. If there is no new story text, ask whether the user wants to provide a new story or resume a listed flow. If they choose a new story, wait for that story text before intake.
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
