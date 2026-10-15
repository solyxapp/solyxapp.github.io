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
function createPhone(figure, index) {
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
}

const phoneFigures = [...document.querySelectorAll(".product-phone")];
const phoneLoader = new IntersectionObserver((entries, observer) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    observer.unobserve(entry.target);
    createPhone(entry.target, phoneFigures.indexOf(entry.target));
  }
}, { rootMargin: "300px" });
phoneFigures.forEach(figure => phoneLoader.observe(figure));
