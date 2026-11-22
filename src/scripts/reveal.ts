/**
 * Reveal on scroll: adds .seen to .rv and [data-seen] elements as they enter
 * the viewport, and counts up any [data-count] numbers inside them.
 * The final numbers are in the HTML, so without JS (or under reduced motion)
 * the right values show immediately.
 */
import { reduceMotion } from "./motion";

const countUp = (el: HTMLElement) => {
  const target = Number(el.dataset.count);
  if (!Number.isFinite(target) || reduceMotion()) return;
  let start: number | null = null;
  const step = (t: number) => {
    start ??= t;
    const p = Math.min((t - start) / 900, 1);
    el.textContent = String(Math.round(target * (1 - (1 - p) ** 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  el.textContent = "0";
  requestAnimationFrame(step);
};

const reveal = (el: Element) => {
  el.classList.add("seen");
  el.querySelectorAll<HTMLElement>("[data-count]").forEach(countUp);
};

const targets = document.querySelectorAll(".rv, [data-seen]");

if (reduceMotion() || !("IntersectionObserver" in window)) {
  targets.forEach((el) => el.classList.add("seen"));
} else {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        io.unobserve(entry.target);
      }),
    { threshold: 0.15 },
  );
  targets.forEach((el) => io.observe(el));
}
