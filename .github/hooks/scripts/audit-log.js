#!/usr/bin/env node
'use strict';
/**
 * Generic audit hook for UserPromptSubmit and Stop events.
 * Appends an event line to docs/sdlc/audit/audit-log.jsonl. Never blocks.
 */
const { readStdin, eventName, readField, audit } = require('./hook-utils');

const payload = readStdin();
const event = eventName(payload);
const prompt = readField(payload, ['prompt', 'user_prompt', 'userPrompt', 'message'], '');

audit('audit-log.jsonl', {
  event,
  promptPreview: prompt ? String(prompt).slice(0, 200) : undefined,
});

process.stdout.write(JSON.stringify({ continue: true }));
process.exit(0);
