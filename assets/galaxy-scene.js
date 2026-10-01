import * as THREE from "./three.module.js";

const canvas = document.querySelector(".galaxy-canvas");
const hero = document.querySelector(".hero");
const reduced = matchMedia("(prefers-reduced-motion: reduce)");

// Deterministic stars keep the composition stable across reloads and devices.
let seed = 714;
function random() {
  seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
  return seed / 4294967296;
}
function gaussian() {
  return (
    Math.sqrt(-2 * Math.log(Math.max(random(), 0.00001))) *
    Math.cos(random() * Math.PI * 2)
  );
}

try {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: "low-power",
  });
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 150);
  const galaxy = new THREE.Group();
  const disk = new THREE.Group();
  galaxy.add(disk);
  scene.add(galaxy);
  galaxy.rotation.set(-0.85, 0.12, -0.34);

  const uniforms = {
    time: { value: 0 },
    pixelRatio: { value: 1 },
    pointScale: { value: 1 },
  };
  const material = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `
      attribute float size;
      attribute float phase;
      attribute vec3 tint;
      uniform float time;
      uniform float pixelRatio;
      uniform float pointScale;
      varying vec3 vTint;
      varying float vLight;
      void main() {
        vec4 view = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * view;
        gl_PointSize = clamp(size * pixelRatio * pointScale * 23.0 / -view.z, 1.0, 18.0);
        vTint = tint;
        vLight = .78 + .22 * sin(time * .7 + phase);
      }`,
    fragmentShader: `
      varying vec3 vTint;
      varying float vLight;
      void main() {
        float d = length(gl_PointCoord - .5) * 2.0;
        if (d > 1.0) discard;
        float glow = exp(-d * d * 5.0) * .58;
        float core = exp(-d * d * 38.0) * .55;
        gl_FragColor = vec4(vTint, (glow + core) * vLight);
      }`,
  });
  function starField(count, background = false) {
    const positions = new Float32Array(count * 3);
    const tints = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      let x, y, z, radius;
      if (background) {
        x = (random() - 0.5) * 85;
        y = (random() - 0.5) * 55;
        z = -12 - random() * 45;
        radius = 8;
      } else {
        radius = Math.pow(random(), 0.75) * 10.5;
        const arm = i % 3;
        const spread = 0.1 + radius * 0.02;
        const angle =
          (arm * Math.PI * 2) / 3 + radius * 0.69 + gaussian() * spread;
        x = Math.cos(angle) * radius + gaussian() * 0.16;
        y = Math.sin(angle) * radius + gaussian() * 0.16;
        z = gaussian() * (0.08 + 0.22 * Math.exp(-radius));
        // A dense, round stellar bulge breaks the spiral at its center.
        if (i % 5 === 0) {
          radius = Math.abs(gaussian()) * 1.4;
          const a = random() * Math.PI * 2;
          x = Math.cos(a) * radius;
          y = Math.sin(a) * radius;
          z = gaussian() * 0.3;
        }
      }
      positions.set([x, y, z], i * 3);
      const mix = Math.min(radius / 7, 1);
      const brightness = background
        ? 0.3 + random() * 0.55
        : 0.35 + random() * 0.65;
      tints.set(
        [
          (1 - 0.38 * mix) * brightness,
          (0.82 + 0.06 * mix) * brightness,
          (0.52 + 0.48 * mix) * brightness,
        ],
        i * 3,
      );
      sizes[i] = background
        ? 0.7 + random() * 2.8
        : 1.1 + Math.pow(random(), 4) * 4.5;
      phases[i] = random() * Math.PI * 2;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("tint", new THREE.BufferAttribute(tints, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("phase", new THREE.BufferAttribute(phases, 1));
    return new THREE.Points(geometry, material);
  }
  disk.add(starField(innerWidth < 701 ? 38000 : 68000));
  // Unresolved starlight fills the same spiral arms, beneath individual stars.
  const lightDisk = new THREE.Mesh(
    new THREE.PlaneGeometry(23, 23),
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      vertexShader: `varying vec2 vUv;
      void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `
      varying vec2 vUv;
      float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
      float noise(vec2 p){
        vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
        return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
      }
      void main(){
        vec2 p=(vUv-.5)*23.0;
        float r=length(p);
        float a=atan(p.y,p.x);
        float grain=noise(p*2.0)*.5+noise(p*6.0)*.3+noise(p*15.0)*.2;
        float wave=sin((a-r*.69)*1.5);
        float arms=exp(-wave*wave*12.0)*exp(-r*.18);
        float center=exp(-r*r*1.8);
        float bulge=exp(-r*.75);
        float edge=1.0-smoothstep(8.5,11.0,r);
        float light=(arms*(.13+grain*.2)+bulge*.16+center*.75)*edge;
        vec3 tint=mix(vec3(1.0,.86,.62),vec3(.48,.7,1.0),smoothstep(1.2,6.0,r));
        gl_FragColor=vec4(tint,light);
      }`,
    }),
  );
  lightDisk.position.z = -0.1;
  disk.add(lightDisk);
  const background = starField(1200, true);
  scene.add(background);

  let pointerX = 0;
  let pointerY = 0;
  let visible = true;
  let frame;
  let last = 0;
  let elapsed = 0;
  let frameCount = 0;
  function render(now = 0) {
    frame = undefined;
    if (!visible || document.hidden) {
      last = 0;
      return;
    }
    const delta = last ? Math.min((now - last) / 1000, 0.05) : 0;
    last = now;
    if (!reduced.matches) elapsed += delta;
    uniforms.time.value = elapsed;
    disk.rotation.z = elapsed * 0.032;
    galaxy.rotation.x =
      -0.85 + Math.sin(elapsed * 0.13) * 0.055 + pointerY * 0.04;
    galaxy.rotation.y += (pointerX * 0.09 - galaxy.rotation.y) * 0.025;
    background.rotation.z = elapsed * 0.0015;
    renderer.render(scene, camera);
    if (frameCount++ % 30 === 0) canvas.dataset.frame = String(frameCount);
    if (!reduced.matches) frame = requestAnimationFrame(render);
  }
  function start() {
    if (frame !== undefined) cancelAnimationFrame(frame);
    last = 0;
    frame = requestAnimationFrame(render);
  }
  function resize() {
    const { width, height } = hero.getBoundingClientRect();
    const ratio = Math.min(devicePixelRatio, width < 701 ? 1.5 : 1.75);
    renderer.setPixelRatio(ratio);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.set(0, 0, width < 701 ? 27 : 22);
    galaxy.position.y = width < 701 ? -5.2 : -3.7;
    uniforms.pixelRatio.value = ratio;
    uniforms.pointScale.value = width < 701 ? 0.9 : 1;
    camera.updateProjectionMatrix();
    start();
  }
  new ResizeObserver(resize).observe(hero);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    start();
  }).observe(hero);
  hero.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType !== "mouse" || reduced.matches) return;
      const rect = hero.getBoundingClientRect();
      pointerX = (event.clientX - rect.left) / rect.width - 0.5;
      pointerY = (event.clientY - rect.top) / rect.height - 0.5;
    },
    { passive: true },
  );
  hero.addEventListener("pointerleave", () => {
    pointerX = 0;
    pointerY = 0;
  });
  document.addEventListener("visibilitychange", start);
  reduced.addEventListener("change", start);
  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    visible = false;
    cancelAnimationFrame(frame);
    hero.classList.remove("galaxy-ready");
  });
  canvas.addEventListener("webglcontextrestored", () => {
    visible = true;
    hero.classList.add("galaxy-ready");
    resize();
  });
  resize();
  renderer.render(scene, camera);
  hero.classList.add("galaxy-ready");
} catch (error) {
  // Keep the original bitmap as a readable fallback when WebGL is unavailable.
  console.warn("Live galaxy unavailable; using image fallback.", error);
}
