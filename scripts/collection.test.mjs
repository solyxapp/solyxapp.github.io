import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { existsSync, statSync } from 'node:fs';

test('planet row has real image fallback before JavaScript runs', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /data-planets>[\s\S]*?planet-[^" ]+\.webp/);
});

test('native catalog assets exist and exclude solar-system portraits', async () => {
  const { planets } = await import('../assets/planet-portraits.js');
  assert.equal(planets.length, 42);
  for (const entry of planets) {
    assert.ok(['Rare', 'Legendary'].includes(entry.rarity));
    assert.ok(!['Mercury','Venus','Earth','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto'].includes(entry.name));
    const file = new URL('../assets/' + entry.file, import.meta.url);
    assert.ok(existsSync(file));
    assert.ok(statSync(file).size < 70000, entry.name);
  }
});

test('collection no longer generates portraits using WebGL', () => {
  const source = readFileSync(new URL('../assets/product-scenes.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /buildPlanets|toDataURL|data-planets/);
});

test('selection includes both rarities without duplicates or catalog mutation', async () => {
  const { selectPlanets } = await import('../assets/collection-selection.mjs');
  const entries = Array.from({ length: 20 }, (_, i) => ({name: String(i), rarity: i < 10 ? 'Rare' : 'Legendary'}));
  const original = JSON.stringify(entries);
  for (const random of [() => 0, () => .5, () => .999]) {
    const chosen = selectPlanets(entries, random);
    assert.equal(chosen.length, 8);
    assert.equal(new Set(chosen.map(p => p.name)).size, 8);
    assert.equal(chosen.filter(p => p.rarity === 'Rare').length, 4);
    assert.equal(chosen.filter(p => p.rarity === 'Legendary').length, 4);
  }
  assert.equal(JSON.stringify(entries), original);
});
