const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

// Input is produced by WebsitePlanetExportTests using the app's PlanetView.
const source = process.argv[2];
if (!source) throw new Error('Pass the native website-planets export directory');
const assets = path.resolve(__dirname, '../assets');
const solar = new Set(['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']);
const entries = JSON.parse(fs.readFileSync(path.join(source, 'manifest.json')))
  .filter(entry => !solar.has(entry.name));
(async () => {
  for (const entry of entries) {
    const output = entry.file.replace('.png', '.webp');
    await sharp(path.join(source, entry.file)).webp({ quality: 88, effort: 6 }).toFile(path.join(assets, output));
    entry.file = output;
  }
  fs.writeFileSync(path.join(assets, 'planet-portraits.js'),
    '// Generated from Solyx 1.1 PlanetView, canonical catalog seeds, native rarity.\nexport const planets = ' + JSON.stringify(entries, null, 2) + ';\n');
  console.log(`Imported ${entries.length} native Rare/Legendary portraits.`);
})();
