'use strict';
/**
 * Shared helpers for SDLC hooks: stdin parsing, audit logging, path utils.
 * Hook payload field names vary across surfaces; readField checks common variants.
 */
const fs = require('fs');
const path = require('path');

const REPO_ROOT = process.cwd();
const AUDIT_DIR = path.join(REPO_ROOT, 'docs', 'sdlc', 'audit');

function readStdin() {
  try {
    const raw = fs.readFileSync(0, 'utf8');
    return raw.trim() ? JSON.parse(raw) : {};
  } catch (_e) {
    return {};
  }
}

function readField(obj, names, fallback) {
  for (const n of names) {
    if (obj && obj[n] !== undefined && obj[n] !== null) return obj[n];
  }
  return fallback;
}

function toolName(payload) {
  return String(readField(payload, ['tool_name', 'toolName', 'tool'], '')).toLowerCase();
}

function toolInput(payload) {
  const input = readField(payload, ['tool_input', 'toolInput', 'input', 'arguments'], {});
  if (typeof input === 'string') {
    try { return JSON.parse(input); } catch (_e) { return { raw: input }; }
  }
  return input || {};
}

function eventName(payload) {
  return readField(payload, ['hook_event_name', 'hookEventName', 'event'], 'Unknown');
}

/** Append a JSON line to an audit file; never throw (hooks must not break the session). */
function audit(file, entry) {
  try {
    fs.mkdirSync(AUDIT_DIR, { recursive: true });
    fs.appendFileSync(
      path.join(AUDIT_DIR, file),
      JSON.stringify({ ts: new Date().toISOString(), ...entry }) + '\n',
      'utf8'
    );
  } catch (_e) { /* best-effort */ }
}

/** Collect all string values from a tool input object (for content scanning). */
function stringValues(obj, depth = 0, out = []) {
  if (depth > 4 || out.length > 50) return out;
  if (typeof obj === 'string') { out.push(obj); return out; }
  if (Array.isArray(obj)) { obj.forEach((v) => stringValues(v, depth + 1, out)); return out; }
  if (obj && typeof obj === 'object') { Object.values(obj).forEach((v) => stringValues(v, depth + 1, out)); }
  return out;
}

module.exports = { REPO_ROOT, AUDIT_DIR, readStdin, readField, toolName, toolInput, eventName, audit, stringValues };
