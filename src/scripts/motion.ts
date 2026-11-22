/** True when the visitor asked for reduced motion. Checked live, not cached. */
export const reduceMotion = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True for a mouse or trackpad (tilt and spotlight effects only apply then). */
export const finePointer = (): boolean =>
  window.matchMedia("(pointer: fine)").matches;
