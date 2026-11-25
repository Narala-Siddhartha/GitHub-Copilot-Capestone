#!/usr/bin/env node
/**
 * Lists incomplete stories or creates a new story from intake text.
 * A selected incomplete story can only be replaced through --replace-incomplete.
 * Usage:
 *   node tools/new-story.js --list-incomplete
 *   node tools/new-story.js --file <path> [--title "<short title>"] [--replace-incomplete US-###]
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const STORIES = path.join(ROOT, 'docs', 'sdlc', 'stories');
const TEMPLATE = path.join(ROOT, 'docs', 'sdlc', 'templates', 'workflow-status.template.yml');
const VALID_STATUSES = new Set(['pending', 'in_progress', 'awaiting_approval', 'approved', 'rejected']);

function fail(message) {
  throw new Error(message);
}

function argument(args, name) {
  const index = args.indexOf(name);
  return index < 0 ? undefined : args[index + 1];
}

function parseWorkflowStatus(storiesDir, storyId) {
  if (!/^US-\d+$/.test(storyId)) fail(`invalid story ID: ${storyId}`);
  const storyDir = path.resolve(storiesDir, storyId);
  if (path.dirname(storyDir) !== path.resolve(storiesDir)) fail(`invalid story path: ${storyId}`);

  let directoryStat;
  try {
    directoryStat = fs.lstatSync(storyDir);
  } catch (error) {
    if (error.code === 'ENOENT') fail(`story folder not found: ${storyId}`);
    throw error;
  }
  if (!directoryStat.isDirectory() || directoryStat.isSymbolicLink()) {
    fail(`story path is not a regular directory: ${storyId}`);
  }

  const statusFile = path.join(storyDir, 'workflow-status.yml');
  if (!fs.existsSync(statusFile)) fail(`workflow status missing for ${storyId}`);
  const text = fs.readFileSync(statusFile, 'utf8');
  const declaredStory = text.match(/^story:\s*(US-\d+)\s*$/m);
  if (!declaredStory || declaredStory[1] !== storyId) {
    fail(`workflow status story ID does not match folder ${storyId}`);
  }

  const phases = [];
  let inPhases = false;
  let currentPhase;
  for (const line of text.split(/\r?\n/)) {
    if (!inPhases) {
      if (/^phases:\s*$/.test(line)) inPhases = true;
      continue;
    }
    if (/^\S/.test(line) && line.trim()) break;

    const phaseHeader = /^  ([0-9]+-[\w-]+):\s*$/.exec(line);
    if (phaseHeader) {
      currentPhase = { name: phaseHeader[1], status: null };
      phases.push(currentPhase);
      continue;
    }

    const phaseStatus = /^    status:\s*([a-z_]+)\s*$/.exec(line);
    if (phaseStatus) {
      if (!currentPhase || currentPhase.status !== null) {
        fail(`invalid phase status structure in ${statusFile}`);
      }
      if (!VALID_STATUSES.has(phaseStatus[1])) {
        fail(`invalid workflow status "${phaseStatus[1]}" in ${statusFile}`);
      }
      currentPhase.status = phaseStatus[1];
    }
  }

  if (!phases.length || phases.some((phase) => phase.status === null)) {
    fail(`workflow status has missing phase statuses: ${statusFile}`);
  }

  let title = '';
  const titleLine = text.match(/^title:\s*(.*)$/m);
  if (titleLine) {
    try { title = JSON.parse(titleLine[1]); }
    catch (_error) { title = titleLine[1].replace(/^['"]|['"]$/g, ''); }
  }

  const firstUnapprovedPhase = phases.find((phase) => phase.status !== 'approved');
  return {
    story: storyId,
    title,
    incomplete: Boolean(firstUnapprovedPhase),
    currentPhase: firstUnapprovedPhase ? firstUnapprovedPhase.name : null,
    currentStatus: firstUnapprovedPhase ? firstUnapprovedPhase.status : null,
  };
}

function listIncompleteStories(storiesDir = STORIES) {
  if (!fs.existsSync(storiesDir)) return [];
  const stories = [];
  for (const entry of fs.readdirSync(storiesDir, { withFileTypes: true })) {
    if (/^\.(?:replaced-US-\d+-|intake-stage-)/.test(entry.name)) {
      fail(`unfinished story intake or replacement requires recovery: ${entry.name}`);
    }
    if (!/^US-\d+$/.test(entry.name)) continue;
    if (!entry.isDirectory() || entry.isSymbolicLink()) {
      fail(`story path is not a regular directory: ${entry.name}`);
    }
    if (fs.readdirSync(path.join(storiesDir, entry.name)).length === 0) continue;
    const story = parseWorkflowStatus(storiesDir, entry.name);
    if (story.incomplete) stories.push(story);
  }
  return stories.sort((left, right) => Number(left.story.slice(3)) - Number(right.story.slice(3)));
}

function nextStoryId(storiesDir) {
  const used = fs.readdirSync(storiesDir)
    .map((name) => /^US-(\d+)$/.exec(name))
    .filter(Boolean)
    .map((match) => Number(match[1]));
  return `US-${String(Math.max(0, ...used) + 1).padStart(3, '0')}`;
}

function replaceTemplate(template, storyId, title, branch, date) {
  const replacements = [
    ['story: US-XXX', `story: ${storyId}`],
    ['title: ""', `title: ${JSON.stringify(title)}`],
    ['branch: ""', `branch: ${JSON.stringify(branch)}`],
    ['created: YYYY-MM-DD', `created: ${date}`],
  ];
  let status = template;
  for (const [placeholder, value] of replacements) {
    if (!status.includes(placeholder)) fail(`workflow template missing placeholder: ${placeholder}`);
    status = status.replace(placeholder, value);
  }
  return status;
}

function removeIfPresent(target) {
  if (fs.existsSync(target)) fs.rmSync(target, { recursive: true });
}

function createStory({ storiesDir = STORIES, templatePath = TEMPLATE, file, title: requestedTitle, replaceIncomplete }) {
  if (!file) fail('usage: node tools/new-story.js --file <story-text-file> [--title "<short title>"] [--replace-incomplete US-###]');
  const absFile = path.resolve(file);
  if (!fs.existsSync(absFile)) fail(`story file not found: ${absFile}`);
  const text = fs.readFileSync(absFile, 'utf8');
  if (!text.trim()) fail('story text is empty; refusing to create a story from nothing');
  if (!fs.existsSync(templatePath)) fail(`workflow template missing: ${templatePath}`);

  fs.mkdirSync(storiesDir, { recursive: true });
  let replacementDir;
  if (replaceIncomplete) {
    if (!/^US-\d+$/.test(replaceIncomplete)) fail(`invalid story ID for replacement: ${replaceIncomplete}`);
    const oldStory = parseWorkflowStatus(storiesDir, replaceIncomplete);
    if (!oldStory.incomplete) fail(`story ${replaceIncomplete} is complete and cannot be replaced`);
    replacementDir = path.join(path.resolve(storiesDir), replaceIncomplete);
  }

  const storyId = nextStoryId(storiesDir);
  const storyDir = path.join(path.resolve(storiesDir), storyId);
  if (fs.existsSync(storyDir)) fail(`new story folder already exists: ${storyId}`);

  const firstLine = text.split(/\r?\n/)[0];
  const title = (requestedTitle || firstLine).replace(/^#+\s*/, '').slice(0, 80).trim();
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'story';
  const branch = `story/${storyId}-${slug}`;
  const date = new Date().toISOString().slice(0, 10);
  const status = replaceTemplate(fs.readFileSync(templatePath, 'utf8'), storyId, title, branch, date);
  const storyText = `# ${storyId}: ${title}\n\n${text}${text.endsWith('\n') ? '' : '\n'}`;

  const stagingDir = fs.mkdtempSync(path.join(path.resolve(storiesDir), '.intake-stage-'));
  let stageExists = true;
  let replacementBackup;
  let published = false;
  try {
    fs.writeFileSync(path.join(stagingDir, 'user-story.md'), storyText, 'utf8');
    fs.writeFileSync(path.join(stagingDir, 'workflow-status.yml'), status, 'utf8');

    if (replacementDir) {
      replacementBackup = path.join(
        path.resolve(storiesDir),
        `.replaced-${replaceIncomplete}-${process.pid}-${Date.now()}`
      );
      fs.renameSync(replacementDir, replacementBackup);
    }

    fs.renameSync(stagingDir, storyDir);
    stageExists = false;
    published = true;

    if (replacementBackup) {
      fs.rmSync(replacementBackup, { recursive: true });
      replacementBackup = undefined;
    }
  } catch (error) {
    const recoveryErrors = [];
    if (published) {
      try { removeIfPresent(storyDir); }
      catch (recoveryError) { recoveryErrors.push(`could not remove new story folder ${storyDir}: ${recoveryError.message}`); }
    }
    if (replacementBackup && fs.existsSync(replacementBackup)) {
      try { fs.renameSync(replacementBackup, replacementDir); }
      catch (recoveryError) { recoveryErrors.push(`could not restore remaining files to ${replacementDir}: ${recoveryError.message}`); }
    }
    if (stageExists) {
      try { removeIfPresent(stagingDir); }
      catch (recoveryError) { recoveryErrors.push(`could not remove intake staging folder ${stagingDir}: ${recoveryError.message}`); }
    }
    const recovery = recoveryErrors.length ? ` Recovery errors: ${recoveryErrors.join('; ')}` : '';
    throw new Error(`story intake failed: ${error.message}.${recovery}`);
  }

  let warning;
  if (path.dirname(absFile) === path.resolve(storiesDir)) {
    try { fs.rmSync(absFile); }
    catch (error) { warning = `Story created, but intake file could not be removed: ${absFile} (${error.message})`; }
  }

  const result = {
    story: storyId,
    dir: path.relative(ROOT, storyDir).replace(/\\/g, '/'),
    branch,
  };
  if (replaceIncomplete) result.replaced = replaceIncomplete;
  if (warning) result.warning = warning;
  return result;
}

