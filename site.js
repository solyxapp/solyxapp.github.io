const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const statement = document.querySelector("[data-scroll-words]");
const words = statement.textContent.trim().split(/\s+/);
statement.setAttribute("aria-label", words.join(" "));
statement.replaceChildren(
  ...words.map((word) => {
    const span = document.createElement("span");
    span.textContent = word + " ";
    span.setAttribute("aria-hidden", "true");
    return span;
  }),
);
let queued = false;
const story = statement.closest("section");
const stage = story.querySelector(".scroll-story-stage");
const wordElements = [...statement.children];
function paintScroll() {
  queued = false;
  const rect = story.getBoundingClientRect();
  // Finish before the sticky stage releases, leaving a short fully lit hold.
  const travel = Math.max(1, (rect.height - stage.offsetHeight) * 0.85);
  const progress = reducedMotion.matches
    ? 1
    : Math.max(
        0,
        Math.min(1, -rect.top / travel),
      );
  wordElements.forEach((word, index) => {
    const light = Math.max(0, Math.min(1, progress * words.length - index));
    const c = Math.round(52 + light * 192);
    word.style.color = `rgb(${c} ${c} ${c})`;
  });
}
function queueScroll() {
  if (!queued) {
    queued = true;
    requestAnimationFrame(paintScroll);
  }
}
addEventListener("scroll", queueScroll, { passive: true });
addEventListener("resize", queueScroll);
reducedMotion.addEventListener("change", queueScroll);
paintScroll();
const collection = document.querySelector(".collection");
new IntersectionObserver((entries) => {
  collection.classList.toggle("in-view", entries[0].isIntersecting);
}).observe(collection);
document.addEventListener("visibilitychange", () => {
  collection.classList.toggle("page-hidden", document.hidden);
});
