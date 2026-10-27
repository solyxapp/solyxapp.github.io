const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('privacy policy accurately describes the forthcoming event-only analytics update', () => {
  const html = fs.readFileSync(path.join(__dirname, '../privacy/index.html'), 'utf8');
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
  for (const phrase of ['upcoming analytics-enabled app update', 'pseudonymous, not fully anonymous',
    'Share usage analytics', 'United States', 'Turning this off does not disable purchases',
    'session recording or automatic interaction capture']) assert.ok(text.includes(phrase), phrase);
  assert.ok(!text.includes('does not record your screen or use PostHog'));
  assert.ok(html.includes('https://posthog.com/privacy'));
  assert.equal((html.match(/<h1>/g) || []).length, 1);
});
