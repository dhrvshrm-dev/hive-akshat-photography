// The one Lenis instance, reachable from anywhere that needs to pause the page
// (intro, lightbox, mobile menu) or glide to an anchor. Module-level for the
// same reason the GL stage is: the owner mounts in the root layout and the
// callers live anywhere in the tree.
let lenis = null;
const locks = new Set();

export function setLenis(instance) {
  lenis = instance;
  if (lenis && locks.size) lenis.stop();
}

export function getLenis() {
  return lenis;
}

/** Stop the page scrolling until every caller that locked it has unlocked. */
export function lockScroll(key) {
  locks.add(key);
  document.documentElement.style.overflow = "hidden";
  if (lenis) lenis.stop();
}

export function unlockScroll(key) {
  locks.delete(key);
  if (locks.size) return;
  document.documentElement.style.overflow = "";
  if (lenis) lenis.start();
}

export function scrollToTarget(target, opts = {}) {
  if (lenis) {
    lenis.scrollTo(target, { offset: -80, duration: 1.4, ...opts });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (typeof target === "number") window.scrollTo({ top: target });
  else if (el) el.scrollIntoView({ behavior: "smooth" });
}
