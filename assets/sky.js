// Scroll-scrubbed opening: the phone rises out of the galaxy, then steps through real screens.
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const cosmos = document.querySelector(".cosmos");
const steps = [...document.querySelectorAll(".sky-step")];
const dock = document.querySelector(".dock");
const RISE = 0.16; // share of the pinned scroll spent raising the phone
const FADE = 0.22; // crossfade width between screens, in steps

const clamp = (value) => Math.min(1, Math.max(0, value));
let queued = false;

function paint() {
  queued = false;
  if (!cosmos.classList.contains("is-live")) return;
  const rect = cosmos.getBoundingClientRect();
  const progress = clamp(-rect.top / Math.max(1, rect.height - innerHeight));
  const rise = clamp(progress / RISE);
  // Ease out so the phone arrives quickly and settles slowly.
  const eased = 1 - Math.pow(1 - rise, 3);
  cosmos.style.setProperty("--rise", eased.toFixed(4));
  const t = clamp((progress - RISE) / (1 - RISE)) * steps.length;
  steps.forEach((step, i) => {
    const enter = i === 0 ? 1 : clamp((t - i + FADE / 2) / FADE);
    const leave = i === steps.length - 1 ? 1 : clamp((i + 1 - t + FADE / 2) / FADE);
    const shown = Math.min(enter, leave);
    step.style.setProperty("--shown", shown.toFixed(3));
    // Captions hand off instead of overlapping: the old one leaves before the new one arrives.
    step.style.setProperty("--copy", clamp(shown * 2 - 1).toFixed(3));
    step.toggleAttribute("data-current", shown > 0.5);
  });
  if (dock) dock.classList.toggle("is-shown", rise > 0.6 && !downloadVisible);
}

function queue() {
  if (!queued) {
    queued = true;
    requestAnimationFrame(paint);
  }
}

function setMode() {
  cosmos.classList.toggle("is-live", !reduced.matches);
  if (reduced.matches) {
    cosmos.style.removeProperty("--rise");
    steps.forEach((step) => {
      step.style.removeProperty("--shown");
      step.style.removeProperty("--copy");
    });
  }
  queue();
}

// The bar steps aside for the closing download section and the hero's own badge.
let downloadVisible = false;
let heroBadgeVisible = true;
function updateDock() {
  if (!dock) return;
  if (cosmos.classList.contains("is-live")) return queue();
  dock.classList.toggle("is-shown", !heroBadgeVisible && !downloadVisible);
}
const download = document.querySelector("#download");
if (download) {
  new IntersectionObserver(([entry]) => {
    downloadVisible = entry.isIntersecting;
    updateDock();
  }).observe(download);
}
const heroBadge = document.querySelector(".hero .app-store-download");
if (heroBadge) {
  new IntersectionObserver(([entry]) => {
    heroBadgeVisible = entry.isIntersecting;
    updateDock();
  }).observe(heroBadge);
}

addEventListener("scroll", queue, { passive: true });
addEventListener("resize", queue);
reduced.addEventListener("change", setMode);
setMode();
