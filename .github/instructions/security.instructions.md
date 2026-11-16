---
description: "Use when handling credentials, environment files, authentication code, dependency additions, or shell commands. Security and secret-handling policy for all agents."
---
# Security Policy

## Secrets

- Never write secrets (API keys, tokens, passwords, private keys, connection strings) into any tracked file, artifact, log, or chat output. Use environment variables and reference them by name.
- Never read or print the contents of `.env*`, `*.pem`, `*.key`, `id_rsa*`, `*credentials*`, `*.pfx` files. Hooks deny these operations; do not attempt workarounds.
- If a secret is discovered in the repo or history, stop, report it as a blocking finding, and escalate to the human.

## Commands

- Destructive commands (recursive deletes outside the workspace, `git push --force`, history rewrites, disk/OS-level operations, piping remote scripts to a shell) are blocked by hooks. Do not attempt them or equivalents.
- Prefer dry-run flags first when a command mutates state.

## Code

- Validate and sanitize all external input at trust boundaries.
- No dynamic code execution from user input (eval, deserialization of untrusted data).
- Parameterize all database queries.
- New dependencies require a justification line in the implementation plan or log (name, purpose, license).
- Design review (phase 3) and code review (phase 6) must each include an explicit security assessment section; "not applicable" must be justified.
