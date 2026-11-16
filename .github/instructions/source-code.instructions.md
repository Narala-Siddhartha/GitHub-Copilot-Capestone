---
description: "Use when writing or modifying application source code during the implementation phase. Covers coding standards, commit conventions, and the stack placeholder."
---
# Source Code Rules

## Stack (placeholder — update when chosen)

The application stack is **not yet selected**. When it is, replace this section with:
language/framework versions, directory layout, install/build/test/lint commands, and formatting tool. Also update `.github/hooks/scripts/post-tool-validate.js` (`LINT_COMMAND`, `TEST_PATTERNS`).

## General standards (stack-independent)

- Implement only what an approved `TASK-###` covers; reference the task ID in the commit message: `feat: <summary> (TASK-003, REQ-002)`.
- Small, focused commits — one task (or coherent sub-step) per commit.
- Follow Conventional Commits: `feat|fix|refactor|test|docs|chore(scope): message`.
- No dead code, commented-out blocks, or TODOs without a linked `TASK`/`DRF` ID.
- Public functions/classes get doc comments stating purpose, inputs, outputs, and errors.
- Error handling: fail explicitly; never swallow exceptions silently; log with context.
- Keep functions small and single-purpose; prefer composition over inheritance.
- Match the architecture: new modules must correspond to components named in `02-architecture.md`. Introducing an unplanned component requires going back through the design-change path (see `docs/sdlc-workflow.md`).
