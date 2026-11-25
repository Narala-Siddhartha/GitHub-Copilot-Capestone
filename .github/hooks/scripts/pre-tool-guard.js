#!/usr/bin/env node
'use strict';
/**
 * PreToolUse hook: deny dangerous commands, secret-file access, and
 * tampering with audit logs or hook configuration. Logs every decision.
 */
const { readStdin, toolName, toolInput, audit, stringValues } = require('./hook-utils');

const payload = readStdin();
const tool = toolName(payload);
const input = toolInput(payload);

const EXEC_TOOLS = /(bash|shell|powershell|terminal|execute|run)/;
const WRITE_TOOLS = /(edit|write|create|apply|patch|replace)/;
const READ_TOOLS = /(read|view|cat|open)/;

const DANGEROUS_COMMANDS = [
  [/\brm\s+(-[a-z]*r[a-z]*f|-[a-z]*f[a-z]*r)[a-z]*\s+([\/~]|\$home|"?[a-z]:\\)/i, 'recursive force-delete of a root/home path'],
  [/remove-item\s+[^|;]*-recurse[^|;]*-force\s+[^|;]*([a-z]:\\\s*$|[a-z]:\\[^\\]*$|\$home)/i, 'recursive force-delete of a drive/home path'],
  [/\b(rmdir|rd)\s+\/s\b/i, 'recursive directory delete'],
  [/\bgit\s+push\s+[^|;]*(--force\b|-f\b)/i, 'force push'],
  [/\bgit\s+(reset\s+--hard\s+\S+|clean\s+-[a-z]*f|filter-branch|filter-repo)/i, 'history rewrite / destructive git operation'],
  [/\bgit\s+branch\s+-D\s+main\b|\bgit\s+push\s+\S+\s+--delete\s+main\b/i, 'deleting main branch'],
  [/\b(format|mkfs|diskpart|dd\s+if=)/i, 'disk-level operation'],
  [/\b(shutdown|reboot)\b/i, 'OS power operation'],
  [/\b(curl|wget|iwr|invoke-webrequest)\b[^|;]*\|\s*(sh|bash|pwsh|powershell|iex)\b/i, 'piping remote script into a shell'],
  [/\biex\s*\(\s*(new-object\s+net\.webclient|invoke-webrequest|iwr)/i, 'executing downloaded code'],
  [/\bdrop\s+(table|database)\b/i, 'destructive SQL'],
  [/chmod\s+777\b/i, 'world-writable permissions'],
  [/\bgh\s+pr\s+merge\b/i, 'PR merge is a human action in this SDLC'],
];
const DIRECT_STORY_FOLDER_DELETE = /\b(?:remove-item|rm|rmdir|rd|del|erase)\b[^|;&]*(?:docs[\\/]sdlc[\\/]stories[\\/]US-\d+)/i;

const SECRET_PATHS = /(^|[\\\/.])(\.env(\.[\w.]+)?|id_rsa[^\\\/]*|[^\\\/]*\.(pem|key|pfx|p12)|[^\\\/]*credentials[^\\\/]*|\.netrc|\.npmrc|\.git-credentials)$/i;
const PROTECTED_WRITE = /(docs[\\\/]sdlc[\\\/]audit[\\\/]|\.github[\\\/]hooks[\\\/])/i;
const SECRET_READ_CMD = /\b(cat|type|get-content|gc|more|less|head|tail)\b[^|;&]*(\.env\b|id_rsa|\.pem\b|\.key\b|credentials)/i;

function decide(decision, reason) {
  audit('audit-log.jsonl', { event: 'PreToolUse', tool, decision, reason: reason || null });
  const out = { hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: decision } };
  if (reason) out.hookSpecificOutput.permissionDecisionReason = reason;
  process.stdout.write(JSON.stringify(out));
  process.exit(0);
}

const texts = stringValues(input);
const command = String(input.command || input.cmd || input.script || texts.join('\n'));
const filePath = String(input.path || input.file_path || input.filePath || input.uri || '');

if (EXEC_TOOLS.test(tool)) {
  if (DIRECT_STORY_FOLDER_DELETE.test(command)) {
    decide('deny', 'Story folders may only be replaced through the validated tools/new-story.js --replace-incomplete flow after explicit user selection.');
  }
  for (const [re, why] of DANGEROUS_COMMANDS) {
    if (re.test(command)) decide('deny', `Blocked dangerous command (${why}). See .github/instructions/security.instructions.md.`);
  }
  if (SECRET_READ_CMD.test(command)) decide('deny', 'Blocked reading a secret file via shell. Secrets must never enter the conversation.');
}

if (WRITE_TOOLS.test(tool) || READ_TOOLS.test(tool)) {
  if (filePath && SECRET_PATHS.test(filePath)) {
    decide('deny', `Blocked ${READ_TOOLS.test(tool) ? 'reading' : 'writing'} secret-bearing file: ${filePath}`);
  }
}

if (WRITE_TOOLS.test(tool) && filePath && PROTECTED_WRITE.test(filePath)) {
  decide('deny', 'Audit logs and hook configuration are protected. Changes there require a human editing them directly.');
}

decide('allow');
