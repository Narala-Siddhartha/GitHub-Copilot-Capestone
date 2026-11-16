#!/usr/bin/env node
'use strict';
/**
 * PostToolUse hook:
 *  - block tool results that wrote secret material into files
 *  - capture test-command executions to docs/sdlc/audit/test-runs.jsonl
 *  - validate SDLC artifacts (frontmatter) on write, warn via systemMessage
 *  - run the project linter on written source files (no-op until a stack is chosen)
 *  - append every tool use to the audit log
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { REPO_ROOT, readStdin, toolName, toolInput, readField, audit, stringValues } = require('./hook-utils');

// ---- Stack wiring (fill in when a tech stack is chosen) --------------------
const LINT_COMMAND = null; // e.g. 'npx eslint --fix' or 'ruff check --fix'
const SOURCE_FILE = /\.(ts|js|tsx|jsx|py|java|cs|go|rb|rs)$/i;
// ---------------------------------------------------------------------------

const TEST_COMMAND = /\b(npm\s+(run\s+)?test|npx\s+(jest|vitest|mocha)|pytest|python\s+-m\s+(pytest|unittest)|go\s+test|mvn\s+(test|verify)|gradle\s+test|dotnet\s+test|cargo\s+test)\b/i;
const SECRET_CONTENT = [
  [/AKIA[0-9A-Z]{16}/, 'AWS access key'],
  [/\bgh[pousr]_[A-Za-z0-9]{36,}/, 'GitHub token'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'private key block'],
  [/\b(password|passwd|secret|api[_-]?key|token)\b\s*[:=]\s*['"][^'"\s]{8,}['"]/i, 'hardcoded credential assignment'],
  [/\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}\b/, 'JWT'],
];

const payload = readStdin();
const tool = toolName(payload);
const input = toolInput(payload);
const WRITE_TOOLS = /(edit|write|create|apply|patch|replace)/;
const EXEC_TOOLS = /(bash|shell|powershell|terminal|execute|run)/;

const filePath = String(input.path || input.file_path || input.filePath || '');
const command = String(input.command || input.cmd || '');
const messages = [];

audit('audit-log.jsonl', {
  event: 'PostToolUse',
  tool,
  file: filePath || undefined,
  command: command ? command.slice(0, 300) : undefined,
});

// 1. Secret scan on written content → block
if (WRITE_TOOLS.test(tool)) {
  const content = stringValues(input).join('\n');
  for (const [re, what] of SECRET_CONTENT) {
    if (re.test(content)) {
      audit('audit-log.jsonl', { event: 'SecretBlocked', tool, file: filePath, what });
      process.stdout.write(JSON.stringify({
        decision: 'block',
        reason: `Possible secret written (${what}) in ${filePath || 'file'}. Remove it and use an environment variable reference instead. See .github/instructions/security.instructions.md.`,
      }));
      process.exit(0);
    }
  }
}

// 2. Test-run capture
if (EXEC_TOOLS.test(tool) && TEST_COMMAND.test(command)) {
  const result = readField(payload, ['tool_response', 'toolResult', 'result', 'output'], '');
  const resultText = typeof result === 'string' ? result : JSON.stringify(result);
  audit('test-runs.jsonl', { command: command.slice(0, 300), resultSummary: String(resultText).slice(0, 1000) });
  messages.push('Test run captured to docs/sdlc/audit/test-runs.jsonl.');
}

// 3. SDLC artifact validation on write
if (WRITE_TOOLS.test(tool) && /docs[\\\/]sdlc[\\\/]stories[\\\/]US-\d+[\\\/].+\.md$/i.test(filePath)) {
  try {
    const abs = path.isAbsolute(filePath) ? filePath : path.join(REPO_ROOT, filePath);
    const text = fs.readFileSync(abs, 'utf8');
    const problems = [];
    if (!/^---\r?\n[\s\S]+?\r?\n---/.test(text)) problems.push('missing YAML frontmatter');
    else {
      for (const key of ['story:', 'phase:', 'status:']) {
        if (!text.slice(0, 500).includes(key)) problems.push(`frontmatter missing ${key.replace(':', '')}`);
      }
    }
    if (!/##\s*Open Questions/i.test(text)) problems.push('missing "## Open Questions" section');
    if (!/##\s*Assumptions/i.test(text)) problems.push('missing "## Assumptions" section');
    if (problems.length) messages.push(`Artifact ${path.basename(filePath)} is invalid: ${problems.join('; ')}. Fix before requesting approval.`);
  } catch (_e) { /* file may not exist yet in this payload shape */ }
}

// 4. Lint/format written source files (active once LINT_COMMAND is set)
if (LINT_COMMAND && WRITE_TOOLS.test(tool) && filePath && SOURCE_FILE.test(filePath)) {
  try {
    execSync(`${LINT_COMMAND} "${filePath}"`, { cwd: REPO_ROOT, stdio: 'pipe', timeout: 20000 });
  } catch (e) {
    messages.push(`Lint issues in ${filePath}: ${String(e.stdout || e.message).slice(0, 500)}`);
  }
}

process.stdout.write(JSON.stringify(messages.length ? { continue: true, systemMessage: messages.join(' ') } : { continue: true }));
process.exit(0);
