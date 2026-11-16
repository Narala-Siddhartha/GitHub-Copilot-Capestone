#!/usr/bin/env node
/**
 * Validates the Copilot Agentic SDLC framework:
 *  - agents/prompts/instructions/skills have parseable frontmatter and required fields
 *  - skill folder names match their `name` field; descriptions within limits
 *  - prompt `agent:` references and orchestrator `agents:` entries resolve to agent files
 *  - instruction applyTo globs are well-formed
 *  - hooks config is valid JSON, uses only supported events, and scripts parse
 * Usage: node tools/validate-framework.js   (exit 1 on any error)
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const errors = [];
const warnings = [];

function rel(p) { return path.relative(ROOT, p).replace(/\\/g, '/'); }

/** Minimal strict-enough frontmatter parser: returns {ok, data, reason}. */
function frontmatter(file) {
  const text = fs.readFileSync(file, 'utf8');
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---(\r?\n|$)/);
  if (!m) return { ok: false, reason: 'no frontmatter block' };
  const data = {};
  let currentKey = null;
  for (const line of m[1].split(/\r?\n/)) {
    if (/^\s*#/.test(line) || !line.trim()) continue;
    if (/\t/.test(line)) return { ok: false, reason: `tab character in frontmatter: "${line.trim()}"` };
    let kv = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (kv) {
      currentKey = kv[1];
      const v = kv[2].trim();
      data[currentKey] = v === '' ? [] : v.replace(/^['"]|['"]$/g, '');
    } else if (/^\s+-\s+/.test(line) && currentKey) {
      if (!Array.isArray(data[currentKey])) data[currentKey] = [];
      data[currentKey].push(line.replace(/^\s+-\s+/, '').trim());
    } else if (/^\s/.test(line) && currentKey) {
      // nested mapping (e.g. hooks:) — tolerated, not parsed
    } else {
      return { ok: false, reason: `unparseable frontmatter line: "${line.trim()}"` };
    }
  }
  return { ok: true, data };
}

function listFiles(dir, suffix) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs).filter((f) => f.endsWith(suffix)).map((f) => path.join(abs, f));
}

// --- Agents ---
const agentFiles = listFiles('.github/agents', '.agent.md');
const agentNames = new Set(agentFiles.map((f) => path.basename(f, '.agent.md')));
for (const f of agentFiles) {
  const fm = frontmatter(f);
  if (!fm.ok) { errors.push(`${rel(f)}: ${fm.reason}`); continue; }
  if (!fm.data.description) errors.push(`${rel(f)}: missing description`);
  if (fm.data.agents && Array.isArray(fm.data.agents)) {
    for (const a of fm.data.agents) {
      if (!agentNames.has(a)) errors.push(`${rel(f)}: agents list references unknown agent "${a}"`);
    }
  }
}
if (agentFiles.length === 0) errors.push('.github/agents: no agent files found');

// --- Prompts ---
const promptFiles = listFiles('.github/prompts', '.prompt.md');
for (const f of promptFiles) {
  const fm = frontmatter(f);
  if (!fm.ok) { errors.push(`${rel(f)}: ${fm.reason}`); continue; }
  if (!fm.data.description) warnings.push(`${rel(f)}: missing description`);
  const agent = fm.data.agent;
  const builtin = ['ask', 'agent', 'plan', 'edit'];
  if (agent && !builtin.includes(agent) && !agentNames.has(agent)) {
    errors.push(`${rel(f)}: agent "${agent}" has no matching .agent.md`);
  }
}

// --- Instructions ---
for (const f of listFiles('.github/instructions', '.instructions.md')) {
  const fm = frontmatter(f);
  if (!fm.ok) { errors.push(`${rel(f)}: ${fm.reason}`); continue; }
  if (!fm.data.description) errors.push(`${rel(f)}: missing description`);
  const applyTo = fm.data.applyTo;
  if (applyTo !== undefined && typeof applyTo === 'string') {
    if (!applyTo.trim()) errors.push(`${rel(f)}: empty applyTo`);
    if (/[{}]/.test(applyTo) && !/\{[^}]+\}/.test(applyTo)) errors.push(`${rel(f)}: unbalanced braces in applyTo`);
    if (applyTo === '**') warnings.push(`${rel(f)}: applyTo "**" loads on every request — confirm intentional`);
  }
}

// --- Skills ---
const skillsRoot = path.join(ROOT, '.github', 'skills');
if (fs.existsSync(skillsRoot)) {
  for (const folder of fs.readdirSync(skillsRoot)) {
    const skillFile = path.join(skillsRoot, folder, 'SKILL.md');
    if (!fs.existsSync(skillFile)) { errors.push(`.github/skills/${folder}: missing SKILL.md`); continue; }
    const fm = frontmatter(skillFile);
    if (!fm.ok) { errors.push(`${rel(skillFile)}: ${fm.reason}`); continue; }
    if (fm.data.name !== folder) errors.push(`${rel(skillFile)}: name "${fm.data.name}" != folder "${folder}"`);
    if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(String(fm.data.name))) errors.push(`${rel(skillFile)}: invalid skill name format`);
    const desc = String(fm.data.description || '');
    if (!desc) errors.push(`${rel(skillFile)}: missing description`);
    else if (desc.length > 1024) errors.push(`${rel(skillFile)}: description exceeds 1024 chars`);
    // referenced relative resources must exist
    const body = fs.readFileSync(skillFile, 'utf8');
    for (const [, target] of body.matchAll(/\]\((\.\/[^)]+)\)/g)) {
      if (!fs.existsSync(path.join(skillsRoot, folder, target))) {
        errors.push(`${rel(skillFile)}: broken resource link ${target}`);
      }
    }
  }
}

// --- Hooks ---
const SUPPORTED_EVENTS = new Set(['SessionStart', 'UserPromptSubmit', 'PreToolUse', 'PostToolUse', 'PreCompact', 'SubagentStart', 'SubagentStop', 'Stop']);
for (const f of listFiles('.github/hooks', '.json')) {
  let cfg;
  try { cfg = JSON.parse(fs.readFileSync(f, 'utf8')); }
  catch (e) { errors.push(`${rel(f)}: invalid JSON (${e.message})`); continue; }
  if (!cfg.hooks || typeof cfg.hooks !== 'object') { errors.push(`${rel(f)}: missing "hooks" object`); continue; }
  for (const [event, entries] of Object.entries(cfg.hooks)) {
    if (!SUPPORTED_EVENTS.has(event)) errors.push(`${rel(f)}: unsupported hook event "${event}"`);
    if (!Array.isArray(entries)) { errors.push(`${rel(f)}: ${event} must be an array`); continue; }
    for (const h of entries) {
      if (h.type !== 'command') errors.push(`${rel(f)}: ${event} entry type must be "command"`);
      if (!h.command) errors.push(`${rel(f)}: ${event} entry missing command`);
    }
  }
}
// hook + skill scripts must at least parse
const scriptDirs = ['.github/hooks/scripts', '.github/skills/verification-testing/scripts'];
for (const d of scriptDirs) {
  for (const f of listFiles(d, '.js')) {
    try { execFileSync(process.execPath, ['--check', f], { stdio: 'pipe' }); }
    catch (e) { errors.push(`${rel(f)}: syntax error — ${String(e.stderr).slice(0, 200)}`); }
  }
}

// --- Report ---
for (const w of warnings) console.log(`WARN  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
console.log(`\n${agentFiles.length} agents, ${promptFiles.length} prompts checked. ${errors.length} error(s), ${warnings.length} warning(s).`);
process.exit(errors.length ? 1 : 0);
