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
function paintScroll() {
  queued = false;
  const rect = statement.closest("section").getBoundingClientRect();
  const progress = reducedMotion.matches
    ? 1
    : Math.max(
        0,
        Math.min(1, (innerHeight * 0.75 - rect.top) / (rect.height * 0.65)),
      );
  [...statement.children].forEach((word, index) => {
    const light = Math.max(0, Math.min(1, progress * words.length - index));
    const c = Math.round(122 + light * 122);
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