function main(args = process.argv.slice(2)) {
  if (args.includes('--help')) {
    console.log('Usage: node tools/new-story.js --list-incomplete | --file <path> [--title "<title>"] [--replace-incomplete US-###]');
    return;
  }
  if (args.includes('--list-incomplete')) {
    if (args.length !== 1) fail('--list-incomplete cannot be combined with other options');
    console.log(JSON.stringify(listIncompleteStories()));
    return;
  }

  const file = argument(args, '--file');
  const title = argument(args, '--title');
  const replaceIncomplete = argument(args, '--replace-incomplete');
  const knownOptions = new Set(['--file', '--title', '--replace-incomplete']);
  const seenOptions = new Set();
  for (let index = 0; index < args.length; index += 1) {
    if (!knownOptions.has(args[index])) fail(`unknown option: ${args[index]}`);
    if (seenOptions.has(args[index])) fail(`duplicate option: ${args[index]}`);
    seenOptions.add(args[index]);
    if (!args[index + 1] || args[index + 1].startsWith('--')) fail(`missing value for ${args[index]}`);
    index += 1;
  }
  if (replaceIncomplete && !file) fail('--replace-incomplete requires --file');

  const result = createStory({ file, title, replaceIncomplete });
  console.log(JSON.stringify(result));
  if (result.warning) console.error(`new-story: ${result.warning}`);
}

if (require.main === module) {
  try { main(); }
  catch (error) {
    console.error(`new-story: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { createStory, listIncompleteStories, parseWorkflowStatus };
