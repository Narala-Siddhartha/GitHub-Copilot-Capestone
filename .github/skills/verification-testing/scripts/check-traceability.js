#!/usr/bin/env node
/**
 * Traceability completeness check for one story.
 * Usage: node check-traceability.js US-001 [repoRoot]
 * Scans docs/sdlc/stories/<story>/ artifacts and reports, per REQ/NFR:
 * whether it is referenced by ADRs, TASKs, and TESTs. Exit 1 if gaps exist.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const story = process.argv[2];
if (!story || !/^US-\d+$/.test(story)) {
  console.error('Usage: node check-traceability.js US-### [repoRoot]');
  process.exit(2);
}
const root = process.argv[3] || process.cwd();
const dir = path.join(root, 'docs', 'sdlc', 'stories', story);
if (!fs.existsSync(dir)) {
  console.error(`Story folder not found: ${dir}`);
  process.exit(2);
}

const read = (f) => {
  const p = path.join(dir, f);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
};

const requirementsDoc = read('01-requirements.md');
const architectureDoc = read('02-architecture.md');
const planDoc = read('04-implementation-plan.md');
const testReport = read('07-test-report.md');
const matrix = read('traceability-matrix.md');

const ids = (text, re) => [...new Set([...text.matchAll(re)].map((m) => m[0]))];
const reqs = ids(requirementsDoc, /\b(?:REQ|NFR)-\d{3}\b/g);
if (reqs.length === 0) {
  console.error(`No REQ/NFR IDs found in 01-requirements.md for ${story}.`);
  process.exit(1);
}

// A requirement is "covered" at a stage if its ID appears in that stage's artifact.
const stages = [
  ['ADR (02-architecture.md)', architectureDoc],
  ['TASK (04-implementation-plan.md)', planDoc],
  ['TEST (07-test-report.md)', testReport],
];

let gaps = 0;
console.log(`Traceability check for ${story} — ${reqs.length} requirement(s)\n`);
for (const req of reqs.sort()) {
  const missing = stages.filter(([, text]) => !text.includes(req)).map(([name]) => name);
  if (missing.length) {
    gaps++;
    console.log(`GAP  ${req}: not referenced in ${missing.join(', ')}`);
  } else {
    console.log(`OK   ${req}`);
  }
}

if (!matrix) {
  console.log('\nWARN traceability-matrix.md is missing.');
}

console.log(gaps ? `\n${gaps} gap(s) found — PR is blocked until resolved or waived by a human.` : '\nNo gaps. Chain complete.');
process.exit(gaps ? 1 : 0);
