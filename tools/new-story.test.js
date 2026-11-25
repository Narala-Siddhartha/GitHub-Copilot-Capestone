'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { createStory, listIncompleteStories } = require('./new-story');

const TEMPLATE_PATH = path.join(__dirname, '..', 'docs', 'sdlc', 'templates', 'workflow-status.template.yml');
const PHASES = [
  '1-requirements',
  '2-architecture',
  '3-design-review',
  '4-implementation-planning',
  '5-implementation',
  '6-code-review',
  '7-verification-testing',
  '8-pull-request',
];

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sdlc-story-test-'));
  const storiesDir = path.join(root, 'stories');
  fs.mkdirSync(storiesDir);
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return { root, storiesDir };
}

function writeStory(storiesDir, storyId, statuses) {
  const storyDir = path.join(storiesDir, storyId);
  fs.mkdirSync(storyDir);
  const phases = PHASES.map((phase, index) =>
    `  ${phase}:\n    status: ${statuses[index]}\n`
  ).join('');
  fs.writeFileSync(
    path.join(storyDir, 'workflow-status.yml'),
    `story: ${storyId}\ntitle: ${JSON.stringify(storyId)}\nphases:\n${phases}pr_url: null\n`,
    'utf8'
  );
  return storyDir;
}

test('lists incomplete stories with the first unapproved phase', (t) => {
  const { storiesDir } = fixture(t);
  writeStory(storiesDir, 'US-001', ['approved', 'approved', 'awaiting_approval', 'pending', 'pending', 'pending', 'pending', 'pending']);
  writeStory(storiesDir, 'US-002', Array(8).fill('approved'));

  assert.deepEqual(listIncompleteStories(storiesDir), [{
    story: 'US-001',
    title: 'US-001',
    incomplete: true,
    currentPhase: '3-design-review',
    currentStatus: 'awaiting_approval',
  }]);
});

test('replaces only the selected incomplete story and allocates an unused ID', (t) => {
  const { storiesDir } = fixture(t);
  const oldStoryDir = writeStory(storiesDir, 'US-001', ['approved', 'pending', 'pending', 'pending', 'pending', 'pending', 'pending', 'pending']);
  const completedStoryDir = writeStory(storiesDir, 'US-002', Array(8).fill('approved'));
  const otherIncompleteDir = writeStory(storiesDir, 'US-003', ['in_progress', 'pending', 'pending', 'pending', 'pending', 'pending', 'pending', 'pending']);
  const intakeFile = path.join(storiesDir, '.intake.md');
  const storyText = 'As a user, I want a new flow.  \n';
  fs.writeFileSync(intakeFile, storyText, 'utf8');

  const result = createStory({
    storiesDir,
    templatePath: TEMPLATE_PATH,
    file: intakeFile,
    title: 'Replacement Story',
    replaceIncomplete: 'US-001',
  });

  assert.equal(result.story, 'US-004');
  assert.equal(result.replaced, 'US-001');
  assert.equal(fs.existsSync(oldStoryDir), false);
  assert.equal(fs.existsSync(completedStoryDir), true);
  assert.equal(fs.existsSync(otherIncompleteDir), true);
  assert.equal(fs.existsSync(intakeFile), false);
  const newStory = fs.readFileSync(path.join(storiesDir, 'US-004', 'user-story.md'), 'utf8');
  assert.ok(newStory.endsWith(storyText));
  assert.deepEqual(listIncompleteStories(storiesDir).map((story) => story.story), ['US-003', 'US-004']);
});

test('refuses to replace a completed story without consuming intake', (t) => {
  const { storiesDir } = fixture(t);
  const completedStoryDir = writeStory(storiesDir, 'US-001', Array(8).fill('approved'));
  const intakeFile = path.join(storiesDir, '.intake.md');
  fs.writeFileSync(intakeFile, 'A new story\n', 'utf8');

  assert.throws(() => createStory({
    storiesDir,
    templatePath: TEMPLATE_PATH,
    file: intakeFile,
    replaceIncomplete: 'US-001',
  }), /complete and cannot be replaced/);

  assert.equal(fs.existsSync(completedStoryDir), true);
  assert.equal(fs.existsSync(intakeFile), true);
  assert.equal(fs.existsSync(path.join(storiesDir, 'US-002')), false);
});

test('fails closed when a story workflow status is malformed', (t) => {
  const { storiesDir } = fixture(t);
  const storyDir = path.join(storiesDir, 'US-001');
  fs.mkdirSync(storyDir);
  fs.writeFileSync(path.join(storyDir, 'workflow-status.yml'), 'story: US-001\nphases:\n  1-requirements:\n    status: unknown\n', 'utf8');

  assert.throws(() => listIncompleteStories(storiesDir), /invalid workflow status/);
});

test('fails closed when a prior intake or replacement needs recovery', (t) => {
  const { storiesDir } = fixture(t);
  fs.mkdirSync(path.join(storiesDir, '.replaced-US-001-123-456'));

  assert.throws(() => listIncompleteStories(storiesDir), /requires recovery/);
});

test('ignores empty story folders that contain no recoverable flow', (t) => {
  const { storiesDir } = fixture(t);
  fs.mkdirSync(path.join(storiesDir, 'US-001'));

  assert.deepEqual(listIncompleteStories(storiesDir), []);
});
