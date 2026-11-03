// Browser-facing logic tested with controlled DOM, clock, and network substitutes.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = name => fs.readFileSync(path.join(__dirname, '../dist', name), 'utf8');
function run(name, globals) { vm.runInNewContext(source(name), globals); }

for (const [instant, hidden] of [
  ['2026-11-04T06:59:59Z', false], // Still November 3 in Colorado.
  ['2026-11-04T07:00:00Z', true]
]) {
  const notice = {};
  class Clock extends Date { constructor() { super(instant); } }
  run('election.js', { document: { getElementById: () => notice }, Intl, Date: Clock });
  assert.equal(notice.hidden, hidden);
}

const digits = Array.from({ length: 4 }, () => ({}));
const clock = { querySelector: selector => digits[['days', 'hours', 'minutes', 'seconds']
  .findIndex(unit => selector.includes(unit))] };
const ended = {};
let now = Date.parse('2026-11-04T01:59:59Z');
let tick;
let cleared;
run('countdown.js', {
  document: { getElementById: id => id === 'student-vote-clock' ? clock : ended },
  Date: { parse: Date.parse, now: () => now },
  setInterval: callback => { tick = callback; return 7; },
  clearInterval: timer => { cleared = timer; }
});
assert.equal(digits[3].textContent, '01');
now += 1000;
tick();
assert.equal(clock.hidden, true);
assert.equal(ended.hidden, false);
assert.equal(cleared, 7);

async function formCase(fetchResult, reject = false) {
  let submit;
  let reset = false;
  let requested;
  const button = { textContent: 'Send message', disabled: false };
  const status = {};
  const form = {
    action: 'https://formsubmit.co/leo@boulderculture.org', dataset: {},
    reportValidity: () => true,
    querySelector: selector => selector === '.form-status' ? status : button,
    addEventListener: (_, callback) => { submit = callback; },
    reset: () => { reset = true; }
  };
  run('form.js', {
    document: { querySelectorAll: () => [form] },
    FormData: class { *[Symbol.iterator]() { yield ['name', 'Test']; yield ['_honey', '']; } },
    AbortController, setTimeout, clearTimeout,
    fetch: async url => {
      requested = url;
      if (reject) throw fetchResult;
      return { ok: true, json: async () => fetchResult };
    }
  });
  await submit({ preventDefault() {} });
  assert.equal(requested, 'https://formsubmit.co/ajax/leo@boulderculture.org');
  assert.equal(button.disabled, false);
  assert.equal(form.dataset.sending, 'false');
  assert.equal(button.textContent, 'Send message');
  return { status, reset };
}

(async () => {
  const success = await formCase({ success: 'true' });
  assert.equal(success.reset, true);
  assert.equal(success.status.className, 'form-status success');
  const inactive = await formCase({ success: false, message: 'Please activate your email' });
  assert.equal(inactive.reset, false);
  assert.match(inactive.status.textContent, /activation/);
  const timeout = await formCase(Object.assign(new Error('timeout'), { name: 'AbortError' }), true);
  assert.equal(timeout.reset, false);
  assert.match(timeout.status.textContent, /couldn’t confirm/);
  const failure = await formCase(new Error('offline'), true);
  assert.equal(failure.reset, false);
  assert.match(failure.status.textContent, /Couldn’t connect/);
  process.stdout.write('PASS: Colorado banner expiry, countdown deadline/cleanup, form success, activation, timeout, and network failure.\n');
})().catch(error => { process.stderr.write(`${error.stack}\n`); process.exitCode = 1; });
