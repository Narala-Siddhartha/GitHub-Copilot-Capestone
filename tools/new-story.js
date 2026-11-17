#!/usr/bin/env node
/**
 * Story intake: creates docs/sdlc/stories/US-###/ with user-story.md and a fresh
 * workflow-status.yml (all phases pending) from the template.
 * Usage: node tools/new-story.js --file <path-to-story-text> [--title "<short title>"]
 * The story text file is read verbatim and deleted after a successful intake only if it
 * lives in docs/sdlc/stories/ (the orchestrator's scratch location).
 * Prints a JSON line {"story","dir","branch"}; exit 1 with a message on any failure.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const STORIES = path.join(ROOT, 'docs', 'sdlc', 'stories');
const TEMPLATE = path.join(ROOT, 'docs', 'sdlc', 'templates', 'workflow-status.template.yml');

function fail(msg) { console.error(`new-story: ${msg}`); process.exit(1); }

function arg(name) {
  const i = process.argv.indexOf(name);
  return i > -1 ? process.argv[i + 1] : undefined;
}

const file = arg('--file');
if (!file) fail('usage: node tools/new-story.js --file <story-text-file> [--title "<short title>"]');
const abs = path.resolve(file);
if (!fs.existsSync(abs)) fail(`story file not found: ${abs}`);
const text = fs.readFileSync(abs, 'utf8').trim();
if (!text) fail('story text is empty; refusing to create a story from nothing');
if (!fs.existsSync(TEMPLATE)) fail(`workflow template missing: ${TEMPLATE}`);

fs.mkdirSync(STORIES, { recursive: true });
const used = fs.readdirSync(STORIES)
  .map((d) => /^US-(\d+)$/.exec(d))
  .filter(Boolean)
  .map((m) => Number(m[1]));
const id = `US-${String(Math.max(0, ...used) + 1).padStart(3, '0')}`;

const title = (arg('--title') || text.split(/\r?\n/)[0]).replace(/^#+\s*/, '').slice(0, 80).trim();
const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'story';
const branch = `story/${id}-${slug}`;
const dir = path.join(STORIES, id);
fs.mkdirSync(dir);

const today = new Date().toISOString().slice(0, 10);
const status = fs.readFileSync(TEMPLATE, 'utf8')
  .replace('story: US-XXX', `story: ${id}`)
  .replace('title: ""', `title: ${JSON.stringify(title)}`)
  .replace('branch: ""', `branch: ${JSON.stringify(branch)}`)
  .replace('created: YYYY-MM-DD', `created: ${today}`);

fs.writeFileSync(path.join(dir, 'user-story.md'), `# ${id}: ${title}\n\n${text}\n`, 'utf8');
fs.writeFileSync(path.join(dir, 'workflow-status.yml'), status, 'utf8');

if (path.dirname(abs) === STORIES) fs.rmSync(abs);

console.log(JSON.stringify({ story: id, dir: path.relative(ROOT, dir).replace(/\\/g, '/'), branch }));
