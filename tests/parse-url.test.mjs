import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import vm from 'node:vm';

// parseUrl runs in a separate vm context (different realm), so objects it
// returns are not `instanceof` this realm's Object — deepStrictEqual would
// fail on that alone. Compare plain field values instead.
function assertParsed(actual, expectedOwner, expectedRepo) {
  assert.ok(actual, `expected a parsed result, got ${actual}`);
  assert.equal(actual.owner, expectedOwner);
  assert.equal(actual.repo, expectedRepo);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');
const htmlSource = await readFile(join(repoRoot, 'index.html'), 'utf8');

const fnStart = htmlSource.indexOf('function parseUrl(url){');
if (fnStart < 0) {
  throw new Error('Could not locate parseUrl() in index.html');
}
const fnEnd = htmlSource.indexOf('\n    }', fnStart) + '\n    }'.length;
const fnSource = htmlSource.slice(fnStart, fnEnd);

const context = { console };
vm.createContext(context);
vm.runInContext(`${fnSource}\nthis.parseUrl = parseUrl;`, context);
const { parseUrl } = context;

test('parseUrl accepts the bare owner/repo shorthand', () => {
  assertParsed(parseUrl('facebook/react'), 'facebook', 'react');
});

test('parseUrl accepts owner/repo with a trailing slash', () => {
  assertParsed(parseUrl('facebook/react/'), 'facebook', 'react');
});

test('parseUrl still rejects owner/repo with extra path segments', () => {
  assert.equal(parseUrl('facebook/react/extra'), null);
});

test('parseUrl accepts a full GitHub URL with a trailing slash', () => {
  assertParsed(parseUrl('https://github.com/facebook/react/'), 'facebook', 'react');
});

test('parseUrl strips .git suffix from full GitHub URLs', () => {
  assertParsed(parseUrl('https://github.com/facebook/react.git'), 'facebook', 'react');
});

test('parseUrl rejects garbage input', () => {
  assert.equal(parseUrl(''), null);
  assert.equal(parseUrl(null), null);
  assert.equal(parseUrl('not a repo'), null);
  assert.equal(parseUrl('{"owner":"x"}/repo'), null);
});
