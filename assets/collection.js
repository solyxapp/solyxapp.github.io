import { selectPlanets } from './collection-selection.mjs';
import { planets } from './planet-portraits.js';

// Catalog geometry from Solyx's ConstellationTemplateLibrary.
const patterns = [
  [
    "Moon Chalice",
    [
      [-0.72, -0.34],
      [-0.28, 0.2],
      [0, 0.68],
      [0.28, 0.2],
      [0.72, -0.34],
    ],
    [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [1, 3],
    ],
  ],
  [
    "Vesper Kite",
    [
      [0, -0.82],
      [-0.54, -0.08],
      [0, 0.76],
      [0.54, -0.08],
    ],
    [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [1, 3],
    ],
  ],
  [
    "Regent Crown",
    [
      [-0.86, 0.3],
      [-0.48, -0.54],
      [-0.06, 0.14],
      [0.4, -0.52],
      [0.86, 0.26],
    ],
    [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
  ],
  [
    "Celestial Harp",
    [
      [-0.5, -0.68],
      [0.48, -0.48],
      [0.5, 0.48],
      [-0.48, 0.66],
      [0, -0.02],
    ],
    [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [0, 4],
      [4, 2],
    ],
  ],
  [
    "Mariner's Anchor",
    [
      [0, -0.84],
      [0, -0.18],
      [0, 0.54],
      [-0.54, 0.2],
      [0.54, 0.2],
    ],
    [
      [0, 1],
      [1, 2],
      [2, 3],
      [2, 4],
    ],
  ],
  [
    "Comet Kite",
    [
      [0, -0.88],
      [-0.56, -0.06],
      [0.52, -0.04],
      [0, 0.62],
      [0, 1.02],
    ],
    [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
      [3, 4],
    ],
  ],
];
function tile(name) {
  const item = document.createElement("figure");
  item.className = "collection-item";
  const light = {
    "Moon Chalice": "136 176 232",
    "Vesper Kite": "177 150 230",
    "Regent Crown": "230 193 110",
    "Celestial Harp": "106 193 177",
    "Mariner's Anchor": "95 170 212",
    "Comet Kite": "225 164 127",
  };
  item.style.setProperty("--collection-light", light[name] || "220 196 135");
  const label = document.createElement("figcaption");
  label.textContent = name;
  item.append(label);
  return item;
}
const stars = document.querySelector("[data-constellations]");
patterns.forEach(([name, points, edges]) => {
  const item = tile(name);
  const ns = "http://www.w3.org/2000/svg",
    svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 240 200");
  svg.setAttribute("aria-hidden", "true");
  const xy = ([x, y]) => [120 + x * 65, 95 + y * 65];
  edges.forEach(([a, b]) => {
    const line = document.createElementNS(ns, "line");
    const [x1, y1] = xy(points[a]),
      [x2, y2] = xy(points[b]);
    Object.entries({
      x1,
      y1,
      x2,
      y2,
      stroke: "#928a70",
      "stroke-width": 1.2,
    }).forEach(([k, v]) => line.setAttribute(k, v));
    svg.append(line);
  });
  points.forEach((p) => {
    const [cx, cy] = xy(p);
    [7, 2.7].forEach((r, i) => {
      const c = document.createElementNS(ns, "circle");
      Object.entries({
        cx,
        cy,
        r,
        fill: i ? "#fff4cd" : "#bda56b",
        opacity: i ? 1 : 0.18,
      }).forEach(([k, v]) => c.setAttribute(k, v));
      svg.append(c);
    });
  });
  item.prepend(svg);
  stars.append(item);
});
function repeatTrack(track) {
  const originals = [...track.children];
  for (let i = 0; i < 2; i++) {
    track.append(
      ...originals.map((el) => {
        const clone = el.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        return clone;
      }),
    );
  }
}
repeatTrack(stars);

const collection = document.querySelector('.collection');
const track = document.querySelector('[data-planets]');

// Build one complete, decoded row offscreen; never resize a running marquee.
async function preparePlanets() {
  const selected = selectPlanets(planets);
  const items = await Promise.all(selected.map(async (entry) => {
    const item = tile(entry.name);
    item.style.setProperty('--collection-light', entry.rarity === 'Rare' ? '106 177 226' : '230 193 110');
    const img = new Image(360, 300);
    img.alt = '';
    img.decoding = 'async';
    img.src = `./assets/${entry.file}`;
    item.prepend(img);
    let timeout;
    try {
      await Promise.race([img.decode(), new Promise((_, reject) => { timeout = setTimeout(reject, 8000); })]);
      return item;
    } catch { return null; }
    finally { clearTimeout(timeout); }
  }));
  const loaded = items.filter(Boolean);
  if (loaded.length >= 6) track.replaceChildren(...loaded);
  repeatTrack(track);
  track.classList.add('ready');
}
stars.classList.add('ready');
preparePlanets();
new IntersectionObserver(([entry]) => {
  collection.classList.toggle('in-view', entry.isIntersecting);
}, { rootMargin: '100px' }).observe(collection);
const updateVisibility = () => collection.classList.toggle('page-hidden', document.hidden);
document.addEventListener('visibilitychange', updateVisibility);
updateVisibility();

