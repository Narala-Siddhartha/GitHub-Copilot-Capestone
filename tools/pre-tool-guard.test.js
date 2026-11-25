'use strict';
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const HOOK = path.join(__dirname, '..', '.github', 'hooks', 'scripts', 'pre-tool-guard.js');

test('denies direct story-folder deletion but allows the validated intake script', (t) => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'sdlc-hook-test-'));
  t.after(() => fs.rmSync(cwd, { recursive: true, force: true }));

  const invoke = (command) => {
    const output = execFileSync(process.execPath, [HOOK], {
      cwd,
      input: JSON.stringify({ tool_name: 'powershell', tool_input: { command } }),
      encoding: 'utf8',
    });
    return JSON.parse(output).hookSpecificOutput;
  };

  const directDelete = invoke('Remove-Item -Recurse docs\\sdlc\\stories\\US-001');
  assert.equal(directDelete.permissionDecision, 'deny');

  const validatedIntake = invoke('node tools/new-story.js --file docs\\sdlc\\stories\\.intake.md --replace-incomplete US-001');
  assert.equal(validatedIntake.permissionDecision, 'allow');
});
