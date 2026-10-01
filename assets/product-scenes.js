import * as THREE from "./three.module.js";

const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const loader = new THREE.TextureLoader();
function rounded(w, h, r) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(w / 2 - r, -h / 2);
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r);
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  s.lineTo(-w / 2 + r, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r);
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  return s;
}

// Real screenshots mapped onto a bevelled device, rendered only on scroll.
document.querySelectorAll(".product-phone").forEach((figure, index) => {
  figure.setAttribute("role", "img");
  figure.setAttribute("aria-label", figure.querySelector("img").alt);
  figure.querySelector("img").alt = "";
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  } catch {
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.z = 8.7;
  const group = new THREE.Group();
  scene.add(group);
  const body = new THREE.Mesh(
    new THREE.ExtrudeGeometry(rounded(2.03, 4.35, 0.26), {
      depth: 0.13,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.035,
      bevelThickness: 0.035,
    }),
    new THREE.MeshStandardMaterial({
      color: 0x74777d,
      metalness: 0.8,
      roughness: 0.27,
    }),
  );
  group.add(body);
  const glass = new THREE.Mesh(
    new THREE.ShapeGeometry(rounded(1.98, 4.3, 0.25)),
    new THREE.MeshBasicMaterial({ color: 0x080808 }),
  );
  glass.position.z = 0.171;
  group.add(glass);
  const geometry = new THREE.ShapeGeometry(rounded(1.9, 4.13, 0.21));
  const position = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  for (let i = 0; i < position.count; i++)
    uv.setXY(
      i,
      (position.getX(i) + 0.95) / 1.9,
      (position.getY(i) + 2.065) / 4.13,
    );
  const screen = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
  screen.position.z = 0.18;
  group.add(screen);
  const island = new THREE.Mesh(
    new THREE.ShapeGeometry(rounded(0.57, 0.15, 0.075)),
    new THREE.MeshBasicMaterial({ color: 0x000000 }),
  );
  island.position.set(0, 1.94, 0.19);
  group.add(island);
  for (const y of [0.7, 1.15]) {
    const button = new THREE.Mesh(
      new THREE.BoxGeometry(0.055, 0.32, 0.085),
      body.material,
    );
    button.position.set(-1.055, y, 0.04);
    group.add(button);
  }
  scene.add(new THREE.HemisphereLight(0xffffff, 0x444455, 3));
  const key = new THREE.DirectionalLight(0xffffff, 5);
  key.position.set(-3, 5, 6);
  scene.add(key);
  figure.append(renderer.domElement);
  renderer.domElement.setAttribute("aria-hidden", "true");
  let visible = false,
    ready = false,
    queued = false;
  function draw() {
    queued = false;
    if (!ready || !visible || document.hidden) return;
    const r = figure.getBoundingClientRect();
    const progress = reduced.matches
      ? 0
      : Math.max(
          -1,
          Math.min(1, (r.top + r.height / 2 - innerHeight / 2) / innerHeight),
        );
    const direction = index % 2 ? -1 : 1;
    group.rotation.set(
      -0.12 + progress * 0.08,
      direction * (0.3 + progress * 0.13),
      direction * -0.1,
    );
    group.position.y = -progress * 0.13;
    renderer.render(scene, camera);
    figure.classList.add("scene-ready");
  }
  function schedule() {
    if (!queued) {
      queued = true;
      requestAnimationFrame(draw);
    }
  }
  new ResizeObserver(() => {
    const w = figure.clientWidth,
      h = figure.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    schedule();
  }).observe(figure);
  new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      schedule();
    },
    { rootMargin: "150px" },
  ).observe(figure);
  loader.load(
    figure.querySelector("img").src,
    (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      screen.material.map = texture;
      screen.material.needsUpdate = true;
      ready = true;
      schedule();
    },
    undefined,
    () => renderer.domElement.remove(),
  );
  renderer.domElement.addEventListener("webglcontextlost", () =>
    figure.classList.remove("scene-ready"),
  );
  addEventListener("scroll", schedule, { passive: true });
  document.addEventListener("visibilitychange", schedule);
  reduced.addEventListener("change", schedule);
});

// Catalog geometry from Solyx's ConstellationTemplateLibrary, not invented art.
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
    Jupiter: "223 168 83",
    Earth: "76 174 190",
    Neptune: "91 157 229",
    Mars: "218 137 77",
    Venus: "237 169 79",
    Pluto: "190 146 166",
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

// One temporary renderer creates the planet portraits, then releases its context.
async function buildPlanets() {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  } catch {
    return;
  }
  renderer.setSize(360, 300);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(32, 1.2, 0.1, 20);
  camera.position.z = 5.4;
  scene.add(new THREE.AmbientLight(0xffffff, 1.1));
  const light = new THREE.DirectionalLight(0xfff3dc, 3);
  light.position.set(-3, 3, 4);
  scene.add(light);
  const geometry = new THREE.SphereGeometry(0.92, 64, 48);
  const material = new THREE.MeshStandardMaterial({ roughness: 0.88 });
  const planet = new THREE.Mesh(geometry, material);
  planet.rotation.set(0.15, -0.8, -0.15);
  scene.add(planet);
  const track = document.querySelector("[data-planets]");
  for (const name of [
    "Jupiter",
    "Earth",
    "Neptune",
    "Mars",
    "Venus",
    "Pluto",
  ]) {
    try {
      const texture = await loader.loadAsync(
        `./assets/${name.toLowerCase()}_surface.jpg`,
      );
      texture.colorSpace = THREE.SRGBColorSpace;
      material.map = texture;
      material.needsUpdate = true;
      renderer.render(scene, camera);
      const item = tile(name),
        img = new Image();
      img.src = renderer.domElement.toDataURL("image/png");
      img.alt = "";
      img.width = 360;
      img.height = 300;
      item.prepend(img);
      track.append(item);
      texture.dispose();
    } catch {
      /* Keep the rest of the collection available if one texture fails. */
    }
  }
  repeatTrack(track);
  geometry.dispose();
  material.dispose();
  renderer.dispose();
  renderer.forceContextLoss();
}
const collectionLoader = new IntersectionObserver(
  (entries) => {
    if (!entries[0].isIntersecting) return;
    collectionLoader.disconnect();
    buildPlanets();
  },
  { rootMargin: "700px" },
);
collectionLoader.observe(document.querySelector(".collection"));
