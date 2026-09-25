// Cookie fork: GitHub URL mode is disabled by default; its UI slot shows the local folder path.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const html = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'index.html'), 'utf8');

test('local-only flags default to GitHub disabled and apply the hide class at startup', () => {
  assert.match(html, /window\.COOKIE_CODEFLOW_LOCAL_ONLY = true;/);
  assert.match(html, /window\.COOKIE_CODEFLOW_ALLOW_GITHUB = false;/);
  assert.match(html, /document\.documentElement\.classList\.toggle\('cookie-hide-github', !!\(window\.COOKIE_CODEFLOW_LOCAL_ONLY && !window\.COOKIE_CODEFLOW_ALLOW_GITHUB\)\)/);
});

test('hide CSS targets the real GitHub controls', () => {
  for (const selector of [
    ".cookie-hide-github input[aria-label='Repository URL']",
    '.cookie-hide-github #analyze-btn',
    '.cookie-hide-github #mobile-analyze-btn',
    '.cookie-hide-github .auth-select',
    ".cookie-hide-github select[aria-label='Authentication Method']",
  ]) assert.ok(html.includes(selector), selector);
  // Every select that the CSS names must exist in the markup.
  assert.ok(html.includes("'aria-label':'Authentication Method'"));
});

test('every Repository URL input, Analyze button, auth control and GitHub ZIP button is gated', () => {
  const urlInputs = html.match(/React\.createElement\('input',\{className:'repo-input','aria-label':'Repository URL'/g) || [];
  const gatedUrlInputs = html.match(/cookieLocalOnly\?cookieLocalPathField\(\):React\.createElement\('input',\{className:'repo-input','aria-label':'Repository URL'/g) || [];
  assert.equal(urlInputs.length, 2);
  assert.equal(gatedUrlInputs.length, urlInputs.length);
  assert.match(html, /!cookieLocalOnly&&React\.createElement\('button',\{id:'analyze-btn'/);
  assert.match(html, /!cookieLocalOnly&&React\.createElement\('button',\{id:'mobile-analyze-btn'/);
  assert.equal((html.match(/!cookieLocalOnly&&React\.createElement\('select',\{className:'auth-select'/g) || []).length, 2);
  assert.equal((html.match(/!cookieLocalOnly&&React\.createElement\('div',\{className:'auth-inputs'\}/g) || []).length, 2);
  assert.equal((html.match(/!cookieLocalOnly&&parseUrl\(repoUrl\)&&React\.createElement\('button',\{className:'top-btn','aria-label':'Download GitHub ZIP'/g) || []).length, 2);
});

test('local path field is read-only and GitHub paths stay refused', () => {
  assert.match(html, /'aria-label':'Local folder path',readOnly:true/);
  assert.match(html, /COOKIE_GITHUB_BLOCKED/);
  assert.match(html, /GitHub URL mode is disabled/);
});
