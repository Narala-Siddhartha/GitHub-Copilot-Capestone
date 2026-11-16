#!/usr/bin/env node
'use strict';
/**
 * SessionStart hook: validate repository context and inject SDLC status.
 * Reports missing framework components and the per-story workflow phase.
 */
const fs = require('fs');
const path = require('path');
const { REPO_ROOT, readStdin, audit } = require('./hook-utils');

const payload = readStdin();
audit('audit-log.jsonl', { event: 'SessionStart' });

const required = [
  '.github/copilot-instructions.md',
  '.github/agents',
  '.github/prompts',
  '.github/skills',
  'docs/sdlc/stories',
  'docs/sdlc/templates/workflow-status.template.yml',
];
const missing = required.filter((r) => !fs.existsSync(path.join(REPO_ROOT, r)));

const lines = [];
if (missing.length) {
  lines.push(`SDLC framework incomplete — missing: ${missing.join(', ')}.`);
} else {
  lines.push('SDLC framework present.');
}

// Summarize story states from workflow-status.yml files (minimal YAML scan).
const storiesDir = path.join(REPO_ROOT, 'docs', 'sdlc', 'stories');
try {
  const stories = fs.readdirSync(storiesDir).filter((d) => /^US-\d+/.test(d));
  if (!stories.length) {
    lines.push('No stories yet. Start one with /sdlc-run <user story text>.');
  }
  for (const s of stories.slice(0, 10)) {
    const statusFile = path.join(storiesDir, s, 'workflow-status.yml');
    if (!fs.existsSync(statusFile)) {
      lines.push(`${s}: no workflow-status.yml (inconsistent state — reconcile before working on it).`);
      continue;
    }
    const text = fs.readFileSync(statusFile, 'utf8');
    const phases = [...text.matchAll(/^\s{2}([\w-]+):\s*$[\s\S]*?status:\s*(\S+)/gm)]
      .map((m) => ({ phase: m[1], status: m[2] }));
    const current = phases.find((p) => p.status !== 'approved');
    lines.push(current
      ? `${s}: current phase ${current.phase} (${current.status}).`
      : `${s}: all phases approved.`);
  }
} catch (_e) { /* stories dir may not exist yet */ }

process.stdout.write(JSON.stringify({ continue: true, systemMessage: lines.join(' ') }));
process.exit(0);
